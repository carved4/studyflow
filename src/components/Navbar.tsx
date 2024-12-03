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
import { IconButton, Tooltip } from '@mui/material';

interface NavbarProps {
  onLoginClick: () => void;
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, className }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

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

  // Get user display name or email
  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    return currentUser?.email?.split('@')[0] || 'User';
  };

  // Conditionally render login/logout button based on authentication
  const AuthButton = () => (
    isAuthenticated ? (
      <Tooltip title={`Logout (${getUserDisplayName()})`}>
        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    ) : (
      <IconButton onClick={onLoginClick}>
        <LoginIcon />
      </IconButton>
    )
  );

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''} ${className}`}>
      <div className="navbar-content">
        <div className="navbar-brand">StudyFlow</div>

        <div className="navbar-menu">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`navbar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </button>

          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
