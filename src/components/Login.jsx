// pages/LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.user.email);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Left Side - Illustration */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "50%",
          backgroundColor: "#1976d2",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 40,
            left: 40,
            color: "white",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Welcome Back!
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, opacity: 0.8 }}>
            We're excited to see you again
          </Typography>
        </Box>

        {/* Abstract Wave SVG */}
        <svg
          viewBox="0 0 600 600"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.2,
          }}
        >
          <path
            d="M 0 300 C 150 200 450 400 600 300 C 450 400 150 200 0 300"
            fill="white"
            opacity="0.3"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M 0 300 C 150 200 450 400 600 300 C 450 400 150 200 0 300;
                M 0 300 C 150 400 450 200 600 300 C 450 200 150 400 0 300;
                M 0 300 C 150 200 450 400 600 300 C 450 400 150 200 0 300
              "
            />
          </path>
        </svg>

        {/* Login Illustration SVG */}
        <svg
          viewBox="0 0 500 500"
          style={{
            width: "70%",
            height: "70%",
            zIndex: 1,
          }}
        >
          <path
            d="M250,100 Q350,50 400,150 Q450,250 400,350 Q350,450 250,400 Q150,450 100,350 Q50,250 100,150 Q150,50 250,100"
            fill="#ffffff"
            opacity="0.1"
          />
          <circle cx="250" cy="250" r="120" fill="#ffffff" opacity="0.1" />
        </svg>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: "#1976d2",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Sign In
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
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
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  boxShadow: "0 6px 20px rgba(25,118,210,0.25)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Sign In
            </Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
