import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f5c55",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#d97745",
    },
    background: {
      default: "#f4f1ea",
      paper: "#fffdf8",
    },
    text: {
      primary: "#21302f",
      secondary: "#64706d",
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"DM Sans", "Segoe UI", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"DM Sans", "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        h1: {
          fontFamily: '"DM Sans", "Segoe UI", sans-serif',
          fontWeight: 700,
          letterSpacing: "-0.02em",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 700,
          paddingInline: 18,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(31, 92, 85, 0.12)",
        },
      },
    },
  },
});