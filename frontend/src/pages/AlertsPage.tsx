import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import client from '../api/client';
import { Alert } from '../types/network';
import AlertSeverityChip from '../components/AlertSeverityChip';
import { usePolling } from '../hooks/usePolling';

const fallbackAlerts: Alert[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: 'Недоступен коммутатор SW-DC-01',
    description: 'Нет ответа по SNMP и ICMP более 5 минут, задействованы резервные линк-каналы.',
    timestamp: new Date().toISOString(),
    deviceId: 'SW-DC-01',
  },
  {
    id: 'alert-2',
    severity: 'warning',
    title: 'Повышенная задержка VPN-туннеля',
    description: 'Средняя задержка превышает 120 мс для туннеля HQ-BRANCH-02.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    deviceId: 'VPN-HQ-02',
  },
  {
    id: 'alert-3',
    severity: 'info',
    title: 'Успешно применены политики безопасности',
    description: 'Новые правила брандмауэра активированы на всех граничных маршрутизаторах.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await client.get<Alert[]>('/alerts');
      setAlerts(response.data);
    } catch (err) {
      console.warn('Не удалось загрузить оповещения, используются мок-данные:', err);
      setAlerts(fallbackAlerts);
    }
  }, []);

  useEffect(() => {
    void fetchAlerts();
  }, [fetchAlerts]);

  usePolling(fetchAlerts, 60_000);

  const groupedAlerts = useMemo(() => {
    return alerts.reduce<Record<string, Alert[]>>((acc, alert) => {
      const date = new Date(alert.timestamp).toLocaleDateString('ru-RU');
      acc[date] = acc[date] ?? [];
      acc[date].push(alert);
      return acc;
    }, {});
  }, [alerts]);

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          Центр оповещений
        </Typography>
        <Typography color="text.secondary">
          Хронология инцидентов и уведомлений с группировкой по датам, уровню критичности и устройствам.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {Object.entries(groupedAlerts).map(([date, dateAlerts]) => (
          <Grid item xs={12} md={6} key={date}>
            <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader title={date} subheader={`${dateAlerts.length} событий`} />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  {dateAlerts.map((alert) => (
                    <Stack key={alert.id} spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" fontWeight={600}>
                          {alert.title}
                        </Typography>
                        <AlertSeverityChip severity={alert.severity} />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {alert.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(alert.timestamp).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {alert.deviceId ? ` • Устройство: ${alert.deviceId}` : ''}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default AlertsPage;
