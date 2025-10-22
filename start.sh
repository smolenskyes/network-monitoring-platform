#!/bin/bash

set -e  # Остановка при ошибках

echo "=== Network Monitoring Platform Setup ==="

# Проверка Docker
if ! docker --version > /dev/null 2>&1; then
    echo "❌ Docker не установлен или не доступен"
    exit 1
fi

# Проверка Docker Compose
if ! docker compose version > /dev/null 2>&1; then
    echo "❌ Docker Compose не доступен"
    exit 1
fi

# Проверка прав Docker
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Нет доступа к Docker daemon"
    echo "Выполните: sudo usermod -aG docker \$USER && newgrp docker"
    exit 1
fi

# Убираем устаревший version из docker-compose.yml
sed -i '/^version:/d' docker-compose.yml

# Создаем .env если не существует
if [ ! -f .env ]; then
    echo "📝 Создаем .env файл из .env.example"
    cp .env.example .env
    echo "⚠️  Пожалуйста, отредактируйте .env файл перед запуском в production"
    echo "   Для теста можно использовать значения по умолчанию"
fi

# Создаем необходимые директории
mkdir -p databases/init-scripts backups prometheus grafana/dashboards

echo "🔨 Собираем и запускаем сервисы..."
docker compose down > /dev/null 2>&1 || true
docker compose build --no-cache
docker compose up -d

echo "⏳ Ожидаем запуск сервисов..."
sleep 10

echo ""
echo "✅ Инфраструктура запущена!"
echo ""
echo "📊 Доступные сервисы:"
echo "   - Frontend:      http://localhost:3000"
echo "   - API Gateway:   http://localhost:80"
echo "   - Grafana:       http://localhost:3001 (admin/admin123)"
echo "   - Prometheus:    http://localhost:9090"
echo ""
echo "🔍 Проверка статуса:"
docker compose ps