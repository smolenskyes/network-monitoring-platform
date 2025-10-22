#!/bin/bash

echo "🔧 Fixing project structure..."

# Создаем основные директории
mkdir -p api-gateway auth-service/app discovery-service/app monitoring-service/app frontend/src
mkdir -p databases/init-scripts backups prometheus grafana/dashboards

# Создаем Dockerfile
cat > api-gateway/Dockerfile << 'EOF'
FROM nginx:1.21-alpine
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

cat > auth-service/Dockerfile << 'EOF'
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

cat > discovery-service/Dockerfile << 'EOF'
FROM python:3.9-slim
RUN apt-get update && apt-get install -y iputils-ping net-tools && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
EOF

cat > monitoring-service/Dockerfile << 'EOF'
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8002
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002"]
EOF

cat > frontend/Dockerfile << 'EOF'
FROM nginx:1.21-alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Создаем requirements.txt
cat > auth-service/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-dotenv==1.0.0
EOF

cat > discovery-service/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-dotenv==1.0.0
ping3==4.0.4
EOF

cat > monitoring-service/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-dotenv==1.0.0
ping3==4.0.4
pysnmp==4.4.12
EOF

# Создаем базовые файлы для frontend
cat > frontend/nginx.conf << 'EOF'
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
    }
}
EOF

cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Network Monitoring</title>
</head>
<body>
    <h1>Network Monitoring Platform</h1>
    <p>Backend services are starting...</p>
</body>
</html>
EOF

echo "✅ Project structure fixed!"