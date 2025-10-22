from pysnmp.hlapi import *
import logging
from typing import Dict, List, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SNMPClient:
    def __init__(self, community: str = "public", timeout: int = 2, retries: int = 1):
        self.community = community
        self.timeout = timeout
        self.retries = retries
        
        # OID definitions
        self.OIDS = {
            'sys_descr': '1.3.6.1.2.1.1.1.0',
            'sys_name': '1.3.6.1.2.1.1.5.0',
            'sys_uptime': '1.3.6.1.2.1.1.3.0',
            'cpu_usage': '1.3.6.1.4.1.9.2.1.56.0',  # Cisco CPU
            'memory_used': '1.3.6.1.4.1.9.9.48.1.1.1.5.1',  # Cisco memory
            'memory_free': '1.3.6.1.4.1.9.9.48.1.1.1.6.1',  # Cisco memory
        }

    def get_snmp_data(self, device_ip: str, oids: List[str]) -> Dict:
        """Получение данных по SNMP"""
        results = {}
        
        for oid in oids:
            try:
                error_indication, error_status, error_index, var_binds = next(
                    getCmd(SnmpEngine(),
                          CommunityData(self.community),
                          UdpTransportTarget((device_ip, 161), timeout=self.timeout, retries=self.retries),
                          ContextData(),
                          ObjectType(ObjectIdentity(oid)))
                )

                if error_indication:
                    logger.warning(f"SNMP error for {device_ip} OID {oid}: {error_indication}")
                    results[oid] = None
                elif error_status:
                    logger.warning(f"SNMP error for {device_ip} OID {oid}: {error_status}")
                    results[oid] = None
                else:
                    for var_bind in var_binds:
                        results[oid] = str(var_bind[1])
                        
            except Exception as e:
                logger.error(f"SNMP exception for {device_ip} OID {oid}: {e}")
                results[oid] = None
        
        return results

    def get_device_metrics(self, device_ip: str) -> Dict:
        """Получение метрик устройства"""
        oids_to_query = [
            self.OIDS['sys_name'],
            self.OIDS['cpu_usage'],
            self.OIDS['memory_used'],
            self.OIDS['memory_free']
        ]
        
        raw_data = self.get_snmp_data(device_ip, oids_to_query)
        
        # Обработка и преобразование данных
        metrics = {}
        
        # CPU usage
        cpu_usage = raw_data.get(self.OIDS['cpu_usage'])
        if cpu_usage and cpu_usage.isdigit():
            metrics['cpu_usage'] = float(cpu_usage)
        
        # Memory usage
        memory_used = raw_data.get(self.OIDS['memory_used'])
        memory_free = raw_data.get(self.OIDS['memory_free'])
        if memory_used and memory_free and memory_used.isdigit() and memory_free.isdigit():
            total_memory = float(memory_used) + float(memory_free)
            if total_memory > 0:
                metrics['memory_usage'] = (float(memory_used) / total_memory) * 100
                metrics['memory_used_mb'] = float(memory_used) / 1024  # Convert to MB
                metrics['memory_total_mb'] = total_memory / 1024
        
        return metrics

    def get_interface_metrics(self, device_ip: str) -> List[Dict]:
        """Получение метрик интерфейсов (упрощенная версия)"""
        # В реальной системе здесь будет сложная логика опроса интерфейсов
        interfaces = []
        
        try:
            # Пример для одного интерфейса
            interface_oids = [
                '1.3.6.1.2.1.2.2.1.7.1',  # admin status
                '1.3.6.1.2.1.2.2.1.8.1',  # oper status
            ]
            
            raw_data = self.get_snmp_data(device_ip, interface_oids)
            
            interfaces.append({
                'interface_name': 'GigabitEthernet0/0',
                'admin_status': 'up' if raw_data.get(interface_oids[0]) == '1' else 'down',
                'oper_status': 'up' if raw_data.get(interface_oids[1]) == '1' else 'down',
                'bandwidth_usage': 45.2,  # Примерное значение
                'error_count': 0
            })
            
        except Exception as e:
            logger.error(f"Error getting interface metrics for {device_ip}: {e}")
        
        return interfaces