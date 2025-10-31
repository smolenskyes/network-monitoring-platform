import { Box, MenuItem, TextField } from "@mui/material";

interface DeviceFilterProps {
  status: string;
  type: string;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
}

const DeviceFilter = ({ status, type, onStatusChange, onTypeChange }: DeviceFilterProps) => {
  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      <TextField
        select
        label="Статус"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        size="small"
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="all">Все</MenuItem>
        <MenuItem value="online">Онлайн</MenuItem>
        <MenuItem value="degraded">Понижена</MenuItem>
        <MenuItem value="offline">Оффлайн</MenuItem>
      </TextField>
      <TextField
        select
        label="Тип"
        value={type}
        onChange={(event) => onTypeChange(event.target.value)}
        size="small"
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="all">Все</MenuItem>
        <MenuItem value="router">Маршрутизатор</MenuItem>
        <MenuItem value="switch">Коммутатор</MenuItem>
        <MenuItem value="server">Сервер</MenuItem>
        <MenuItem value="workstation">Рабочая станция</MenuItem>
      </TextField>
    </Box>
  );
};

export default DeviceFilter;
