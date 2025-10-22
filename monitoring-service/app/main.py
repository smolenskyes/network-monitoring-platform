from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
from celery import Celery
import asyncio
from ping3 import ping
import datetime

from .models import Base, DeviceMetric, DeviceStatus, InterfaceStatus
from .snmp_client import SNMPClient

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://monitoring_user:monitoring_pass@localhost:5432/monitoring_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Celery setup
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/1")
celery_app = Celery('monitoring', broker=REDIS_URL, backend=REDIS_URL)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Monitoring Service", version="1.0.0")
snmp_client = SNMPClient()

# Pydantic models
class MetricData(BaseModel):
    device_ip: str
    metric_type: str
    metric_name: str
    metric_value: float
    unit: Optional[str] = None

class DeviceStatusResponse(BaseModel):
    device_ip: str
    is_online: bool
    response_time: Optional[float]
    last_check: str
    uptime: float

    class Config:
        from_attributes = True

class InterfaceStatusResponse(BaseModel):
    device_ip: str
    interface_name: str
    admin_status: Optional[str]
    oper_status: Optional[str]
    bandwidth_usage: Optional[float]
    error_count: int
    timestamp: str

    class Config:
        from_attributes = True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Celery tasks
@celery_app.task
def check_device_availability(device_ip: str):
    """Проверка доступности устройства"""
    db = SessionLocal()
    try:
        # ICMP ping
        response_time = ping(device_ip, timeout=2)
        is_online = response_time is not None and response_time is not False
        
        # Обновление статуса устройства
        device_status = db.query(DeviceStatus).filter(DeviceStatus.device_ip == device_ip).first()
        
        if device_status:
            device_status.is_online = is_online
            device_status.response_time = response_time * 1000 if response_time else None  # Convert to ms
            device_status.last_check = datetime.datetime.now()
            
            if is_online:
                device_status.uptime += 60  # Assuming check every 60 seconds
            else:
                device_status.uptime = 0
        else:
            device_status = DeviceStatus(
                device_ip=device_ip,
                is_online=is_online,
                response_time=response_time * 1000 if response_time else None,
                last_check=datetime.datetime.now(),
                uptime=60 if is_online else 0
            )
            db.add(device_status)
        
        db.commit()
        
    except Exception as e:
        print(f"Error checking device {device_ip}: {e}")
    finally:
        db.close()

@celery_app.task
def collect_device_metrics(device_ip: str):
    """Сбор метрик устройства"""
    db = SessionLocal()
    try:
        if not device_ip:
            return
        
        # Проверка доступности
        response_time = ping(device_ip, timeout=2)
        if response_time is None or response_time is False:
            return
        
        # Сбор метрик по SNMP
        metrics = snmp_client.get_device_metrics(device_ip)
        
        # Сохранение метрик
        for metric_name, metric_value in metrics.items():
            if metric_value is not None:
                metric = DeviceMetric(
                    device_ip=device_ip,
                    metric_type='system',
                    metric_name=metric_name,
                    metric_value=metric_value,
                    unit='%' if 'usage' in metric_name else 'MB'
                )
                db.add(metric)
        
        # Сбор метрик интерфейсов
        interfaces = snmp_client.get_interface_metrics(device_ip)
        for interface in interfaces:
            interface_status = InterfaceStatus(
                device_ip=device_ip,
                interface_name=interface['interface_name'],
                admin_status=interface['admin_status'],
                oper_status=interface['oper_status'],
                bandwidth_usage=interface['bandwidth_usage'],
                error_count=interface['error_count'],
                timestamp=datetime.datetime.now()
            )
            db.add(interface_status)
        
        db.commit()
        
    except Exception as e:
        print(f"Error collecting metrics for {device_ip}: {e}")
    finally:
        db.close()

# Routes
@app.get("/devices/{device_ip}/status")
async def get_device_status(device_ip: str, db: Session = Depends(get_db)):
    """Получение статуса устройства"""
    status = db.query(DeviceStatus).filter(DeviceStatus.device_ip == device_ip).first()
    if not status:
        raise HTTPException(status_code=404, detail="Device status not found")
    return status

@app.get("/devices/{device_ip}/metrics")
async def get_device_metrics(device_ip: str, limit: int = 100, db: Session = Depends(get_db)):
    """Получение метрик устройства"""
    metrics = db.query(DeviceMetric).filter(
        DeviceMetric.device_ip == device_ip
    ).order_by(DeviceMetric.timestamp.desc()).limit(limit).all()
    return metrics

@app.get("/devices/{device_ip}/interfaces")
async def get_device_interfaces(device_ip: str, db: Session = Depends(get_db)):
    """Получение статуса интерфейсов устройства"""
    interfaces = db.query(InterfaceStatus).filter(
        InterfaceStatus.device_ip == device_ip
    ).order_by(InterfaceStatus.timestamp.desc()).limit(10).all()
    return interfaces

@app.post("/devices/{device_ip}/check-now")
async def check_device_now(device_ip: str, background_tasks: BackgroundTasks):
    """Немедленная проверка устройства"""
    background_tasks.add_task(check_device_availability, device_ip)
    background_tasks.add_task(collect_device_metrics, device_ip)
    return {"message": f"Device {device_ip} check initiated"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "monitoring-service"}

# Celery beat schedule for periodic monitoring
celery_app.conf.beat_schedule = {
    'periodic-availability-check': {
        'task': 'app.main.check_device_availability',
        'schedule': 60.0,  # Every 60 seconds
    },
    'periodic-metrics-collection': {
        'task': 'app.main.collect_device_metrics',
        'schedule': 300.0,  # Every 5 minutes
    },
}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)