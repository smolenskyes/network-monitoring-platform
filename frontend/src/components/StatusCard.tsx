import { Card, CardContent, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface StatusCardProps {
  title: string;
  value: string | number;
  trend?: ReactNode;
  description?: string;
}

const StatusCard = ({ title, value, trend, description }: StatusCardProps) => (
  <Card elevation={0} sx={{ borderRadius: 3 }}>
    <CardContent>
      <Stack spacing={1}>
        <Typography color="text.secondary" variant="subtitle2">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        {trend && <Typography variant="body2">{trend}</Typography>}
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Stack>
    </CardContent>
  </Card>
);

export default StatusCard;
