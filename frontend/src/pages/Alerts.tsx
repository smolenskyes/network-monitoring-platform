import { Grid, Skeleton, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import AlertFilters from "../components/Alerts/AlertFilters";
import AlertTimeline from "../components/Alerts/AlertTimeline";
import { useFetch } from "../hooks/useFetch";
import { fetchAlertStats, fetchAlerts } from "../services/apiClient";
import AlertVolumeChart from "../components/Analytics/AlertVolumeChart";

const AlertsPage = () => {
  const [severity, setSeverity] = useState("all");
  const [category, setCategory] = useState("all");
  const alertsState = useFetch(fetchAlerts);
  const statsState = useFetch(fetchAlertStats);

  const filteredAlerts = useMemo(() => {
    if (!alertsState.data) {
      return [];
    }
    return alertsState.data.filter((alert) => {
      const severityMatch = severity === "all" || alert.severity === severity;
      const categoryMatch = category === "all" || alert.category === category;
      return severityMatch && categoryMatch;
    });
  }, [alertsState.data, severity, category]);

  const loading = alertsState.loading || statsState.loading;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          События и уведомления
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Анализ инцидентов и контроль выполнения регламентов реагирования.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <AlertFilters
          severity={severity}
          category={category}
          onSeverityChange={setSeverity}
          onCategoryChange={setCategory}
        />
      </Grid>
      {loading ? (
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={400} />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} md={6}>
            <AlertTimeline alerts={filteredAlerts} />
          </Grid>
          <Grid item xs={12} md={6}>
            {statsState.data && <AlertVolumeChart stats={statsState.data} />}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default AlertsPage;
