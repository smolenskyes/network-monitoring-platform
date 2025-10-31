import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Alert } from "../../types";
import { Fragment } from "react";

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

interface AlertTimelineProps {
  alerts: Alert[];
}

const severityColor: Record<Alert["severity"], "error" | "warning" | "info"> = {
  critical: "error",
  warning: "warning",
  info: "info",
};

const AlertTimeline = ({ alerts }: AlertTimelineProps) => {
  return (
    <Card>
      <CardHeader title="Лента событий" subheader="Последние уведомления" />
      <CardContent>
        <List>
          {alerts.map((alert, index) => (
            <Fragment key={alert.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <WarningIcon color={severityColor[alert.severity]} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={alert.message}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {dateTimeFormatter.format(new Date(alert.timestamp))}
                      </Typography>
                      <Chip
                        label={alert.acknowledged ? "Подтверждено" : "Требует реакции"}
                        color={alert.acknowledged ? "success" : "default"}
                        size="small"
                        icon={alert.acknowledged ? <CheckCircleIcon /> : undefined}
                        sx={{ ml: 1 }}
                      />
                    </>
                  }
                />
              </ListItem>
              {index < alerts.length - 1 && <Divider component="li" />}
            </Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default AlertTimeline;
