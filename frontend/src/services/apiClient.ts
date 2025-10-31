import axios from "axios";
import { Alert, AlertStatistic, Device, ServiceHealthMetric, TrafficSample } from "../types";
import { alertStats, alerts, devices, serviceMetrics, trafficSamples } from "../data/mockData";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export const fetchDevices = async (): Promise<Device[]> => {
  try {
    const response = await api.get<Device[]>("/devices");
    return response.data;
  } catch (error) {
    console.warn("API недоступен, использованы демо-данные устройств", error);
    return devices;
  }
};

export const fetchAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await api.get<Alert[]>("/alerts");
    return response.data;
  } catch (error) {
    console.warn("API недоступен, использованы демо-данные событий", error);
    return alerts;
  }
};

export const fetchTraffic = async (): Promise<TrafficSample[]> => {
  try {
    const response = await api.get<TrafficSample[]>("/traffic");
    return response.data;
  } catch (error) {
    console.warn("API недоступен, использованы демо-данные трафика", error);
    return trafficSamples;
  }
};

export const fetchServiceMetrics = async (): Promise<ServiceHealthMetric[]> => {
  try {
    const response = await api.get<ServiceHealthMetric[]>("/services/health");
    return response.data;
  } catch (error) {
    console.warn("API недоступен, использованы демо-данные сервисов", error);
    return serviceMetrics;
  }
};

export const fetchAlertStats = async (): Promise<AlertStatistic[]> => {
  try {
    const response = await api.get<AlertStatistic[]>("/alerts/statistics");
    return response.data;
  } catch (error) {
    console.warn("API недоступен, использованы демо-статистики", error);
    return alertStats;
  }
};
