// src/pages/Signup.tsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance"; // Axios instance

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    isAdmin: true,
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/register", form);
      navigate("/login"); // Redirect to login on success
    } catch (err) {
      if (err && typeof err === "object" && err !== null && "response" in err) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message || "Signup failed"
        );
      } else {
        setError("Signup failed");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom align="center">
          Create an Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid>
              <TextField
                fullWidth
                label="Name"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
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
            <Button type="submit" variant="contained" fullWidth>
              Sign Up
            </Button>
          </Box>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Already have an account?{" "}
              <Button variant="text" onClick={() => navigate("/login")}>
                Login
              </Button>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;
