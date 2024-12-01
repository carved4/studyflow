import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
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
    Fade,
    Alert,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Add as AddIcon,
    Brightness4 as ThemeIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';

const GradePredictor = () => {
    const muiTheme = useTheme();
    const { isDarkMode, toggleTheme } = useCustomTheme();
    const [gradeItems, setGradeItems] = useState([
        { id: 1, name: '', weight: '', score: '', maxScore: 100 },
    ]);
    const [targetGrade, setTargetGrade] = useState('');
    const [error, setError] = useState('');

    // Validate total weight
    useEffect(() => {
        const totalWeight = gradeItems.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
        if (totalWeight > 100) {
            setError('Total weight exceeds 100%');
        } else {
            setError('');
        }
    }, [gradeItems]);

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
                if (field === 'name') return { ...item, [field]: value };
                
                // Handle numerical inputs
                const numValue = value === '' ? '' : Number(value);
                if (field === 'weight' && numValue > 100) return item;
                if (field === 'score' && numValue > item.maxScore) return item;
                if (numValue < 0) return item;
                
                return { ...item, [field]: numValue };
            }
            return item;
        }));
    };

    const calculateCurrentGrade = () => {
        let totalWeight = 0;
        let weightedScore = 0;
        gradeItems.forEach((item) => {
            if (item.weight && item.score !== '') {
                const percentage = (Number(item.score) / Number(item.maxScore)) * 100;
                weightedScore += percentage * (Number(item.weight) / 100);
                totalWeight += Number(item.weight);
            }
        });
        return totalWeight === 0 ? 0 : (weightedScore * (100 / totalWeight)).toFixed(2);
    };

    const calculateNeededScore = () => {
        if (!targetGrade) return 'Set a target';
        
        const currentGrade = Number(calculateCurrentGrade());
        const remainingWeight = 100 - gradeItems.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
        
        if (remainingWeight <= 0) return 'N/A';
        
        const neededScore = ((targetGrade - currentGrade * (1 - remainingWeight / 100)) /
            (remainingWeight / 100)) * 100;
            
        if (neededScore < 0) return '0';
        if (neededScore > 100) return 'Impossible';
        return neededScore.toFixed(2);
    };

    const getGradeColor = (grade) => {
        const numGrade = Number(grade);
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
                justifyContent: 'flex-start',
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 3,
                px: { xs: 1, sm: 2, md: 3 },
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                    <Typography variant="h4" gutterBottom={false} sx={{ ml: { xs: 0, sm: 1 } }}>
                        Grade Predictor
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    onClick={toggleTheme}
                    color={isDarkMode ? 'secondary' : 'primary'}
                    startIcon={<ThemeIcon />}
                    sx={{
                        minWidth: 150,
                        alignSelf: 'center',
                        mr: { xs: 0, sm: 1 },
                    }}
                >
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
            </Box>

            {error && (
                <Fade in={!!error}>
                    <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>
                </Fade>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            mb: 3,
                            backgroundColor: muiTheme.palette.background.paper,
                        }}
                    >
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                Assessment
                                                <Tooltip title="Enter the name of your assessment (e.g., Midterm, Final, Quiz)">
                                                    <InfoIcon fontSize="small" color="action" />
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                                Weight (%)
                                                <Tooltip title="Enter the percentage this assessment contributes to your final grade">
                                                    <InfoIcon fontSize="small" color="action" />
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                                Score
                                                <Tooltip title="Enter your score on this assessment">
                                                    <InfoIcon fontSize="small" color="action" />
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                                Max Score
                                                <Tooltip title="Enter the maximum possible score for this assessment">
                                                    <InfoIcon fontSize="small" color="action" />
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
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
                                                    autoFocus={gradeItems.length > 1 && item.id === gradeItems[gradeItems.length - 1].id}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.weight}
                                                    onChange={(e) => updateGradeItem(item.id, 'weight', e.target.value)}
                                                    inputProps={{ min: 0, max: 100, step: "any" }}
                                                    variant="outlined"
                                                    placeholder="0-100"
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
                                                    inputProps={{ min: 0, max: item.maxScore, step: "any" }}
                                                    variant="outlined"
                                                    placeholder="Your score"
                                                    sx={{ maxWidth: 120 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={item.maxScore}
                                                    onChange={(e) => updateGradeItem(item.id, 'maxScore', e.target.value)}
                                                    inputProps={{ min: 0, step: "any" }}
                                                    variant="outlined"
                                                    placeholder="Max points"
                                                    sx={{ maxWidth: 120 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title={gradeItems.length === 1 ? "Cannot remove the last assessment" : "Remove this assessment"}>
                                                    <span>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => removeGradeItem(item.id)}
                                                            disabled={gradeItems.length === 1}
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
                            sx={{ mt: 2 }}
                            color="primary"
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
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                }
                            }}
                        >
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>
                                    Current Grade
                                </Typography>
                                <Typography
                                    variant="h4"
                                    color={getGradeColor(calculateCurrentGrade())}
                                >
                                    {calculateCurrentGrade()}%
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            variant="outlined"
                            sx={{
                                backgroundColor: muiTheme.palette.background.paper,
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                }
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
                                    onChange={(e) => setTargetGrade(e.target.value === '' ? '' : Number(e.target.value))}
                                    inputProps={{ min: 0, max: 100, step: "any" }}
                                    variant="outlined"
                                    placeholder="Enter target grade"
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                />
                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    Needed Score:
                                    <Typography
                                        component="span"
                                        color={getGradeColor(calculateNeededScore())}
                                        fontWeight="bold"
                                    >
                                        {calculateNeededScore()}
                                        {calculateNeededScore() !== 'Set a target' &&
                                         calculateNeededScore() !== 'N/A' &&
                                         calculateNeededScore() !== 'Impossible' ? '%' : ''}
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
