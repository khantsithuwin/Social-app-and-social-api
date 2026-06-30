import { Typography, Box, OutlinedInput, Button, Alert } from "@mui/material";
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
    <Box>
      <Typography variant="h3">Register</Typography>
      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit(create)}>
        <OutlinedInput
          fullWidth
          sx={{ mt: 2 }}
          placeholder="name"
          {...register("name", { required: true })}
          error={errors.name}
        />
        <OutlinedInput
          fullWidth
          sx={{ mt: 2 }}
          placeholder="username"
          {...register("username", { required: true })}
          error={errors.username}
        />
        <OutlinedInput
          fullWidth
          sx={{ mt: 2 }}
          placeholder="bio"
          {...register("bio")}
        />
        <OutlinedInput
          fullWidth
          sx={{ mt: 2 }}
          placeholder="password"
          type="password"
          {...register("password", { required: true })}
          error={errors.password}
        />
        <Button variant="outlined" type="submit" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
}
