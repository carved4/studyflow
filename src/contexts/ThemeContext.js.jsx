import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
const ThemeContext = createContext({
    isDarkMode: false,
    toggleTheme: () => { },
});
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    // Create a theme based on dark/light mode
    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            primary: {
                main: isDarkMode ? '#90caf9' : '#1976d2', // Adjusted primary color for better contrast
            },
            background: {
                default: isDarkMode ? '#121212' : '#f4f4f4',
                paper: isDarkMode ? '#1e1e1e' : '#ffffff',
            },
        },
        typography: {
            fontFamily: 'Roboto, Arial, sans-serif',
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                        boxShadow: isDarkMode
                            ? '0 4px 6px rgba(255, 255, 255, 0.1)'
                            : '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
        },
    });
    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);
    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };
    return (_jsx(ThemeContext.Provider, { value: { isDarkMode, toggleTheme }, children: _jsxs(MUIThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), " ", children] }) }));
};
export const useTheme = () => useContext(ThemeContext);
