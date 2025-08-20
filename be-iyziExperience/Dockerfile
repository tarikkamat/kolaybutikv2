FROM php:8.2-apache

# Sistem paketlerini güncelle ve gerekli paketleri yükle
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install mbstring exif pcntl bcmath gd zip

# Composer'ı yükle
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Apache mod_rewrite'ı etkinleştir
RUN a2enmod rewrite

# Çalışma dizinini ayarla
WORKDIR /var/www/html

# Laravel proje dosyalarını kopyala
COPY . .

# Composer bağımlılıklarını yükle
RUN composer install --no-dev --optimize-autoloader

# Storage ve cache dizinlerine yazma izni ver
RUN chown -R www-data:www-data /var/www/html/storage \
    && chown -R www-data:www-data /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# .env dosyasını oluştur
RUN cp .env.example .env

# Laravel key'i oluştur
RUN php artisan key:generate

# Apache konfigürasyonunu ayarla
RUN echo 'ServerName localhost\n\
<VirtualHost *:4000>\n\
    DocumentRoot /var/www/html/public\n\
    ServerName localhost\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Apache port konfigürasyonunu güncelle
RUN echo 'Listen 4000' > /etc/apache2/ports.conf

EXPOSE 4000

CMD ["apache2-foreground"]
