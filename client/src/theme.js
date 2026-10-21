import { createTheme } from "@mui/material/styles";

// MUI theme aligned with the Tailwind `brand`/`navy` tokens so the two styling
// systems (MUI components + Tailwind utility classes) look like one product.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ea580c", // brand-600
      light: "#fb923c",
      dark: "#c2410c",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0f172a", // navy-900
      light: "#334155",
      dark: "#020617",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 20,
          paddingBlock: 9,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          marginTop: 6,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
