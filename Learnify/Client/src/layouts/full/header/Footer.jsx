import React from 'react';
import { Container, Grid, Typography, IconButton, Box, Link } from '@mui/material';
import { Facebook, Twitter, Google, Instagram, LinkedIn, GitHub, Home, Email, Phone, Print } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: 'lightgray', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Company name
            </Typography>
            <Typography variant="body2">
              Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Products
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="none">Angular</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="none">React</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="none">Vue</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="none">Laravel</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Useful links
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="none">Pricing</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="none">Settings</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="none">Orders</Link>
            </Typography>
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="none">Help</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2">
              <Home sx={{ mr: 1 }} /> New York, NY 10012, US
            </Typography>
            <Typography variant="body2">
              <Email sx={{ mr: 1 }} /> info@example.com
            </Typography>
            <Typography variant="body2">
              <Phone sx={{ mr: 1 }} /> + 01 234 567 88
            </Typography>
            <Typography variant="body2">
              <Print sx={{ mr: 1 }} /> + 01 234 567 89
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" gutterBottom>
            Get connected with us on social networks:
          </Typography>
          <IconButton href="#" color="inherit">
            <Facebook />
          </IconButton>
          <IconButton href="#" color="inherit">
            <Twitter />
          </IconButton>
          <IconButton href="#" color="inherit">
            <Google />
          </IconButton>
          <IconButton href="#" color="inherit">
            <Instagram />
          </IconButton>
          <IconButton href="#" color="inherit">
            <LinkedIn />
          </IconButton>
          <IconButton href="#" color="inherit">
            <GitHub />
          </IconButton>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 4, py: 2, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          <Typography variant="body2">
            © 2021 Copyright:
            <Link href="https://mdbootstrap.com/" color="inherit" underline="none" sx={{ ml: 1 }}>
              MDBootstrap.com
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;