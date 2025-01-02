import React, { useState, useCallback, useMemo } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Brightness4 as ThemeIcon } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import { GradeItem, GradePredictorProps, GradeField } from './types';
import { useFirebaseState } from '../../hooks/useFirebaseState';

const DEFAULT_MAX_SCORE = 100;
const DEFAULT_TARGET_GRADE = 90;
const MIN_GRADE = 0;
const MAX_GRADE = 100;

interface Assignment {
  id: number;
  name: string;
  weight: number;
  score: number;
  maxScore: number;
}

const GradePredictor: React.FC<GradePredictorProps> = ({ className }) => {
  const muiTheme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  
  const [assignments, setAssignments, isLoading, error] = useFirebaseState<Assignment[]>('grade-predictor', [{
    id: Date.now(),
    name: '',
    weight: 0,
    score: 0,
    maxScore: DEFAULT_MAX_SCORE,
  }]);
  
  const [targetGrade, setTargetGrade] = useState<number>(DEFAULT_TARGET_GRADE);

  const addAssignment = useCallback(() => {
    const newId = assignments.length > 0 ? Math.max(...assignments.map(a => a.id)) + 1 : 1;
    setAssignments([...assignments, {
      id: newId,
      name: '',
      weight: 0,
      score: 0,
      maxScore: DEFAULT_MAX_SCORE,
    }]);
  }, [assignments]);

  const updateAssignment = useCallback((id: number, field: keyof Assignment, value: number | string) => {
    setAssignments(assignments.map(assignment =>
      assignment.id === id ? { ...assignment, [field]: value } : assignment
    ));
  }, [assignments]);

  const deleteAssignment = useCallback((id: number) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  }, [assignments]);

  const calculateCurrentGrade = useMemo(() => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    assignments.forEach(assignment => {
      const weight = Number(assignment.weight);
      const score = Number(assignment.score);
      const maxScore = Number(assignment.maxScore);

      if (weight > 0 && maxScore > 0) {
        const percentage = (score / maxScore) * 100;
        totalWeightedScore += percentage * (weight / 100);
        totalWeight += weight;
      }
    });

    // Return 0 if no valid assignments, otherwise calculate weighted average
    return totalWeight === 0 ? 0 : (totalWeightedScore / totalWeight) * totalWeight;
  }, [assignments]);

  const calculateNeededScore = useMemo(() => {
    if (targetGrade < MIN_GRADE || targetGrade > MAX_GRADE) {
      return 'Invalid target';
    }

    const totalWeight = assignments.reduce((sum, assignment) => sum + Number(assignment.weight), 0);
    const remainingWeight = 100 - totalWeight;
    
    if (remainingWeight <= 0) return 'N/A';
    
    const currentWeightedGrade = calculateCurrentGrade * (totalWeight / 100);
    const neededScore = ((targetGrade - currentWeightedGrade) / remainingWeight) * 100;

    if (neededScore < MIN_GRADE) return '0.00';
    if (neededScore > MAX_GRADE) return 'Impossible';
    return neededScore.toFixed(2);
  }, [calculateCurrentGrade, targetGrade, assignments]);

  const getGradeColor = useCallback((grade: number): 'success.main' | 'warning.main' | 'error.main' => {
    if (grade >= 90) return 'success.main';
    if (grade >= 70) return 'warning.main';
    return 'error.main';
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading grade predictor data: {error.message}
      </Alert>
    );
  }

  return (
    <div className={`grade-predictor app-container ${className}`}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap', 
          gap: 2 
        }}>
          <Typography variant="h4">Grade Predictor</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Target Grade"
              type="number"
              size="small"
              value={targetGrade}
              onChange={(e) => {
                const value = Math.min(Math.max(Number(e.target.value), MIN_GRADE), MAX_GRADE);
                setTargetGrade(value);
              }}
              sx={{ width: 120 }}
            />
            <Button 
              variant="outlined" 
              onClick={toggleTheme}
              color={isDarkMode ? 'secondary' : 'primary'}
              startIcon={<ThemeIcon />}
            >
              {isDarkMode ? 'Light' : 'Dark'}
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Assessments</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addAssignment}
                    size="small"
                  >
                    Add Assessment
                  </Button>
                </Box>
                
                <TableContainer>
                  <Table size="small" sx={{ '& .MuiTableCell-root': { py: 1 } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Assessment</TableCell>
                        <TableCell align="center">Weight (%)</TableCell>
                        <TableCell align="center">Score</TableCell>
                        <TableCell align="center">Max Score</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell sx={{ width: '30%' }}>
                            <TextField
                              fullWidth
                              size="small"
                              value={assignment.name}
                              onChange={(e) => updateAssignment(assignment.id, 'name', e.target.value)}
                              placeholder="Enter name"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ width: '20%' }}>
                            <TextField
                              size="small"
                              type="number"
                              value={assignment.weight}
                              onChange={(e) => {
                                const value = Math.min(Math.max(Number(e.target.value), 0), 100);
                                updateAssignment(assignment.id, 'weight', value);
                              }}
                              inputProps={{ min: 0, max: 100 }}
                              sx={{ width: '80px' }}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ width: '20%' }}>
                            <TextField
                              size="small"
                              type="number"
                              value={assignment.score}
                              onChange={(e) => {
                                const value = Math.max(Number(e.target.value), 0);
                                updateAssignment(assignment.id, 'score', value);
                              }}
                              inputProps={{ min: 0 }}
                              sx={{ width: '80px' }}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ width: '20%' }}>
                            <TextField
                              size="small"
                              type="number"
                              value={assignment.maxScore}
                              onChange={(e) => {
                                const value = Math.max(Number(e.target.value), 1);
                                updateAssignment(assignment.id, 'maxScore', value);
                              }}
                              inputProps={{ min: 1 }}
                              sx={{ width: '80px' }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ width: '10%' }}>
                            <IconButton
                              onClick={() => deleteAssignment(assignment.id)}
                              size="small"
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Current Grade
                        </Typography>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            color: getGradeColor(calculateCurrentGrade),
                            fontWeight: 'bold'
                          }}
                        >
                          {calculateCurrentGrade.toFixed(2)}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Target Grade
                        </Typography>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            color: getGradeColor(targetGrade),
                            fontWeight: 'bold'
                          }}
                        >
                          {targetGrade}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Needed Score
                        </Typography>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            color: calculateNeededScore === 'Impossible' ? 'error.main' : 'text.primary',
                            fontWeight: 'bold'
                          }}
                        >
                          {calculateNeededScore === 'Impossible' ? '—' : 
                           calculateNeededScore === 'N/A' ? '—' :
                           calculateNeededScore === 'Invalid target' ? '—' :
                           `${calculateNeededScore}%`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default GradePredictor;
