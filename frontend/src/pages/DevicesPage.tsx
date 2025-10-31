import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import client from '../api/client';
import { Device } from '../types/network';
import { usePolling } from '../hooks/usePolling';

const deviceTypeLabel: Record<Device['type'], string> = {
  router: 'Маршрутизатор',
  switch: 'Коммутатор',
  server: 'Сервер',
  workstation: 'Рабочая станция',
  unknown: 'Неизвестно',
};

const deviceStatusColor: Record<Device['status'], 'success' | 'warning' | 'error'> = {
  online: 'success',
  degraded: 'warning',
  offline: 'error',
};

const fallbackDevices: Device[] = Array.from({ length: 12 }).map((_, index) => ({
  id: `device-${index + 1}`,
  name: `Устройство ${index + 1}`,
  ipAddress: `10.0.${Math.floor(index / 5)}.${(index % 5) + 10}`,
  type: (['router', 'switch', 'server', 'workstation'] as Device['type'][])[
    index % 4
  ] ?? 'unknown',
  status: (['online', 'degraded', 'online', 'offline'] as Device['status'][])[index % 4],
  uptimeHours: Math.floor(Math.random() * 24 * 30),
  cpuLoad: 20 + Math.random() * 60,
  memoryUsage: 30 + Math.random() * 50,
  lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
  location: index % 2 === 0 ? 'ЦОД-1' : 'ЦОД-2',
}));

const DevicesPage = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [search, setSearch] = useState('');

  const fetchDevices = useCallback(async () => {
    try {
      const response = await client.get<Device[]>('/devices');
      setDevices(response.data);
    } catch (err) {
      console.warn('Не удалось загрузить список устройств, используются мок-данные:', err);
      setDevices(fallbackDevices);
    }
  }, []);

  useEffect(() => {
    void fetchDevices();
  }, [fetchDevices]);

  usePolling(fetchDevices, 120_000);

  const filteredDevices = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return devices;
    }
    return devices.filter((device) =>
      [device.name, device.ipAddress, device.location ?? '', device.type]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [devices, search]);

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            Устройства сети
          </Typography>
          <Typography color="text.secondary">
            Список активных узлов ЛВС с текущим статусом, загрузкой и местоположением.
          </Typography>
        </Stack>
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск по имени, IP или площадке"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Grid container spacing={3}>
        {filteredDevices.map((device) => (
          <Grid item xs={12} md={6} lg={4} key={device.id}>
            <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>{device.name[0]}</Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {device.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {device.ipAddress} • {deviceTypeLabel[device.type]}
                      </Typography>
                    </Box>
                    <Chip
                      label={device.status === 'online' ? 'В сети' : device.status === 'offline' ? 'Недоступно' : 'Нестабильно'}
                      color={deviceStatusColor[device.status]}
                      sx={{ ml: 'auto' }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Chip label={`Uptime: ${Math.floor(device.uptimeHours / 24)} дн.`} />
                    <Chip label={`CPU: ${device.cpuLoad.toFixed(0)}%`} color={device.cpuLoad > 80 ? 'error' : 'default'} />
                    <Chip
                      label={`Память: ${device.memoryUsage.toFixed(0)}%`}
                      color={device.memoryUsage > 80 ? 'warning' : 'default'}
                    />
                    {device.location && <Chip label={device.location} color="info" />}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Последняя активность: {new Date(device.lastSeen).toLocaleString('ru-RU')}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default DevicesPage;
