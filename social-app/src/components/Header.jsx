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
    <AppBar position="static">
      <Toolbar>
        {pathname == "/" ? (
          <IconButton sx={{ mr: 4 }} onClick={() => setOpenDrawer(true)}>
            <MenuIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => navigate("/")}>
            <BackIcon />
          </IconButton>
        )}
        <Typography sx={{ flexGrow: 1 }}>Social</Typography>
        {mode == "dark" ? (
          <IconButton onClick={() => setMode("light")}>
            <LightModeIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => setMode("dark")}>
            <DarkModeIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
