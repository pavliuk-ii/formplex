import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Link as RouterLink } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)', // Віднімаємо висоту навбару
        mt: 0,
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <CheckBoxIcon sx={{ fontSize: 120, mb: 1, color: '#1976d2' }} />
      <Typography variant="h2" sx={{ mb: 1 }}>
        <span style={{ color: '#1976d2' }}>Formplex</span> - швидкий
      </Typography>
      <Typography variant="h2" sx={{ mb: 7 }}>
        та зручний конструктор форм
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, width: '100%', justifyContent: 'center', mb: 6 }}>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/register"
          sx={{ p: 2, width: '240px', fontSize: '1.2rem' }}
        >
          Зареєструватися
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={RouterLink}
          to="/login"
          sx={{ p: 2, width: '240px', fontSize: '1.2rem' }}
        >
          Увійти
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
