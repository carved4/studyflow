import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, Card, CardContent, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Stack, Chip, Divider, Tooltip, Alert, } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, TrendingUp as TrendingUpIcon, AccessTime as AccessTimeIcon, Book as BookIcon, CalendarToday as CalendarIcon, } from '@mui/icons-material';
import { format } from 'date-fns';
const StudyLogger = () => {
    const [sessions, setSessions] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [newSession, setNewSession] = useState({
        subject: '',
        duration: 30,
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
        productivity: 'Medium',
    });
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setEditingSession(null);
        setNewSession({
            subject: '',
            duration: 30,
            date: format(new Date(), 'yyyy-MM-dd'),
            notes: '',
            productivity: 'Medium',
        });
    };
    const handleSubmit = () => {
        if (editingSession) {
            setSessions(sessions.map((session) => session.id === editingSession.id
                ? { ...session, ...newSession }
                : session));
        }
        else {
            const newId = sessions.length > 0 ? Math.max(...sessions.map((s) => s.id)) + 1 : 1;
            setSessions([...sessions, { ...newSession, id: newId }]);
        }
        handleClose();
    };
    const handleEdit = (session) => {
        setEditingSession(session);
        setNewSession({
            subject: session.subject,
            duration: session.duration,
            date: session.date,
            notes: session.notes,
            productivity: session.productivity,
        });
        setOpen(true);
    };
    const handleDelete = (id) => {
        setSessions(sessions.filter((session) => session.id !== id));
    };
    const calculateTotalTime = () => {
        return sessions.reduce((total, session) => total + session.duration, 0);
    };
    const calculateAverageProductivity = () => {
        if (sessions.length === 0)
            return 'N/A';
        const productivityMap = { High: 3, Medium: 2, Low: 1 };
        const total = sessions.reduce((sum, session) => sum + productivityMap[session.productivity], 0);
        const average = total / sessions.length;
        if (average >= 2.5)
            return 'High';
        if (average >= 1.5)
            return 'Medium';
        return 'Low';
    };
    const getMostStudiedSubject = () => {
        if (sessions.length === 0)
            return 'N/A';
        const subjectMap = sessions.reduce((map, session) => {
            map[session.subject] = (map[session.subject] || 0) + session.duration;
            return map;
        }, {});
        return Object.entries(subjectMap).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    };
    const getProductivityColor = (productivity) => {
        switch (productivity) {
            case 'High':
                return 'success';
            case 'Medium':
                return 'warning';
            case 'Low':
                return 'error';
            default:
                return 'default';
        }
    };
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours === 0)
            return `${minutes} min`;
        return `${hours}h ${remainingMinutes}m`;
    };
    return (_jsxs(Box, { sx: { maxWidth: 1200, mx: 'auto', p: 3 }, children: [_jsxs(Paper, { elevation: 3, sx: { p: 3, mb: 3 }, children: [_jsxs(Grid, { container: true, justifyContent: "space-between", alignItems: "center", sx: { mb: 3 }, children: [_jsxs(Grid, { item: true, children: [_jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold', color: 'primary.main' }, children: "Study Logger" }), _jsx(Typography, { variant: "subtitle1", color: "text.secondary", children: "Track and analyze your study sessions" })] }), _jsx(Grid, { item: true, children: _jsx(Button, { variant: "contained", size: "large", startIcon: _jsx(AddIcon, {}), onClick: handleClickOpen, sx: {
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        backgroundColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        }
                                    }, children: "Log Study Session" }) })] }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: sessions.length === 0 ? (_jsx(Alert, { severity: "info", sx: {
                                        borderRadius: 2,
                                        backgroundColor: 'background.paper'
                                    }, children: "No study sessions logged yet. Click \"Log Study Session\" to get started!" })) : (_jsx(Paper, { elevation: 2, sx: {
                                        borderRadius: 2,
                                        overflow: 'hidden'
                                    }, children: _jsx(List, { children: sessions.map((session, index) => (_jsxs(_Fragment, { children: [index > 0 && _jsx(Divider, {}), _jsx(ListItem, { sx: {
                                                        py: 2,
                                                        '&:hover': {
                                                            backgroundColor: 'action.hover',
                                                        },
                                                    }, secondaryAction: _jsxs(Box, { children: [_jsx(Tooltip, { title: "Edit session", children: _jsx(IconButton, { edge: "end", "aria-label": "edit", onClick: () => handleEdit(session), sx: { mr: 1 }, children: _jsx(EditIcon, {}) }) }), _jsx(Tooltip, { title: "Delete session", children: _jsx(IconButton, { edge: "end", "aria-label": "delete", onClick: () => handleDelete(session.id), color: "error", children: _jsx(DeleteIcon, {}) }) })] }), children: _jsx(ListItemText, { primary: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 1 }, children: [_jsx(Typography, { variant: "h6", component: "span", children: session.subject }), _jsx(Chip, { label: session.productivity, color: getProductivityColor(session.productivity), size: "small", sx: { ml: 2 } })] }), secondary: _jsxs(Grid, { container: true, spacing: 2, alignItems: "center", children: [_jsx(Grid, { item: true, children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(CalendarIcon, { sx: { fontSize: 'small', mr: 0.5 } }), _jsx(Typography, { variant: "body2", children: format(new Date(session.date), 'MMM dd, yyyy') })] }) }), _jsx(Grid, { item: true, children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(AccessTimeIcon, { sx: { fontSize: 'small', mr: 0.5 } }), _jsx(Typography, { variant: "body2", children: formatDuration(session.duration) })] }) }), session.notes && (_jsx(Grid, { item: true, xs: 12, children: _jsx(Typography, { variant: "body2", sx: {
                                                                            mt: 1,
                                                                            color: 'text.secondary',
                                                                            fontStyle: 'italic'
                                                                        }, children: session.notes }) }))] }) }) }, session.id)] }))) }) })) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Stack, { spacing: 2, children: [_jsx(Card, { sx: { borderRadius: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(AccessTimeIcon, { sx: { mr: 1, color: 'primary.main' } }), _jsx(Typography, { variant: "h6", color: "text.primary", children: "Total Study Time" })] }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: formatDuration(calculateTotalTime()) })] }) }), _jsx(Card, { sx: { borderRadius: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(TrendingUpIcon, { sx: { mr: 1, color: 'primary.main' } }), _jsx(Typography, { variant: "h6", color: "text.primary", children: "Average Productivity" })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: calculateAverageProductivity() }), _jsx(Chip, { label: calculateAverageProductivity(), color: getProductivityColor(calculateAverageProductivity()), sx: { ml: 2 } })] })] }) }), _jsx(Card, { sx: { borderRadius: 2 }, children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(BookIcon, { sx: { mr: 1, color: 'primary.main' } }), _jsx(Typography, { variant: "h6", color: "text.primary", children: "Most Studied Subject" })] }), _jsx(Typography, { variant: "h4", sx: { fontWeight: 'bold' }, children: getMostStudiedSubject() })] }) })] }) })] })] }), _jsxs(Dialog, { open: open, onClose: handleClose, maxWidth: "sm", fullWidth: true, PaperProps: {
                    sx: { borderRadius: 2 }
                }, children: [_jsx(DialogTitle, { sx: { pb: 1 }, children: _jsx(Typography, { variant: "h5", component: "div", sx: { fontWeight: 'bold' }, children: editingSession ? 'Edit Study Session' : 'New Study Session' }) }), _jsxs(DialogContent, { children: [_jsx(TextField, { autoFocus: true, margin: "dense", label: "Subject", fullWidth: true, value: newSession.subject, onChange: (e) => setNewSession({ ...newSession, subject: e.target.value }), sx: { mt: 2 } }), _jsx(TextField, { margin: "dense", label: "Duration (minutes)", type: "number", fullWidth: true, value: newSession.duration, onChange: (e) => setNewSession({ ...newSession, duration: Number(e.target.value) }) }), _jsx(TextField, { margin: "dense", label: "Date", type: "date", fullWidth: true, value: newSession.date, onChange: (e) => setNewSession({ ...newSession, date: e.target.value }), InputLabelProps: {
                                    shrink: true,
                                } }), _jsx(TextField, { margin: "dense", label: "Notes", fullWidth: true, multiline: true, rows: 3, value: newSession.notes, onChange: (e) => setNewSession({ ...newSession, notes: e.target.value }) }), _jsxs(FormControl, { fullWidth: true, margin: "dense", children: [_jsx(InputLabel, { children: "Productivity" }), _jsxs(Select, { value: newSession.productivity, label: "Productivity", onChange: (e) => setNewSession({
                                            ...newSession,
                                            productivity: e.target.value,
                                        }), children: [_jsx(MenuItem, { value: "High", children: "High" }), _jsx(MenuItem, { value: "Medium", children: "Medium" }), _jsx(MenuItem, { value: "Low", children: "Low" })] })] })] }), _jsxs(DialogActions, { sx: { p: 2 }, children: [_jsx(Button, { onClick: handleClose, variant: "outlined", sx: { borderRadius: 2 }, children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, variant: "contained", sx: { borderRadius: 2 }, children: editingSession ? 'Save Changes' : 'Add Session' })] })] })] }));
};
export default StudyLogger;
