import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";

import { useApp } from "../AppProvider.jsx";
import { useLocation, useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mode, setMode, setOpenDrawer } = useApp();
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(20px)",
        background: mode === "dark"
          ? "rgba(15,15,19,0.7)"
          : "rgba(255,255,255,0.7)",
        borderBottom: "1px solid",
        borderColor: mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      }}
    >
      <Toolbar>
        {pathname === "/" ? (
          <IconButton sx={{ mr: 1 }} onClick={() => setOpenDrawer(true)}>
            <MenuIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => navigate(-1)}>
            <BackIcon />
          </IconButton>
        )}
        <Typography
          sx={{
            flexGrow: 1,
            fontWeight: 800,
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Social
        </Typography>
        <IconButton onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
