import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const scheduledReports = [
  {
    id: 'report-availability',
    title: 'Отчёт по доступности инфраструктуры',
    description: 'Ежедневный анализ доступности критических сегментов ЛВС и SLA.',
    period: 'Ежедневно в 07:00',
    format: 'PDF + XLSX',
  },
  {
    id: 'report-security',
    title: 'Сводка по безопасности и событиям',
    description: 'Инциденты безопасности, события IDS/IPS и динамика политик доступа.',
    period: 'Ежедневно в 08:00',
    format: 'PDF',
  },
  {
    id: 'report-capacity',
    title: 'Планирование ёмкости каналов связи',
    description: 'Прогноз использования полосы пропускания и рекомендации по масштабированию.',
    period: 'Еженедельно по понедельникам',
    format: 'XLSX',
  },
];

const ReportsPage = () => {
  const [customReportName, setCustomReportName] = useState('');

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          Отчёты и аналитика
        </Typography>
        <Typography color="text.secondary">
          Планирование, формирование и доставка отчётности по ключевым метрикам корпоративной сети.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {scheduledReports.map((report) => (
          <Grid item xs={12} md={4} key={report.id}>
            <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader title={report.title} subheader={report.period} />
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    {report.description}
                  </Typography>
                  <Chip label={report.format} />
                </Stack>
              </CardContent>
              <CardActions>
                <Button size="small">Скачать последний</Button>
                <Button size="small">Изменить расписание</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <CardHeader title="Создать разовый отчёт" subheader="Настройте параметры и получите ссылку на скачивание" />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Название отчёта"
              value={customReportName}
              onChange={(event) => setCustomReportName(event.target.value)}
              placeholder={'Например, "Аудит сетевой доступности филиалов"'}
            />
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField label="Период от" type="date" InputLabelProps={{ shrink: true }} />
              <TextField label="Период до" type="date" InputLabelProps={{ shrink: true }} />
              <TextField
                select
                label="Формат"
                value="pdf"
                SelectProps={{ native: true }}
              >
                <option value="pdf">PDF</option>
                <option value="xlsx">XLSX</option>
                <option value="csv">CSV</option>
              </TextField>
            </Box>
          </Stack>
        </CardContent>
        <CardActions>
          <Button variant="contained" disabled={!customReportName}>
            Сгенерировать отчёт
          </Button>
          <Button>Очистить</Button>
        </CardActions>
      </Card>
    </Stack>
  );
};

export default ReportsPage;
