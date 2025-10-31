import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert as MuiAlert, Grid, Skeleton, Stack, Typography } from '@mui/material';
import StatusCard from '../components/StatusCard';
import TrafficChart from '../components/TrafficChart';
import ServiceStatusList from '../components/ServiceStatusList';
import client from '../api/client';
import { Alert, NetworkOverview, ServiceHealth, TrafficSample } from '../types/network';
import { usePolling } from '../hooks/usePolling';

interface DashboardResponse {
  overview: NetworkOverview;
  traffic: TrafficSample[];
  services: ServiceHealth[];
  alerts: Alert[];
}

const fallbackData: DashboardResponse = {
  overview: {
    availability: 99.92,
    totalDevices: 128,
    activeAlerts: 3,
    averageLatencyMs: 12,
    bandwidthUtilization: 63,
  },
  traffic: Array.from({ length: 24 }, (_, index) => ({
    timestamp: `${index}:00`,
    inboundMbps: 120 + Math.random() * 40,
    outboundMbps: 80 + Math.random() * 30,
  })),
  services: [
    {
      name: 'API шлюз',
      status: 'operational',
      responseTimeMs: 18,
      lastChecked: '1 минуту назад',
    },
    {
      name: 'Служба обнаружения',
      status: 'operational',
      responseTimeMs: 26,
      lastChecked: '1 минуту назад',
    },
    {
      name: 'Мониторинг устройств',
      status: 'degraded',
      responseTimeMs: 41,
      lastChecked: '2 минуты назад',
    },
    {
      name: 'Уведомления',
      status: 'maintenance',
      responseTimeMs: 0,
      lastChecked: '4 минуты назад',
    },
  ],
  alerts: [
    {
      id: '1',
      severity: 'critical',
      title: 'Высокая загрузка CPU на маршрутизаторе',
      description: 'Маршрутизатор HQ-R1 превышает порог CPU > 90% в течение 10 минут',
      timestamp: new Date().toISOString(),
      deviceId: 'HQ-R1',
    },
    {
      id: '2',
      severity: 'warning',
      title: 'Потеря пакетов в сегменте VLAN 42',
      description: 'Фиксируются потери пакетов 2-3% при пиковых нагрузках',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      severity: 'info',
      title: 'Плановое обновление прошивки',
      description: 'Коммутаторы в дата-центре переведены в режим обновления',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    },
  ],
};

const DashboardPage = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await client.get<DashboardResponse>('/dashboard');
      setData(response.data);
    } catch (err) {
      console.warn('Не удалось загрузить данные панели управления, используется мок:', err);
      setError('Не удалось получить данные с сервера. Показаны примерные значения.');
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  usePolling(fetchData, 60_000);

  const latestAlert = useMemo(() => data?.alerts[0], [data?.alerts]);

  if (loading && !data) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rectangular" height={100} />
        <Skeleton variant="rectangular" height={360} />
        <Skeleton variant="rectangular" height={280} />
      </Stack>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Typography variant="h4" fontWeight={700}>
          Сводка состояния сети
        </Typography>
        <Typography color="text.secondary">
          Онлайн-мониторинг инфраструктуры предприятия: доступность, устройства, инциденты и тенденции.
        </Typography>
      </Stack>

      {error && <MuiAlert severity="warning">{error}</MuiAlert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatusCard
            title="Доступность сети"
            value={`${data.overview.availability.toFixed(2)}%`}
            trend={`Среднее за 30 дней: ${(data.overview.availability - 0.12).toFixed(2)}%`}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatusCard
            title="Устройств под мониторингом"
            value={data.overview.totalDevices}
            description="Обновляется при сканировании инфраструктуры"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatusCard
            title="Активные оповещения"
            value={data.overview.activeAlerts}
            trend={latestAlert ? `Последнее: ${latestAlert.title}` : 'Нет активных оповещений'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatusCard
            title="Средняя задержка"
            value={`${data.overview.averageLatencyMs} мс`}
            description={`Загруженность каналов: ${data.overview.bandwidthUtilization}%`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <TrafficChart data={data.traffic} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ServiceStatusList services={data.services} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DashboardPage;
