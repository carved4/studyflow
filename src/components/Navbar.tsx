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
        <div className="navbar-brand">StudyFlow</div>
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
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={toggleTheme}>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
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
      </div>
    </nav>
  );
};

export default Navbar;
