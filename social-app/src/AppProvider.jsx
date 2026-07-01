import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./AppRouter.jsx";

export const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export const queryClient = new QueryClient();

export default function AppProvider() {
  const [mode, setMode] = useState("dark");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [auth, setAuth] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8800/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (res.ok) {
            setAuth(await res.json());
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        ...(mode === "dark"
          ? {
              primary: { main: "#ec4899", light: "#f472b6", dark: "#be185d" },
              secondary: { main: "#8b5cf6", light: "#a78bfa", dark: "#6d28d9" },
              background: { default: "#0f0f13", paper: "#1a1a23" },
            }
          : {
              primary: { main: "#ec4899", light: "#f9a8d4", dark: "#be185d" },
              secondary: { main: "#8b5cf6", light: "#c4b5fd", dark: "#6d28d9" },
              background: { default: "#f5f5f7", paper: "#ffffff" },
            }),
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      shape: { borderRadius: 8 },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              transition: "transform 0.15s ease, box-shadow 0.2s ease",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 12,
              padding: "10px 20px",
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: { borderRadius: 12 },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: { backgroundImage: "none" },
          },
        },
      },
    });
  }, [mode]);

  return (
    <AppContext.Provider
      value={{ mode, setMode, openDrawer, setOpenDrawer, auth, setAuth }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <AppRouter />
          <CssBaseline />
        </ThemeProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
