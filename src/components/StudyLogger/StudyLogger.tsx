import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
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
  Stack,
  Chip,
  Divider,
  LinearProgress,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Book as BookIcon,
  Grade as GradeIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface StudySession {
  id: number;
  subject: string;
  duration: number;
  date: string;
  notes: string;
  productivity: 'High' | 'Medium' | 'Low';
}

const StudyLogger = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [newSession, setNewSession] = useState<Omit<StudySession, 'id'>>({
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
      setSessions(
        sessions.map((session) =>
          session.id === editingSession.id
            ? { ...session, ...newSession }
            : session
        )
      );
    } else {
      const newId = sessions.length > 0 ? Math.max(...sessions.map((s) => s.id)) + 1 : 1;
      setSessions([...sessions, { ...newSession, id: newId }]);
    }
    handleClose();
  };

  const handleEdit = (session: StudySession) => {
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

  const handleDelete = (id: number) => {
    setSessions(sessions.filter((session) => session.id !== id));
  };

  const calculateTotalTime = () => {
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  const calculateAverageProductivity = () => {
    if (sessions.length === 0) return 'N/A';
    const productivityMap = { High: 3, Medium: 2, Low: 1 };
    const total = sessions.reduce(
      (sum, session) => sum + productivityMap[session.productivity],
      0
    );
    const average = total / sessions.length;
    if (average >= 2.5) return 'High';
    if (average >= 1.5) return 'Medium';
    return 'Low';
  };

  const getMostStudiedSubject = () => {
    if (sessions.length === 0) return 'N/A';
    const subjectMap = sessions.reduce((map, session) => {
      map[session.subject] = (map[session.subject] || 0) + session.duration;
      return map;
    }, {} as { [key: string]: number });
    return Object.entries(subjectMap).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];
  };

  const getProductivityColor = (productivity: string) => {
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${minutes} min`;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Study Logger
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Track and analyze your study sessions
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
            >
              Log Study Session
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {sessions.length === 0 ? (
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }}
              >
                No study sessions logged yet. Click "Log Study Session" to get started!
              </Alert>
            ) : (
              <Paper 
                elevation={2} 
                sx={{ 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <List>
                  {sessions.map((session, index) => (
                    <>
                      {index > 0 && <Divider />}
                      <ListItem
                        key={session.id}
                        sx={{
                          py: 2,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                        secondaryAction={
                          <Box>
                            <Tooltip title="Edit session">
                              <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => handleEdit(session)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete session">
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDelete(session.id)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="h6" component="span">
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
                                  <CalendarIcon sx={{ fontSize: 'small', mr: 0.5 }} />
                                  <Typography variant="body2">
                                    {format(new Date(session.date), 'MMM dd, yyyy')}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AccessTimeIcon sx={{ fontSize: 'small', mr: 0.5 }} />
                                  <Typography variant="body2">
                                    {formatDuration(session.duration)}
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
                    </>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" color="text.primary">
                      Total Study Time
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {formatDuration(calculateTotalTime())}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" color="text.primary">
                      Average Productivity
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {calculateAverageProductivity()}
                    </Typography>
                    <Chip
                      label={calculateAverageProductivity()}
                      color={getProductivityColor(calculateAverageProductivity())}
                      sx={{ ml: 2 }}
                    />
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BookIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" color="text.primary">
                      Most Studied Subject
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {getMostStudiedSubject()}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {editingSession ? 'Edit Study Session' : 'New Study Session'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subject"
            fullWidth
            value={newSession.subject}
            onChange={(e) =>
              setNewSession({ ...newSession, subject: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Duration (minutes)"
            type="number"
            fullWidth
            value={newSession.duration}
            onChange={(e) =>
              setNewSession({ ...newSession, duration: Number(e.target.value) })
            }
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={newSession.date}
            onChange={(e) =>
              setNewSession({ ...newSession, date: e.target.value })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={3}
            value={newSession.notes}
            onChange={(e) =>
              setNewSession({ ...newSession, notes: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Productivity</InputLabel>
            <Select
              value={newSession.productivity}
              label="Productivity"
              onChange={(e) =>
                setNewSession({
                  ...newSession,
                  productivity: e.target.value as 'High' | 'Medium' | 'Low',
                })
              }
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            {editingSession ? 'Save Changes' : 'Add Session'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyLogger;
