import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { ServiceHealth } from '../types/network';

interface ServiceStatusListProps {
  services: ServiceHealth[];
}

const statusToColor: Record<ServiceHealth['status'], 'success' | 'warning' | 'error' | 'default'> = {
  operational: 'success',
  maintenance: 'warning',
  degraded: 'warning',
  down: 'error',
};

const statusToLabel: Record<ServiceHealth['status'], string> = {
  operational: 'Работает',
  maintenance: 'Обслуживание',
  degraded: 'Нестабильно',
  down: 'Недоступно',
};

const ServiceStatusList = ({ services }: ServiceStatusListProps) => (
  <Card elevation={0} sx={{ height: '100%', borderRadius: 3 }}>
    <CardHeader title="Состояние сервисов" subheader="Мониторинг ключевых компонентов" />
    <CardContent>
      <List disablePadding>
        {services.map((service) => (
          <ListItem key={service.name} disableGutters sx={{ py: 1.5 }}>
            <ListItemAvatar>
              <Avatar>{service.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {service.name}
                  </Typography>
                  <Chip
                    size="small"
                    label={statusToLabel[service.status]}
                    color={statusToColor[service.status]}
                  />
                </Stack>
              }
              secondary={`Время отклика: ${service.responseTimeMs} мс • Проверено ${service.lastChecked}`}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

export default ServiceStatusList;
