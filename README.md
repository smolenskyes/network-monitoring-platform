# Network Monitoring Platform

Веб-платформа для мониторинга локальной вычислительной сети предприятия, построенная по микросервисной архитектуре.
Репозиторий содержит готовый скелет проекта, объединяющий независимые сервисы, API-шлюз и клиентскую веб-панель.
Достаточно запустить `docker compose`, и все сервисы поднимутся вместе с базами данных и инструментами наблюдения.

---

## Архитектура

```
┌──────────┐     ┌────────────┐     ┌────────────────┐
│ Frontend │◄───►│ API Gateway│───►│ Backend сервисы │
└────┬─────┘     └────┬──────┘     └────┬────────────┘
     │                │                │
     │                │                │
     │     ┌──────────▼──────────┐  ┌──▼──────────┐  ┌──────────────┐
     │     │ Auth Service        │  │ Discovery   │  │ Monitoring    │
     │     │ (FastAPI + Postgres)│  │ Service     │  │ Service       │
     │     └─────────────────────┘  │ (FastAPI +  │  │ (FastAPI +    │
     │                              │ PostgreSQL +│  │ PostgreSQL +  │
     │                              │ Celery +    │  │ Celery +      │
     │                              │ Redis)      │  │ Redis)        │
     │                              └─────┬───────┘  └──────┬───────┘
     │                                    │                │
     │                              ┌─────▼────┐      ┌────▼────┐
     │                              │ Redis    │      │ Prometheus │
     │                              └──────────┘      │ Grafana    │
     │                                                 └────────────┘
```

* **Frontend** — статическое SPA (React + Vite). Отправляет запросы к API-шлюзу, отображает список устройств, статусы и метрики.
* **API Gateway** — Nginx, маршрутизирует `/api/auth`, `/api/discovery`, `/api/monitoring` и раздаёт фронтенд.
* **Auth Service** — FastAPI + SQLAlchemy. Регистрация, авторизация и JWT-токены.
* **Discovery Service** — FastAPI-сервис для инвентаризации сети, хранит устройства в PostgreSQL, фоновые задачи — Celery + Redis.
* **Monitoring Service** — FastAPI-сервис для опроса устройств и сбора метрик (SNMP, Redis, PostgreSQL).
* **Инфраструктура** — отдельные контейнеры PostgreSQL, Redis, Prometheus и Grafana.

---

## Структура репозитория

```
api-gateway/          # Конфигурация Nginx API-шлюза
auth-service/         # Микросервис аутентификации (FastAPI)
databases/            # SQL-скрипты инициализации БД
frontend/             # Клиентское SPA (React + Vite) и конфиг Nginx
monitoring-service/   # Метрики, SNMP, Celery-задачи
discovery-service/    # Сервис обнаружения устройств
prometheus/, grafana/ # Конфигурация Prometheus и Grafana
redis/                # Конфигурация Redis
```

---

## Быстрый старт

1. Скопируйте пример окружения и при необходимости измените значения:

   ```bash
   cp .env.example .env
   ```

2. Запустите инфраструктуру:

   ```bash
   docker compose up -d
   ```

3. Фронтенд будет доступен по адресу [http://localhost:3000](http://localhost:3000),
   API-шлюз — [http://localhost:80](http://localhost:80).

> ⚠️ По умолчанию используется демонстрационный SNMP community `public`.
> В production-окружении обязательно замените его в `.env`.

---

## Frontend

Клиент реализован как одностраничное приложение на **React + Vite**.
Используются **Material UI** и **Recharts**, что позволяет быстро собрать современный интерфейс.

Основные компоненты:

* `App.jsx` — каркас приложения, глобальная тема, хранение JWT.
* `pages/Dashboard.jsx` — главная страница с логикой загрузки статусов и метрик.
* `components/ServiceStatusGrid.jsx` — карточки статусов Auth/Discovery/Monitoring сервисов.
* `components/DeviceTable.jsx` — таблица устройств, добавление и запуск сканирования подсети.
* `components/MonitoringPanel.jsx` — графики и список интерфейсов.
* `components/AuthPanel.jsx` — формы входа и регистрации.

HTTP-клиент (`src/api/client.js`) автоматически проксирует запросы через `/api` и подставляет JWT из `localStorage`.

Для локальной разработки можно задать:

* `VITE_API_BASE_URL` — адрес API для production-сборки,
* `VITE_API_GATEWAY_URL` — адрес шлюза для прокси dev-сервера Vite.

**Запуск:**

```bash
cd frontend
npm install
npm run dev
```

Сборка production-версии выполняется через Dockerfile — результат помещается в Nginx контейнер.

---

## Backend сервисы

Каждый backend-сервис — независимое **FastAPI-приложение**:

* Подключается к своей PostgreSQL-базе, создаёт таблицы через SQLAlchemy.
* Фоновые задачи — **Celery + Redis** (планировщики и воркеры).
* `auth-service/app/auth.py` — функции хэширования паролей и генерации JWT.
* `monitoring-service/app/snmp_client.py` — пример работы с SNMP через `pysnmp`.

---

## Разработка

* Запуск отдельного сервиса:

  ```bash
  uvicorn app.main:app --reload --port 8000
  ```

* Запуск Celery-воркера:

  ```bash
  celery -A app.main.celery_app worker --loglevel=info
  ```

* Фронтенд dev-сервер:

  ```bash
  cd frontend
  npm install
  npm run dev
  ```

  Для production-сборки:

  ```bash
  npm run build
  ```

  Результат появится в `frontend/dist` и будет обслуживаться контейнером `frontend`.

---

