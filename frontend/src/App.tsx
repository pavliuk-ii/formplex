import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyForms from './pages/MyForms';
import FilledForms from './pages/FilledForms';
import { Container, Box } from '@mui/material';
import './App.css';

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Container component="main" sx={{ mt: 8, ml: 2, flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-forms" element={<MyForms />} />
          <Route path="/filled-forms" element={<FilledForms />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
