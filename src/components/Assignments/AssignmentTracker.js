import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Chip, Grid, } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, CheckCircle as CheckCircleIcon, } from '@mui/icons-material';
import { format } from 'date-fns';
const AssignmentTracker = () => {
    const [assignments, setAssignments] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        priority: 'Medium',
        completed: false,
    });
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setEditingAssignment(null);
        setNewAssignment({
            title: '',
            description: '',
            dueDate: format(new Date(), 'yyyy-MM-dd'),
            priority: 'Medium',
            completed: false,
        });
    };
    const handleSubmit = () => {
        if (editingAssignment) {
            setAssignments(assignments.map((assignment) => assignment.id === editingAssignment.id
                ? { ...assignment, ...newAssignment }
                : assignment));
        }
        else {
            const newId = assignments.length > 0 ? Math.max(...assignments.map((a) => a.id)) + 1 : 1;
            setAssignments([...assignments, { ...newAssignment, id: newId }]);
        }
        handleClose();
    };
    const handleEdit = (assignment) => {
        setEditingAssignment(assignment);
        setNewAssignment({
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate,
            priority: assignment.priority,
            completed: assignment.completed,
        });
        setOpen(true);
    };
    const handleDelete = (id) => {
        setAssignments(assignments.filter((assignment) => assignment.id !== id));
    };
    const toggleComplete = (id) => {
        setAssignments(assignments.map((assignment) => assignment.id === id
            ? { ...assignment, completed: !assignment.completed }
            : assignment));
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'error';
            case 'Medium':
                return 'warning';
            case 'Low':
                return 'success';
            default:
                return 'default';
        }
    };
    const sortedAssignments = [...assignments].sort((a, b) => {
        if (a.completed === b.completed) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return a.completed ? 1 : -1;
    });
    return (_jsxs(Box, { sx: { maxWidth: 800, mx: 'auto', p: 3 }, children: [_jsxs(Grid, { container: true, justifyContent: "space-between", alignItems: "center", sx: { mb: 3 }, children: [_jsx(Grid, { item: true, children: _jsx(Typography, { variant: "h4", children: "Assignment Tracker" }) }), _jsx(Grid, { item: true, children: _jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: handleClickOpen, children: "Add Assignment" }) })] }), _jsx(Paper, { elevation: 3, children: _jsx(List, { children: sortedAssignments.map((assignment) => (_jsx(ListItem, { secondaryAction: _jsxs(Box, { children: [_jsx(IconButton, { edge: "end", "aria-label": "edit", onClick: () => handleEdit(assignment), children: _jsx(EditIcon, {}) }), _jsx(IconButton, { edge: "end", "aria-label": "delete", onClick: () => handleDelete(assignment.id), children: _jsx(DeleteIcon, {}) }), _jsx(IconButton, { edge: "end", "aria-label": "complete", onClick: () => toggleComplete(assignment.id), color: assignment.completed ? 'success' : 'default', children: _jsx(CheckCircleIcon, {}) })] }), sx: {
                            opacity: assignment.completed ? 0.6 : 1,
                            textDecoration: assignment.completed ? 'line-through' : 'none',
                        }, children: _jsx(ListItemText, { primary: assignment.title, secondary: _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: assignment.description }), _jsxs(Box, { sx: { mt: 1 }, children: [_jsx(Chip, { label: `Due: ${format(new Date(assignment.dueDate), 'MMM dd, yyyy')}`, size: "small", sx: { mr: 1 } }), _jsx(Chip, { label: assignment.priority, color: getPriorityColor(assignment.priority), size: "small" })] })] }) }) }, assignment.id))) }) }), _jsxs(Dialog, { open: open, onClose: handleClose, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: editingAssignment ? 'Edit Assignment' : 'New Assignment' }), _jsxs(DialogContent, { children: [_jsx(TextField, { autoFocus: true, margin: "dense", label: "Title", fullWidth: true, value: newAssignment.title, onChange: (e) => setNewAssignment({ ...newAssignment, title: e.target.value }) }), _jsx(TextField, { margin: "dense", label: "Description", fullWidth: true, multiline: true, rows: 3, value: newAssignment.description, onChange: (e) => setNewAssignment({ ...newAssignment, description: e.target.value }) }), _jsx(TextField, { margin: "dense", label: "Due Date", type: "date", fullWidth: true, value: newAssignment.dueDate, onChange: (e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value }) }), _jsxs(FormControl, { fullWidth: true, margin: "dense", children: [_jsx(InputLabel, { children: "Priority" }), _jsxs(Select, { value: newAssignment.priority, label: "Priority", onChange: (e) => setNewAssignment({
                                            ...newAssignment,
                                            priority: e.target.value,
                                        }), children: [_jsx(MenuItem, { value: "High", children: "High" }), _jsx(MenuItem, { value: "Medium", children: "Medium" }), _jsx(MenuItem, { value: "Low", children: "Low" })] })] })] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: handleClose, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, variant: "contained", children: editingAssignment ? 'Save' : 'Add' })] })] })] }));
};
export default AssignmentTracker;
