import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../config/firebase';
import { Home as HomeIcon, Calculate as CalculateIcon, Timer as TimerIcon, AssignmentOutlined as AssignmentIcon, ShowChart as ShowChartIcon, Book as BookIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon, Login as LoginIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { Button, IconButton, Box } from '@mui/material';
const Navbar = ({ onLoginClick }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { currentUser, isAuthenticated } = useAuth();
    const navItems = [
        { path: '/', icon: _jsx(HomeIcon, {}), label: 'Dashboard' },
        { path: '/gpa', icon: _jsx(CalculateIcon, {}), label: 'GPA' },
        { path: '/timer', icon: _jsx(TimerIcon, {}), label: 'Timer' },
        { path: '/assignments', icon: _jsx(AssignmentIcon, {}), label: 'Assignments' },
        { path: '/grade-predictor', icon: _jsx(ShowChartIcon, {}), label: 'Grade Predictor' },
        { path: '/study-logger', icon: _jsx(BookIcon, {}), label: 'Study Logger' },
    ];
    const handleLogout = async () => {
        try {
            await signOut();
        }
        catch (error) {
            console.error('Logout failed', error);
        }
    };
    return (_jsx("nav", { className: `navbar ${isDarkMode ? 'dark-mode' : ''}`, children: _jsxs("div", { className: "navbar-content", children: [_jsx("div", { className: "navbar-brand", children: "StudyFlow" }), _jsx("div", { className: "navbar-menu", children: navItems.map((item) => (_jsxs(Link, { to: item.path, className: "navbar-item", children: [item.icon, _jsx("span", { children: item.label })] }, item.path))) }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(IconButton, { onClick: toggleTheme, children: isDarkMode ? _jsx(LightModeIcon, {}) : _jsx(DarkModeIcon, {}) }), isAuthenticated ? (_jsx(Button, { variant: "outlined", color: "error", startIcon: _jsx(LogoutIcon, {}), onClick: handleLogout, children: "Logout" })) : (_jsx(Button, { variant: "contained", color: "primary", startIcon: _jsx(LoginIcon, {}), onClick: onLoginClick, children: "Login" }))] })] }) }));
};
export default Navbar;
