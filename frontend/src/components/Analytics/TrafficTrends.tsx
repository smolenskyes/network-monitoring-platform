import { Card, CardContent, CardHeader } from "@mui/material";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrafficSample } from "../../types";

interface TrafficTrendsProps {
  samples: TrafficSample[];
}

const TrafficTrends = ({ samples }: TrafficTrendsProps) => {
  return (
    <Card>
      <CardHeader title="Тренды трафика" subheader="Сравнение входящего и исходящего потоков" />
      <CardContent sx={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={samples}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value} Мбит/с`} />
            <Line type="monotone" dataKey="inboundMbps" stroke="#0061f2" name="Входящий" strokeWidth={2} />
            <Line type="monotone" dataKey="outboundMbps" stroke="#ff6b6b" name="Исходящий" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrafficTrends;
