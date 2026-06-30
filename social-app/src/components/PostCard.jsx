import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import {
  FavoriteBorderOutlined as LikeIcon,
  ChatBubbleOutlineOutlined as CommentIcon,
  DeleteOutlineOutlined as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useApp, queryClient } from "../AppProvider.jsx";

export default function PostCard({ post, onDeleted }) {
  const navigate = useNavigate();
  const { auth } = useApp();
  const canDelete = auth?.id === post.userId;

  const deletePost = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8800/posts/${post.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["post", String(post.id)] });
      onDeleted?.();
    }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 5 }}>
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
            <Typography
              sx={{ mt: 1 }}
              onClick={() => navigate(`/view/${post.id}`)}
            >
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
            <IconButton size="sm">
              <LikeIcon color="error"></LikeIcon>
            </IconButton>
            <Button size="sm" variant="text">
              10
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <IconButton size="sm">
              <CommentIcon sx={{ color: "gray" }}></CommentIcon>
            </IconButton>
            <Button size="sm" variant="text">
              {post.comments ? post.comments.length : 0}
            </Button>
          </ButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
}
