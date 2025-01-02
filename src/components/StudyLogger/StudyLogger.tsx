import React, { useMemo, useState } from 'react';
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
  Stack,
  CircularProgress
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFirebaseState } from '../../hooks/useFirebaseState';

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
  const [sessions, setSessions, isLoading, error] = useFirebaseState<StudySession[]>('study-sessions', []);
  const [open, setOpen] = useState(false);
  const [editSession, setEditSession] = useState<StudySession | null>(null);
  const [newSession, setNewSession] = useState<Omit<StudySession, 'id'>>({
    subject: '',
    duration: 0,
    date: new Date().toISOString().split('T')[0],
    notes: '',
    productivity: 'Medium'
  });

  const sortedSessions = useMemo(() => {
    return [...(sessions || [])].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [sessions]);

  const totalStudyTime = useMemo(() => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  }, [sessions]);

  const averageProductivity = useMemo(() => {
    if (sessions.length === 0) return 'N/A';
    
    const productivityScores = {
      'High': 3,
      'Medium': 2,
      'Low': 1
    };
    
    const totalScore = sessions.reduce((sum, session) => 
      sum + productivityScores[session.productivity], 0
    );
    
    const average = totalScore / sessions.length;
    
    if (average >= 2.5) return 'High';
    if (average >= 1.5) return 'Medium';
    return 'Low';
  }, [sessions]);

  const mostStudiedSubject = useMemo(() => {
    if (sessions.length === 0) return 'N/A';
    
    const subjectCount = sessions.reduce((counts: { [key: string]: number }, session) => {
      counts[session.subject] = (counts[session.subject] || 0) + 1;
      return counts;
    }, {});
    
    return Object.entries(subjectCount).reduce((a, b) => 
      a[1] > b[1] ? a : b
    )[0];
  }, [sessions]);

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

  const handleSave = async () => {
    if (editSession) {
      await setSessions(prev => 
        prev.map(s => s.id === editSession.id ? { ...s, ...newSession, id: s.id } : s)
      );
    } else {
      await setSessions(prev => [
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

  const handleDelete = async (id: number) => {
    await setSessions(prev => prev.filter(s => s.id !== id));
  };

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
        Error loading study sessions: {error.message}
      </Alert>
    );
  }

  return (
    <Box 
      className="app-container" 
      sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: 3,
        backgroundColor: '#16181c',
        borderRadius: 2,
        border: '1px solid rgb(47, 51, 54)',
      }}
    >
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
            variant="contained"
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
            elevation={0}
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              backgroundColor: '#16181c',
              border: '1px solid rgb(47, 51, 54)',
            }}
          >
            <List>
              {sortedSessions.map((session, index) => (
                <React.Fragment key={session.id}>
                  {index > 0 && <Divider sx={{ borderColor: 'rgb(47, 51, 54)' }} />}
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
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(239, 243, 244, 0.1)',
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
              backgroundColor: '#16181c',
              border: '1px solid rgb(47, 51, 54)',
            }}
          >
            <Alert 
              severity="info" 
              sx={{ 
                borderRadius: 2,
                backgroundColor: 'rgba(239, 243, 244, 0.1)',
              }}
            >
              No study sessions logged yet. Click "Log Study Session" to get started!
            </Alert>
          </Paper>
        </Fade>
      )}

      <Grid 
        container 
        spacing={3} 
        sx={{
          mt: 3,
          backgroundColor: '#16181c',
          borderRadius: 2,
          border: '1px solid rgb(47, 51, 54)',
          p: 2
        }}
      >
        <Grid item xs={12} md={8}>
          {/* Empty grid for spacing */}
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Card sx={{ borderRadius: 2, backgroundColor: '#16181c', border: '1px solid rgb(47, 51, 54)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="text.primary">
                    Total Study Time
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatDuration(totalStudyTime)}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2, backgroundColor: '#16181c', border: '1px solid rgb(47, 51, 54)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="text.primary">
                    Average Productivity
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {averageProductivity}
                  </Typography>
                  <Chip
                    label={averageProductivity}
                    color={getProductivityColor(averageProductivity)}
                    sx={{ ml: 2 }}
                  />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2, backgroundColor: '#16181c', border: '1px solid rgb(47, 51, 54)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="text.primary">
                    Most Studied Subject
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {mostStudiedSubject}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            backgroundColor: '#16181c',
            backgroundImage: 'none',
            border: '1px solid rgb(47, 51, 54)',
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
