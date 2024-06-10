import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3333/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Помилка під час логіну');
      }

      const data = await response.json();
      localStorage.setItem('token', data.accessToken);
      setIsAuthenticated(true);
      navigate('/');
      enqueueSnackbar('Вхід успішний', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Помилка під час логіну', { variant: 'error' });
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
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>УВІЙТИ</Typography>
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, p: 1.5 }}
        >
          Увійти
        </Button>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Не маєте акаунту?{' '}
            <Link href="/register" underline="hover">Зареєструватись</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
