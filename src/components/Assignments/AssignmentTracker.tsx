import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

const AssignmentTracker = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [open, setOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [newAssignment, setNewAssignment] = useState<Omit<Assignment, 'id'>>({
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
      setAssignments(
        assignments.map((assignment) =>
          assignment.id === editingAssignment.id
            ? { ...assignment, ...newAssignment }
            : assignment
        )
      );
    } else {
      const newId = assignments.length > 0 ? Math.max(...assignments.map((a) => a.id)) + 1 : 1;
      setAssignments([...assignments, { ...newAssignment, id: newId }]);
    }
    handleClose();
  };

  const handleEdit = (assignment: Assignment) => {
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

  const handleDelete = (id: number) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
  };

  const toggleComplete = (id: number) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === id
          ? { ...assignment, completed: !assignment.completed }
          : assignment
      )
    );
  };

  const getPriorityColor = (priority: string) => {
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

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4">Assignment Tracker</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add Assignment
          </Button>
        </Grid>
      </Grid>

      <Paper elevation={3}>
        <List>
          {sortedAssignments.map((assignment) => (
            <ListItem
              key={assignment.id}
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEdit(assignment)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(assignment.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="complete"
                    onClick={() => toggleComplete(assignment.id)}
                    color={assignment.completed ? 'success' : 'default'}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Box>
              }
              sx={{
                opacity: assignment.completed ? 0.6 : 1,
                textDecoration: assignment.completed ? 'line-through' : 'none',
              }}
            >
              <ListItemText
                primary={assignment.title}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {assignment.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`Due: ${format(new Date(assignment.dueDate), 'MMM dd, yyyy')}`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={assignment.priority}
                        color={getPriorityColor(assignment.priority)}
                        size="small"
                      />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAssignment ? 'Edit Assignment' : 'New Assignment'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newAssignment.title}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newAssignment.description}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            value={newAssignment.dueDate}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, dueDate: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={newAssignment.priority}
              label="Priority"
              onChange={(e) =>
                setNewAssignment({
                  ...newAssignment,
                  priority: e.target.value as 'High' | 'Medium' | 'Low',
                })
              }
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAssignment ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignmentTracker;
