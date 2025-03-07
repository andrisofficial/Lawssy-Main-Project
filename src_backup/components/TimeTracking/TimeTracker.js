import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Grid,
  useTheme,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import { formatDuration } from '../../utils/timeUtils';

const TimeTracker = () => {
  const theme = useTheme();
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [lastIdleCheck, setLastIdleCheck] = useState(Date.now());
  const IDLE_THRESHOLD = 300000; // 5 minutes in milliseconds

  useEffect(() => {
    let timer;
    if (isTracking && !isPaused) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
        checkIdleTime();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTracking, isPaused]);

  const checkIdleTime = () => {
    const now = Date.now();
    if (now - lastIdleCheck > IDLE_THRESHOLD) {
      handleIdle();
    }
    setLastIdleCheck(now);
  };

  const handleIdle = () => {
    setIsPaused(true);
    // TODO: Implement idle time dialog
  };

  const startTimer = () => {
    setIsTracking(true);
    setIsPaused(false);
    if (!startTime) {
      setStartTime(new Date());
    }
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsTracking(false);
    setIsPaused(false);
    // TODO: Implement save time entry dialog
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Time Tracker
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h3" component="div">
              {formatDuration(duration)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            {!isTracking ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={startTimer}
              >
                Start
              </Button>
            ) : (
              <>
                <IconButton
                  color="primary"
                  onClick={isPaused ? resumeTimer : pauseTimer}
                >
                  {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                </IconButton>
                <IconButton color="secondary" onClick={stopTimer}>
                  <StopIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TimeTracker; 