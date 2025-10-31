import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RouterIcon from "@mui/icons-material/Router";
import WarningIcon from "@mui/icons-material/Warning";
import InsightsIcon from "@mui/icons-material/Insights";
import { NavLink, useLocation } from "react-router-dom";

const drawerWidth = 260;

const navItems = [
  { label: "Обзор", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Устройства", icon: <RouterIcon />, path: "/devices" },
  { label: "События", icon: <WarningIcon />, path: "/alerts" },
  { label: "Аналитика", icon: <InsightsIcon />, path: "/analytics" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: 0,
          backgroundColor: "background.default",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight={700} color="primary">
          NMP
        </Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": {
                  color: "primary.contrastText",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "text.secondary" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box mt="auto" p={2}>
        <Typography variant="body2" color="text.secondary">
          Мониторинг ЛВС предприятия
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
