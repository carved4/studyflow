import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes'; 
import AuthModal from './components/Auth/AuthModal';
import { Button, Box } from '@mui/material';
import './styles/ios.css';

const App: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Prevent bounce effect on iOS
    document.body.style.overscrollBehavior = 'none';
    
    // Fix viewport height on iOS
    const fixViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    window.addEventListener('resize', fixViewportHeight);
    window.addEventListener('orientationchange', fixViewportHeight);
    fixViewportHeight();

    // Handle iOS keyboard
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        window.scrollTo(0, 0);
      });
    });

    return () => {
      window.removeEventListener('resize', fixViewportHeight);
      window.removeEventListener('orientationchange', fixViewportHeight);
    };
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app app-container">
            <Navbar 
              onLoginClick={() => setIsAuthModalOpen(true)} 
              className="sticky-header no-select"
            />
            <AuthModal 
              open={isAuthModalOpen} 
              onClose={() => setIsAuthModalOpen(false)} 
            />
            <main className="container scroll-container">
              <AppRoutes />
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
