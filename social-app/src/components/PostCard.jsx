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

  return (
    <Card
      sx={{ mb: 2, borderRadius: 5, cursor: "pointer" }}
      onClick={() => !likesOpen && navigate(`/view/${post.id}`)}
    >
      <CardContent>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box>
            <Avatar sx={{ height: 52, width: 52, background: green[500] }}>
              {post.user.name[0].toUpperCase()}
            </Avatar>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>
              {post.user.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: green[500] }}>
              {post.created}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              {post.content}
            </Typography>
          </Box>
          {canDelete && (
            <IconButton
              size="small"
              aria-label="delete post"
              onClick={deletePost}
              sx={{ alignSelf: "flex-start" }}
            >
              <DeleteIcon color="error" />
            </IconButton>
          )}
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-around" }}>
          <ButtonGroup>
            <IconButton size="small" onClick={toggleLike}>
              {liked ? <LikeFilledIcon color="error" /> : <LikeOutlineIcon color="error" />}
            </IconButton>
            <Button size="small" variant="text" onClick={openLikes}>
              {likesCount}
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <IconButton size="small" onClick={(e) => {
              e.stopPropagation();
              navigate(`/view/${post.id}`);
            }}>
              <CommentIcon sx={{ color: "gray" }}></CommentIcon>
            </IconButton>
            <Button size="small" variant="text">
              {post.comments ? post.comments.length : 0}
            </Button>
          </ButtonGroup>
        </Box>
      </CardContent>
      <Dialog open={likesOpen} onClose={() => setLikesOpen(false)}>
        <DialogTitle>Liked by</DialogTitle>
        <List sx={{ minWidth: 250 }}>
          {likers.map((user) => (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar sx={{ background: green[500] }}>
                  {user.name[0].toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={`@${user.username}`} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
}
