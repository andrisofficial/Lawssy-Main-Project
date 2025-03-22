import React, { useState } from 'react';
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
  FormHelperText,
  Grid,
  Box,
  Typography,
  Chip,
  Autocomplete,
  Divider,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  Collapse,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
  AvatarGroup,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Close, Add, Warning, Info, CloudUpload, Person, Group, AccessTime, AttachFile, RadioButtonUnchecked, Flag, PriorityHigh, Assignment, AssignmentLate, CheckCircleOutline } from '@mui/icons-material';
import { useTask } from '../../contexts/TaskContext';
import { taskService } from '../../services/taskService';
import { parseISO } from 'date-fns';

const NewTaskDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const { createTask } = useTask();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    customType: '',
    priority: 'medium',
    status: 'to-do',
    dueDate: null,
    caseReference: null,
    assignees: [],
    team: null,
    backupAssignee: null,
    subtasks: [],
    dependencies: [],
    timeTracking: {
      estimatedHours: 0,
      billable: false,
      budgetAlert: {
        enabled: false,
        threshold: 0
      }
    },
    recurrence: {
      enabled: false,
      pattern: 'none',
      interval: 1
    },
    attachments: [],
    courtRules: {
      jurisdiction: '',
      enabled: false
    },
    permissions: {
      view: ['attorney', 'paralegal', 'partner', 'associate'],
      edit: ['attorney', 'partner', 'associate'],
      delete: ['partner'],
      assignTask: ['attorney', 'partner'],
      addComment: ['attorney', 'paralegal', 'partner', 'associate'],
      addAttachment: ['attorney', 'paralegal', 'partner', 'associate'],
      logTime: ['attorney', 'paralegal', 'partner', 'associate']
    }
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [conflict, setConflict] = useState(null);
  const [showConflictAlert, setShowConflictAlert] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  
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
  
  // Mock team options
  const teamOptions = [
    { id: 301, name: 'Litigation Team' },
    { id: 302, name: 'Corporate Team' },
    { id: 303, name: 'Real Estate Team' },
    { id: 304, name: 'IP Team' }
  ];
  
  // Mock task options for dependencies
  const taskOptions = [
    { id: 1, title: 'Review Case Files', status: 'completed' },
    { id: 2, title: 'Client Interview', status: 'completed' },
    { id: 3, title: 'Draft Initial Pleading', status: 'in-progress' },
    { id: 4, title: 'File Complaint', status: 'to-do' }
  ];
  
  // Jurisdiction options for court rules
  const jurisdictionOptions = [
    { value: 'Federal', label: 'Federal Court' },
    { value: 'California', label: 'California State Court' },
    { value: 'New York', label: 'New York State Court' },
    { value: 'Texas', label: 'Texas State Court' }
  ];
  
  // Task type options
  const taskTypeOptions = [
    { value: 'document', label: 'Document Preparation' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'research', label: 'Research' },
    { value: 'court', label: 'Court Appearance' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'client_meeting', label: 'Client Meeting' },
    { value: 'deposition', label: 'Deposition' },
    { value: 'filing', label: 'Filing' },
    { value: 'custom', label: 'Custom Type...' }
  ];
  
  // Recurrence pattern options
  const recurrencePatternOptions = [
    { value: 'none', label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];
  
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
    
    // Clear error for this field
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
  
  // Handle assignees change
  const handleAssigneesChange = (event, newValue) => {
    setFormData({
      ...formData,
      assignees: newValue
    });
  };
  
  // Handle estimated hours change
  const handleEstimatedHoursChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData({
      ...formData,
      timeTracking: {
        ...formData.timeTracking,
        estimatedHours: value
      }
    });
  };
  
  // Handle billable change
  const handleBillableChange = (e) => {
    setFormData({
      ...formData,
      timeTracking: {
        ...formData.timeTracking,
        billable: e.target.checked
      }
    });
  };
  
  // Handle recurrence enabled change
  const handleRecurrenceEnabledChange = (e) => {
    setFormData({
      ...formData,
      recurrence: {
        ...formData.recurrence,
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
        ...formData.recurrence,
        pattern: e.target.value
      }
    });
  };
  
  // Handle recurrence interval change
  const handleRecurrenceIntervalChange = (e) => {
    setFormData({
      ...formData,
      recurrence: {
        ...formData.recurrence,
        interval: parseInt(e.target.value, 10) || 1
      }
    });
  };
  
  const handleTeamChange = (event, newValue) => {
    setFormData({
      ...formData,
      team: newValue
    });
  };
  
  const handleBackupAssigneeChange = (event, newValue) => {
    setFormData({
      ...formData,
      backupAssignee: newValue
    });
  };
  
  const handleDependenciesChange = (event, newValue) => {
    setFormData({
      ...formData,
      dependencies: newValue
    });
  };
  
  const handleBudgetAlertEnabledChange = (e) => {
    setFormData({
      ...formData,
      timeTracking: {
        ...formData.timeTracking,
        budgetAlert: {
          ...formData.timeTracking.budgetAlert,
          enabled: e.target.checked
        }
      }
    });
  };
  
  const handleBudgetThresholdChange = (e) => {
    setFormData({
      ...formData,
      timeTracking: {
        ...formData.timeTracking,
        budgetAlert: {
          ...formData.timeTracking.budgetAlert,
          threshold: parseFloat(e.target.value) || 0
        }
      }
    });
  };
  
  const handleCourtRulesEnabledChange = (e) => {
    setFormData({
      ...formData,
      courtRules: {
        ...formData.courtRules,
        enabled: e.target.checked
      }
    });
  };
  
  const handleJurisdictionChange = (e) => {
    setFormData({
      ...formData,
      courtRules: {
        ...formData.courtRules,
        jurisdiction: e.target.value
      }
    });
  };
  
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...newFiles]);
    
    // Create attachment objects for the form data
    const newAttachments = newFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      file: file  // Store the actual file object for upload
    }));
    
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...newAttachments]
    });
  };
  
  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    
    const updatedAttachments = [...formData.attachments];
    updatedAttachments.splice(index, 1);
    setFormData({
      ...formData,
      attachments: updatedAttachments
    });
  };
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Handle add subtask
  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const subtask = {
      title: newSubtask.trim(),
      status: 'to-do'
    };
    
    setFormData({
      ...formData,
      subtasks: [...formData.subtasks, subtask]
    });
    
    setNewSubtask('');
  };
  
  // Handle remove subtask
  const handleRemoveSubtask = (index) => {
    const updatedSubtasks = [...formData.subtasks];
    updatedSubtasks.splice(index, 1);
    
    setFormData({
      ...formData,
      subtasks: updatedSubtasks
    });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    // Validate type
    if (!formData.type) {
      newErrors.type = 'Task type is required';
    } else if (formData.type === 'custom' && !formData.customType.trim()) {
      newErrors.customType = 'Custom type is required';
    }
    
    // Validate case reference for certain task types
    if (['document', 'court', 'filing', 'deadline', 'deposition'].includes(formData.type) && !formData.caseReference) {
      newErrors.caseReference = 'Case reference is required for this task type';
    }
    
    // Validate assignees
    if (formData.assignees.length === 0 && !formData.team) {
      newErrors.assignees = 'At least one assignee or team is required';
    }
    
    // Validate due date
    if (formData.dueDate && typeof formData.dueDate === 'string') {
      try {
        const date = parseISO(formData.dueDate);
        if (isNaN(date.getTime())) {
          newErrors.dueDate = 'Invalid date format';
        }
      } catch (error) {
        newErrors.dueDate = 'Invalid date format';
      }
    }
    
    // Validate recurrence
    if (formData.recurrence.enabled && formData.recurrence.pattern === 'none') {
      newErrors.recurrencePattern = 'Please select a recurrence pattern';
    }
    
    // Validate budget alert threshold
    if (formData.timeTracking.budgetAlert.enabled && 
        (!formData.timeTracking.budgetAlert.threshold || formData.timeTracking.budgetAlert.threshold <= 0)) {
      newErrors.budgetThreshold = 'Please enter a valid budget threshold';
    }
    
    // Validate court rules
    if (formData.courtRules.enabled && !formData.courtRules.jurisdiction) {
      newErrors.jurisdiction = 'Please select a jurisdiction';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Process the custom type if needed
      const finalType = formData.type === 'custom' ? formData.customType : formData.type;
      
      // Prepare the task data
      const taskData = {
        ...formData,
        type: finalType
      };
      
      // Remove the customType field if it's not a custom type
      if (formData.type !== 'custom') {
        delete taskData.customType;
      }
      
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
      
      // Create the task
      const newTask = await createTask(taskData);
      
      // Close the dialog and reset form
      onClose();
      
      // Show success message or notification
      console.log('Task created successfully:', newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      // Show error message or notification
    } finally {
      setLoading(false);
    }
  };
  
  // Handle close
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      customType: '',
      priority: 'medium',
      status: 'to-do',
      dueDate: null,
      caseReference: null,
      assignees: [],
      team: null,
      backupAssignee: null,
      subtasks: [],
      dependencies: [],
      timeTracking: {
        estimatedHours: 0,
        billable: false,
        budgetAlert: {
          enabled: false,
          threshold: 0
        }
      },
      recurrence: {
        enabled: false,
        pattern: 'none',
        interval: 1
      },
      attachments: [],
      courtRules: {
        jurisdiction: '',
        enabled: false
      },
      permissions: {
        view: ['attorney', 'paralegal', 'partner', 'associate'],
        edit: ['attorney', 'partner', 'associate'],
        delete: ['partner'],
        assignTask: ['attorney', 'partner'],
        addComment: ['attorney', 'paralegal', 'partner', 'associate'],
        addAttachment: ['attorney', 'paralegal', 'partner', 'associate'],
        logTime: ['attorney', 'paralegal', 'partner', 'associate']
      }
    });
    setErrors({});
    setConflict(null);
    setShowConflictAlert(false);
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          pb: 1,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" component="div" fontWeight={600}>
          Create New Task
        </Typography>
        <IconButton 
          onClick={handleClose} 
          size="small"
          sx={{
            backgroundColor: 'background.subtle',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          px: 3, 
          backgroundColor: 'background.paper',
          '& .MuiTab-root': {
            minHeight: '48px',
            fontWeight: 500,
            fontSize: '0.875rem',
            textTransform: 'none',
            '&.Mui-selected': {
              fontWeight: 600
            }
          }
        }}
      >
        <Tab label="Basic Info" />
        <Tab label="Assignment" />
        <Tab label="Time & Billing" />
        <Tab label="Attachments" />
        <Tab label="Dependencies" />
        <Tab label="Deadlines" />
        <Tab label="Permissions" />
      </Tabs>
      
      <DialogContent sx={{ px: 3, py: 2, backgroundColor: 'background.default' }}>
        {/* Conflict Alert */}
        <Collapse in={showConflictAlert}>
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 2,
              borderRadius: '8px',
              '& .MuiAlert-icon': {
                alignItems: 'center'
              }
            }}
            action={
              <IconButton
                size="small"
                onClick={() => setShowConflictAlert(false)}
              >
                <Close fontSize="small" />
              </IconButton>
            }
          >
            <Typography variant="body2">
              {conflict}
            </Typography>
          </Alert>
        </Collapse>
        
        {/* Tab 0: Basic Task Information */}
        {currentTab === 0 && (
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                label="Task Title"
                fullWidth
                required
                value={formData.title}
                onChange={handleInputChange}
                name="title"
                error={!!errors.title}
                helperText={errors.title}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                name="description"
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Task Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={handleInputChange}
                  name="type"
                  label="Task Type"
                  sx={{ borderRadius: '8px' }}
                >
                  {taskTypeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {formData.type === 'custom' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Custom Type"
                  fullWidth
                  value={formData.customType}
                  onChange={handleInputChange}
                  name="customType"
                  error={!!errors.customType}
                  helperText={errors.customType}
                  InputProps={{
                    sx: { borderRadius: '8px' }
                  }}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={handleInputChange}
                  name="priority"
                  label="Priority"
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="low">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <RadioButtonUnchecked fontSize="small" color="success" sx={{ mr: 1 }} />
                      Low
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Flag fontSize="small" color="warning" sx={{ mr: 1 }} />
                      Medium
                    </Box>
                  </MenuItem>
                  <MenuItem value="high">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PriorityHigh fontSize="small" color="error" sx={{ mr: 1 }} />
                      High
                    </Box>
                  </MenuItem>
                  <MenuItem value="urgent">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PriorityHigh fontSize="small" sx={{ mr: 1, color: 'error.dark' }} />
                      Urgent
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleInputChange}
                  name="status"
                  label="Status"
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="to-do">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Assignment fontSize="small" sx={{ mr: 1 }} />
                      To Do
                    </Box>
                  </MenuItem>
                  <MenuItem value="in-progress">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssignmentLate fontSize="small" color="primary" sx={{ mr: 1 }} />
                      In Progress
                    </Box>
                  </MenuItem>
                  <MenuItem value="review">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Assignment fontSize="small" color="info" sx={{ mr: 1 }} />
                      Review
                    </Box>
                  </MenuItem>
                  <MenuItem value="completed">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleOutline fontSize="small" color="success" sx={{ mr: 1 }} />
                      Completed
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={handleDueDateChange}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    error: !!errors.dueDate,
                    helperText: errors.dueDate,
                    InputProps: {
                      sx: { borderRadius: '8px' }
                    }
                  } 
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={caseOptions}
                getOptionLabel={(option) => `${option.title} (${option.caseNumber})`}
                value={formData.caseReference}
                onChange={handleCaseReferenceChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Case Reference"
                    error={!!errors.caseReference}
                    helperText={errors.caseReference}
                    InputProps={{
                      ...params.InputProps,
                      sx: { borderRadius: '8px' }
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'background.paper', 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Subtasks
                </Typography>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    label="New Subtask"
                    fullWidth
                    size="small"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                    InputProps={{
                      sx: { borderRadius: '8px' }
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ 
                      ml: 1,
                      borderRadius: '8px',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={handleAddSubtask}
                    disabled={!newSubtask.trim()}
                  >
                    <Add fontSize="small" />
                  </Button>
                </Box>
                
                {formData.subtasks.length > 0 && (
                  <List sx={{ 
                    bgcolor: 'background.subtle', 
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    {formData.subtasks.map((subtask, index) => (
                      <ListItem 
                        key={index} 
                        dense
                        sx={{
                          borderBottom: index < formData.subtasks.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider'
                        }}
                      >
                        <ListItemText primary={subtask} />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={() => handleRemoveSubtask(index)} 
                            size="small"
                            sx={{
                              backgroundColor: 'background.subtle',
                              '&:hover': {
                                backgroundColor: 'action.hover'
                              }
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'background.paper', 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Recurrence
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.recurrence.enabled}
                      onChange={handleRecurrenceEnabledChange}
                      name="recurrenceEnabled"
                      color="primary"
                    />
                  }
                  label="This is a recurring task"
                />
                
                {formData.recurrence.enabled && (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors.recurrencePattern}>
                        <InputLabel>Repeat</InputLabel>
                        <Select
                          value={formData.recurrence.pattern}
                          onChange={handleRecurrencePatternChange}
                          label="Repeat"
                          sx={{ borderRadius: '8px' }}
                        >
                          {recurrencePatternOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.recurrencePattern && (
                          <FormHelperText>{errors.recurrencePattern}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    
                    {formData.recurrence.pattern !== 'none' && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label={`Every ${formData.recurrence.pattern === 'daily' ? 'Day' : 
                                       formData.recurrence.pattern === 'weekly' ? 'Week' : 'Month'}`}
                          type="number"
                          fullWidth
                          value={formData.recurrence.interval}
                          onChange={handleRecurrenceIntervalChange}
                          InputProps={{ 
                            inputProps: { min: 1 },
                            sx: { borderRadius: '8px' }
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
        
        {/* Tab 1: Assignment */}
        {currentTab === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Individual Assignees
                <Tooltip title="Assign the task to specific team members">
                  <Info fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', opacity: 0.6 }} />
                </Tooltip>
              </Typography>
              <Autocomplete
                multiple
                options={assigneeOptions}
                getOptionLabel={(option) => option.name}
                value={formData.assignees}
                onChange={handleAssigneesChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign To"
                    fullWidth
                    error={!!errors.assignees && !formData.team}
                    helperText={errors.assignees && !formData.team ? errors.assignees : ''}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      avatar={<Avatar alt={option.name} src={option.avatar} />}
                      label={`${option.name} (${option.role})`}
                      {...getTagProps({ index })}
                      sx={{ m: 0.25 }}
                    />
                  ))
                }
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        alt={option.name}
                        src={option.avatar}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
                        ({option.role})
                      </Typography>
                    </Box>
                  </li>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Team Assignment
                <Tooltip title="Assign the task to an entire team">
                  <Info fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', opacity: 0.6 }} />
                </Tooltip>
              </Typography>
              <Autocomplete
                options={teamOptions}
                getOptionLabel={(option) => option.name}
                value={formData.team}
                onChange={handleTeamChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign to Team"
                    fullWidth
                    error={!!errors.assignees && formData.assignees.length === 0}
                    helperText={errors.assignees && formData.assignees.length === 0 ? errors.assignees : ''}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Group sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">{option.name}</Typography>
                    </Box>
                  </li>
                )}
              />
              {formData.team && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    icon={<Group />} 
                    label={formData.team.name} 
                    color="primary" 
                    variant="outlined" 
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    This task will be visible to all team members
                  </Typography>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Backup Assignee
                <Tooltip title="Designate a backup person for critical tasks">
                  <Info fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', opacity: 0.6 }} />
                </Tooltip>
              </Typography>
              <Autocomplete
                options={assigneeOptions}
                getOptionLabel={(option) => option.name}
                value={formData.backupAssignee}
                onChange={handleBackupAssigneeChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Backup Assignee"
                    fullWidth
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        alt={option.name}
                        src={option.avatar}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
                        ({option.role})
                      </Typography>
                    </Box>
                  </li>
                )}
              />
              {formData.backupAssignee && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  {formData.backupAssignee.name} will be notified if the primary assignee(s) is unavailable
                </Typography>
              )}
            </Grid>
          </Grid>
        )}
        
        {/* Tab 2: Time & Billing */}
        {currentTab === 2 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Time Estimation & Billing
                <Tooltip title="Track time spent on tasks with billable hours">
                  <Info fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', opacity: 0.6 }} />
                </Tooltip>
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Estimated Hours"
                type="number"
                fullWidth
                value={formData.timeTracking.estimatedHours}
                onChange={handleEstimatedHoursChange}
                InputProps={{ 
                  inputProps: { min: 0, step: 0.25 },
                  startAdornment: <AccessTime fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
                }}
                helperText="Estimated time to complete this task"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.timeTracking.billable}
                    onChange={handleBillableChange}
                    color="primary"
                  />
                }
                label="Billable"
              />
              {formData.timeTracking.billable && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Time tracked on this task will be available for invoicing
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Budget Alerts
                <Tooltip title="Get notifications when time exceeds budget">
                  <Info fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', opacity: 0.6 }} />
                </Tooltip>
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.timeTracking.budgetAlert.enabled}
                    onChange={handleBudgetAlertEnabledChange}
                    color="primary"
                  />
                }
                label="Enable Budget Alert"
              />
            </Grid>
            
            {formData.timeTracking.budgetAlert.enabled && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Budget Threshold (hours)"
                  type="number"
                  fullWidth
                  value={formData.timeTracking.budgetAlert.threshold}
                  onChange={handleBudgetThresholdChange}
                  InputProps={{ 
                    inputProps: { min: 0, step: 0.5 },
                    startAdornment: <Warning fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                  }}
                  error={!!errors.budgetThreshold}
                  helperText={errors.budgetThreshold || "You'll be notified when logged time exceeds this threshold"}
                />
              </Grid>
            )}
          </Grid>
        )}
        
        {/* Tab 3: Attachments */}
        {currentTab === 3 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Attachments
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
              />
            </Grid>
            
            {selectedFiles.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Files
                </Typography>
                <List>
                  {selectedFiles.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={file.name} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleRemoveFile(index)} size="small">
                          <Close fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
        )}
        
        {/* Tab 4: Dependencies */}
        {currentTab === 4 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Task Dependencies
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={taskOptions}
                getOptionLabel={(option) => option.title}
                value={formData.dependencies}
                onChange={handleDependenciesChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Dependency"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        )}
        
        {/* Tab 5: Deadlines */}
        {currentTab === 5 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Court Deadlines
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.courtRules.enabled}
                    onChange={handleCourtRulesEnabledChange}
                    color="primary"
                  />
                }
                label="Enable Court Rules"
              />
            </Grid>
            
            {formData.courtRules.enabled && (
              <Grid item xs={12}>
                <Autocomplete
                  options={jurisdictionOptions}
                  getOptionLabel={(option) => option.label}
                  value={formData.courtRules.jurisdiction}
                  onChange={handleJurisdictionChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Jurisdiction"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
        )}
        
        {/* Tab 6: Permissions */}
        {currentTab === 6 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Permissions
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                View Permissions
              </Typography>
              <Autocomplete
                multiple
                options={formData.permissions.view}
                value={formData.permissions.view}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    permissions: {
                      ...formData.permissions,
                      view: newValue
                    }
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add View Permission"
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Edit Permissions
              </Typography>
              <Autocomplete
                multiple
                options={formData.permissions.edit}
                value={formData.permissions.edit}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    permissions: {
                      ...formData.permissions,
                      edit: newValue
                    }
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Edit Permission"
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Delete Permissions
              </Typography>
              <Autocomplete
                multiple
                options={formData.permissions.delete}
                value={formData.permissions.delete}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    permissions: {
                      ...formData.permissions,
                      delete: newValue
                    }
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Delete Permission"
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Assign Task Permissions
              </Typography>
              <Autocomplete
                multiple
                options={formData.permissions.assignTask}
                value={formData.permissions.assignTask}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    permissions: {
                      ...formData.permissions,
                      assignTask: newValue
                    }
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Assign Task Permission"
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Add Comment Permissions
              </Typography>
              <Autocomplete
                multiple
                options={formData.permissions.addComment}
                value={formData.permissions.addComment}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    permissions: {
                      ...formData.permissions,
                      addComment: newValue
                    }
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Add Comment Permission"
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Add Attachment Permissions
              </Typography>
              <Autocomplete
                multiple
                options={formData.permissions.addAttachment}
                value={formData.permissions.addAttachment}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    permissions: {
                      ...formData.permissions,
                      addAttachment: newValue
                    }
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Add Attachment Permission"
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Log Time Permissions
              </Typography>
              <Autocomplete
                multiple
                options={formData.permissions.logTime}
                value={formData.permissions.logTime}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    permissions: {
                      ...formData.permissions,
                      logTime: newValue
                    }
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Log Time Permission"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, backgroundColor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }
          }}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTaskDialog; 