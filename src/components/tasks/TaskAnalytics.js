import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Divider, 
  LinearProgress,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme
} from '@mui/material';
import { 
  Assignment, 
  AssignmentLate, 
  AssignmentTurnedIn, 
  AccessTime,
  Flag,
  Person,
  Folder,
  Schedule,
  AttachMoney,
  Warning
} from '@mui/icons-material';
import { format, isAfter, isBefore, isToday } from 'date-fns';
import { useTask } from '../../contexts/TaskContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const TaskAnalytics = () => {
  const theme = useTheme();
  const { tasks } = useTask();
  const [timeFrame, setTimeFrame] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('completion');
  
  // Task completion by status
  const statusData = [
    { name: 'To Do', value: tasks.filter(task => task.status === 'to-do').length },
    { name: 'In Progress', value: tasks.filter(task => task.status === 'in-progress').length },
    { name: 'Review', value: tasks.filter(task => task.status === 'review').length },
    { name: 'Completed', value: tasks.filter(task => task.status === 'completed').length }
  ];
  
  // Task distribution by priority
  const priorityData = [
    { name: 'Low', value: tasks.filter(task => task.priority === 'low').length },
    { name: 'Medium', value: tasks.filter(task => task.priority === 'medium').length },
    { name: 'High', value: tasks.filter(task => task.priority === 'high').length },
    { name: 'Urgent', value: tasks.filter(task => task.priority === 'urgent').length }
  ];
  
  // Task distribution by type
  const typeData = tasks.reduce((acc, task) => {
    const type = task.type;
    const existingType = acc.find(item => item.name === type);
    if (existingType) {
      existingType.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, []);
  
  // Billable hours by task type
  const billableHoursData = tasks.reduce((acc, task) => {
    if (task.timeTracking && task.timeTracking.billable && task.timeTracking.loggedHours > 0) {
      const type = task.type;
      const existingType = acc.find(item => item.name === type);
      if (existingType) {
        existingType.hours += task.timeTracking.loggedHours;
        existingType.value += 1;
      } else {
        acc.push({ 
          name: type, 
          hours: task.timeTracking.loggedHours, 
          value: 1 
        });
      }
    }
    return acc;
  }, []);
  
  // Budget alerts
  const tasksOverBudget = tasks.filter(task => 
    task.timeTracking && 
    task.timeTracking.budgetAlert && 
    task.timeTracking.budgetAlert.enabled &&
    task.timeTracking.loggedHours > task.timeTracking.budgetAlert.threshold
  );
  
  // Calculate total billable hours and estimated revenue
  const totalBillableHours = tasks.reduce((total, task) => {
    if (task.timeTracking && task.timeTracking.billable && task.timeTracking.loggedHours > 0) {
      return total + task.timeTracking.loggedHours;
    }
    return total;
  }, 0);
  
  // Estimate revenue at $250/hour
  const estimatedRevenue = totalBillableHours * 250;
  
  // Colors for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main
  ];
  
  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return theme.palette.success.main;
      case 'medium':
        return theme.palette.info.main;
      case 'high':
        return theme.palette.warning.main;
      case 'urgent':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Task Analytics Dashboard
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Frame</InputLabel>
          <Select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            label="Time Frame"
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Metric</InputLabel>
          <Select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            label="Metric"
          >
            <MenuItem value="completion">Task Completion</MenuItem>
            <MenuItem value="billable">Billable Hours</MenuItem>
            <MenuItem value="priority">Priority Distribution</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Grid container spacing={3}>
        {/* Task Status Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Task Status Overview" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Tasks']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Billable Hours */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Billable Hours by Task Type" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={billableHoursData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value.toFixed(1), name === 'hours' ? 'Hours' : 'Tasks']} />
                  <Legend />
                  <Bar dataKey="hours" name="Billable Hours" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Priority Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Priority Distribution" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getPriorityColor(entry.name.toLowerCase())} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Tasks']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Budget Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Budget Alerts" 
              action={
                <Chip 
                  icon={<Warning />} 
                  label={tasksOverBudget.length} 
                  color={tasksOverBudget.length > 0 ? "error" : "success"} 
                />
              }
            />
            <CardContent>
              {tasksOverBudget.length > 0 ? (
                <List>
                  {tasksOverBudget.map(task => (
                    <ListItem key={task.id}>
                      <ListItemIcon>
                        <Warning color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={`Logged: ${task.timeTracking.loggedHours}h / Budget: ${task.timeTracking.budgetAlert.threshold}h`}
                      />
                      <Box sx={{ width: '40%', ml: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(task.timeTracking.loggedHours / task.timeTracking.budgetAlert.threshold) * 100}
                          color="error"
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                  <Typography variant="body1" color="text.secondary">
                    No budget alerts at this time
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" gutterBottom>
              Total Tasks
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Assignment fontSize="large" color="primary" sx={{ mr: 1 }} />
              <Typography variant="h4">
                {tasks.length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" gutterBottom>
              Completion Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AssignmentTurnedIn fontSize="large" color="success" sx={{ mr: 1 }} />
              <Typography variant="h4">
                {tasks.length > 0 ? `${((tasks.filter(task => task.status === 'completed').length / tasks.length) * 100).toFixed(0)}%` : '0%'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" gutterBottom>
              Billable Hours
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Schedule fontSize="large" color="info" sx={{ mr: 1 }} />
              <Typography variant="h4">
                {totalBillableHours.toFixed(1)}h
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" gutterBottom>
              Est. Revenue
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoney fontSize="large" color="success" sx={{ mr: 1 }} />
              <Typography variant="h4">
                ${estimatedRevenue.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskAnalytics; 