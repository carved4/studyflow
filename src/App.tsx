import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes'; 
import AuthModal from './components/Auth/AuthModal';
import './styles/ios.css';

const App = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      // Prevent bounce effect on iOS
      document.body.style.overscrollBehavior = 'none';
      
      // Fix viewport height on iOS
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
  }, []);

  return (
    <Router>
      <MUIThemeProvider theme={theme}>
        <ThemeProvider>
          <CssBaseline />
          <AuthProvider>
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
          </AuthProvider>
        </ThemeProvider>
      </MUIThemeProvider>
    </Router>
  );
};

export default App;
