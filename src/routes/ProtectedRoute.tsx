import React, { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Button } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh' 
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          textAlign: 'center',
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          You need to be logged in to access this page.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => window.location.href = '/'}
        >
          Go to Home
        </Button>
      </Box>
    );
  }

  return children;
};
