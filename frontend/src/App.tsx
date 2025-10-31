import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import DashboardPage from "./pages/Dashboard";
import DevicesPage from "./pages/Devices";
import AlertsPage from "./pages/Alerts";
import AnalyticsPage from "./pages/Analytics";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
