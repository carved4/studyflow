import React from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button 
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import {
  Timer as TimerIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  ShowChart as ShowChartIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();

  const features = [
    {
      title: 'GPA Calculator',
      description: 'Track and predict your academic performance',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      path: '/gpa',
      color: '#1976d2',
    },
    {
      title: 'Study Timer',
      description: 'Manage your study sessions effectively',
      icon: <TimerIcon sx={{ fontSize: 40 }} />,
      path: '/timer',
      color: '#2e7d32',
    },
    {
      title: 'Assignment Tracker',
      description: 'Keep track of your assignments and deadlines',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      path: '/assignments',
      color: '#ed6c02',
    },
    {
      title: 'Grade Predictor',
      description: 'Forecast your potential grades',
      icon: <ShowChartIcon sx={{ fontSize: 40 }} />,
      path: '/grade-predictor',
      color: '#9c27b0',
    },
    {
      title: 'Study Logger',
      description: 'Log and analyze your study sessions',
      icon: <BookIcon sx={{ fontSize: 40 }} />,
      path: '/study-logger',
      color: '#673ab7',
    },
  ];

  // Extract first name or use email if no display name
  const getUserName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    return currentUser?.email?.split('@')[0] || 'Student';
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      padding: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          marginTop: 2,
          fontWeight: 600 
        }}
      >
        Welcome, {getUserName()} to StudyFlow
      </Typography>

      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} md={4} key={feature.path}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `${feature.color}20`,
                    color: feature.color,
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6">{feature.title}</Typography>
                <Typography variant="body2">
                  {feature.description}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ mt: 2 }} 
                  onClick={() => navigate(feature.path)}
                >
                  {feature.title}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
