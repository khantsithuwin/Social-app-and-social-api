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
