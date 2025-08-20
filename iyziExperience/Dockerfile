# Build stage
FROM node:18.2-alpine AS build

# Gerekli build araçlarını yükle
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc \
    libc6-compat

# Çalışma dizinini ayarla
WORKDIR /app

# Package.json ve yarn.lock dosyalarını kopyala
COPY package.json yarn.lock ./

# Bağımlılıkları yükle
RUN yarn install --frozen-lockfile

# Kaynak kodları kopyala
COPY . .

# Production build oluştur
RUN yarn build

# Production stage
FROM nginx:alpine

# SSL sertifikaları için gerekli paketleri yükle
RUN apk add --no-cache openssl

# SSL sertifikaları oluştur
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=TR/ST=Istanbul/L=Istanbul/O=KolayButik/CN=localhost"

# Nginx konfigürasyonunu kopyala
COPY nginx.conf /etc/nginx/nginx.conf

# Build edilen dosyaları kopyala
COPY --from=build /app/build /usr/share/nginx/html

# Port 80 ve 443'ü aç
EXPOSE 80 443

# Nginx'i başlat
CMD ["nginx", "-g", "daemon off;"]
