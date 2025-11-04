import React from 'react';
import {  Grid, Box } from '@mui/material';
import PageContainer from '../../../src/Components/container/PageContainer';

// components
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="Student Dashboard">
      <Box>
        <Grid  container spacing={2} alignItems="center" justifyContent="center" >
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
