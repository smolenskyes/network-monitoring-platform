import { Box } from "@mui/material";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box display="flex" minHeight="100vh" bgcolor="background.default">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column">
        <TopBar />
        <Box component="main" flex={1} p={3} bgcolor="background.paper">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
