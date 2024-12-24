import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../config/firebase';
import { 
  Home as HomeIcon, 
  Calculate as CalculateIcon, 
  Timer as TimerIcon, 
  AssignmentOutlined as AssignmentIcon, 
  ShowChart as ShowChartIcon, 
  Book as BookIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Login as LoginIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { 
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Button,
  useTheme as useMuiTheme
} from '@mui/material';

interface NavbarProps {
  onLoginClick: () => void;
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, className }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();
  const muiTheme = useMuiTheme();

  const navItems = [
    { path: '/', icon: <HomeIcon />, label: 'Dashboard' },
    { path: '/gpa', icon: <CalculateIcon />, label: 'GPA' },
    { path: '/timer', icon: <TimerIcon />, label: 'Timer' },
    { path: '/assignments', icon: <AssignmentIcon />, label: 'Assignments' },
    { path: '/grade-predictor', icon: <ShowChartIcon />, label: 'Grades' },
    { path: '/study-logger', icon: <BookIcon />, label: 'Logger' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    return currentUser?.email?.split('@')[0] || 'User';
  };

  return (
    <AppBar 
      position="fixed" 
      className={className}
      sx={{
        backgroundColor: isDarkMode ? 'rgba(22, 24, 28, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderBottom: `1px solid ${isDarkMode ? 'rgb(47, 51, 54)' : 'rgba(0, 0, 0, 0.08)'}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1280, width: '100%', margin: '0 auto' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: isDarkMode ? '#e7e9ea' : '#0f1419',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            '&:hover': {
              color: muiTheme.palette.primary.main,
            },
          }}
        >
          StudyFlow
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                color: location.pathname === item.path 
                  ? '#fff'
                  : isDarkMode 
                    ? '#e7e9ea' 
                    : '#536471',
                backgroundColor: location.pathname === item.path
                  ? muiTheme.palette.primary.main
                  : 'transparent',
                '&:hover': {
                  backgroundColor: location.pathname === item.path
                    ? muiTheme.palette.primary.dark
                    : isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(15, 20, 25, 0.1)',
                  color: location.pathname === item.path
                    ? '#fff'
                    : isDarkMode
                      ? '#fff'
                      : '#0f1419',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: isDarkMode ? '#e7e9ea' : '#536471',
                '&:hover': {
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(15, 20, 25, 0.1)',
                },
              }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {isAuthenticated ? (
            <Tooltip title={`Logout (${getUserDisplayName()})`}>
              <IconButton
                onClick={handleLogout}
                sx={{
                  color: isDarkMode ? '#e7e9ea' : '#536471',
                  '&:hover': {
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(15, 20, 25, 0.1)',
                  },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              onClick={onLoginClick}
              startIcon={<LoginIcon />}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                borderColor: isDarkMode ? '#e7e9ea' : '#536471',
                color: isDarkMode ? '#e7e9ea' : '#536471',
                '&:hover': {
                  borderColor: isDarkMode ? '#fff' : '#0f1419',
                  color: isDarkMode ? '#fff' : '#0f1419',
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(15, 20, 25, 0.1)',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
