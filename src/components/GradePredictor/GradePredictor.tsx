import { useState, useCallback, useMemo } from 'react';
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
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Brightness4 as ThemeIcon } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import { GradeItem, GradePredictorProps, GradeField } from './types';

const DEFAULT_MAX_SCORE = 100;
const DEFAULT_TARGET_GRADE = 90;
const MIN_GRADE = 0;
const MAX_GRADE = 100;

const GradePredictor: React.FC<GradePredictorProps> = ({ className }) => {
  const muiTheme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  
  const [gradeItems, setGradeItems] = useState<GradeItem[]>([{
    id: Date.now(),
    name: '',
    weight: 0,
    score: 0,
    maxScore: DEFAULT_MAX_SCORE,
  }]);
  
  const [targetGrade, setTargetGrade] = useState<number>(DEFAULT_TARGET_GRADE);
  const [error, setError] = useState<string>('');

  // Memoized Calculations
  const totalWeight = useMemo(() => 
    gradeItems.reduce((sum, item) => sum + item.weight, 0),
    [gradeItems]
  );

  const currentGrade = useMemo(() => {
    let weightedScore = 0;
    let effectiveWeight = 0;

    gradeItems.forEach(item => {
      if (item.weight <= 0 || item.maxScore <= 0) return;
      
      const percentage = (item.score / item.maxScore) * 100;
      weightedScore += percentage * (item.weight / 100);
      effectiveWeight += item.weight;
    });

    if (effectiveWeight === 0) return 0;
    return Number((weightedScore * (100 / effectiveWeight)).toFixed(2));
  }, [gradeItems]);

  const neededScore = useMemo(() => {
    if (targetGrade < MIN_GRADE || targetGrade > MAX_GRADE) {
      return 'Invalid target';
    }

    const remainingWeight = MAX_GRADE - totalWeight;
    
    if (remainingWeight <= 0) return 'N/A';
    
    const neededScore = ((targetGrade - currentGrade * (1 - remainingWeight / 100)) /
      (remainingWeight / 100));

    if (neededScore < MIN_GRADE) return '0.00';
    if (neededScore > MAX_GRADE) return 'Impossible';
    return neededScore.toFixed(2);
  }, [currentGrade, targetGrade, totalWeight]);

  // Handlers
  const handleAddItem = useCallback(() => {
    const newItem: GradeItem = {
      id: Date.now(),
      name: '',
      weight: 0,
      score: 0,
      maxScore: DEFAULT_MAX_SCORE,
    };
    setGradeItems(prev => [...prev, newItem]);
    setError('');
  }, []);

  const handleRemoveItem = useCallback((id: number) => {
    if (gradeItems.length <= 1) return;
    setGradeItems(prev => prev.filter(item => item.id !== id));
    setError('');
  }, [gradeItems.length]);

  const validateInput = useCallback((
    field: GradeField,
    value: number,
    item?: GradeItem
  ): string | null => {
    switch (field) {
      case 'weight':
        if (value < MIN_GRADE || value > MAX_GRADE) {
          return 'Weight must be between 0 and 100';
        }
        const newTotalWeight = totalWeight - (item?.weight || 0) + value;
        if (newTotalWeight > MAX_GRADE) {
          return 'Total weight cannot exceed 100%';
        }
        break;
      case 'score':
        if (item && (value < MIN_GRADE || value > item.maxScore)) {
          return `Score must be between 0 and ${item.maxScore}`;
        }
        break;
      case 'maxScore':
        if (value <= MIN_GRADE) {
          return 'Max score must be greater than 0';
        }
        break;
    }
    return null;
  }, [totalWeight]);

  const handleUpdateItem = useCallback((
    id: number,
    field: GradeField,
    value: string | number
  ) => {
    setGradeItems(prev => {
      const itemIndex = prev.findIndex(item => item.id === id);
      if (itemIndex === -1) return prev;

      const newItems = [...prev];
      const item = { ...newItems[itemIndex] };

      if (field === 'name') {
        item.name = value as string;
      } else {
        const numValue = typeof value === 'number' ? value : Number(value);
        
        if (isNaN(numValue)) {
          setError(`Please enter a valid number for ${field}`);
          return prev;
        }

        const validationError = validateInput(field, numValue, item);
        if (validationError) {
          setError(validationError);
          return prev;
        }

        item[field] = numValue;
        
        // Adjust score if maxScore changes
        if (field === 'maxScore' && item.score > numValue) {
          item.score = numValue;
        }
      }

      newItems[itemIndex] = item;
      setError('');
      return newItems;
    });
  }, [validateInput]);

  const getGradeColor = useCallback((grade: number): 'success.main' | 'warning.main' | 'error.main' => {
    if (grade >= 90) return 'success.main';
    if (grade >= 70) return 'warning.main';
    return 'error.main';
  }, []);

  return (
    <Box 
      sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        p: 3,
        backgroundColor: muiTheme.palette.background.default,
        minHeight: '100vh',
      }}
      className={className}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap', 
        gap: 2 
      }}>
        <Typography variant="h4">Grade Predictor</Typography>
        <Button 
          variant="outlined" 
          onClick={toggleTheme}
          color={isDarkMode ? 'secondary' : 'primary'}
          startIcon={<ThemeIcon />}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3, overflowX: 'auto' }}>
            {error && (
              <Typography color="error" sx={{ mb: 2 }} variant="body2">
                {error}
              </Typography>
            )}
            
            <TableContainer sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: { xs: '120px', sm: '150px' } }}>Assessment</TableCell>
                    <TableCell align="right" sx={{ minWidth: '100px' }}>Weight (%)</TableCell>
                    <TableCell align="right" sx={{ minWidth: '100px' }}>Score</TableCell>
                    <TableCell align="right" sx={{ minWidth: '100px' }}>Max Score</TableCell>
                    <TableCell align="right" sx={{ width: '60px' }}>Actions</TableCell>
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
                          onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                          placeholder="Enter assessment name"
                          aria-label="Assessment name"
                          sx={{ 
                            minWidth: { xs: '120px', sm: '150px' },
                            '& .MuiInputBase-root': {
                              height: '36px'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Weight must be between 0 and 100">
                          <TextField
                            size="small"
                            value={item.weight}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^\d.]/g, '');
                              handleUpdateItem(item.id, 'weight', value);
                            }}
                            inputProps={{
                              inputMode: 'decimal',
                              pattern: '[0-9]*\\.?[0-9]*',
                              style: { textAlign: 'right' }
                            }}
                            placeholder="0-100"
                            aria-label="Weight"
                            sx={{ 
                              width: '80px',
                              '& .MuiInputBase-root': {
                                height: '36px'
                              },
                              '& .MuiInputBase-input': {
                                px: 1
                              }
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={`Score must be between 0 and ${item.maxScore}`}>
                          <TextField
                            size="small"
                            value={item.score}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^\d.]/g, '');
                              handleUpdateItem(item.id, 'score', value);
                            }}
                            inputProps={{
                              inputMode: 'decimal',
                              pattern: '[0-9]*\\.?[0-9]*',
                              style: { textAlign: 'right' }
                            }}
                            placeholder={`0-${item.maxScore}`}
                            aria-label="Score"
                            sx={{ 
                              width: '80px',
                              '& .MuiInputBase-root': {
                                height: '36px'
                              },
                              '& .MuiInputBase-input': {
                                px: 1
                              }
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Max score must be greater than 0">
                          <TextField
                            size="small"
                            value={item.maxScore}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^\d.]/g, '');
                              handleUpdateItem(item.id, 'maxScore', value);
                            }}
                            inputProps={{
                              inputMode: 'decimal',
                              pattern: '[0-9]*\\.?[0-9]*',
                              style: { textAlign: 'right' }
                            }}
                            placeholder="Max points"
                            aria-label="Max score"
                            sx={{ 
                              width: '80px',
                              '& .MuiInputBase-root': {
                                height: '36px'
                              },
                              '& .MuiInputBase-input': {
                                px: 1
                              }
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={gradeItems.length === 1}
                          aria-label="Remove assessment"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={handleAddItem}
              sx={{ mt: 2 }}
              color="primary"
              aria-label="Add assessment"
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
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Current Grade
                </Typography>
                <Typography 
                  variant="h4" 
                  color={getGradeColor(currentGrade)}
                >
                  {currentGrade}%
                </Typography>
              </CardContent>
            </Card>

            <Card 
              variant="outlined"
              sx={{ 
                backgroundColor: muiTheme.palette.background.paper,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Target Grade
                </Typography>
                <TextField
                  fullWidth
                  value={targetGrade}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d.]/g, '');
                    const numValue = Number(value);
                    if (!value || (numValue >= MIN_GRADE && numValue <= MAX_GRADE)) {
                      setTargetGrade(numValue);
                      setError('');
                    }
                  }}
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '[0-9]*\\.?[0-9]*',
                    style: { textAlign: 'right' }
                  }}
                  placeholder="Target grade (0-100)"
                  aria-label="Target grade"
                />
              </CardContent>
            </Card>

            <Card 
              variant="outlined"
              sx={{ 
                backgroundColor: muiTheme.palette.background.paper,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Needed Score for Remaining Work
                </Typography>
                <Typography variant="h4" color={getGradeColor(Number(neededScore) || 0)}>
                  {neededScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Remaining Weight: {(MAX_GRADE - totalWeight).toFixed(1)}%
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
