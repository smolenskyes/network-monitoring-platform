import { Box, Chip, Typography } from "@mui/material";
import { Device } from "../../types";

interface DeviceStatusCardProps {
  device: Device;
}

const statusColors: Record<Device["status"], "success" | "warning" | "error"> = {
  online: "success",
  degraded: "warning",
  offline: "error",
};

const DeviceStatusCard = ({ device }: DeviceStatusCardProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.05)",
        backgroundColor: "background.paper",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={600}>
          {device.name}
        </Typography>
        <Chip label={device.status.toUpperCase()} color={statusColors[device.status]} size="small" />
      </Box>
      <Typography variant="body2" color="text.secondary">
        IP: {device.ipAddress} · {device.location}
      </Typography>
      <Typography variant="body2">
        Задержка: <strong>{device.responseTimeMs} мс</strong>
      </Typography>
      <Typography variant="body2">
        Потери пакетов: <strong>{device.packetLossPercent}%</strong>
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Последняя проверка: {device.lastCheck}
      </Typography>
    </Box>
  );
};

export default DeviceStatusCard;
