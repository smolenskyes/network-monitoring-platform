import { Alert, AlertStatistic, Device, ServiceHealthMetric, TrafficSample } from "../types";

export const devices: Device[] = [
  {
    id: "1",
    name: "Core Router",
    ipAddress: "10.0.0.1",
    location: "ЦОД",
    status: "online",
    responseTimeMs: 3,
    packetLossPercent: 0.2,
    uptime: "99.98%",
    lastCheck: "5 сек назад",
    type: "router",
  },
  {
    id: "2",
    name: "Access Switch 12",
    ipAddress: "10.0.12.4",
    location: "Офис 3 этаж",
    status: "degraded",
    responseTimeMs: 18,
    packetLossPercent: 1.4,
    uptime: "98.91%",
    lastCheck: "8 сек назад",
    type: "switch",
  },
  {
    id: "3",
    name: "AD Server",
    ipAddress: "10.0.20.2",
    location: "ЦОД",
    status: "online",
    responseTimeMs: 5,
    packetLossPercent: 0,
    uptime: "99.99%",
    lastCheck: "10 сек назад",
    type: "server",
  },
  {
    id: "4",
    name: "Firewall Edge",
    ipAddress: "192.168.0.254",
    location: "Периметр",
    status: "offline",
    responseTimeMs: 0,
    packetLossPercent: 100,
    uptime: "92.37%",
    lastCheck: "34 сек назад",
    type: "router",
  },
];

export const alerts: Alert[] = [
  {
    id: "a1",
    deviceId: "4",
    severity: "critical",
    message: "Потеря связи с граничным firewall",
    timestamp: "2024-03-20T10:20:00Z",
    acknowledged: false,
    category: "security",
  },
  {
    id: "a2",
    deviceId: "2",
    severity: "warning",
    message: "Повышенная задержка на Access Switch 12",
    timestamp: "2024-03-20T10:10:00Z",
    acknowledged: false,
    category: "network",
  },
  {
    id: "a3",
    deviceId: "1",
    severity: "info",
    message: "Успешное обновление конфигурации",
    timestamp: "2024-03-20T09:45:00Z",
    acknowledged: true,
    category: "service",
  },
];

export const trafficSamples: TrafficSample[] = Array.from({ length: 12 }).map((_, index) => ({
  timestamp: `${String(index).padStart(2, "0")}:00`,
  inboundMbps: Math.round(200 + Math.random() * 200),
  outboundMbps: Math.round(120 + Math.random() * 160),
}));

export const serviceMetrics: ServiceHealthMetric[] = [
  {
    name: "DNS",
    availability: 99.9,
    latencyMs: 8,
    trend: "up",
  },
  {
    name: "DHCP",
    availability: 99.1,
    latencyMs: 21,
    trend: "stable",
  },
  {
    name: "VoIP",
    availability: 96.8,
    latencyMs: 68,
    trend: "down",
  },
];

export const alertStats: AlertStatistic[] = [
  { category: "network", total: 32, acknowledged: 26 },
  { category: "security", total: 14, acknowledged: 9 },
  { category: "hardware", total: 11, acknowledged: 7 },
  { category: "service", total: 5, acknowledged: 4 },
];
