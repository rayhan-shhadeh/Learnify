// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from '../routes/Router.js';

import { baselightTheme } from "../theme/DefaultColors.js";

function Admin() {
  
  const routing = useRoutes(Router);
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={baselightTheme}>
      <CssBaseline />
      {routing}
    </ThemeProvider>
  );
}

export default Admin;