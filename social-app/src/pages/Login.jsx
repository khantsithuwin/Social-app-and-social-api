import { Typography, Box, OutlinedInput, Button, Alert } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useApp } from "../AppProvider.jsx";

export default function Login() {
  const { setAuth } = useApp();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = async (data) => {
    const res = await fetch("http://localhost:8800/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(() => setError("Unable to login"));
    if (res.ok) {
      const { user, token } = await res.json();
      localStorage.setItem("token", token);
      setAuth(user);
      navigate("/");
    } else {
      setError("unable to login");
    }
  };
  return (
    <Box>
      <Typography variant="h3">Login</Typography>
      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit(login)}>
        <OutlinedInput
          fullWidth
          sx={{ mt: 2 }}
          placeholder="username"
          {...register("username", { required: true })}
          error={errors.username}
        ></OutlinedInput>
        <OutlinedInput
          fullWidth
          sx={{ mt: 2 }}
          type="password"
          placeholder="password"
          {...register("password", { required: true })}
          error={errors.password}
        ></OutlinedInput>
        <Button type="submit" variant="outlined" fullWidth sx={{ mt: 2 }}>
          LOGIN
        </Button>
      </form>
    </Box>
  );
}
