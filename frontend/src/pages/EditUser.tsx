import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';
import { useSnackbar } from 'notistack';

const EditUser: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('http://localhost:3333/auth/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUsername(data.username);
      setEmail(data.email);
      setDisplayName(data.displayName);
      localStorage.setItem('displayName', data.displayName);
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3333/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ username, email, displayName }),
      });

      if (!response.ok) {
        throw new Error('Помилка під час оновлення даних');
      }

      enqueueSnackbar('Дані оновлені успішно', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Помилка під час оновлення даних', { variant: 'error' });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>Редагувати користувача</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '400px' }}>
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
          label="Ім'я відображення"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Зберегти
        </Button>
      </Box>
    </Box>
  );
};

export default EditUser;
