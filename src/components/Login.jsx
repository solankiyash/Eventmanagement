// pages/LoginPage.js
import React, { useState, useEffect } from "react";
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
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 4) {
      return "Password must be at least 4 characters long";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
    if (field === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(email),
      }));
    } else if (field === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(password),
      }));
    }
  };

  const isFormValid = () => {
    return (
      !errors.email &&
      !errors.password &&
      email.length > 0 &&
      password.length > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.user.email);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors((prev) => ({
          ...prev,
          password: "Invalid email or password",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "An error occurred. Please try again.",
        }));
      }
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
              onChange={handleEmailChange}
              onBlur={() => handleBlur("email")}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
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
              onChange={handlePasswordChange}
              onBlur={() => handleBlur("password")}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
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
              disabled={!isFormValid()}
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
                "&.Mui-disabled": {
                  backgroundColor: "#ccc",
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
