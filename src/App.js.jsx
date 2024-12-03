import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes';
import AuthModal from './components/Auth/AuthModal';
const App = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    return (_jsx(AuthProvider, { children: _jsx(ThemeProvider, { children: _jsx(Router, { children: _jsxs("div", { className: "app", children: [_jsx(Navbar, { onLoginClick: () => setIsAuthModalOpen(true) }), _jsx(AuthModal, { open: isAuthModalOpen, onClose: () => setIsAuthModalOpen(false) }), _jsx("main", { className: "container", children: _jsx(AppRoutes, {}) })] }) }) }) }));
};
export default App;
