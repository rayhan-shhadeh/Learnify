import React from 'react';
import { Typography } from '@mui/material';
import PageContainer from '../../../src/Components/container/PageContainer.jsx';
import DashboardCard from '../../../src/Components/shared/DashboardCard';


const SamplePage = () => {
  return (
    <PageContainer title="Sample Page" description="this is Sample page">

      <DashboardCard title="Sample Page">
        <Typography>This is a sample page</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;
