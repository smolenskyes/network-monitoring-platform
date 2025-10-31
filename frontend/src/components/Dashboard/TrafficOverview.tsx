import { Card, CardContent, CardHeader } from "@mui/material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrafficSample } from "../../types";

interface TrafficOverviewProps {
  samples: TrafficSample[];
}

const TrafficOverview = ({ samples }: TrafficOverviewProps) => {
  return (
    <Card>
      <CardHeader title="Трафик за последние 12 часов" subheader="Мбит/с" />
      <CardContent sx={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={samples} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="inbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0061f2" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0061f2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="outbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#02b2af" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#02b2af" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value} Мбит/с`} />
            <Area type="monotone" dataKey="inboundMbps" stroke="#0061f2" fill="url(#inbound)" name="Входящий" />
            <Area type="monotone" dataKey="outboundMbps" stroke="#02b2af" fill="url(#outbound)" name="Исходящий" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrafficOverview;
