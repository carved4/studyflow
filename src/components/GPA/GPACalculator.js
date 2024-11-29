import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, IconButton, Grid, Select, MenuItem, FormControl, InputLabel, Card, CardContent, } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
const gradePoints = {
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
    const [courses, setCourses] = useState([
        { id: 1, name: '', credits: 0, grade: 'A' },
    ]);
    const addCourse = () => {
        const newCourse = {
            id: courses.length + 1,
            name: '',
            credits: 0,
            grade: 'A',
        };
        setCourses([...courses, newCourse]);
    };
    const removeCourse = (id) => {
        if (courses.length > 1) {
            setCourses(courses.filter((course) => course.id !== id));
        }
    };
    const updateCourse = (id, field, value) => {
        setCourses(courses.map((course) => course.id === id ? { ...course, [field]: value } : course));
    };
    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;
        courses.forEach((course) => {
            const points = gradePoints[course.grade] * course.credits;
            totalPoints += points;
            totalCredits += course.credits;
        });
        return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
    };
    return (_jsxs(Box, { sx: { maxWidth: 800, mx: 'auto', p: 3 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "GPA Calculator" }), _jsxs(Paper, { elevation: 3, sx: { p: 3, mb: 3 }, children: [courses.map((course) => (_jsxs(Grid, { container: true, spacing: 2, sx: { mb: 2 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(TextField, { fullWidth: true, label: "Course Name", value: course.name, onChange: (e) => updateCourse(course.id, 'name', e.target.value) }) }), _jsx(Grid, { item: true, xs: 12, sm: 3, children: _jsx(TextField, { fullWidth: true, type: "number", label: "Credits", value: course.credits, onChange: (e) => updateCourse(course.id, 'credits', Number(e.target.value)) }) }), _jsx(Grid, { item: true, xs: 12, sm: 3, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Grade" }), _jsx(Select, { value: course.grade, label: "Grade", onChange: (e) => updateCourse(course.id, 'grade', e.target.value), children: Object.keys(gradePoints).map((grade) => (_jsx(MenuItem, { value: grade, children: grade }, grade))) })] }) }), _jsx(Grid, { item: true, xs: 12, sm: 2, children: _jsx(IconButton, { color: "error", onClick: () => removeCourse(course.id), disabled: courses.length === 1, children: _jsx(DeleteIcon, {}) }) })] }, course.id))), _jsx(Button, { startIcon: _jsx(AddIcon, {}), variant: "outlined", onClick: addCourse, sx: { mt: 2 }, children: "Add Course" })] }), _jsx(Card, { elevation: 3, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h5", gutterBottom: true, children: "Calculated GPA" }), _jsx(Typography, { variant: "h3", color: "primary", children: calculateGPA() })] }) })] }));
};
export default GPACalculator;
