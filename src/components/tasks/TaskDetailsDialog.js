import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Tabs,
  Tab,
  Grid,
  Box,
  Typography,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  Paper,
  Card,
  CardContent,
  Tooltip,
  LinearProgress,
  useTheme,
  Alert,
  Collapse,
  Switch,
  FormControlLabel
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { 
  Close, 
  Edit, 
  Delete, 
  Assignment, 
  AssignmentLate, 
  AssignmentTurnedIn, 
  AccessTime,
  Flag,
  CalendarToday,
  Person,
  Folder,
  Comment,
  AttachFile,
  Add,
  Check,
  Send,
  Timer,
  CheckCircleOutline,
  RadioButtonUnchecked,
  PlayArrow,
  Pause,
  Save
} from '@mui/icons-material';
import { format, formatDistance, formatRelative, parseISO } from 'date-fns';
import { useTask } from '../../contexts/TaskContext';
import { taskService } from '../../services/taskService';

const TaskDetailsDialog = ({ open, onClose, task }) => {
  const theme = useTheme();
  const { updateTask, deleteTask, addComment, addSubtask, updateSubtask, logTime, addAttachment } = useTask();
  
  const [currentTab, setCurrentTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({...task});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [comment, setComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [timeEntry, setTimeEntry] = useState({
    hours: 0,
    notes: '',
    billable: true
  });
  const [timer, setTimer] = useState({
    active: false,
    startTime: null,
    elapsed: 0
  });
  const [conflict, setConflict] = useState(null);
  const [showConflictAlert, setShowConflictAlert] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [teamAssignment, setTeamAssignment] = useState(task?.team || null);
  const [backupAssignee, setBackupAssignee] = useState(task?.backupAssignee || null);
  const [dependencies, setDependencies] = useState(task?.dependencies || []);
  
  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({...task});
      
      // Check for conflicts if there's a case reference
      if (task.caseReference) {
        checkForConflicts(task.caseReference);
      }
      
      // Set state for team, backup assignee, and dependencies
      setTeamAssignment(task.team || null);
      setBackupAssignee(task.backupAssignee || null);
      setDependencies(task.dependencies || []);
    }
  }, [task]);
  
  // Timer effect
  useEffect(() => {
    let interval;
    
    if (timer.active && timer.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - timer.startTime) / 1000) + timer.elapsed;
        setTimer(prev => ({...prev, elapsed}));
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timer.active, timer.startTime]);
  
  // Check for conflicts
  const checkForConflicts = async (caseReference) => {
    if (!caseReference) {
      setConflict(null);
      setShowConflictAlert(false);
      return;
    }
    
    try {
      const conflict = await taskService.checkForConflicts({ caseReference });
      setConflict(conflict);
      setShowConflictAlert(!!conflict);
    } catch (err) {
      console.error('Error checking for conflicts:', err);
    }
  };
  
  // Mock case options (in a real app, these would come from an API)
  const caseOptions = [
    { id: 101, title: 'Johnson v. Smith', caseNumber: 'CV-2023-1234' },
    { id: 102, title: 'Williams v. Johnson', caseNumber: 'CV-2023-5678' },
    { id: 103, title: 'Davis Appeal', caseNumber: 'CV-2023-9012' }
  ];
  
  // Mock assignee options (in a real app, these would come from an API)
  const assigneeOptions = [
    { id: 201, name: 'Sarah Johnson', role: 'Attorney', avatar: '/avatars/sarah.jpg' },
    { id: 202, name: 'Michael Brown', role: 'Paralegal', avatar: '/avatars/michael.jpg' },
    { id: 203, name: 'Lisa Brown', role: 'Associate Attorney', avatar: '/avatars/lisa.jpg' },
    { id: 204, name: 'David Wilson', role: 'Partner', avatar: '/avatars/david.jpg' }
  ];
  
  // Task type options
  const taskTypeOptions = [
    { value: 'document', label: 'Document Preparation' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'research', label: 'Research' },
    { value: 'court', label: 'Court Appearance' },
    { value: 'deadline', label: 'Deadline' }
  ];
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    // Check for conflicts if changing case reference
    if (name === 'caseReference') {
      checkForConflicts(value);
    }
  };
  
  // Handle due date change
  const handleDueDateChange = (newValue) => {
    // Ensure we have a valid date object or null
    const validDate = newValue ? 
      (newValue instanceof Date && !isNaN(newValue.getTime()) ? 
        newValue : null) : null;
    
    setFormData({
      ...formData,
      dueDate: validDate
    });
    
    // Clear any errors
    if (errors.dueDate) {
      setErrors({
        ...errors,
        dueDate: null
      });
    }
  };
  
  // Handle case reference change
  const handleCaseReferenceChange = (event, newValue) => {
    setFormData({
      ...formData,
      caseReference: newValue
    });
    
    // Check for conflicts
    checkForConflicts(newValue);
  };
  
  // Handle recurrence enabled change
  const handleRecurrenceEnabledChange = (e) => {
    setFormData({
      ...formData,
      recurrence: {
        ...(formData.recurrence || {}),
        enabled: e.target.checked,
        pattern: e.target.checked ? 'daily' : 'none'
      }
    });
  };
  
  // Handle recurrence pattern change
  const handleRecurrencePatternChange = (e) => {
    setFormData({
      ...formData,
      recurrence: {
        ...(formData.recurrence || {}),
        pattern: e.target.value
      }
    });
  };
  
  // Handle recurrence interval change
  const handleRecurrenceIntervalChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setFormData({
      ...formData,
      recurrence: {
        ...(formData.recurrence || {}),
        interval: value
      }
    });
  };
  
  // Handle edit mode toggle
  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };
  
  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      
      // Prepare task data
      const taskData = {
        ...formData,
        // Only include recurrence if enabled
        recurrence: formData.recurrence && formData.recurrence.enabled ? {
          pattern: formData.recurrence.pattern,
          interval: formData.recurrence.interval
        } : null
      };
      
      // Ensure dueDate is properly formatted for API
      if (taskData.dueDate && taskData.dueDate instanceof Date) {
        // Keep the Date object for the API
        // The API will handle the conversion to ISO string if needed
      } else if (taskData.dueDate && typeof taskData.dueDate === 'string') {
        try {
          // Validate the date string
          const date = parseISO(taskData.dueDate);
          if (isNaN(date.getTime())) {
            taskData.dueDate = null;
          } else {
            taskData.dueDate = date;
          }
        } catch (error) {
          console.error('Invalid date format:', error);
          taskData.dueDate = null;
        }
      }
      
      await updateTask(taskData);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete task
  const handleDeleteTask = async () => {
    try {
      setLoading(true);
      await deleteTask(task.id);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle status change
  const handleStatusChange = async (status) => {
    try {
      setLoading(true);
      const updatedTask = {...formData, status};
      await updateTask(updatedTask);
      setFormData(updatedTask);
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle add comment
  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      setLoading(true);
      const commentData = {
        userId: 201, // This would be the current user's ID in a real app
        userName: 'Sarah Johnson', // This would be the current user's name in a real app
        userAvatar: '/avatars/sarah.jpg', // This would be the current user's avatar in a real app
        text: comment,
        timestamp: new Date().toISOString()
      };
      
      const newComment = await addComment(task.id, commentData);
      
      // Update local state with new comment
      setFormData({
        ...formData,
        comments: formData.comments ? [...formData.comments, newComment] : [newComment]
      });
      
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle add subtask
  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    
    try {
      setLoading(true);
      const subtaskData = {
        title: newSubtask,
        status: 'to-do',
        assigneeId: null
      };
      
      const newSubtaskItem = await addSubtask(task.id, subtaskData);
      
      // Update local state with new subtask
      setFormData({
        ...formData,
        subtasks: formData.subtasks ? [...formData.subtasks, newSubtaskItem] : [newSubtaskItem]
      });
      
      setNewSubtask('');
    } catch (error) {
      console.error('Error adding subtask:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle update subtask status
  const handleUpdateSubtaskStatus = async (subtaskId, status) => {
    try {
      setLoading(true);
      await updateSubtask(task.id, subtaskId, { status });
      
      // Update local state
      const updatedSubtasks = formData.subtasks.map(subtask => 
        subtask.id === subtaskId ? {...subtask, status} : subtask
      );
      
      setFormData({
        ...formData,
        subtasks: updatedSubtasks
      });
    } catch (error) {
      console.error('Error updating subtask:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle log time
  const handleLogTime = async () => {
    if (timeEntry.hours <= 0) return;
    
    try {
      setLoading(true);
      await logTime(task.id, timeEntry);
      
      // Update local state
      setFormData({
        ...formData,
        timeTracking: {
          ...formData.timeTracking,
          loggedHours: (formData.timeTracking?.loggedHours || 0) + timeEntry.hours
        }
      });
      
      setTimeEntry({
        hours: 0,
        notes: '',
        billable: true
      });
    } catch (error) {
      console.error('Error logging time:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle timer start
  const handleTimerStart = () => {
    setTimer({
      active: true,
      startTime: new Date(),
      elapsed: timer.elapsed
    });
  };
  
  // Handle timer pause
  const handleTimerPause = () => {
    setTimer({
      ...timer,
      active: false
    });
  };
  
  // Handle timer save
  const handleTimerSave = () => {
    const hours = parseFloat((timer.elapsed / 3600).toFixed(2));
    
    setTimeEntry({
      ...timeEntry,
      hours
    });
    
    setTimer({
      active: false,
      startTime: null,
      elapsed: 0
    });
  };
  
  // Format timer display
  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        return <Assignment fontSize="small" />;
    }
  };
  
  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'to-do':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };
  
  // Get type label
  const getTypeLabel = (type) => {
    const typeMap = {
      'document': 'Document Preparation',
      'meeting': 'Meeting',
      'research': 'Research',
      'court': 'Court Appearance',
      'deadline': 'Deadline',
      'client_meeting': 'Client Meeting',
      'deposition': 'Deposition',
      'filing': 'Filing'
    };
    
    return typeMap[type] || type;
  };
  
  // Get recurrence pattern label
  const getRecurrencePatternLabel = (pattern) => {
    const patternMap = {
      'none': 'None',
      'daily': 'Daily',
      'weekly': 'Weekly',
      'monthly': 'Monthly'
    };
    
    return patternMap[pattern] || pattern;
  };
  
  // Render basic info tab
  const renderBasicInfoTab = () => {
    return (
      <Box>
        <Collapse in={showConflictAlert}>
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowConflictAlert(false)}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Potential Conflict Detected
            </Typography>
            {conflict && (
              <Typography variant="body2">
                {conflict.reason} involving {conflict.clientName} and {conflict.opposingParty}.
              </Typography>
            )}
          </Alert>
        </Collapse>
        
        {/* Title */}
        <Box sx={{ mb: 3 }}>
          {editMode ? (
            <TextField
              fullWidth
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
              required
              sx={{ mb: 2 }}
            />
          ) : (
            <Typography variant="h5" gutterBottom>
              {task.title}
            </Typography>
          )}
        </Box>
        
        {/* Status and Priority */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {getStatusIcon(task.status)}
              <Typography variant="body1" sx={{ ml: 1 }}>
                Status: {getStatusLabel(task.status)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Flag sx={{ color: getPriorityColor(task.priority) }} />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Assignment />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Type: {getTypeLabel(task.type)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {/* Due Date */}
        <Box sx={{ mb: 3 }}>
          {editMode ? (
            <DateTimePicker
              label="Due Date"
              value={formData.dueDate ? (formData.dueDate instanceof Date ? formData.dueDate : parseISO(formData.dueDate)) : null}
              onChange={handleDueDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.dueDate,
                  helperText: errors.dueDate
                }
              }}
              format="MMM d, yyyy h:mm a"
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Due: {task.dueDate ? format(parseISO(task.dueDate), 'PPP p') : 'No due date'}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Recurrence */}
        <Box sx={{ mb: 3 }}>
          {editMode ? (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Recurrence
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.recurrence?.enabled || false}
                    onChange={handleRecurrenceEnabledChange}
                    color="primary"
                  />
                }
                label="Recurring Task"
              />
              
              {formData.recurrence?.enabled && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Recurrence Pattern</InputLabel>
                      <Select
                        name="recurrencePattern"
                        value={formData.recurrence?.pattern || 'none'}
                        onChange={handleRecurrencePatternChange}
                        label="Recurrence Pattern"
                      >
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Interval"
                      type="number"
                      inputProps={{ min: 1, step: 1 }}
                      value={formData.recurrence?.interval || 1}
                      onChange={handleRecurrenceIntervalChange}
                      helperText={`Repeat every ${formData.recurrence?.interval || 1} ${formData.recurrence?.pattern || 'day'}(s)`}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          ) : task.recurrence ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Recurrence: {getRecurrencePatternLabel(task.recurrence.pattern)}, every {task.recurrence.interval} {task.recurrence.interval === 1 ? task.recurrence.pattern.slice(0, -2) : task.recurrence.pattern}
              </Typography>
            </Box>
          ) : null}
        </Box>
        
        {/* Description */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Description
          </Typography>
          
          {editMode ? (
            <TextField
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
          ) : (
            <Typography variant="body1">
              {task.description || 'No description provided'}
            </Typography>
          )}
        </Box>
        
        {/* Case Reference */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Case Reference
          </Typography>
          
          {editMode ? (
            <Autocomplete
              options={[
                { id: 101, title: 'Johnson v. Smith', caseNumber: 'CV-2023-1234' },
                { id: 102, title: 'Williams v. Johnson', caseNumber: 'CV-2023-5678' },
                { id: 103, title: 'Davis Appeal', caseNumber: 'CV-2023-9012' }
              ]}
              getOptionLabel={(option) => `${option.title} (${option.caseNumber})`}
              value={formData.caseReference}
              onChange={handleCaseReferenceChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Link to Case"
                  fullWidth
                />
              )}
            />
          ) : task.caseReference ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Folder />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {task.caseReference.title} ({task.caseReference.caseNumber})
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No case linked
            </Typography>
          )}
        </Box>
        
        {/* Assignees */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Assignees
          </Typography>
          
          {editMode ? (
            <Autocomplete
              multiple
              options={[
                { id: 201, name: 'Sarah Johnson', role: 'Attorney', avatar: '/avatars/sarah.jpg' },
                { id: 202, name: 'Michael Brown', role: 'Paralegal', avatar: '/avatars/michael.jpg' },
                { id: 203, name: 'Lisa Brown', role: 'Associate Attorney', avatar: '/avatars/lisa.jpg' },
                { id: 204, name: 'David Wilson', role: 'Partner', avatar: '/avatars/david.jpg' }
              ]}
              getOptionLabel={(option) => option.name}
              value={formData.assignees || []}
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  assignees: newValue
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assignees"
                  fullWidth
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    avatar={<Avatar alt={option.name} src={option.avatar} />}
                    label={option.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          ) : task.assignees && task.assignees.length > 0 ? (
            <Box>
              <AvatarGroup max={4}>
                {task.assignees.map(assignee => (
                  <Tooltip key={assignee.id} title={`${assignee.name} (${assignee.role})`}>
                    <Avatar alt={assignee.name} src={assignee.avatar} />
                  </Tooltip>
                ))}
              </AvatarGroup>
              <Box sx={{ mt: 1 }}>
                {task.assignees.map((assignee, index) => (
                  <Typography key={assignee.id} variant="body2" component="span">
                    {assignee.name}{index < task.assignees.length - 1 ? ', ' : ''}
                  </Typography>
                ))}
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No assignees
            </Typography>
          )}
        </Box>
        
        {/* Time Tracking */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Time Tracking
          </Typography>
          
          {task.timeTracking ? (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    Estimated: {task.timeTracking.estimatedHours} hours
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    Logged: {task.timeTracking.loggedHours} hours
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((task.timeTracking.loggedHours / task.timeTracking.estimatedHours) * 100, 100)} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No time tracking information
            </Typography>
          )}
        </Box>
      </Box>
    );
  };
  
  // Render subtasks tab
  const renderSubtasksTab = () => {
    return (
      <Box>
        {/* Add Subtask */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Add Subtask"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              fullWidth
              size="small"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
            />
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={handleAddSubtask}
              disabled={!newSubtask.trim() || loading}
            >
              Add
            </Button>
          </Box>
        </Box>
        
        {/* Subtasks List */}
        {task.subtasks && task.subtasks.length > 0 ? (
          <List>
            {task.subtasks.map((subtask) => (
              <Paper 
                key={subtask.id} 
                variant="outlined" 
                sx={{ mb: 1, bgcolor: subtask.status === 'completed' ? 'rgba(0, 0, 0, 0.04)' : 'inherit' }}
              >
                <ListItem>
                  <ListItemIcon>
                    <IconButton 
                      size="small"
                      onClick={() => handleUpdateSubtaskStatus(
                        subtask.id, 
                        subtask.status === 'completed' ? 'to-do' : 'completed'
                      )}
                      disabled={loading}
                    >
                      {subtask.status === 'completed' 
                        ? <CheckCircleOutline color="success" /> 
                        : <RadioButtonUnchecked />}
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          textDecoration: subtask.status === 'completed' ? 'line-through' : 'none',
                          color: subtask.status === 'completed' ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        {subtask.title}
                      </Typography>
                    }
                    secondary={
                      subtask.assigneeId && (
                        <Typography variant="caption" color="text.secondary">
                          Assigned to: {
                            assigneeOptions.find(a => a.id === subtask.assigneeId)?.name || 'Unknown'
                          }
                        </Typography>
                      )
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button 
                      size="small" 
                      color="secondary"
                      onClick={() => handleUpdateSubtaskStatus(subtask.id, 'in-progress')}
                      disabled={subtask.status === 'in-progress' || subtask.status === 'completed' || loading}
                    >
                      Start
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No subtasks yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add a subtask to break down this task into smaller steps
            </Typography>
          </Box>
        )}
      </Box>
    );
  };
  
  // Render comments tab
  const renderCommentsTab = () => {
    return (
      <Box>
        {/* Add Comment */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Add Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              multiline
              rows={2}
              size="small"
            />
            <Button 
              variant="contained" 
              startIcon={<Send />}
              onClick={handleAddComment}
              disabled={!comment.trim() || loading}
              sx={{ alignSelf: 'flex-end' }}
            >
              Send
            </Button>
          </Box>
        </Box>
        
        {/* Comments List */}
        {task.comments && task.comments.length > 0 ? (
          <List>
            {task.comments.map((comment) => (
              <Paper 
                key={comment.id} 
                variant="outlined" 
                sx={{ mb: 1 }}
              >
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={comment.userAvatar} alt={comment.userName} />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">
                          {comment.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatRelative(new Date(comment.timestamp), new Date())}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        color="text.primary"
                        sx={{ mt: 1 }}
                      >
                        {comment.text}
                      </Typography>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No comments yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add a comment to discuss this task
            </Typography>
          </Box>
        )}
      </Box>
    );
  };
  
  // Render time tracking tab
  const renderTimeTrackingTab = () => {
    return (
      <Box>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Time Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Estimated Hours
                </Typography>
                <Typography variant="h6">
                  {task.timeTracking?.estimatedHours || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Logged Hours
                </Typography>
                <Typography variant="h6">
                  {task.timeTracking?.loggedHours || 0}
                </Typography>
              </Grid>
              {task.timeTracking?.estimatedHours > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(
                      ((task.timeTracking?.loggedHours || 0) / task.timeTracking.estimatedHours) * 100, 
                      100
                    )} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {Math.round(((task.timeTracking?.loggedHours || 0) / task.timeTracking.estimatedHours) * 100)}% complete
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
        
        {/* Timer */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Time Tracker
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Typography variant="h3" fontFamily="monospace">
              {formatTimer(timer.elapsed)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            {!timer.active ? (
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<PlayArrow />}
                onClick={handleTimerStart}
              >
                Start Timer
              </Button>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<Pause />}
                  onClick={handleTimerPause}
                >
                  Pause
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<Save />}
                  onClick={handleTimerSave}
                >
                  Save Time
                </Button>
              </>
            )}
          </Box>
        </Paper>
        
        {/* Manual Time Entry */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Log Time
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hours"
                type="number"
                value={timeEntry.hours}
                onChange={(e) => setTimeEntry({...timeEntry, hours: parseFloat(e.target.value) || 0})}
                fullWidth
                inputProps={{ min: 0, step: 0.25 }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Billable</InputLabel>
                <Select
                  value={timeEntry.billable.toString()}
                  onChange={(e) => setTimeEntry({...timeEntry, billable: e.target.value === 'true'})}
                  label="Billable"
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={timeEntry.notes}
                onChange={(e) => setTimeEntry({...timeEntry, notes: e.target.value})}
                fullWidth
                multiline
                rows={2}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<Timer />}
                onClick={handleLogTime}
                disabled={timeEntry.hours <= 0 || loading}
                fullWidth
              >
                Log Time
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  };
  
  // Render audit log tab
  const renderAuditLogTab = () => {
    if (!task.auditLog || task.auditLog.length === 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No audit log entries available
          </Typography>
        </Box>
      );
    }
    
    return (
      <List>
        {task.auditLog.map((entry, index) => (
          <ListItem key={index} divider={index < task.auditLog.length - 1}>
            <ListItemAvatar>
              <Avatar>
                <Person />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body1">
                  <strong>{entry.userName}</strong> {entry.action} the task
                </Typography>
              }
              secondary={
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {format(parseISO(entry.timestamp), 'PPP p')}
                  </Typography>
                  {entry.changes && entry.changes.length > 0 && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Changed fields: {entry.changes.join(', ')}
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };
  
  // Render tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return renderBasicInfoTab();
      case 1:
        return renderSubtasksTab();
      case 2:
        return renderCommentsTab();
      case 3:
        return renderTimeTrackingTab();
      case 4:
        return renderAuditLogTab();
      default:
        return renderBasicInfoTab();
    }
  };
  
  const handleAddAttachment = async () => {
    try {
      setLoading(true);
      await addAttachment(task.id, {
        name: 'New Attachment.docx',
        type: 'document',
        size: '1.2 MB',
        uploadedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error adding attachment:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTeamChange = async (event, newValue) => {
    try {
      setLoading(true);
      setTeamAssignment(newValue);
      
      if (newValue) {
        await taskService.assignTeam(task.id, newValue.id);
      }
    } catch (err) {
      console.error('Error assigning team:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackupAssigneeChange = async (event, newValue) => {
    try {
      setLoading(true);
      setBackupAssignee(newValue);
      
      if (newValue) {
        await taskService.addBackupAssignee(task.id, newValue);
      }
    } catch (err) {
      console.error('Error adding backup assignee:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDependenciesChange = async (event, newValue) => {
    try {
      setLoading(true);
      
      // Find new dependencies that were added
      const newDependencies = newValue.filter(
        newDep => !dependencies.some(existingDep => existingDep.id === newDep.id)
      );
      
      // Add each new dependency
      for (const dependency of newDependencies) {
        await taskService.addTaskDependency(task.id, {
          id: dependency.id,
          title: dependency.title,
          type: 'predecessor'
        });
      }
      
      setDependencies(newValue);
    } catch (err) {
      console.error('Error updating dependencies:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = async (e) => {
    try {
      setLoading(true);
      const newFiles = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
      
      // Create attachment objects and add them to the task
      for (const file of newFiles) {
        const attachmentData = {
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedBy: {
            id: 201, // In a real app, this would be the current user's ID
            name: 'Sarah Johnson' // In a real app, this would be the current user's name
          }
        };
        
        await taskService.addAttachmentWithVersion(task.id, attachmentData);
      }
    } catch (err) {
      console.error('Error adding attachment:', err);
    } finally {
      setLoading(false);
      // Refresh the task data
      const updatedTask = await taskService.getTaskById(task.id);
      setFormData(updatedTask);
    }
  };
  
  const handleAddCommentWithAttachment = async () => {
    if (!comment.trim()) return;
    
    try {
      setLoading(true);
      const commentData = {
        userId: 201, // In a real app, this would be the current user's ID
        userName: 'Sarah Johnson', // In a real app, this would be the current user's name
        userAvatar: '/avatars/sarah.jpg', // In a real app, this would be the current user's avatar
        text: comment
      };
      
      const attachments = selectedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      }));
      
      await taskService.addCommentWithAttachments(task.id, commentData, attachments);
      setComment('');
      setSelectedFiles([]);
      
      // Refresh the task data
      const updatedTask = await taskService.getTaskById(task.id);
      setFormData(updatedTask);
    } catch (err) {
      console.error('Error adding comment with attachment:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogTimeWithBilling = async () => {
    if (timeEntry.hours <= 0) return;
    
    try {
      setLoading(true);
      const timeData = {
        ...timeEntry,
        userId: 201, // In a real app, this would be the current user's ID
        userName: 'Sarah Johnson' // In a real app, this would be the current user's name
      };
      
      await taskService.logTimeWithBilling(task.id, timeData);
      setTimeEntry({
        hours: 0,
        notes: '',
        billable: true
      });
      
      // Refresh the task data
      const updatedTask = await taskService.getTaskById(task.id);
      setFormData(updatedTask);
    } catch (err) {
      console.error('Error logging time:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCalculateCourtDeadlines = async (jurisdiction) => {
    try {
      setLoading(true);
      await taskService.calculateCourtDeadlines(task.id, { jurisdiction });
      
      // Refresh the task data
      const updatedTask = await taskService.getTaskById(task.id);
      setFormData(updatedTask);
    } catch (err) {
      console.error('Error calculating court deadlines:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!task) return null;
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getStatusIcon(task.status)}
            <Typography variant="h6" sx={{ ml: 1 }}>
              Task Details
            </Typography>
          </Box>
          <Box>
            {!editMode ? (
              <IconButton onClick={handleEditModeToggle} sx={{ mr: 1 }}>
                <Edit />
              </IconButton>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSaveChanges}
                disabled={loading}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
            )}
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Details" />
          <Tab label="Subtasks" />
          <Tab label="Comments" />
          <Tab label="Time Tracking" />
          <Tab label="Audit Log" />
        </Tabs>
        
        {renderTabContent()}
      </DialogContent>
      
      <DialogActions>
        {currentTab === 0 && !editMode && (
          <Button 
            color="error" 
            onClick={handleDeleteTask}
            disabled={loading}
            startIcon={<Delete />}
          >
            Delete Task
          </Button>
        )}
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailsDialog; 