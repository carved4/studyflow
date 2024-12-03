import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  MenuItem,
  Fade,
  Slide,
  Divider,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Utility function to get priority color
const getPriorityColor = (priority: Assignment['priority']): 'error' | 'warning' | 'success' | 'default' => {
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

// Utility function to format due date
const formatDueDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Utility function to get most urgent assignment
const getMostUrgentAssignment = (assignments: Assignment[]): string => {
  if (assignments.length === 0) return 'N/A';
  
  const incompleteAssignments = assignments.filter(a => !a.completed);
  
  if (incompleteAssignments.length === 0) return 'No urgent assignments';
  
  return incompleteAssignments.reduce((mostUrgent, current) => 
    new Date(current.dueDate) < new Date(mostUrgent.dueDate) ? current : mostUrgent
  ).title;
};

// Utility function to get assignment completion rate
const getCompletionRate = (assignments: Assignment[]): string => {
  if (assignments.length === 0) return '0%';
  
  const completedCount = assignments.filter(a => a.completed).length;
  const completionRate = (completedCount / assignments.length) * 100;
  
  return `${Math.round(completionRate)}%`;
};

const AssignmentTracker: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [open, setOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState<Assignment | null>(null);
  const [newAssignment, setNewAssignment] = useState<Omit<Assignment, 'id'>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    completed: false,
  });

  const handleClickOpen = () => {
    setEditAssignment(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditAssignment(null);
    setNewAssignment({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      completed: false,
    });
  };

  const handleSave = () => {
    if (editAssignment) {
      // Update existing assignment
      setAssignments(prev => 
        prev.map(a => a.id === editAssignment.id ? { ...a, ...newAssignment } : a)
      );
    } else {
      // Add new assignment
      setAssignments(prev => [
        ...prev, 
        { 
          ...newAssignment, 
          id: prev.length > 0 ? Math.max(...prev.map(a => a.id)) + 1 : 1,
          completed: false 
        }
      ]);
    }
    handleClose();
  };

  const handleEdit = (assignment: Assignment) => {
    setEditAssignment(assignment);
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
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleComplete = (id: number) => {
    setAssignments(prev => 
      prev.map(a => 
        a.id === id ? { ...a, completed: !a.completed } : a
      )
    );
  };

  const sortedAssignments = useMemo(() => {
    return [...assignments].sort((a, b) => {
      // Sort by completion status (incomplete first), then by due date
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [assignments]);

  return (
    <Box className="app-container" sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Assignment Tracker
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage and track your academic assignments
          </Typography>
        </Grid>
        <Grid item>
          <Button
            className="add-assignment-btn"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add Assignment
          </Button>
        </Grid>
      </Grid>

      {assignments.length > 0 ? (
        <Fade in={true}>
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
            }}
          >
            <List>
              {sortedAssignments.map((assignment, index) => (
                <React.Fragment key={assignment.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEdit(assignment)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(assignment.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                    sx={{
                      py: 2,
                      opacity: assignment.completed ? 0.6 : 1,
                      transition: 'opacity 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    <IconButton
                      onClick={() => handleToggleComplete(assignment.id)}
                      sx={{ mr: 2 }}
                    >
                      {assignment.completed ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </IconButton>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            textDecoration: assignment.completed ? 'line-through' : 'none',
                            fontWeight: assignment.completed ? 400 : 500,
                          }}
                        >
                          {assignment.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                            Due: {formatDueDate(assignment.dueDate)}
                          </Typography>
                          <Chip
                            label={assignment.priority}
                            color={getPriorityColor(assignment.priority)}
                            size="small"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Fade>
      ) : (
        <Fade in={true}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No assignments yet. Click "Add Assignment" to get started!
            </Typography>
          </Paper>
        </Fade>
      )}

      {/* Statistics Section */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.primary">
                  Completion Rate
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {getCompletionRate(assignments)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.primary">
                  Most Urgent Assignment
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {getMostUrgentAssignment(assignments)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.primary">
                  Priority Distribution
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {(['High', 'Medium', 'Low'] as const).map((priority) => {
                  const count = assignments.filter(a => a.priority === priority).length;
                  return (
                    <Chip
                      key={priority}
                      label={`${priority}: ${count}`}
                      color={getPriorityColor(priority)}
                      size="small"
                    />
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="assignment-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            minWidth: 400,
          }
        }}
      >
        <DialogTitle>
          {editAssignment ? 'Edit Assignment' : 'Add New Assignment'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newAssignment.description}
            onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={newAssignment.dueDate}
            onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
            required
          />
          <TextField
            select
            margin="dense"
            label="Priority"
            fullWidth
            variant="outlined"
            value={newAssignment.priority}
            onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
            required
          >
            {['High', 'Medium', 'Low'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editAssignment ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignmentTracker;
