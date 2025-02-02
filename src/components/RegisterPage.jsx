import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      alert('User Registered Successfully');
      navigate('/');
    } catch (err) {
      setError(err.response.data.message || 'Registration failed');
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        height: '100vh',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 6,
          boxShadow: 3,
          padding: 10,
          width: '100%',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        
        {error && <Typography color="error" style={{ marginBottom: '20px' }}>{error}</Typography>}

        <form  onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            InputProps={{
                style: {
                  borderRadius: '200px',
                },
              }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
                style: {
                  borderRadius: '200px',
                },
              }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
                style: {
                  borderRadius: '200px',
                },
              }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{
                marginTop: '20px',
                backgroundColor: '#9e9e9e',
                color: '#fff',
                borderRadius:"200px"
              }}
          >
            Register
          </Button>
          <p>Are you Registerd? <Link to={"/"}>Login</Link></p>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterPage;
