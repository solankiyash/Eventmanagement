import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
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

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (confirmPassword !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    switch (field) {
      case "email":
        setEmail(value);
        if (touched.email) {
          setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        }
        break;
      case "password":
        setPassword(value);
        if (touched.password) {
          setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
        }
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        if (touched.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(value),
          }));
        }
        break;
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let validationError = "";
    switch (field) {
      case "email":
        validationError = validateEmail(email);
        break;
      case "password":
        validationError = validatePassword(password);
        break;
      case "confirmPassword":
        validationError = validateConfirmPassword(confirmPassword);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: validationError }));
  };

  const isFormValid = () => {
    return (
      !Object.values(errors).some((error) => error !== "") &&
      email &&
      password &&
      confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });

    const validationErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error !== "")) {
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        email,
        password,
      });
      navigate("/");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        email: err.response?.data?.message || "Registration failed",
      }));
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
            Welcome!
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, opacity: 0.8 }}>
            Create your account to get started
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
      </Box>

      {/* Right Side - Register Form */}
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
            Sign Up
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={handleChange("email")}
              onBlur={() => handleBlur("email")}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              margin="normal"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={handleChange("password")}
              onBlur={() => handleBlur("password")}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              margin="normal"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
                },
              }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              error={touched.confirmPassword && !!errors.confirmPassword}
              helperText={touched.confirmPassword && errors.confirmPassword}
              margin="normal"
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "white",
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
              Sign Up
            </Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                Already have an account?{" "}
                <Link
                  to="/"
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
