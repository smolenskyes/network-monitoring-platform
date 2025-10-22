#!/bin/bash

echo "Checking services health..."

# Check API Gateway
curl -f http://localhost/health || echo "API Gateway is down"

# Check Auth Service
curl -f http://localhost:8000/health || echo "Auth Service is down"

# Check Discovery Service
curl -f http://localhost:8001/health || echo "Discovery Service is down"

# Check Monitoring Service
curl -f http://localhost:8002/health || echo "Monitoring Service is down"

# Check Redis
docker exec network-monitoring-platform-redis-1 redis-cli ping || echo "Redis is down"

# Check Databases
echo "Database connections:"
docker exec network-monitoring-platform-auth-db-1 pg_isready
docker exec network-monitoring-platform-discovery-db-1 pg_isready
docker exec network-monitoring-platform-monitoring-db-1 pg_isready

echo "Health check completed"