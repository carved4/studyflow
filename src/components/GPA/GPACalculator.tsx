import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Course {
  id: number;
  name: string;
  credits: number | string;
  grade: string;
}

const gradePoints: { [key: string]: number } = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

const GPACalculator = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', credits: '', grade: '' },
  ]);

  const addCourse = () => {
    const newCourse: Course = {
      id: courses.length + 1,
      name: '',
      credits: '',
      grade: '',
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const updateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => {
      if (course.id === id) {
        if (field === 'credits') {
          // Convert empty string to 0 for calculations, but keep as string in state
          return { ...course, [field]: value };
        }
        return { ...course, [field]: value };
      }
      return course;
    }));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      if (course.grade && course.credits) {
        const credits = Number(course.credits) || 0;
        const points = gradePoints[course.grade] * credits;
        if (!isNaN(points)) {
          totalPoints += points;
          totalCredits += credits;
        }
      }
    });

    return totalCredits === 0 ? '0.00' : (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        GPA Calculator
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        {courses.map((course) => (
          <Grid container spacing={2} key={course.id} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                variant="outlined"
                placeholder="Enter course name"
                autoFocus={courses.length > 1 && course.id === courses[courses.length - 1].id}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                type="number"
                size="small"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                inputProps={{ min: 0, step: "any" }}
                variant="outlined"
                placeholder="Credits"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel id={`grade-label-${course.id}`}>Grade</InputLabel>
                <Select
                  labelId={`grade-label-${course.id}`}
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                  label="Grade"
                  displayEmpty
                >
                  <MenuItem value="" disabled><em>Select grade</em></MenuItem>
                  {Object.keys(gradePoints).map((grade) => (
                    <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <IconButton
                color="error"
                onClick={() => removeCourse(course.id)}
                disabled={courses.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={addCourse}
          sx={{ mt: 2 }}
        >
          Add Course
        </Button>
      </Paper>
      <Card>
        <CardContent>
          <Typography color="text.secondary" gutterBottom>
            Current GPA
          </Typography>
          <Typography variant="h4">
            {calculateGPA()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GPACalculator;
