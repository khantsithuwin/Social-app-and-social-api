import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import { useApp } from "../AppProvider.jsx";

import {
  Login as LoginIcon,
  Home as HomeIcon,
  PersonAdd as RegisterIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  Favorite as LikeIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";

export default function AppDrawer() {
  const navigate = useNavigate();
  const { openDrawer, setOpenDrawer, auth, setAuth, mode } = useApp();
  return (
    <Drawer
      open={openDrawer}
      onClose={() => setOpenDrawer(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: "320px !important",
          backgroundImage: "none",
        },
      }}
    >
      {auth ? (
        <Box
          sx={{
            p: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
          }}
        >
          <Avatar
            sx={{
              height: 56,
              width: 56,
              background: "rgba(255,255,255,0.2)",
              fontSize: 24,
              fontWeight: 700,
              color: "white",
              border: "2px solid rgba(255,255,255,0.4)",
            }}
          >
            {auth.name[0].toUpperCase()}
          </Avatar>
          <Typography sx={{ mt: 1.5, fontWeight: 700, color: "white" }}>
            {auth.name}
          </Typography>
          <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            @{auth.username}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            height: 160,
            width: "100%",
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ color: "white", fontWeight: 700, fontSize: 20 }}>
            Social
          </Typography>
        </Box>
      )}
      <List sx={{ pt: 1, px: 2, width: "100%" }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            sx={{ width: "100%", borderRadius: 2 }}
            onClick={() => {
              setOpenDrawer(false);
              navigate("/");
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider sx={{ mx: 2 }} />
      {!auth && (
        <List sx={{ px: 2, width: "100%" }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{ width: "100%", borderRadius: 2 }}
              onClick={() => {
                setOpenDrawer(false);
                navigate("/login");
              }}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{ width: "100%", borderRadius: 2 }}
              onClick={() => {
                setOpenDrawer(false);
                navigate("/register");
              }}
            >
              <ListItemIcon>
                <RegisterIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
      {auth && (
        <List sx={{ px: 2, width: "100%" }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{ width: "100%", borderRadius: 2 }}
              onClick={() => {
                setOpenDrawer(false);
                navigate("/profile");
              }}
            >
              <ListItemIcon>
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{ width: "100%", borderRadius: 2 }}
              onClick={() => {
                setOpenDrawer(false);
                setAuth(undefined);
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Drawer>
  );
}
