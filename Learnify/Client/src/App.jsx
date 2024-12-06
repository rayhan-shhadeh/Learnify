import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router'; // Import the template's Router
import { baselightTheme } from './theme/DefaultColors'; // Import the template theme


function App() {
  const routing = useRoutes(Router); // Use the template's routing system
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {routing} {/* Render routes dynamically */}
    </ThemeProvider>
  );
}

export default App;
