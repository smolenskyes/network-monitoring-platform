import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useMemo } from "react";
import { useThemeMode } from "../../providers/AppThemeProvider";

const TopBar = () => {
  const { mode, toggle } = useThemeMode();

  const ModeIcon = useMemo(() => (mode === "dark" ? LightModeIcon : DarkModeIcon), [mode]);

  const handleRefresh = () => {
    window.dispatchEvent(new CustomEvent("refresh-dashboard"));
  };

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h5" fontWeight={600} sx={{ flex: 1 }}>
          Панель мониторинга
        </Typography>
        <TextField
          placeholder="Поиск устройства или события"
          size="small"
          sx={{ maxWidth: 360 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Обновить данные">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={mode === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}>
          <IconButton onClick={toggle}>
            <ModeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Уведомления">
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar>IT</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
