import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Grid, 
  Tooltip,
  Chip,
  Badge,
  useTheme
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  Today,
  Flag,
  AssignmentLate,
  AccessTime,
  AssignmentTurnedIn
} from '@mui/icons-material';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday,
  getDay,
  startOfWeek,
  endOfWeek,
  addDays
} from 'date-fns';

const TaskCalendar = ({ tasks, onTaskClick }) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Handle previous month
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  // Handle next month
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  // Handle today
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  // Get tasks for a specific day
  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), day);
    });
  };
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'to-do':
        return <AssignmentLate fontSize="small" color="error" />;
      case 'in-progress':
        return <AccessTime fontSize="small" color="warning" />;
      case 'completed':
        return <AssignmentTurnedIn fontSize="small" color="success" />;
      default:
        return null;
    }
  };
  
  // Convert tasks to calendar events
  const getTaskEvents = () => {
    if (!tasks) return [];
    
    const events = [];
    
    // Add regular task due dates
    tasks.forEach(task => {
      if (task.dueDate) {
        events.push({
          id: `task-${task.id}`,
          title: task.title,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          allDay: false,
          backgroundColor: getPriorityColor(task.priority),
          borderColor: getPriorityColor(task.priority),
          extendedProps: {
            type: 'task',
            taskId: task.id,
            priority: task.priority,
            description: task.description,
            status: task.status
          }
        });
      }
      
      // Add court rule deadlines if available
      if (task.courtRules && task.courtRules.calculatedDeadlines) {
        task.courtRules.calculatedDeadlines.forEach(deadline => {
          events.push({
            id: `deadline-${deadline.id}`,
            title: `${deadline.title} - ${task.title}`,
            start: new Date(deadline.dueDate),
            end: new Date(deadline.dueDate),
            allDay: false,
            backgroundColor: '#8e44ad', // Purple for court deadlines
            borderColor: '#8e44ad',
            extendedProps: {
              type: 'court-deadline',
              taskId: task.id,
              deadlineId: deadline.id,
              rule: deadline.rule,
              jurisdiction: task.courtRules.jurisdiction,
              priority: 'high'
            }
          });
        });
      }
    });
    
    return events;
  };
  
  // Render calendar header
  const renderCalendarHeader = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <Grid container>
        {weekDays.map((day, index) => (
          <Grid item xs key={index} sx={{ textAlign: 'center', py: 1 }}>
            <Typography variant="subtitle2" fontWeight={500}>
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };
  
  // Render calendar days
  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const dateFormat = 'd';
    const rows = [];
    
    let days = [];
    let day = startDate;
    let formattedDate = '';
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dayTasks = getTasksForDay(cloneDay);
        
        days.push(
          <Grid item xs key={day.toString()}>
            <Paper 
              elevation={0} 
              variant={isSameMonth(day, monthStart) ? 'outlined' : 'outlined'} 
              sx={{ 
                height: 120, 
                p: 1,
                backgroundColor: !isSameMonth(day, monthStart) 
                  ? 'rgba(0, 0, 0, 0.04)' 
                  : isToday(day) 
                    ? 'rgba(0, 105, 209, 0.08)' 
                    : 'inherit',
                borderColor: isToday(day) ? theme.palette.primary.main : 'divider',
                overflow: 'hidden'
              }}
            >
              <Typography 
                variant="body2" 
                align="center" 
                sx={{ 
                  fontWeight: isToday(day) ? 600 : 400,
                  color: !isSameMonth(day, monthStart) 
                    ? 'text.disabled' 
                    : isToday(day) 
                      ? theme.palette.primary.main 
                      : 'text.primary'
                }}
              >
                {formattedDate}
              </Typography>
              
              <Box sx={{ mt: 1, maxHeight: 85, overflow: 'auto' }}>
                {dayTasks.map(task => (
                  <Tooltip 
                    key={task.id} 
                    title={task.title}
                    placement="top"
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 0.5, 
                        mb: 0.5, 
                        borderRadius: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.08)'
                        }
                      }}
                      onClick={() => onTaskClick(task)}
                    >
                      {getStatusIcon(task.status)}
                      <Box 
                        sx={{ 
                          width: 4, 
                          height: 16, 
                          borderRadius: 1, 
                          backgroundColor: getPriorityColor(task.priority),
                          mr: 0.5
                        }} 
                      />
                      <Typography 
                        variant="caption" 
                        noWrap
                        sx={{ 
                          flexGrow: 1,
                          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          color: task.status === 'completed' ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        {task.title}
                      </Typography>
                    </Box>
                  </Tooltip>
                ))}
                
                {dayTasks.length > 3 && (
                  <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
                    +{dayTasks.length - 3} more
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <Grid container spacing={1} key={day.toString()}>
          {days}
        </Grid>
      );
      
      days = [];
    }
    
    return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{rows}</Box>;
  };
  
  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handlePreviousMonth}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ mx: 1 }}>
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
        <Tooltip title="Today">
          <IconButton onClick={handleToday}>
            <Today />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Calendar Grid */}
      <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
        {renderCalendarHeader()}
        <Box sx={{ mt: 1 }}>
          {renderCalendarDays()}
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskCalendar; 