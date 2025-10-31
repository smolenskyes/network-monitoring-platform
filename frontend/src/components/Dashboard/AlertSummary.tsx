import { Card, CardContent, CardHeader, Chip, Grid, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Alert } from "../../types";

interface AlertSummaryProps {
  alerts: Alert[];
}

const severityColor: Record<Alert["severity"], "error" | "warning" | "info"> = {
  critical: "error",
  warning: "warning",
  info: "info",
};

const AlertSummary = ({ alerts }: AlertSummaryProps) => {
  const critical = alerts.filter((alert) => alert.severity === "critical");
  const warning = alerts.filter((alert) => alert.severity === "warning");

  return (
    <Card>
      <CardHeader title="Активные события" subheader={`Всего: ${alerts.length}`} />
      <CardContent>
        <Grid container spacing={2}>
          {[critical, warning, alerts].map((group, index) => {
            const label = index === 0 ? "Критические" : index === 1 ? "Предупреждения" : "Все";
            return (
              <Grid item xs={12} md={4} key={label}>
                <Card variant="outlined" sx={{ borderStyle: "dashed" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {group.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <Grid container spacing={1} mt={2}>
          {alerts.slice(0, 5).map((alert) => (
            <Grid item xs={12} key={alert.id}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip label={alert.severity.toUpperCase()} color={severityColor[alert.severity]} icon={<WarningIcon />} />
                  <Typography variant="body2" flex={1}>
                    {alert.message}
                  </Typography>
                  <Chip
                    label={alert.acknowledged ? "Подтверждено" : "Неподтверждён"}
                    color={alert.acknowledged ? "success" : "default"}
                    icon={alert.acknowledged ? <CheckCircleIcon /> : undefined}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AlertSummary;
