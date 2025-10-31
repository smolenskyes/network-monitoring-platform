import { Box, MenuItem, TextField } from "@mui/material";

interface AlertFiltersProps {
  severity: string;
  category: string;
  onSeverityChange: (severity: string) => void;
  onCategoryChange: (category: string) => void;
}

const AlertFilters = ({ severity, category, onSeverityChange, onCategoryChange }: AlertFiltersProps) => {
  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      <TextField
        select
        label="Критичность"
        size="small"
        value={severity}
        sx={{ minWidth: 200 }}
        onChange={(event) => onSeverityChange(event.target.value)}
      >
        <MenuItem value="all">Все</MenuItem>
        <MenuItem value="critical">Критические</MenuItem>
        <MenuItem value="warning">Предупреждения</MenuItem>
        <MenuItem value="info">Информационные</MenuItem>
      </TextField>
      <TextField
        select
        label="Категория"
        size="small"
        value={category}
        sx={{ minWidth: 200 }}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        <MenuItem value="all">Все</MenuItem>
        <MenuItem value="network">Сеть</MenuItem>
        <MenuItem value="security">Безопасность</MenuItem>
        <MenuItem value="hardware">Оборудование</MenuItem>
        <MenuItem value="service">Сервисы</MenuItem>
      </TextField>
    </Box>
  );
};

export default AlertFilters;
