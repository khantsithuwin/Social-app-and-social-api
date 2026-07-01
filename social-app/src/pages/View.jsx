import {
  Box,
  Button,
  IconButton,
  OutlinedInput,
  Typography,
  Avatar,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { DeleteOutlineOutlined as DeleteIcon, Send } from "@mui/icons-material";
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
      commentRef.current.value = "";
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

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString();
  };

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography color="error">{error.message}</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const sortedComments = [...(post.comments ?? [])].sort(
    (a, b) => b.id - a.id,
  );

  return (
    <Box>
      <PostCard post={post} onDeleted={() => navigate("/")} />
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: "16px",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addComment();
          }}
        >
          <Typography sx={{ fontWeight: 700, mb: 1.5, fontSize: 14 }}>
            Replies
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <OutlinedInput
              inputRef={commentRef}
              fullWidth
              multiline
              maxRows={3}
              placeholder="Write a reply..."
              sx={{
                "& fieldset": { border: "none" },
                bgcolor: "action.hover",
                borderRadius: "12px",
                fontSize: 13,
                p: 1.5,
              }}
            />
            <IconButton
              type="submit"
              sx={{
                alignSelf: "flex-end",
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                color: "white",
                borderRadius: 2,
                "&:hover": {
                  background: "linear-gradient(135deg, #db2777, #7c3aed)",
                },
              }}
            >
              <Send sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </form>
      </Box>
      <Box>
        {sortedComments.map((comment) => (
          <Box
            key={comment.id}
            sx={{
              mb: 1.5,
              p: 2,
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                height: 36,
                width: 36,
                background: `linear-gradient(135deg, ${green[500]}, ${green[300]})`,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {comment.user.name[0].toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                  {comment.user.name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                  {timeAgo(comment.created)}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 13, mt: 0.3 }}>
                {comment.content}
              </Typography>
            </Box>
            {auth?.id === comment.userId && (
              <IconButton
                size="small"
                aria-label="delete comment"
                onClick={() => deleteComment(comment.id)}
                sx={{ alignSelf: "flex-start", mt: 0.3 }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        ))}
        {sortedComments.length === 0 && (
          <Typography
            sx={{ textAlign: "center", color: "text.secondary", py: 4, fontSize: 14 }}
          >
            No replies yet. Be the first!
          </Typography>
        )}
      </Box>
    </Box>
  );
}
