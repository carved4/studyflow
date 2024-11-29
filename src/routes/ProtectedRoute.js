import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography } from '@mui/material';
export const ProtectedRoute = ({ component: Component, children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx(Box, { sx: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }, children: _jsx(Typography, { children: "Loading..." }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login" });
    }
    return _jsx(Component, { children: children });
};
