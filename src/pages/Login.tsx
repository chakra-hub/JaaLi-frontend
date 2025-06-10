// src/pages/Login.tsx
import { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { username: name, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", JSON.stringify(res.data.isAdmin));
      window.location.href = "/";
    } catch (err) {
      if (err && typeof err === "object" && err !== null && "response" in err) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message || "Login failed"
        );
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom align="center">
          Login to Your Account
        </Typography>

        <Grid container spacing={2}>
          <Grid>
            <TextField
              label="Email"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Button variant="text" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
