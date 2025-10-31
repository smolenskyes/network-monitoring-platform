import { PaletteMode, ThemeOptions, createTheme } from "@mui/material";

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: "#0061f2",
    },
    secondary: {
      main: "#02b2af",
    },
    background: {
      default: mode === "light" ? "#f5f7fa" : "#0b1a2a",
      paper: mode === "light" ? "#ffffff" : "#10233d",
    },
  },
  typography: {
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: mode === "light" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.08)",
          boxShadow: mode === "light" ? "0 10px 30px rgba(15, 35, 95, 0.08)" : "0 12px 40px rgba(2, 17, 40, 0.6)",
        },
      },
    },
  },
});

export const createAppTheme = (mode: PaletteMode) => createTheme(getDesignTokens(mode));
