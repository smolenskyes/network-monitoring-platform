import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

const SettingsPage = () => {
  const [email, setEmail] = useState('noc@enterprise.local');
  const [phone, setPhone] = useState('+7 (495) 000-00-00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoDiscovery, setAutoDiscovery] = useState(true);

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          Настройки платформы
        </Typography>
        <Typography color="text.secondary">
          Управление оповещениями, автоматическим обнаружением и интеграциями внешних систем.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3 }}>
            <CardHeader title="Контакты NOC" subheader="Обновите координаты ответственных специалистов" />
            <CardContent>
              <Stack spacing={2}>
                <TextField label="Почта для уведомлений" value={email} onChange={(event) => setEmail(event.target.value)} />
                <TextField label="Телефон дежурного" value={phone} onChange={(event) => setPhone(event.target.value)} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationsEnabled}
                      onChange={(event) => setNotificationsEnabled(event.target.checked)}
                    />
                  }
                  label="Включить автоматические уведомления"
                />
              </Stack>
            </CardContent>
            <Box display="flex" justifyContent="flex-end" px={2} pb={2}>
              <Button variant="contained">Сохранить</Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3 }}>
            <CardHeader title="Автообнаружение" subheader="Параметры опроса сети и сканирования диапазонов" />
            <CardContent>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch checked={autoDiscovery} onChange={(event) => setAutoDiscovery(event.target.checked)} />
                  }
                  label="Запускать автообнаружение по расписанию"
                />
                <TextField label="Сетевые диапазоны" defaultValue="10.0.0.0/16, 10.1.0.0/16" helperText="CIDR-нотация" />
                <TextField label="SNMP community" defaultValue="enterprise-public" />
                <TextField label="Интервал опроса (мин)" type="number" defaultValue={15} />
              </Stack>
            </CardContent>
            <Box display="flex" justifyContent="flex-end" px={2} pb={2}>
              <Button variant="contained">Применить</Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <CardHeader title="Интеграции" subheader="Веб-хуки, SIEM и системы Service Desk" />
        <CardContent>
          <Stack spacing={2}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Отправлять события в SIEM" />
            <TextField label="URL веб-хука" defaultValue="https://hooks.enterprise.local/noc" />
            <TextField label="API ключ" defaultValue="********-****-****-********" />
          </Stack>
        </CardContent>
        <Box display="flex" justifyContent="flex-end" px={2} pb={2}>
          <Button variant="outlined">Проверить соединение</Button>
        </Box>
      </Card>
    </Stack>
  );
};

export default SettingsPage;
