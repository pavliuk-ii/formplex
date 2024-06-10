import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('http://localhost:3333/auth/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setDisplayName(data.displayName);
      localStorage.setItem('displayName', data.displayName);
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 1400 }}>
      <Toolbar>
        <Button component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textTransform: 'none', color: 'inherit' }}>
          <CheckBoxIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Formplex</Typography>
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {isAuthenticated ? (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {displayName}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 28, alignSelf: 'center', backgroundColor: 'white' }} />
            <Button color="inherit" onClick={handleLogoutClick}>
              Вийти
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Увійти
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Реєстрація
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
