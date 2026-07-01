import {
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import { green, lightGreen } from "@mui/material/colors";
import { useNavigate } from "react-router";
import { useApp } from "../AppProvider.jsx";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/PostCard";

export default function Profile() {
  const navigate = useNavigate();
  const { auth, setAuth } = useApp();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", auth?.id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8800/users/${auth.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.json();
    },
    enabled: !!auth,
  });

  const logout = () => {
    setAuth(undefined);
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!auth) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return (
      <Box>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          height: 180,
          background: `linear-gradient(135deg, ${green[700]}, ${lightGreen[400]})`,
          borderRadius: "0 0 20px 20px",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar
            sx={{
              height: 96,
              width: 96,
              background: green[500],
              fontSize: 40,
              position: "absolute",
              bottom: -48,
              border: "4px solid white",
            }}
          >
            {user.name[0].toUpperCase()}
          </Avatar>
        </Box>
      </Box>

      <Box sx={{ mt: 7, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {user.name}
        </Typography>
        <Typography sx={{ color: "gray" }}>@{user.username}</Typography>
        {user.bio && (
          <Typography sx={{ mt: 1, color: "text.secondary" }}>
            {user.bio}
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          color="error"
          onClick={logout}
          fullWidth
          sx={{ maxWidth: 300 }}
        >
          Logout
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Posts
        </Typography>
        {user.posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {user.posts?.length === 0 && (
          <Typography sx={{ color: "gray" }}>No posts yet</Typography>
        )}
      </Box>
    </Box>
  );
}
