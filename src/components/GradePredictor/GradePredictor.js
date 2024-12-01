import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Card, CardContent, Stack, useTheme, } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Brightness4 as ThemeIcon } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';

const GradePredictor = () => {
    const muiTheme = useTheme();
    const { isDarkMode, toggleTheme } = useCustomTheme();
    const [gradeItems, setGradeItems] = useState([
        { id: 1, name: '', weight: '', score: '', maxScore: 100 },
    ]);
    const [targetGrade, setTargetGrade] = useState('');

    const addGradeItem = () => {
        const newItem = {
            id: gradeItems.length + 1,
            name: '',
            weight: '',
            score: '',
            maxScore: 100,
        };
        setGradeItems([...gradeItems, newItem]);
    };

    const removeGradeItem = (id) => {
        if (gradeItems.length > 1) {
            setGradeItems(gradeItems.filter((item) => item.id !== id));
        }
    };

    const updateGradeItem = (id, field, value) => {
        setGradeItems(gradeItems.map((item) => {
            if (item.id === id) {
                // Convert empty string to 0 for calculations
                const numValue = value === '' ? 0 : Number(value);
                return { ...item, [field]: field === 'name' ? value : numValue };
            }
            return item;
        }));
    };

    const calculateCurrentGrade = () => {
        let totalWeight = 0;
        let weightedScore = 0;
        gradeItems.forEach((item) => {
            const percentage = (item.score / item.maxScore) * 100;
            weightedScore += percentage * (item.weight / 100);
            totalWeight += item.weight;
        });
        return totalWeight === 0 ? 0 : (weightedScore * (100 / totalWeight)).toFixed(2);
    };

    const calculateNeededScore = () => {
        const currentGrade = Number(calculateCurrentGrade());
        const remainingWeight = 100 - gradeItems.reduce((sum, item) => sum + item.weight, 0);
        if (remainingWeight <= 0)
            return 'N/A';
        const neededScore = ((targetGrade - currentGrade * (1 - remainingWeight / 100)) /
            (remainingWeight / 100)) *
            100;
        return neededScore < 0 ? '0' : neededScore > 100 ? 'Impossible' : neededScore.toFixed(2);
    };

    return (_jsxs(Box, { sx: {
            maxWidth: 800,
            mx: 'auto',
            p: 3,
            backgroundColor: muiTheme.palette.background.default,
            minHeight: '100vh',
        }, children: [_jsxs(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 3,
                    px: { xs: 1, sm: 2, md: 3 },
                }, children: [_jsx(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }, children: _jsx(Typography, { variant: "h4", gutterBottom: false, sx: { ml: { xs: 0, sm: 1 } }, children: "Grade Predictor" }) }), _jsx(Button, { variant: "outlined", onClick: toggleTheme, color: isDarkMode ? 'secondary' : 'primary', startIcon: _jsx(ThemeIcon, {}), sx: {
                            minWidth: 150,
                            alignSelf: 'center',
                            mr: { xs: 0, sm: 1 },
                        }, children: isDarkMode ? 'Light Mode' : 'Dark Mode' })] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsxs(Paper, { elevation: 3, sx: {
                                p: 3,
                                mb: 3,
                                backgroundColor: muiTheme.palette.background.paper,
                            }, children: [_jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Assessment" }), _jsx(TableCell, { align: "right", children: "Weight (%)" }), _jsx(TableCell, { align: "right", children: "Score" }), _jsx(TableCell, { align: "right", children: "Max Score" }), _jsx(TableCell, { align: "right", children: "Actions" })] }) }), _jsx(TableBody, { children: gradeItems.map((item) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx(TextField, { 
                                        fullWidth: true, 
                                        size: "small", 
                                        value: item.name, 
                                        onChange: (e) => updateGradeItem(item.id, 'name', e.target.value), 
                                        variant: "outlined",
                                        placeholder: "Enter assessment name",
                                        autoFocus: gradeItems.length > 1 && item.id === gradeItems[gradeItems.length - 1].id
                                    }) }), 
                                    _jsx(TableCell, { align: "right", children: _jsx(TextField, { 
                                        type: "number", 
                                        size: "small", 
                                        value: item.weight, 
                                        onChange: (e) => updateGradeItem(item.id, 'weight', e.target.value), 
                                        inputProps: { min: 0, max: 100, step: "any" }, 
                                        variant: "outlined",
                                        placeholder: "0-100"
                                    }) }), 
                                    _jsx(TableCell, { align: "right", children: _jsx(TextField, { 
                                        type: "number", 
                                        size: "small", 
                                        value: item.score, 
                                        onChange: (e) => updateGradeItem(item.id, 'score', e.target.value), 
                                        inputProps: { min: 0, step: "any" }, 
                                        variant: "outlined",
                                        placeholder: "Your score"
                                    }) }), 
                                    _jsx(TableCell, { align: "right", children: _jsx(TextField, { 
                                        type: "number", 
                                        size: "small", 
                                        value: item.maxScore, 
                                        onChange: (e) => updateGradeItem(item.id, 'maxScore', e.target.value), 
                                        inputProps: { min: 0, step: "any" }, 
                                        variant: "outlined",
                                        placeholder: "Max points"
                                    }) }), 
                                    _jsx(TableCell, { align: "right", children: _jsx(IconButton, { color: "error", onClick: () => removeGradeItem(item.id), disabled: gradeItems.length === 1, children: _jsx(DeleteIcon, {}) }) })] }, item.id))) })] }) }), _jsx(Button, { startIcon: _jsx(AddIcon, {}), variant: "outlined", onClick: addGradeItem, sx: { mt: 2 }, color: "primary", children: "Add Assessment" })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Stack, { spacing: 2, children: [_jsx(Card, { variant: "outlined", sx: {
                                        backgroundColor: muiTheme.palette.background.paper,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        }
                                    }, children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "text.secondary", gutterBottom: true, children: "Current Grade" }), _jsxs(Typography, { variant: "h4", color: Number(calculateCurrentGrade()) >= 90
                                                    ? 'success.main'
                                                    : Number(calculateCurrentGrade()) >= 70
                                                        ? 'warning.main'
                                                        : 'error.main', children: [calculateCurrentGrade(), "%"] })] }) }), _jsx(Card, { variant: "outlined", sx: {
                                        backgroundColor: muiTheme.palette.background.paper,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        }
                                    }, children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "text.secondary", gutterBottom: true, children: "Target Grade" }), _jsx(TextField, { type: "number", fullWidth: true, value: targetGrade, onChange: (e) => setTargetGrade(Number(e.target.value)), inputProps: { min: 0, max: 100 }, variant: "outlined", sx: { mb: 2 } }), _jsxs(Typography, { color: "text.secondary", children: ["Needed Score: ", calculateNeededScore(), "%"] })] }) })] }) })] })] }));
};
export default GradePredictor;
