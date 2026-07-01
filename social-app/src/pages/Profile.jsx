import {
  Typography,
  Box,
  Avatar,
  Button,
  Skeleton,
} from "@mui/material";
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
        <Skeleton variant="rounded" height={160} sx={{ borderRadius: "0 0 20px 20px" }} />
        <Box sx={{ display: "flex", justifyContent: "center", mt: -6 }}>
          <Skeleton variant="circular" width={96} height={96} />
        </Box>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Skeleton width={150} sx={{ mx: "auto" }} />
          <Skeleton width={100} sx={{ mx: "auto", mt: 1 }} />
        </Box>
      </Box>
    );
  }

  const totalLikes = user.posts?.reduce(
    (sum, p) => sum + (p.likesCount || 0),
    0,
  );

  return (
    <Box>
      <Box
        sx={{
          height: 160,
          background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
          borderRadius: "0 0 24px 24px",
          position: "relative",
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "center", mt: -7 }}>
        <Avatar
          sx={{
            height: 96,
            width: 96,
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            fontSize: 36,
            fontWeight: 700,
            border: "4px solid",
            borderColor: "background.default",
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          {user.name[0].toUpperCase()}
        </Avatar>
      </Box>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {user.name}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          @{user.username}
        </Typography>
        {user.bio && (
          <Typography
            sx={{
              mt: 0.5,
              color: "text.secondary",
              fontSize: 13,
              maxWidth: 300,
              mx: "auto",
            }}
          >
            {user.bio}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          gap: 4,
          textAlign: "center",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
            {user.posts?.length || 0}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
            Posts
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
            {totalLikes || 0}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
            Likes
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          color="error"
          onClick={logout}
          sx={{
            borderRadius: 3,
            px: 4,
            fontSize: 13,
            fontWeight: 600,
            borderColor: "divider",
            color: "text.secondary",
            "&:hover": {
              borderColor: "#ef4444",
              color: "#ef4444",
              bgcolor: "rgba(239,68,68,0.08)",
            },
          }}
        >
          Logout
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 700, fontSize: 16 }}
        >
          Posts
        </Typography>
        {user.posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {user.posts?.length === 0 && (
          <Typography sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
            No posts yet
          </Typography>
        )}
      </Box>
    </Box>
  );
}
