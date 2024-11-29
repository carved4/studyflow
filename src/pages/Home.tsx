import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to StudyFlow
        </Typography>
        <Typography variant="h5" component="p" color="text.secondary">
          Your personal academic productivity companion
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
