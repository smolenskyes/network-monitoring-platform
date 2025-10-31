import { Card, CardContent, CardHeader } from "@mui/material";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertStatistic } from "../../types";

interface AlertVolumeChartProps {
  stats: AlertStatistic[];
}

const AlertVolumeChart = ({ stats }: AlertVolumeChartProps) => {
  return (
    <Card>
      <CardHeader title="Распределение событий" subheader="По категориям и подтверждению" />
      <CardContent sx={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#0061f2" name="Всего" />
            <Bar dataKey="acknowledged" fill="#02b2af" name="Подтверждено" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AlertVolumeChart;
