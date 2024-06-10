import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
      }}
    >
      <List>
        <ListItem button component={Link} to="/my-forms">
          <ListItemText primary="Мої форми" />
        </ListItem>
        <ListItem button component={Link} to="/filled-forms">
          <ListItemText primary="Заповнені форми" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
