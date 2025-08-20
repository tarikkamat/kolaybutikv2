# Docker Kurulum ve Kullanım Kılavuzu

Bu proje Laravel API backend ve React frontend'den oluşmaktadır. Docker kullanarak her iki projeyi de kolayca çalıştırabilirsiniz.

## Gereksinimler

- Docker
- Docker Compose

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd kolayButikV2
```

2. Frontend için environment variables ayarlayın:
```bash
# iyziExperience/.env dosyası oluşturun
cd iyziExperience
echo "REACT_APP_API_URL=http://localhost:8000" > .env
echo "REACT_APP_API_PREFIX=/api" >> .env
```

3. Docker container'larını başlatın:
```bash
docker-compose up -d
```

## Servisler

### Backend (Laravel API)
- **URL**: http://localhost:8000
- **Port**: 8000
- **Container**: laravel-api

### Frontend (React)
- **URL**: http://localhost:3000
- **Port**: 3000
- **Container**: react-frontend

## Kullanım

### Container'ları başlatma
```bash
docker-compose up -d
```

### Container'ları durdurma
```bash
docker-compose down
```

### Log'ları görüntüleme
```bash
# Tüm servislerin log'ları
docker-compose logs

# Sadece backend log'ları
docker-compose logs backend

# Sadece frontend log'ları
docker-compose logs frontend
```

### Container'lara bağlanma
```bash
# Backend container'ına bağlanma
docker-compose exec backend bash

# Frontend container'ına bağlanma
docker-compose exec frontend sh
```

### Composer komutları (Backend)
```bash
docker-compose exec backend composer install
docker-compose exec backend composer update
docker-compose exec backend php artisan key:generate
```

### Yarn komutları (Frontend)
```bash
docker-compose exec frontend yarn install
docker-compose exec frontend yarn build
docker-compose exec frontend yarn start
```

## API Kullanımı

Frontend'den backend API'ye istek yapmak için iki yöntem vardır:

### 1. Direkt Backend URL (Önerilen)
```javascript
// config/api.js dosyasından API endpoint'lerini kullanın
import { API_ENDPOINTS } from '../config/api';

fetch(API_ENDPOINTS.PAYMENT_INITIALIZE)
  .then(response => response.json())
  .then(data => console.log(data));
```

### 2. Nginx Proxy (Opsiyonel)
`/api/` prefix'i ile yapılan istekler otomatik olarak backend'e yönlendirilir:
- `http://localhost:3000/api/payment/initialize` → `http://localhost:8000/api/payment/initialize`
- `http://localhost:3000/api/payment/callback` → `http://localhost:8000/api/payment/callback`

### Environment Variables
Frontend'de API URL'ini ve prefix'ini değiştirmek için:
```bash
# iyziExperience/.env dosyasında
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_PREFIX=/api

# Örnek farklı konfigürasyonlar:
# REACT_APP_API_URL=https://api.example.com
# REACT_APP_API_PREFIX=/v1
```

## Sorun Giderme

### Port çakışması
Eğer portlar kullanımdaysa, `docker-compose.yml` dosyasındaki port mapping'leri değiştirin.

### Permission hatası
Laravel storage ve cache dizinlerinde permission hatası alırsanız:
```bash
docker-compose exec backend chown -R www-data:www-data /var/www/html/storage
docker-compose exec backend chown -R www-data:www-data /var/www/html/bootstrap/cache
```

### Container yeniden başlatma
```bash
docker-compose restart
```

## Geliştirme

Geliştirme sırasında kod değişiklikleriniz otomatik olarak container'lara yansıyacaktır. Sadece tarayıcınızı yenilemeniz yeterlidir.

## Production

Production ortamı için:
1. Environment değişkenlerini production değerleriyle güncelleyin
2. `APP_ENV=production` olarak ayarlayın
3. `APP_DEBUG=false` olarak ayarlayın
4. Gerekli SSL sertifikalarını ekleyin
