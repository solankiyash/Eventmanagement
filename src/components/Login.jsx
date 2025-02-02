// pages/LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.user.email);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 6,
          boxShadow: 3,
          padding: 10,
          width: "100%",
        }}
      >
        <Typography variant="h4">Login</Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            InputProps={{
              style: {
                borderRadius: "200px",
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            InputProps={{
              style: {
                borderRadius: "200px",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{
              marginTop: "20px",
              backgroundColor: "#9e9e9e",
              color: "#fff",
              borderRadius: "200px",
            }}
          >
            Login
          </Button>
          <p>
            Are you not register? <Link to={"/register"}>Singup</Link>
          </p>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
