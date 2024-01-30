import React, { useState } from 'react';
import { Button, TextField, Paper, Typography, Container, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { Link } from 'react-router-dom';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, gender }),
      });

      if (!response.ok) {
        console.error('Ошибка при регистрации');
        return;
      }

      const data = await response.json();
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Зарегистрироваться</Typography>
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
        <TextField
          label="Имя"
          margin="normal"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl component="fieldset" style={{ marginTop: 10 }}>
          <FormLabel component="legend">Пол</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <FormControlLabel value="male" control={<Radio />} label="Мужской" />
            <FormControlLabel value="female" control={<Radio />} label="Женский" />
          </RadioGroup>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleRegister}>
          Зарегистрироваться
        </Button>
        <Link to='/'>Есть аккаунт</Link>
      </Paper>
    </Container>
  );
};

export default Registration;
