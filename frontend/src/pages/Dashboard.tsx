import { Grid, Skeleton, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import AlertSummary from "../components/Dashboard/AlertSummary";
import DeviceStatusCard from "../components/Dashboard/DeviceStatusCard";
import ServiceHealth from "../components/Dashboard/ServiceHealth";
import TrafficOverview from "../components/Dashboard/TrafficOverview";
import { useFetch } from "../hooks/useFetch";
import {
  fetchAlerts,
  fetchDevices,
  fetchServiceMetrics,
  fetchTraffic,
} from "../services/apiClient";

const DashboardPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = useCallback(() => setRefreshKey((prev) => prev + 1), []);

  const devicesState = useFetch(fetchDevices, refreshKey);
  const alertsState = useFetch(fetchAlerts, refreshKey);
  const trafficState = useFetch(fetchTraffic, refreshKey);
  const serviceMetricsState = useFetch(fetchServiceMetrics, refreshKey);

  useEffect(() => {
    window.addEventListener("refresh-dashboard", handleRefresh);
    return () => {
      window.removeEventListener("refresh-dashboard", handleRefresh);
    };
  }, [handleRefresh]);

  const loading =
    devicesState.loading || alertsState.loading || trafficState.loading || serviceMetricsState.loading;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Сводка сети
        </Typography>
      </Grid>
      {loading ? (
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={400} />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} md={8}>
            {trafficState.data && <TrafficOverview samples={trafficState.data} />}
          </Grid>
          <Grid item xs={12} md={4}>
            {alertsState.data && <AlertSummary alerts={alertsState.data} />}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Критические устройства
            </Typography>
            <Grid container spacing={2}>
              {devicesState.data?.map((device) => (
                <Grid item xs={12} sm={6} md={3} key={device.id}>
                  <DeviceStatusCard device={device} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {serviceMetricsState.data && <ServiceHealth metrics={serviceMetricsState.data} />}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default DashboardPage;
