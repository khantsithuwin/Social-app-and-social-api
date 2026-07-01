import { Box, Button, IconButton, OutlinedInput, Typography } from "@mui/material";
import { DeleteOutlineOutlined as DeleteIcon } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router";
import PostCard from "../components/PostCard";
import { useApp, queryClient } from "../AppProvider.jsx";

async function fetchPosts(id) {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`http://localhost:8800/posts/${id}`, { headers });
  if (!res.ok) throw new Error("Post not found");
  return res.json();
}

export default function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const commentRef = useRef();
  const { auth } = useApp();
  const {
    data: post,
    error,
    isLoading,
  } = useQuery({ queryKey: ["post", id], queryFn: () => fetchPosts(id) });

  const addComment = async () => {
    const content = commentRef.current.value;
    if (!content) return;

    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8800/comments", {
      method: "POST",
      body: JSON.stringify({ postId: Number(id), content }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  };

  const deleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8800/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  };

  if (error) {
    return (
      <Box>
        <Typography>{error.message}</Typography>
      </Box>
    );
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
      <PostCard post={post} onDeleted={() => navigate("/")} />
      <Box sx={{ mb: 2 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addComment();
            e.currentTarget.reset();
          }}
        >
          <OutlinedInput
            inputRef={commentRef}
            fullWidth
            sx={{ mb: 1 }}
            placeholder="Your reply...."
          ></OutlinedInput>
          <Button type="submit" fullWidth variant="contained">
            Add Comment
          </Button>
        </form>
      </Box>
      <Box>
        {[...(post.comments ?? [])]
          .sort((a, b) => b.id - a.id)
          .map((comment) => {
          return (
            <Box
              key={comment.id}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid #666666",
                display: "flex",
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                  {comment.user.name}
                </Typography>
                <Typography sx={{ color: "gray" }}>{comment.content}</Typography>
              </Box>
              {auth?.id === comment.userId && (
                <IconButton
                  size="small"
                  aria-label="delete comment"
                  onClick={() => deleteComment(comment.id)}
                  sx={{ alignSelf: "flex-start" }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
