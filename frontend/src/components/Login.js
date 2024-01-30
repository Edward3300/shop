import React, { useState } from 'react';
import { Button, TextField, Paper, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),

      });

      if (!response.ok) {
        console.error('Ошибка при авторизации');
        return;
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.token);
      window.location = "/products";
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Авторизация</Typography>
        <TextField
          label="Почта"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Войти
        </Button>
        <Link to='/registration'>Зарегистрироваться</Link>

      </Paper>
    </Container>
  );
};

export default Login;
