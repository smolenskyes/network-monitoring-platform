import { Chip } from '@mui/material';
import { Alert } from '../types/network';

const severityMap: Record<Alert['severity'], { label: string; color: 'default' | 'info' | 'warning' | 'error' }> = {
  info: { label: 'Инфо', color: 'info' },
  warning: { label: 'Внимание', color: 'warning' },
  critical: { label: 'Критично', color: 'error' },
};

interface AlertSeverityChipProps {
  severity: Alert['severity'];
}

const AlertSeverityChip = ({ severity }: AlertSeverityChipProps) => {
  const config = severityMap[severity];
  return <Chip size="small" color={config.color} label={config.label} />;
};

export default AlertSeverityChip;
