import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          my: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="h5" component="p" color="text.secondary" align="center">
          Oops! The page you are looking for does not exist.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 4 }}
          onClick={() => navigate('/')}
        >
          Return to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
