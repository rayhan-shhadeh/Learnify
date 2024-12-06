import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import logo from '../assets/A+.svg'; // Adjust the path to your logo


const Header = () => {
  return (

    <AppBar position="static" sx={{ background: '#ADC6E5' }}>
      <Toolbar>
      <Box component="img" src={logo} alt="Logo" sx={{ height: 80, mr: 2 }} />
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Welcome to the A+ Platform 
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;