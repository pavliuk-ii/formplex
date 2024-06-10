import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <Box
      sx={{
        width: 260,
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <List>
        <ListItem button component={Link} to="/my-forms">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Мої форми" />
        </ListItem>
        <ListItem button component={Link} to="/filled-forms">
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Пройдені форми" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/edit-user">
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Редагувати користувача" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
