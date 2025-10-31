import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { ServiceHealthMetric } from "../../types";

interface ServiceHealthProps {
  metrics: ServiceHealthMetric[];
}

const trendIcon: Record<ServiceHealthMetric["trend"], JSX.Element> = {
  up: <ArrowUpwardIcon color="success" fontSize="small" />,
  down: <ArrowDownwardIcon color="error" fontSize="small" />, 
  stable: <HorizontalRuleIcon color="info" fontSize="small" />, 
};

const ServiceHealth = ({ metrics }: ServiceHealthProps) => {
  return (
    <Card>
      <CardHeader title="Состояние ключевых сервисов" subheader="Доступность и задержки" />
      <CardContent>
        <Grid container spacing={3}>
          {metrics.map((metric) => (
            <Grid item xs={12} md={4} key={metric.name}>
              <Typography variant="subtitle2" color="text.secondary">
                {metric.name}
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {metric.availability}%
              </Typography>
              <LinearProgress variant="determinate" value={metric.availability} sx={{ my: 1, height: 8, borderRadius: 4 }} />
              <Typography variant="body2" color="text.secondary">
                Задержка: {metric.latencyMs} мс
              </Typography>
              <Chip
                label={metric.trend === "up" ? "Рост" : metric.trend === "down" ? "Падение" : "Стабильно"}
                icon={trendIcon[metric.trend]}
                size="small"
                sx={{ mt: 1 }}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ServiceHealth;
