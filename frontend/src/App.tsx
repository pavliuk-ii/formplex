import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyForms from './pages/MyForms';
import FilledForms from './pages/FilledForms';
import EditUser from './pages/EditUser';
import { Container, Box, ThemeProvider } from '@mui/material';
import theme from './theme';
import { SnackbarProvider, useSnackbar } from 'notistack';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
    enqueueSnackbar('Ви успішно вийшли з акаунту', { variant: 'success' });
  };

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar onLogout={handleLogout} />
          <Box sx={{ display: 'flex', flexGrow: 1, mt: '64px' }}>
            {isAuthenticated && <Sidebar />}
            <Container component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={isAuthenticated ? <MyForms /> : <Home />} />
                <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
                <Route path="/register" element={!isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
                <Route path="/my-forms" element={isAuthenticated ? <MyForms /> : <Navigate to="/login" />} />
                <Route path="/filled-forms" element={isAuthenticated ? <FilledForms /> : <Navigate to="/login" />} />
                <Route path="/edit-user" element={isAuthenticated ? <EditUser /> : <Navigate to="/login" />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
