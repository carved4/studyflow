import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Timer as TimerIcon, School as SchoolIcon, Assignment as AssignmentIcon, ShowChart as ShowChartIcon, Book as BookIcon, } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const features = [
        {
            title: 'GPA Calculator',
            description: 'Track and predict your academic performance',
            icon: _jsx(SchoolIcon, { sx: { fontSize: 40 } }),
            path: '/gpa',
            color: '#1976d2',
        },
        {
            title: 'Study Timer',
            description: 'Manage your study sessions effectively',
            icon: _jsx(TimerIcon, { sx: { fontSize: 40 } }),
            path: '/timer',
            color: '#2e7d32',
        },
        {
            title: 'Assignment Tracker',
            description: 'Keep track of your assignments and deadlines',
            icon: _jsx(AssignmentIcon, { sx: { fontSize: 40 } }),
            path: '/assignments',
            color: '#ed6c02',
        },
        {
            title: 'Grade Predictor',
            description: 'Forecast your potential grades',
            icon: _jsx(ShowChartIcon, { sx: { fontSize: 40 } }),
            path: '/grade-predictor',
            color: '#9c27b0',
        },
        {
            title: 'Study Logger',
            description: 'Track your study time and progress',
            icon: _jsx(BookIcon, { sx: { fontSize: 40 } }),
            path: '/study-logger',
            color: '#d32f2f',
        },
    ];
    return (_jsxs(Box, { sx: {
            flexGrow: 1,
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
        }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, sx: {
                    textAlign: 'center',
                    marginTop: 2,
                    fontWeight: 600
                }, children: "Welcome to StudyFlow" }), _jsx(Grid, { container: true, spacing: 3, children: features.map((feature) => (_jsx(Grid, { item: true, xs: 12, md: 4, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Box, { sx: {
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: `${feature.color}20`,
                                        color: feature.color,
                                        mb: 2,
                                    }, children: feature.icon }), _jsx(Typography, { variant: "h6", children: feature.title }), _jsx(Typography, { variant: "body2", children: feature.description }), _jsx(Button, { variant: "outlined", color: "primary", sx: { mt: 2 }, onClick: () => navigate(feature.path), children: feature.title })] }) }) }, feature.path))) })] }));
};
export default Dashboard;
