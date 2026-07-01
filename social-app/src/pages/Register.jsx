import {
  Typography,
  Box,
  OutlinedInput,
  Button,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Person, Lock, Badge, Info } from "@mui/icons-material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function Register() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const create = async (data) => {
    const res = await fetch("http://localhost:8800/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(() => setError("unable to register"));
    if (res.ok) {
      navigate("/login");
    } else {
      setError("unable to register");
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          mb: 0.5,
          background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Create account
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 3, fontSize: 14 }}>
        Join the community
      </Typography>
      <Box
        sx={{
          width: "100%",
          p: 3,
          borderRadius: 4,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {error && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit(create)}>
          <OutlinedInput
            fullWidth
            placeholder="Name"
            startAdornment={
              <InputAdornment position="start">
                <Badge sx={{ fontSize: 20, color: "text.secondary" }} />
              </InputAdornment>
            }
            {...register("name", { required: true })}
            error={!!errors.name}
            sx={{ mb: 2 }}
          />
          <OutlinedInput
            fullWidth
            placeholder="Username"
            startAdornment={
              <InputAdornment position="start">
                <Person sx={{ fontSize: 20, color: "text.secondary" }} />
              </InputAdornment>
            }
            {...register("username", { required: true })}
            error={!!errors.username}
            sx={{ mb: 2 }}
          />
          <OutlinedInput
            fullWidth
            placeholder="Bio (optional)"
            startAdornment={
              <InputAdornment position="start">
                <Info sx={{ fontSize: 20, color: "text.secondary" }} />
              </InputAdornment>
            }
            {...register("bio")}
            sx={{ mb: 2 }}
          />
          <OutlinedInput
            fullWidth
            type="password"
            placeholder="Password"
            startAdornment={
              <InputAdornment position="start">
                <Lock sx={{ fontSize: 20, color: "text.secondary" }} />
              </InputAdornment>
            }
            {...register("password", { required: true })}
            error={!!errors.password}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.2,
              background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
              "&:hover": {
                background: "linear-gradient(135deg, #db2777, #7c3aed)",
              },
            }}
          >
            Create Account
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Already have an account?{" "}
            <Button
              size="small"
              onClick={() => navigate("/login")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#ec4899",
                p: 0,
                minWidth: 0,
                "&:hover": { background: "none", textDecoration: "underline" },
              }}
            >
              Sign in
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
