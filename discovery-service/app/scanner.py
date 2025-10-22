import asyncio
import ipaddress
from ping3 import ping
from scapy.all import ARP, Ether, srp
import datetime
from typing import List, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NetworkScanner:
    def __init__(self):
        self.timeout = 2
        self.thread_count = 50

    async def ping_sweep(self, subnet: str) -> List[str]:
        """Асинхронное сканирование подсети с помощью ping"""
        network = ipaddress.ip_network(subnet, strict=False)
        active_ips = []
        
        async def check_ip(ip):
            try:
                response = await asyncio.get_event_loop().run_in_executor(
                    None, ping, str(ip), self.timeout
                )
                if response is not None and response is not False:
                    active_ips.append(str(ip))
                    logger.info(f"Found active device: {ip}")
            except Exception as e:
                logger.debug(f"Ping failed for {ip}: {e}")
        
        tasks = [check_ip(ip) for ip in network.hosts()]
        await asyncio.gather(*tasks, return_exceptions=True)
        
        return active_ips

    def arp_scan(self, subnet: str) -> List[Dict]:
        """Сканирование ARP для получения MAC-адресов"""
        try:
            arp_request = ARP(pdst=subnet)
            broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
            arp_request_broadcast = broadcast / arp_request
            
            answered_list = srp(arp_request_broadcast, timeout=1, verbose=False)[0]
            
            devices = []
            for sent, received in answered_list:
                devices.append({
                    'ip': received.psrc,
                    'mac': received.hwsrc,
                    'vendor': self.get_vendor(received.hwsrc)
                })
            
            return devices
        except Exception as e:
            logger.error(f"ARP scan failed: {e}")
            return []

    def get_vendor(self, mac_address: str) -> str:
        """Определение производителя по MAC-адресу (упрощенная версия)"""
        # В реальной системе можно использовать базу данных OUI
        vendors = {
            '00:00:0c': 'Cisco',
            '00:50:56': 'VMware',
            '00:1c:42': 'Parallels',
            '00:15:5d': 'Microsoft',
            '00:0c:29': 'VMware',
            '00:50:8b': 'Intel',
            '00:1b:21': 'Hewlett Packard',
        }
        
        mac_prefix = mac_address.lower()[:8]
        return vendors.get(mac_prefix, 'Unknown')

    async def comprehensive_scan(self, subnet: str) -> List[Dict]:
        """Комплексное сканирование сети"""
        logger.info(f"Starting comprehensive scan for subnet: {subnet}")
        
        # Ping sweep для обнаружения активных устройств
        active_ips = await self.ping_sweep(subnet)
        logger.info(f"Ping sweep found {len(active_ips)} active devices")
        
        # ARP scan для получения MAC-адресов
        arp_devices = self.arp_scan(subnet)
        
        # Объединение результатов
        devices = []
        for ip in active_ips:
            device_info = {
                'ip_address': ip,
                'mac_address': 'Unknown',
                'vendor': 'Unknown',
                'hostname': f"device-{ip.replace('.', '-')}",
                'device_type': 'unknown',
                'last_seen': datetime.datetime.now()
            }
            
            # Поиск в ARP результатах
            for arp_device in arp_devices:
                if arp_device['ip'] == ip:
                    device_info.update({
                        'mac_address': arp_device['mac'],
                        'vendor': arp_device['vendor']
                    })
                    break
            
            devices.append(device_info)
        
        logger.info(f"Scan completed. Total devices found: {len(devices)}")
        return devices