export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  type: 'router' | 'switch' | 'server' | 'workstation' | 'unknown';
  status: 'online' | 'offline' | 'degraded';
  uptimeHours: number;
  cpuLoad: number;
  memoryUsage: number;
  lastSeen: string;
  location?: string;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  deviceId?: string;
}

export interface TrafficSample {
  timestamp: string;
  inboundMbps: number;
  outboundMbps: number;
}

export interface NetworkOverview {
  availability: number;
  totalDevices: number;
  activeAlerts: number;
  averageLatencyMs: number;
  bandwidthUtilization: number;
}

export interface ServiceHealth {
  name: string;
  status: 'operational' | 'maintenance' | 'degraded' | 'down';
  responseTimeMs: number;
  lastChecked: string;
}
