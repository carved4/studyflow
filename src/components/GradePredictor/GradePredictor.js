import React, { useState, useMemo, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Card,
    CardContent,
    Stack,
    useTheme,
    Tooltip,
    InputAdornment,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Brightness4 as ThemeIcon,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';

// Utility functions for safe number parsing
const safeParseFloat = (value, defaultValue = 0) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
};

const GradePredictor = () => {
    const muiTheme = useTheme();
    const { isDarkMode, toggleTheme } = useCustomTheme();

    const [gradeItems, setGradeItems] = useState([
        { id: 1, name: '', weight: '', score: '', maxScore: 100 }
    ]);

    const [targetGrade, setTargetGrade] = useState('');

    const addGradeItem = useCallback(() => {
        const newItem = {
            id: Date.now(), // Use timestamp to ensure unique ID
            name: '',
            weight: '',
            score: '',
            maxScore: 100
        };
        setGradeItems(prev => [...prev, newItem]);
    }, []);

    const removeGradeItem = useCallback((id) => {
        setGradeItems(prev => {
            // Prevent removing the last item
            if (prev.length <= 1) return prev;
            return prev.filter(item => item.id !== id);
        });
    }, []);

    const updateGradeItem = useCallback((id, field, value) => {
        setGradeItems(prev => 
            prev.map(item => {
                if (item.id !== id) return item;

                // Special handling for name field
                if (field === 'name') {
                    return { ...item, name: value };
                }

                // Numerical field handling
                if (value === '') {
                    return { ...item, [field]: '' };
                }

                const numValue = safeParseFloat(value);

                // Field-specific validations
                switch (field) {
                    case 'weight':
                        return numValue >= 0 && numValue <= 100 
                            ? { ...item, weight: numValue }
                            : item;
                    case 'score':
                        return numValue >= 0 && numValue <= item.maxScore 
                            ? { ...item, score: numValue }
                            : item;
                    case 'maxScore':
                        return numValue > 0 
                            ? { 
                                ...item, 
                                maxScore: numValue,
                                // Adjust score if it exceeds new max score
                                score: Math.min(item.score, numValue)
                            }
                            : item;
                    default:
                        return item;
                }
            })
        );
    }, []);

    const calculateCurrentGrade = useMemo(() => {
        const validItems = gradeItems.filter(item => 
            item.weight !== '' && 
            item.score !== '' && 
            item.maxScore !== ''
        );

        if (validItems.length === 0) return '0.00';

        const totalWeight = validItems.reduce((sum, item) => 
            sum + safeParseFloat(item.weight), 0
        );

        if (totalWeight === 0) return '0.00';

        const weightedScore = validItems.reduce((total, item) => {
            const weight = safeParseFloat(item.weight);
            const score = safeParseFloat(item.score);
            const maxScore = safeParseFloat(item.maxScore);
            
            const percentage = (score / maxScore) * 100;
            return total + (percentage * (weight / 100));
        }, 0);

        return (weightedScore * (100 / totalWeight)).toFixed(2);
    }, [gradeItems]);

    const calculateNeededScore = useMemo(() => {
        if (!targetGrade) return 'Set a target';

        const currentGrade = safeParseFloat(calculateCurrentGrade);
        const validItems = gradeItems.filter(item => item.weight !== '');
        
        const usedWeight = validItems.reduce((sum, item) => 
            sum + safeParseFloat(item.weight), 0
        );

        const remainingWeight = 100 - usedWeight;

        if (remainingWeight <= 0) return 'N/A';

        const neededScore = ((targetGrade - currentGrade * (1 - remainingWeight / 100)) / 
            (remainingWeight / 100)) * 100;

        if (neededScore < 0) return '0';
        if (neededScore > 100) return 'Impossible';
        
        return neededScore.toFixed(2);
    }, [gradeItems, targetGrade, calculateCurrentGrade]);

    const getGradeColor = (grade) => {
        const numGrade = safeParseFloat(grade);
        if (numGrade >= 90) return 'success.main';
        if (numGrade >= 80) return 'info.main';
        if (numGrade >= 70) return 'warning.main';
        return 'error.main';
    };

    return (
        <Box sx={{
            maxWidth: 800,
            mx: 'auto',
            p: 3,
            backgroundColor: muiTheme.palette.background.default,
            minHeight: '100vh',
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                px: { xs: 1, sm: 2, md: 3 },
            }}>
                <Typography variant="h4" gutterBottom={false}>
                    Grade Predictor
                </Typography>
                <Button
                    variant="outlined"
                    onClick={toggleTheme}
                    color={isDarkMode ? 'secondary' : 'primary'}
                    startIcon={<ThemeIcon />}
                    sx={{ minWidth: 150 }}
                >
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            backgroundColor: muiTheme.palette.background.paper,
                        }}
                    >
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Assessment</TableCell>
                                        <TableCell align="right">Weight (%)</TableCell>
                                        <TableCell align="right">Score</TableCell>
                                        <TableCell align="right">Max Score</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {gradeItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={item.name}
                                                    onChange={(e) => updateGradeItem(item.id, 'name', e.target.value)}
                                                    variant="outlined"
                                                    placeholder="Enter assessment name"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.weight}
                                                    onChange={(e) => updateGradeItem(item.id, 'weight', e.target.value)}
                                                    variant="outlined"
                                                    placeholder="0-100"
                                                    InputProps={{
                                                        inputProps: { min: 0, max: 100 },
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                                    }}
                                                    sx={{ maxWidth: 120 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.score}
                                                    onChange={(e) => updateGradeItem(item.id, 'score', e.target.value)}
                                                    variant="outlined"
                                                    placeholder="Your score"
                                                    InputProps={{
                                                        inputProps: { min: 0, max: item.maxScore }
                                                    }}
                                                    sx={{ maxWidth: 120 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.maxScore}
                                                    onChange={(e) => updateGradeItem(item.id, 'maxScore', e.target.value)}
                                                    variant="outlined"
                                                    placeholder="Max points"
                                                    InputProps={{
                                                        inputProps: { min: 1 }
                                                    }}
                                                    sx={{ maxWidth: 120 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip 
                                                    title={gradeItems.length <= 1 
                                                        ? "Cannot remove last assessment" 
                                                        : "Remove assessment"
                                                    }
                                                >
                                                    <span>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => removeGradeItem(item.id)}
                                                            disabled={gradeItems.length <= 1}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button
                            startIcon={<AddIcon />}
                            variant="outlined"
                            onClick={addGradeItem}
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Add Assessment
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Stack spacing={2}>
                        <Card
                            variant="outlined"
                            sx={{
                                backgroundColor: muiTheme.palette.background.paper,
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'scale(1.02)' }
                            }}
                        >
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>
                                    Current Grade
                                </Typography>
                                <Typography
                                    variant="h4"
                                    color={getGradeColor(calculateCurrentGrade)}
                                >
                                    {calculateCurrentGrade}%
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            variant="outlined"
                            sx={{
                                backgroundColor: muiTheme.palette.background.paper,
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'scale(1.02)' }
                            }}
                        >
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>
                                    Target Grade
                                </Typography>
                                <TextField
                                    type="number"
                                    fullWidth
                                    value={targetGrade}
                                    onChange={(e) => setTargetGrade(e.target.value)}
                                    variant="outlined"
                                    placeholder="Enter target grade"
                                    InputProps={{
                                        inputProps: { min: 0, max: 100 },
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <Typography color="text.secondary">
                                    Needed Score: 
                                    <Typography 
                                        component="span" 
                                        color={getGradeColor(calculateNeededScore)}
                                        sx={{ ml: 1, fontWeight: 'bold' }}
                                    >
                                        {calculateNeededScore}
                                        {calculateNeededScore !== 'Set a target' && 
                                         calculateNeededScore !== 'N/A' && 
                                         calculateNeededScore !== 'Impossible' ? '%' : ''}
                                    </Typography>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default GradePredictor;
