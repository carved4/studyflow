import { useState } from 'react';
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
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Brightness4 as ThemeIcon } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';

interface GradeItem {
  id: number;
  name: string;
  weight: number;
  score: number;
  maxScore: number;
}

const GradePredictor = () => {
  const muiTheme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const [gradeItems, setGradeItems] = useState<GradeItem[]>([
    { id: 1, name: '', weight: 0, score: 0, maxScore: 100 },
  ]);
  const [targetGrade, setTargetGrade] = useState<number>(90);

  const addGradeItem = () => {
    const newItem: GradeItem = {
      id: gradeItems.length + 1,
      name: '',
      weight: 0,
      score: 0,
      maxScore: 100,
    };
    setGradeItems([...gradeItems, newItem]);
  };

  const removeGradeItem = (id: number) => {
    if (gradeItems.length > 1) {
      setGradeItems(gradeItems.filter((item) => item.id !== id));
    }
  };

  const updateGradeItem = (
    id: number,
    field: keyof GradeItem,
    value: string | number
  ) => {
    setGradeItems(
      gradeItems.map((item) =>
        item.id === id ? { ...item, [field]: Number(value) } : item
      )
    );
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

    if (remainingWeight <= 0) return 'N/A';

    const neededScore =
      ((targetGrade - currentGrade * (1 - remainingWeight / 100)) /
        (remainingWeight / 100)) *
      100;

    return neededScore < 0 ? '0' : neededScore > 100 ? 'Impossible' : neededScore.toFixed(2);
  };

  return (
    <Box 
      sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        p: 3,
        backgroundColor: muiTheme.palette.background.default,
        minHeight: '100vh',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap', 
          gap: 3, 
          px: { xs: 1, sm: 2, md: 3 }, 
        }}
      >
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
                          onChange={(e) =>
                            updateGradeItem(item.id, 'name', e.target.value)
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          value={item.weight}
                          onChange={(e) =>
                            updateGradeItem(item.id, 'weight', e.target.value)
                          }
                          inputProps={{ min: 0, max: 100 }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          value={item.score}
                          onChange={(e) =>
                            updateGradeItem(item.id, 'score', e.target.value)
                          }
                          inputProps={{ min: 0 }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          value={item.maxScore}
                          onChange={(e) =>
                            updateGradeItem(item.id, 'maxScore', e.target.value)
                          }
                          inputProps={{ min: 0 }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => removeGradeItem(item.id)}
                          disabled={gradeItems.length === 1}
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
                  color={
                    Number(calculateCurrentGrade()) >= 90 
                      ? 'success.main' 
                      : Number(calculateCurrentGrade()) >= 70 
                      ? 'warning.main' 
                      : 'error.main'
                  }
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
                  onChange={(e) => setTargetGrade(Number(e.target.value))}
                  inputProps={{ min: 0, max: 100 }}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Typography color="text.secondary">
                  Needed Score: {calculateNeededScore()}%
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
