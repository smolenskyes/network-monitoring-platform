import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Device } from "../../types";

interface DeviceTableProps {
  devices: Device[];
}

const statusColors: Record<Device["status"], "success" | "warning" | "error"> = {
  online: "success",
  degraded: "warning",
  offline: "error",
};

const typeLabels: Record<Device["type"], string> = {
  router: "Маршрутизатор",
  switch: "Коммутатор",
  server: "Сервер",
  workstation: "Рабочая станция",
};

const DeviceTable = ({ devices }: DeviceTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Имя</TableCell>
            <TableCell>IP адрес</TableCell>
            <TableCell>Локация</TableCell>
            <TableCell>Тип</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Uptime</TableCell>
            <TableCell>Задержка, мс</TableCell>
            <TableCell>Потери, %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id} hover>
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.ipAddress}</TableCell>
              <TableCell>{device.location}</TableCell>
              <TableCell>{typeLabels[device.type]}</TableCell>
              <TableCell>
                <Chip label={device.status} color={statusColors[device.status]} size="small" />
              </TableCell>
              <TableCell>{device.uptime}</TableCell>
              <TableCell>{device.responseTimeMs}</TableCell>
              <TableCell>{device.packetLossPercent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DeviceTable;
