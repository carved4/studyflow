import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes'; 
import AuthModal from './components/Auth/AuthModal';
import './styles/ios.css';

const AppContent = () => {
  const { isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isIOSInitialized, setIsIOSInitialized] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      document.body.style.overscrollBehavior = 'none';
      
      const fixViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      fixViewportHeight();
      window.addEventListener('resize', fixViewportHeight);
      
      return () => {
        window.removeEventListener('resize', fixViewportHeight);
      };
    }
    setIsIOSInitialized(true);
  }, []);

  // Wait for both auth loading and iOS initialization
  if (!isIOSInitialized || isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar 
        onLoginClick={() => setIsAuthModalOpen(true)} 
        className="sticky-header no-select"
      />
      <main className="main-content">
        <AppRoutes />
      </main>
      <AuthModal 
        open={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <CssBaseline />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
