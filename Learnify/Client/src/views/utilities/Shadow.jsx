import React from 'react';
import { Paper, Box, Grid2 } from '@mui/material';
import PageContainer from '../../Components/container/PageContainer.jsx';
import DashboardCard from '../../Components/shared/DashboardCard';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

const Shadow = () => {
  return (
    <PageContainer title="Shadow" description="this is Shadow">

      <DashboardCard title="Shadow">
        <Grid2 container spacing={2}>
          {[lightTheme, darkTheme].map((theme, index) => (
            <Grid2 item xs={6} key={index}>
              <ThemeProvider theme={theme}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    display: 'Grid2',
                    Grid2TemplateColumns: { md: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  {[0, 1, 2, 3, 4, 6, 8, 12, 16, 24].map((elevation) => (
                    <Item key={elevation} elevation={elevation}>
                      {`elevation=${elevation}`}
                    </Item>
                  ))}
                </Box>
              </ThemeProvider>
            </Grid2>
          ))}
        </Grid2>
      </DashboardCard>
    </PageContainer>
  );
};

export default Shadow;
