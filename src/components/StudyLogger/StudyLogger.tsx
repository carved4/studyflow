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
  Alert,
  Divider,
  Chip,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface StudySession {
  id: number;
  subject: string;
  duration: number;
  date: string;
  notes: string;
  productivity: 'High' | 'Medium' | 'Low';
}

// Utility function to format duration
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
};

// Utility function to get productivity color
const getProductivityColor = (productivity: string): 'success' | 'warning' | 'error' | 'default' => {
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

// Utility function to get most studied subject
const getMostStudiedSubject = (sessions: StudySession[]): string => {
  if (sessions.length === 0) return 'N/A';
  
  const subjectCounts = sessions.reduce((acc, session) => {
    acc[session.subject] = (acc[session.subject] || 0) + session.duration;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(subjectCounts).reduce((a, b) => 
    b[1] > a[1] ? b : a
  )[0];
};

// Utility function to get average productivity
const getAverageProductivity = (sessions: StudySession[]): string => {
  if (sessions.length === 0) return 'N/A';
  
  const productivityMap: Record<StudySession['productivity'], number> = { 
    High: 3, 
    Medium: 2, 
    Low: 1 
  };
  
  const total = sessions.reduce(
    (sum, session) => sum + productivityMap[session.productivity], 
    0
  );
  
  const average = total / sessions.length;
  
  if (average >= 2.5) return 'High';
  if (average >= 1.5) return 'Medium';
  return 'Low';
};

const StudyLogger: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [open, setOpen] = useState(false);
  const [editSession, setEditSession] = useState<StudySession | null>(null);
  const [newSession, setNewSession] = useState<Omit<StudySession, 'id'>>({
    subject: '',
    duration: 0,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    productivity: 'Medium'
  });

  const handleClickOpen = () => {
    setEditSession(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditSession(null);
    setNewSession({
      subject: '',
      duration: 0,
      date: new Date().toISOString().split('T')[0],
      notes: '',
      productivity: 'Medium'
    });
  };

  const handleSave = () => {
    if (editSession) {
      // Update existing session
      setSessions(prev => 
        prev.map(s => s.id === editSession.id ? { ...s, ...newSession } : s)
      );
    } else {
      // Add new session
      setSessions(prev => [
        ...prev, 
        { 
          ...newSession, 
          id: prev.length > 0 ? Math.max(...prev.map(s => s.id)) + 1 : 1 
        }
      ]);
    }
    handleClose();
  };

  const handleEdit = (session: StudySession) => {
    setEditSession(session);
    setNewSession({
      subject: session.subject,
      duration: session.duration,
      date: session.date,
      notes: session.notes,
      productivity: session.productivity
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [sessions]);

  const getTotalStudyTime = () => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  return (
    <Box className="app-container" sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Study Logger
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Track and analyze your study sessions
          </Typography>
        </Grid>
        <Grid item>
          <Button
            className="log-study-session-btn"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Log Study Session
          </Button>
        </Grid>
      </Grid>

      {sessions.length > 0 ? (
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
              {sortedSessions.map((session, index) => (
                <React.Fragment key={session.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEdit(session)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(session.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                    sx={{
                      py: 2,
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography 
                            variant="body1" 
                            sx={{ fontWeight: 500 }}
                          >
                            {session.subject}
                          </Typography>
                          <Chip
                            label={session.productivity}
                            color={getProductivityColor(session.productivity)}
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Grid container spacing={2} alignItems="center">
                          <Grid item>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2">
                                {formatDuration(session.duration)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2">
                                {new Date(session.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Grid>
                          {session.notes && (
                            <Grid item xs={12}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  mt: 1,
                                  color: 'text.secondary',
                                  fontStyle: 'italic'
                                }}
                              >
                                {session.notes}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
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
            <Alert 
              severity="info" 
              sx={{ 
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }}
            >
              No study sessions logged yet. Click "Log Study Session" to get started!
            </Alert>
          </Paper>
        </Fade>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="text.primary">
                    Total Study Time
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatDuration(getTotalStudyTime())}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="text.primary">
                    Average Productivity
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {getAverageProductivity(sessions)}
                  </Typography>
                  <Chip
                    label={getAverageProductivity(sessions)}
                    color={getProductivityColor(getAverageProductivity(sessions))}
                    sx={{ ml: 2 }}
                  />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="text.primary">
                    Most Studied Subject
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {getMostStudiedSubject(sessions)}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="study-session-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            minWidth: 400,
          }
        }}
      >
        <DialogTitle>
          {editSession ? 'Edit Study Session' : 'Log New Study Session'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subject"
            fullWidth
            variant="outlined"
            value={newSession.subject}
            onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Duration (minutes)"
            type="number"
            fullWidth
            variant="outlined"
            value={newSession.duration}
            onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
            required
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={newSession.date}
            onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newSession.notes}
            onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            label="Productivity"
            fullWidth
            variant="outlined"
            value={newSession.productivity}
            onChange={(e) => setNewSession({ ...newSession, productivity: e.target.value as 'High' | 'Medium' | 'Low' })}
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
            {editSession ? 'Update' : 'Log'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyLogger;
