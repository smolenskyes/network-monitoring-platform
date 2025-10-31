import { CssBaseline, PaletteMode } from "@mui/material";
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "../theme";

interface ThemeModeContextValue {
  mode: PaletteMode;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode должен использоваться внутри AppThemeProvider");
  }
  return context;
};

interface AppThemeProviderProps {
  children: ReactNode;
}

const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  const toggle = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    const handler = () => toggle();
    window.addEventListener("toggle-theme-mode", handler);
    return () => window.removeEventListener("toggle-theme-mode", handler);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme-mode", mode);
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default AppThemeProvider;
