import { Card, CardContent, CardHeader } from '@mui/material';
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { TrafficSample } from '../types/network';

interface TrafficChartProps {
  data: TrafficSample[];
}

const TrafficChart = ({ data }: TrafficChartProps) => (
  <Card elevation={0} sx={{ height: '100%', borderRadius: 3 }}>
    <CardHeader title="Трафик сети" subheader="Данные за последние 24 часа" />
    <CardContent sx={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1976d2" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#009688" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#009688" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" minTickGap={32} />
          <YAxis unit=" Мбит/с" />
          <Tooltip formatter={(value: number) => `${value.toFixed(1)} Мбит/с`} />
          <Legend />
          <Area
            type="monotone"
            dataKey="inboundMbps"
            name="Входящий трафик"
            stroke="#1976d2"
            fillOpacity={1}
            fill="url(#colorInbound)"
          />
          <Area
            type="monotone"
            dataKey="outboundMbps"
            name="Исходящий трафик"
            stroke="#009688"
            fillOpacity={1}
            fill="url(#colorOutbound)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default TrafficChart;
