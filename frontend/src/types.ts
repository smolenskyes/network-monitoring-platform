export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  location: string;
  status: "online" | "offline" | "degraded";
  responseTimeMs: number;
  packetLossPercent: number;
  uptime: string;
  lastCheck: string;
  type: "router" | "switch" | "server" | "workstation";
}

export interface Alert {
  id: string;
  deviceId: string;
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
  acknowledged: boolean;
  category: "network" | "security" | "hardware" | "service";
}

export interface TrafficSample {
  timestamp: string;
  inboundMbps: number;
  outboundMbps: number;
}

export interface ServiceHealthMetric {
  name: string;
  availability: number;
  latencyMs: number;
  trend: "up" | "down" | "stable";
}

export interface AlertStatistic {
  category: string;
  total: number;
  acknowledged: number;
}
