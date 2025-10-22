from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import os
from celery import Celery
import asyncio

from .models import Base, NetworkDevice, NetworkScan
from .scanner import NetworkScanner

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://discovery_user:discovery_pass@localhost:5432/discovery_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Celery setup
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
celery_app = Celery('discovery', broker=REDIS_URL, backend=REDIS_URL)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Discovery Service", version="1.0.0")
scanner = NetworkScanner()

# Pydantic models
class DeviceCreate(BaseModel):
    ip_address: str
    mac_address: Optional[str] = None
    hostname: Optional[str] = None
    vendor: Optional[str] = None
    device_type: Optional[str] = None

class DeviceResponse(BaseModel):
    id: int
    ip_address: str
    mac_address: Optional[str]
    hostname: Optional[str]
    vendor: Optional[str]
    device_type: Optional[str]
    is_active: bool
    last_seen: str

    class Config:
        from_attributes = True

class ScanRequest(BaseModel):
    subnet: str = "192.168.1.0/24"

class ScanResponse(BaseModel):
    scan_id: int
    subnet: str
    devices_found: int
    status: str

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Celery tasks
@celery_app.task
def perform_network_scan(subnet: str, scan_id: int):
    """Фоновая задача для сканирования сети"""
    db = SessionLocal()
    try:
        # Здесь будет асинхронный вызов сканирования
        # Для демонстрации - имитация сканирования
        import time
        time.sleep(10)  # Имитация длительного сканирования
        
        # Обновление статуса сканирования
        scan = db.query(NetworkScan).filter(NetworkScan.id == scan_id).first()
        if scan:
            scan.status = "completed"
            scan.devices_found = 5  # Примерное количество
            db.commit()
            
    except Exception as e:
        # Обновление статуса при ошибке
        scan = db.query(NetworkScan).filter(NetworkScan.id == scan_id).first()
        if scan:
            scan.status = "failed"
            db.commit()
    finally:
        db.close()

# Routes
@app.post("/scan", response_model=ScanResponse)
async def start_network_scan(scan_request: ScanRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Запуск сканирования сети"""
    # Создание записи о сканировании
    scan = NetworkScan(subnet=scan_request.subnet, status="running")
    db.add(scan)
    db.commit()
    db.refresh(scan)
    
    # Запуск фоновой задачи
    perform_network_scan.delay(scan_request.subnet, scan.id)
    
    return ScanResponse(
        scan_id=scan.id,
        subnet=scan_request.subnet,
        devices_found=0,
        status=scan.status
    )

@app.get("/devices", response_model=List[DeviceResponse])
async def get_devices(db: Session = Depends(get_db)):
    """Получение списка всех устройств"""
    devices = db.query(NetworkDevice).filter(NetworkDevice.is_active == True).all()
    return devices

@app.post("/devices", response_model=DeviceResponse)
async def create_device(device_data: DeviceCreate, db: Session = Depends(get_db)):
    """Ручное добавление устройства"""
    # Проверка существования устройства
    existing_device = db.query(NetworkDevice).filter(
        NetworkDevice.ip_address == device_data.ip_address
    ).first()
    
    if existing_device:
        raise HTTPException(status_code=400, detail="Device already exists")
    
    # Создание нового устройства
    device = NetworkDevice(**device_data.dict())
    db.add(device)
    db.commit()
    db.refresh(device)
    
    return device

@app.get("/devices/{device_id}", response_model=DeviceResponse)
async def get_device(device_id: int, db: Session = Depends(get_db)):
    """Получение информации об устройстве"""
    device = db.query(NetworkDevice).filter(NetworkDevice.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@app.delete("/devices/{device_id}")
async def delete_device(device_id: int, db: Session = Depends(get_db)):
    """Удаление устройства"""
    device = db.query(NetworkDevice).filter(NetworkDevice.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    db.delete(device)
    db.commit()
    
    return {"message": "Device deleted successfully"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "discovery-service"}

# Celery beat schedule
celery_app.conf.beat_schedule = {
    'periodic-network-scan': {
        'task': 'app.main.perform_network_scan',
        'schedule': 300.0,  # Каждые 5 минут
        'args': ['192.168.1.0/24', 0]  # 0 означает автоматическое сканирование
    },
}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)