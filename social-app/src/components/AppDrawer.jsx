import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useApp } from "../AppProvider.jsx";
import { grey } from "@mui/material/colors";

import {
  Login as LoginIcon,
  Home as HomeIcon,
  PersonAdd as RegisterIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";

export default function AppDrawer() {
  const navigate = useNavigate();
  const { openDrawer, setOpenDrawer, auth, setAuth } = useApp();
  return (
    <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
      <Box sx={{ width: 240, height: 200, background: grey[500] }}></Box>
      <List>
        <ListItem>
          <ListItemButton
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
      <Divider />
      {!auth && (
        <List>
          <ListItem>
            <ListItemButton
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
          <ListItem>
            <ListItemButton
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
        <List>
          <ListItem>
            <ListItemButton
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
          <ListItem>
            <ListItemButton
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
