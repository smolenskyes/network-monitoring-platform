import { Grid, Skeleton, Typography } from "@mui/material";
import AlertVolumeChart from "../components/Analytics/AlertVolumeChart";
import TrafficTrends from "../components/Analytics/TrafficTrends";
import { useFetch } from "../hooks/useFetch";
import { fetchAlertStats, fetchTraffic } from "../services/apiClient";

const AnalyticsPage = () => {
  const trafficState = useFetch(fetchTraffic);
  const statsState = useFetch(fetchAlertStats);

  const loading = trafficState.loading || statsState.loading;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Аналитика сети
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Тренды производительности и эффективность реагирования на инциденты.
        </Typography>
      </Grid>
      {loading ? (
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={400} />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} md={7}>
            {trafficState.data && <TrafficTrends samples={trafficState.data} />}
          </Grid>
          <Grid item xs={12} md={5}>
            {statsState.data && <AlertVolumeChart stats={statsState.data} />}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default AnalyticsPage;
