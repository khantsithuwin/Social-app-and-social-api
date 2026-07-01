import {
  Typography,
  Box,
  OutlinedInput,
  Button,
  Avatar,
  Skeleton,
} from "@mui/material";
import { green } from "@mui/material/colors";
import PostCard from "../components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { queryClient, useApp } from "../AppProvider.jsx";

async function fetchPosts() {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch("http://localhost:8800/posts", { headers });
  return res.json();
}

export default function Home() {
  const contentRef = useRef();
  const { auth } = useApp();
  const {
    data: posts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography color="error">{error.message}</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rounded" height={100} sx={{ borderRadius: 3 }} />
        </Box>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={140}
            sx={{ borderRadius: 3, mb: 2 }}
          />
        ))}
      </Box>
    );
  }

  const addPost = async () => {
    const content = contentRef.current.value;
    if (!content) return false;

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8800/posts", {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      contentRef.current.value = "";
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: "16px",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Avatar
            sx={{
              height: 40,
              width: 40,
              background: `linear-gradient(135deg, ${green[500]}, ${green[300]})`,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {auth?.name?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addPost();
              }}
            >
              <OutlinedInput
                inputRef={contentRef}
                fullWidth
                multiline
                minRows={2}
                maxRows={4}
                placeholder="What's on your mind?"
                sx={{
                  mb: 1.5,
                  bgcolor: "transparent",
                  "& fieldset": { border: "none" },
                  p: 0,
                  fontSize: 14,
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  sx={{
                    px: 3,
                    background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #db2777, #7c3aed)",
                    },
                  }}
                >
                  Post
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
      <Box>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
}
