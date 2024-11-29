import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Stack, IconButton, Card, CardContent, Grid, } from '@mui/material';
import { PlayArrow as PlayIcon, Pause as PauseIcon, Stop as StopIcon, SkipNext as SkipIcon, } from '@mui/icons-material';
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
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
                if (isWorkTime) {
                    setTotalStudyTime((prev) => prev + 1);
                }
            }, 1000);
        }
        else if (timeLeft === 0) {
            handleTimerComplete();
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, isWorkTime]);
    const handleTimerComplete = () => {
        if (isWorkTime) {
            setPomodoroCount((prev) => prev + 1);
            const isLongBreak = (pomodoroCount + 1) % 4 === 0;
            setTimeLeft(isLongBreak ? LONG_BREAK : SHORT_BREAK);
        }
        else {
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
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
            .toString()
            .padStart(2, '0')}`;
    };
    const formatTotalTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };
    const calculateProgress = () => {
        const total = isWorkTime ? WORK_TIME : (pomodoroCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK);
        return ((total - timeLeft) / total) * 100;
    };
    return (_jsxs(Box, { sx: { maxWidth: 800, mx: 'auto', p: 3 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "Study Timer" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsxs(Paper, { elevation: 3, sx: {
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }, children: [_jsxs(Box, { sx: { position: 'relative', display: 'inline-flex', mb: 3 }, children: [_jsx(CircularProgress, { variant: "determinate", value: calculateProgress(), size: 200, thickness: 2, sx: { color: isWorkTime ? 'primary.main' : 'secondary.main' } }), _jsx(Box, { sx: {
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                position: 'absolute',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }, children: _jsx(Typography, { variant: "h3", component: "div", children: formatTime(timeLeft) }) })] }), _jsx(Typography, { variant: "h6", gutterBottom: true, children: isWorkTime ? 'Work Time' : 'Break Time' }), _jsxs(Stack, { direction: "row", spacing: 2, sx: { mt: 2 }, children: [_jsx(IconButton, { size: "large", onClick: toggleTimer, color: "primary", sx: { border: 1, borderColor: 'primary.main' }, children: isRunning ? _jsx(PauseIcon, {}) : _jsx(PlayIcon, {}) }), _jsx(IconButton, { size: "large", onClick: resetTimer, color: "error", sx: { border: 1, borderColor: 'error.main' }, children: _jsx(StopIcon, {}) }), _jsx(IconButton, { size: "large", onClick: skipInterval, color: "secondary", sx: { border: 1, borderColor: 'secondary.main' }, children: _jsx(SkipIcon, {}) })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Stack, { spacing: 2, children: [_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "text.secondary", gutterBottom: true, children: "Completed Pomodoros" }), _jsx(Typography, { variant: "h4", children: pomodoroCount })] }) }), _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { color: "text.secondary", gutterBottom: true, children: "Total Study Time" }), _jsx(Typography, { variant: "h4", children: formatTotalTime(totalStudyTime) })] }) })] }) })] })] }));
};
export default StudyTimer;
