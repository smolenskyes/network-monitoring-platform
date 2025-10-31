import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import DeviceFilter from "../components/Devices/DeviceFilter";
import DeviceTable from "../components/Devices/DeviceTable";
import { useFetch } from "../hooks/useFetch";
import { fetchDevices } from "../services/apiClient";

const DevicesPage = () => {
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const { data, loading } = useFetch(fetchDevices);

  const filteredDevices = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.filter((device) => {
      const statusMatch = status === "all" || device.status === status;
      const typeMatch = type === "all" || device.type === type;
      return statusMatch && typeMatch;
    });
  }, [data, status, type]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Устройства сети
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Подробная информация о состоянии и производительности оборудования.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <DeviceFilter status={status} type={type} onStatusChange={setStatus} onTypeChange={setType} />
      </Grid>
      <Grid item xs={12}>
        {loading ? <Skeleton variant="rectangular" height={400} /> : <DeviceTable devices={filteredDevices} />}
      </Grid>
      {!loading && (
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" color="text.secondary">
            Показано {filteredDevices.length} из {data?.length ?? 0} устройств
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default DevicesPage;
