import React, { useState } from 'react';
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
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { 
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Button,
  useTheme as useMuiTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery
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
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', icon: <HomeIcon />, label: 'Dashboard' },
    { path: '/gpa', icon: <CalculateIcon />, label: 'GPA' },
    { path: '/timer', icon: <TimerIcon />, label: 'Timer' },
    { path: '/assignments', icon: <AssignmentIcon />, label: 'Assignments' },
    { path: '/grade-predictor', icon: <ShowChartIcon />, label: 'Grades' },
    { path: '/study-logger', icon: <BookIcon />, label: 'Logger' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      if (isMobile) {
        setMobileOpen(false);
      }
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

  const drawer = (
    <Box
      sx={{
        height: '100%',
        backgroundColor: isDarkMode ? '#16181c' : '#fff',
        color: isDarkMode ? '#e7e9ea' : '#0f1419',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        borderBottom: `1px solid ${isDarkMode ? 'rgb(47, 51, 54)' : 'rgba(0, 0, 0, 0.08)'}`,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          StudyFlow
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'inherit' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: location.pathname === item.path 
                ? muiTheme.palette.primary.main
                : 'inherit',
              backgroundColor: location.pathname === item.path
                ? isDarkMode 
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(15, 20, 25, 0.1)'
                : 'transparent',
              '&:hover': {
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(15, 20, 25, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path 
                ? muiTheme.palette.primary.main
                : isDarkMode 
                  ? '#e7e9ea' 
                  : '#536471',
              minWidth: 40,
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, mt: 'auto', borderTop: `1px solid ${isDarkMode ? 'rgb(47, 51, 54)' : 'rgba(0, 0, 0, 0.08)'}` }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={isAuthenticated ? handleLogout : onLoginClick}
          startIcon={isAuthenticated ? <LogoutIcon /> : <LoginIcon />}
          sx={{
            justifyContent: 'flex-start',
            borderColor: isDarkMode ? '#e7e9ea' : '#536471',
            color: isDarkMode ? '#e7e9ea' : '#536471',
            mb: 2,
            '&:hover': {
              borderColor: isDarkMode ? '#fff' : '#0f1419',
              color: isDarkMode ? '#fff' : '#0f1419',
              backgroundColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(15, 20, 25, 0.1)',
            },
          }}
        >
          {isAuthenticated ? `Logout (${getUserDisplayName()})` : 'Login'}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={toggleTheme}
          startIcon={isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          sx={{
            justifyContent: 'flex-start',
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
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        className={className}
        sx={{
          backgroundColor: isDarkMode ? 'rgba(22, 24, 28, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderBottom: `1px solid ${isDarkMode ? 'rgb(47, 51, 54)' : 'rgba(0, 0, 0, 0.08)'}`,
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          maxWidth: 1280, 
          width: '100%', 
          margin: '0 auto',
          minHeight: { xs: 56, sm: 64 }, // Smaller height on mobile
          px: { xs: 2, sm: 3 }, // Less padding on mobile
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: isDarkMode ? '#e7e9ea' : '#536471' }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }, // Smaller font on mobile
                '&:hover': {
                  color: muiTheme.palette.primary.main,
                },
              }}
            >
              StudyFlow
            </Typography>
          </Box>

          {!isMobile && (
            <>
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
            </>
          )}
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              width: '85%',
              maxWidth: 360,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Navbar;
