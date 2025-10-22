from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class DeviceMetric(Base):
    __tablename__ = "device_metrics"

    id = Column(Integer, primary_key=True, index=True)
    device_ip = Column(String(15), nullable=False, index=True)
    metric_type = Column(String(50), nullable=False)  # cpu, memory, interface, availability
    metric_name = Column(String(100), nullable=False)  # cpu_usage, memory_used, etc.
    metric_value = Column(Float, nullable=False)
    unit = Column(String(20), nullable=True)  # %, MB, Mbps, etc.
    timestamp = Column(DateTime, default=func.now())

class DeviceStatus(Base):
    __tablename__ = "device_status"

    id = Column(Integer, primary_key=True, index=True)
    device_ip = Column(String(15), unique=True, index=True, nullable=False)
    is_online = Column(Boolean, default=False)
    response_time = Column(Float)  # in ms
    last_check = Column(DateTime, default=func.now())
    uptime = Column(Float, default=0.0)  # in seconds

class InterfaceStatus(Base):
    __tablename__ = "interface_status"

    id = Column(Integer, primary_key=True, index=True)
    device_ip = Column(String(15), nullable=False, index=True)
    interface_name = Column(String(50), nullable=False)
    admin_status = Column(String(20), nullable=True)  # up, down
    oper_status = Column(String(20), nullable=True)   # up, down
    bandwidth_usage = Column(Float, nullable=True)    # in Mbps
    error_count = Column(Integer, default=0)
    timestamp = Column(DateTime, default=func.now())