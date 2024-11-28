import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Stack,
  IconButton,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  SkipNext as SkipIcon,
} from '@mui/icons-material';

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes in seconds
const LONG_BREAK = 15 * 60; // 15 minutes in seconds

const StudyTimer = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        if (isWorkTime) {
          setTotalStudyTime((prev) => prev + 1);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWorkTime]);

  const handleTimerComplete = () => {
    if (isWorkTime) {
      setPomodoroCount((prev) => prev + 1);
      const isLongBreak = (pomodoroCount + 1) % 4 === 0;
      setTimeLeft(isLongBreak ? LONG_BREAK : SHORT_BREAK);
    } else {
      setTimeLeft(WORK_TIME);
    }
    setIsWorkTime((prev) => !prev);
    setIsRunning(false);
    playNotificationSound();
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch((error) => console.log('Audio play failed:', error));
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(WORK_TIME);
    setIsWorkTime(true);
  };

  const skipInterval = () => {
    handleTimerComplete();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const calculateProgress = () => {
    const total = isWorkTime ? WORK_TIME : (pomodoroCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK);
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Study Timer
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
              <CircularProgress
                variant="determinate"
                value={calculateProgress()}
                size={200}
                thickness={2}
                sx={{ color: isWorkTime ? 'primary.main' : 'secondary.main' }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h3" component="div">
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom>
              {isWorkTime ? 'Work Time' : 'Break Time'}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <IconButton
                size="large"
                onClick={toggleTimer}
                color="primary"
                sx={{ border: 1, borderColor: 'primary.main' }}
              >
                {isRunning ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
              <IconButton
                size="large"
                onClick={resetTimer}
                color="error"
                sx={{ border: 1, borderColor: 'error.main' }}
              >
                <StopIcon />
              </IconButton>
              <IconButton
                size="large"
                onClick={skipInterval}
                color="secondary"
                sx={{ border: 1, borderColor: 'secondary.main' }}
              >
                <SkipIcon />
              </IconButton>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Completed Pomodoros
                </Typography>
                <Typography variant="h4">{pomodoroCount}</Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Study Time
                </Typography>
                <Typography variant="h4">
                  {formatTotalTime(totalStudyTime)}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudyTimer;
