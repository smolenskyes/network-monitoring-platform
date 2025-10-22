from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class NetworkDevice(Base):
    __tablename__ = "network_devices"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String(15), unique=True, index=True, nullable=False)
    mac_address = Column(String(17), nullable=True)
    hostname = Column(String(100), nullable=True)
    vendor = Column(String(100), nullable=True)
    device_type = Column(String(50), nullable=True)  # router, switch, server, etc.
    os_version = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    last_seen = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())

class NetworkScan(Base):
    __tablename__ = "network_scans"

    id = Column(Integer, primary_key=True, index=True)
    subnet = Column(String(18), nullable=False)  # CIDR notation
    devices_found = Column(Integer, default=0)
    scan_duration = Column(Integer)  # in seconds
    status = Column(String(20), default="completed")  # running, completed, failed
    created_at = Column(DateTime, default=func.now())