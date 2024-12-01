import React from 'react';
import { Link } from 'react-router-dom';
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
  Button, 
  IconButton, 
  Typography, 
  Box 
} from '@mui/material';

interface NavbarProps {
  onLoginClick: () => void;
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, className }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, isAuthenticated } = useAuth();

  const navItems = [
    { path: '/', icon: <HomeIcon />, label: 'Dashboard' },
    { path: '/gpa', icon: <CalculateIcon />, label: 'GPA' },
    { path: '/timer', icon: <TimerIcon />, label: 'Timer' },
    { path: '/assignments', icon: <AssignmentIcon />, label: 'Assignments' },
    { path: '/grade-predictor', icon: <ShowChartIcon />, label: 'Grade Predictor' },
    { path: '/study-logger', icon: <BookIcon />, label: 'Study Logger' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''} ${className}`}>
      <div className="navbar-content">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            StudyFlow
          </Typography>
          <IconButton 
            onClick={toggleTheme}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<LoginIcon />}
              onClick={onLoginClick}
            >
              Login
            </Button>
          )}
        </Box>

        <div className="navbar-menu">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="navbar-item"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <Box 
            sx={{ 
              display: { sm: 'none' },
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <IconButton 
              onClick={toggleTheme}
              sx={{ padding: '4px' }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <span style={{ fontSize: '0.65rem' }}>Theme</span>
          </Box>
          <Box 
            sx={{ 
              display: { sm: 'none' },
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {isAuthenticated ? (
              <IconButton 
                color="error" 
                onClick={handleLogout}
                sx={{ padding: '4px' }}
              >
                <LogoutIcon />
                <span style={{ fontSize: '0.65rem' }}>Logout</span>
              </IconButton>
            ) : (
              <IconButton 
                color="primary" 
                onClick={onLoginClick}
                sx={{ padding: '4px' }}
              >
                <LoginIcon />
                <span style={{ fontSize: '0.65rem' }}>Login</span>
              </IconButton>
            )}
          </Box>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
