import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface RegisterProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Register: React.FC<RegisterProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3333/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, displayName }),
      });

      if (!response.ok) {
        throw new Error('Помилка під час реєстрації');
      }

      const data = await response.json();
      localStorage.setItem('token', data.accessToken);
      setIsAuthenticated(true);
      navigate('/');
      enqueueSnackbar('Реєстрація успішна', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Помилка під час реєстрації', { variant: 'error' });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)',
        boxSizing: 'border-box',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          border: '1px solid #ccc',
          borderRadius: '4px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>РЕЄСТРАЦІЯ</Typography>
        <TextField
          label="Ім'я користувача"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Електронна пошта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Ім'я відображення"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, p: 1.5 }}
        >
          Зареєструватися
        </Button>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Вже маєте акаунт?{' '}
            <Link href="/login" underline="hover">Увійти</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
