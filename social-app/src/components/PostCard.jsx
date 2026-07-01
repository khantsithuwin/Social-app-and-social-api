import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import {
  Favorite as LikeFilledIcon,
  FavoriteBorderOutlined as LikeOutlineIcon,
  ChatBubbleOutlineOutlined as CommentIcon,
  DeleteOutlineOutlined as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useApp, queryClient } from "../AppProvider.jsx";
import { useState } from "react";

export default function PostCard({ post, onDeleted }) {
  const navigate = useNavigate();
  const { auth } = useApp();
  const canDelete = auth?.id === post.userId;
  const [liked, setLiked] = useState(post.likedByMe ?? false);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [likesOpen, setLikesOpen] = useState(false);
  const [likers, setLikers] = useState([]);

  const deletePost = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8800/posts/${post.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      onDeleted?.();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user", post.userId] });
    }
  };

  const openLikes = async (e) => {
    e.stopPropagation();
    const res = await fetch(`http://localhost:8800/likes/${post.id}`);
    if (res.ok) {
      setLikers(await res.json());
      setLikesOpen(true);
    }
  };

  const toggleLike = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    const res = await fetch("http://localhost:8800/likes", {
      method: "POST",
      body: JSON.stringify({ postId: post.id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikesCount(data.likesCount);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } else {
      setLiked(prevLiked);
      setLikesCount(prevCount);
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

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 4px 20px rgba(0,0,0,0.4)"
              : "0 4px 20px rgba(0,0,0,0.08)",
        },
      }}
      onClick={() => !likesOpen && navigate(`/view/${post.id}`)}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box>
            <Avatar
              sx={{
                height: 44,
                width: 44,
                background: `linear-gradient(135deg, ${green[500]}, ${green[300]})`,
                fontWeight: 700,
              }}
            >
              {post.user.name[0].toUpperCase()}
            </Avatar>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                {post.user.name}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {timeAgo(post.created)}
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.5, fontSize: 14, lineHeight: 1.5 }}>
              {post.content}
            </Typography>
          </Box>
          {canDelete && (
            <IconButton
              size="small"
              aria-label="delete post"
              onClick={deletePost}
              sx={{ alignSelf: "flex-start", mt: 0.5 }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>
        <Box sx={{ mt: 1.5, display: "flex", gap: 3, ml: 7 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={toggleLike}
              sx={{
                p: 0.5,
                transition: "transform 0.15s ease",
                "&:hover": { transform: "scale(1.15)" },
              }}
            >
              {liked ? (
                <LikeFilledIcon sx={{ fontSize: 20, color: "#ec4899" }} />
              ) : (
                <LikeOutlineIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
            <Button
              size="small"
              variant="text"
              onClick={openLikes}
              sx={{
                minWidth: 0,
                p: 0.5,
                fontSize: 13,
                fontWeight: 600,
                color: liked ? "#ec4899" : "text.secondary",
              }}
            >
              {likesCount}
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/view/${post.id}`);
              }}
              sx={{ p: 0.5 }}
            >
              <CommentIcon sx={{ fontSize: 20, color: "text.secondary" }} />
            </IconButton>
            <Button
              size="small"
              variant="text"
              sx={{
                minWidth: 0,
                p: 0.5,
                fontSize: 13,
                fontWeight: 600,
                color: "text.secondary",
              }}
            >
              {post.comments ? post.comments.length : 0}
            </Button>
          </Box>
        </Box>
      </CardContent>
      <Dialog
        open={likesOpen}
        onClose={() => setLikesOpen(false)}
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Liked by</DialogTitle>
        <List sx={{ minWidth: 280, pt: 0 }}>
          {likers.map((user) => (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    background: `linear-gradient(135deg, ${green[500]}, ${green[300]})`,
                    width: 36,
                    height: 36,
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  {user.name[0].toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={`@${user.username}`}
                primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                secondaryTypographyProps={{ fontSize: 12 }}
              />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
}
