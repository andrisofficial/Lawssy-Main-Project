import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Chip, 
  Avatar, 
  AvatarGroup, 
  IconButton, 
  Tooltip,
  Divider,
  Stack,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  LinearProgress,
  alpha
} from '@mui/material';
import { 
  MoreVert, 
  Flag, 
  CalendarToday, 
  AccessTime,
  Assignment,
  AssignmentLate,
  AssignmentTurnedIn,
  Folder,
  Comment,
  Edit,
  Delete,
  Warning,
  Refresh,
  CheckCircleOutline,
  RadioButtonUnchecked,
  PriorityHigh,
  Schedule,
  AttachFile
} from '@mui/icons-material';
import { format, isToday, isTomorrow, isPast, parseISO, isBefore } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTask } from '../../contexts/TaskContext';

const TaskBoard = ({ tasks, onTaskClick, onDeleteTask, onStatusChange }) => {
  const theme = useTheme();
  const { updateTask } = useTask();
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [selectedTaskForAction, setSelectedTaskForAction] = useState(null);
  
  // Group tasks by status
  const tasksByStatus = {
    'to-do': tasks.filter(task => task.status === 'to-do'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    'completed': tasks.filter(task => task.status === 'completed')
  };
  
  // Handle drag end
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    // If dropped outside a droppable area
    if (!destination) return;
    
    // If dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // If status changed
    if (destination.droppableId !== source.droppableId) {
      const taskId = parseInt(draggableId.split('-')[1]);
      const task = tasks.find(t => t.id === taskId);
      
      if (task) {
        try {
          await updateTask({
            ...task,
            status: destination.droppableId
          });
        } catch (err) {
          console.error('Error updating task status:', err);
        }
      }
    }
  };
  
  // Handle action menu open
  const handleActionMenuOpen = (event, task) => {
    event.stopPropagation();
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedTaskForAction(task);
  };
  
  // Handle action menu close
  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
    setSelectedTaskForAction(null);
  };
  
  // Handle action selection
  const handleActionSelect = (action) => {
    if (!selectedTaskForAction) return;
    
    switch (action) {
      case 'edit':
        onTaskClick(selectedTaskForAction);
        break;
      case 'delete':
        onDeleteTask(selectedTaskForAction.id);
        break;
      case 'status-todo':
        onStatusChange(selectedTaskForAction.id, 'to-do');
        break;
      case 'status-in-progress':
        onStatusChange(selectedTaskForAction.id, 'in-progress');
        break;
      case 'status-completed':
        onStatusChange(selectedTaskForAction.id, 'completed');
        break;
      default:
        break;
    }
    
    handleActionMenuClose();
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
      case 'urgent':
        return theme.palette.error.dark;
      default:
        return theme.palette.info.main;
    }
  };
  
  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return <PriorityHigh fontSize="small" />;
      case 'medium':
        return <Flag fontSize="small" />;
      case 'low':
        return <RadioButtonUnchecked fontSize="small" />;
      default:
        return <Flag fontSize="small" />;
    }
  };
  
  // Get type label
  const getTypeLabel = (type) => {
    const typeMap = {
      'document': 'Document',
      'meeting': 'Meeting',
      'research': 'Research',
      'court': 'Court',
      'deadline': 'Deadline',
      'client_meeting': 'Client',
      'deposition': 'Deposition',
      'filing': 'Filing',
      'custom': 'Custom'
    };
    
    return typeMap[type] || type;
  };
  
  // Get type color
  const getTypeColor = (type) => {
    const typeColorMap = {
      'document': theme.palette.primary.main,
      'meeting': theme.palette.secondary.main,
      'research': theme.palette.info.main,
      'court': theme.palette.error.main,
      'deadline': theme.palette.warning.main,
      'client_meeting': theme.palette.success.main,
      'deposition': theme.palette.error.light,
      'filing': theme.palette.primary.dark,
      'custom': theme.palette.grey[700]
    };
    
    return typeColorMap[type] || theme.palette.grey[700];
  };
  
  // Get due date color and format
  const getDueDateInfo = (dueDate) => {
    if (!dueDate) return { color: theme.palette.text.secondary, text: 'No due date' };
    
    try {
      // Check if dueDate is already a Date object
      const date = dueDate instanceof Date ? dueDate : parseISO(dueDate);
      
      // Validate if the date is valid
      if (isNaN(date.getTime())) {
        return { color: theme.palette.text.secondary, text: 'Invalid date' };
      }
      
      let color = theme.palette.text.secondary;
      let text = format(date, 'MMM d, yyyy');
      
      if (isToday(date)) {
        color = theme.palette.warning.main;
        text = 'Today';
      } else if (isTomorrow(date)) {
        color = theme.palette.info.main;
        text = 'Tomorrow';
      } else if (isPast(date)) {
        color = theme.palette.error.main;
        text = `Overdue: ${format(date, 'MMM d')}`;
      }
      
      return { color, text };
    } catch (error) {
      console.error('Error formatting date:', error);
      return { color: theme.palette.text.secondary, text: 'Invalid date format' };
    }
  };
  
  // Calculate completion percentage for subtasks
  const getCompletionPercentage = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(s => s.status === 'completed').length;
    return Math.round((completed / subtasks.length) * 100);
  };

  const renderTaskCard = (task, index, status) => {
    const dueDateInfo = getDueDateInfo(task.dueDate);
    const completionPercentage = getCompletionPercentage(task.subtasks);
    const typeColor = getTypeColor(task.type);
    const priorityColor = getPriorityColor(task.priority);
    
    return (
      <Draggable key={`task-${task.id}`} draggableId={`task-${task.id}`} index={index}>
        {(provided) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              mb: 2,
              cursor: 'pointer',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              overflow: 'visible',
              position: 'relative',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: priorityColor,
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
              }
            }}
            onClick={() => onTaskClick(task)}
          >
            <CardContent sx={{ pb: 1 }}>
              {/* Task header with title and menu */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="600" noWrap sx={{ flexGrow: 1 }}>
                    {task.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {task.conflict && (
                    <Tooltip title="Potential conflict detected">
                      <Warning color="warning" sx={{ mr: 0.5 }} />
                    </Tooltip>
                  )}
                  {task.recurrence && (
                    <Tooltip title="Recurring task">
                      <Refresh color="info" sx={{ mr: 0.5 }} />
                    </Tooltip>
                  )}
                  <IconButton
                    size="small"
                    onClick={(event) => handleActionMenuOpen(event, task)}
                    sx={{ ml: 0.5 }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              
              {/* Task type and priority */}
              <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                <Chip 
                  label={getTypeLabel(task.type)} 
                  size="small" 
                  sx={{ 
                    backgroundColor: alpha(typeColor, 0.1),
                    color: typeColor,
                    fontWeight: 500,
                    borderRadius: '6px',
                  }}
                />
                <Chip 
                  icon={getPriorityIcon(task.priority)}
                  label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  size="small"
                  sx={{ 
                    backgroundColor: alpha(priorityColor, 0.1),
                    color: priorityColor,
                    fontWeight: 500,
                    borderRadius: '6px',
                  }}
                />
              </Stack>
              
              {/* Subtasks progress */}
              {task.subtasks && task.subtasks.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Subtasks: {task.subtasks.filter(s => s.status === 'completed').length}/{task.subtasks.length}
                    </Typography>
                    <Typography variant="caption" fontWeight="600" color="text.secondary">
                      {completionPercentage}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={completionPercentage} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette.primary.main,
                      }
                    }} 
                  />
                </Box>
              )}
              
              {/* Due date */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Schedule fontSize="small" sx={{ mr: 1, color: dueDateInfo.color }} />
                <Typography variant="body2" color={dueDateInfo.color} fontWeight={dueDateInfo.text === 'Today' || dueDateInfo.text.includes('Overdue') ? 600 : 400}>
                  {dueDateInfo.text}
                </Typography>
              </Box>
              
              {/* Case reference */}
              {task.caseReference && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Folder fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" noWrap color="text.secondary">
                    {task.caseReference.title}
                  </Typography>
                </Box>
              )}
              
              {/* Attachments indicator */}
              {task.attachments && task.attachments.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachFile fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary, transform: 'rotate(45deg)' }} />
                  <Typography variant="body2" color="text.secondary">
                    {task.attachments.length} attachment{task.attachments.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              )}
            </CardContent>
            
            <Divider sx={{ opacity: 0.6 }} />
            
            <CardActions sx={{ pt: 1, pb: 1, px: 2, justifyContent: 'space-between' }}>
              {/* Assignees */}
              {task.assignees && task.assignees.length > 0 ? (
                <AvatarGroup 
                  max={3} 
                  sx={{ 
                    '& .MuiAvatar-root': { 
                      width: 28, 
                      height: 28, 
                      fontSize: '0.75rem',
                      border: `2px solid ${theme.palette.background.paper}`,
                    } 
                  }}
                >
                  {task.assignees.map(assignee => (
                    <Tooltip key={assignee.id} title={assignee.name}>
                      <Avatar 
                        alt={assignee.name} 
                        src={assignee.avatar}
                        sx={{ 
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Unassigned
                </Typography>
              )}
              
              {/* Status indicator */}
              <Chip
                icon={status === 'completed' ? <CheckCircleOutline fontSize="small" /> : null}
                label={status === 'to-do' ? 'To Do' : 
                       status === 'in-progress' ? 'In Progress' : 
                       'Completed'}
                size="small"
                color={status === 'to-do' ? 'default' : 
                       status === 'in-progress' ? 'primary' : 
                       'success'}
                variant={status === 'completed' ? 'filled' : 'outlined'}
                sx={{ 
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                }}
              />
            </CardActions>
          </Card>
        )}
      </Draggable>
    );
  };
  
  // Render column content
  const renderColumnContent = (status, tasks) => {
    const statusLabels = {
      'to-do': 'To Do',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    };
    
    const statusIcons = {
      'to-do': <Assignment fontSize="small" sx={{ mr: 1 }} />,
      'in-progress': <AssignmentLate fontSize="small" sx={{ mr: 1 }} />,
      'completed': <CheckCircleOutline fontSize="small" sx={{ mr: 1 }} />
    };
    
    const statusColors = {
      'to-do': theme.palette.grey[700],
      'in-progress': theme.palette.primary.main,
      'completed': theme.palette.success.main
    };
    
    return (
      <Box sx={{ width: '100%', height: '100%' }}>
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {statusIcons[status]}
            <Typography variant="subtitle1" fontWeight={600} color={statusColors[status]}>
              {statusLabels[status]}
            </Typography>
          </Box>
          <Chip 
            label={tasks.length} 
            size="small" 
            sx={{ 
              fontWeight: 600,
              backgroundColor: alpha(statusColors[status], 0.1),
              color: statusColors[status]
            }} 
          />
        </Box>
        <Box sx={{ p: 2, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
          {tasks.map((task, index) => renderTaskCard(task, index, status))}
          {tasks.length === 0 && (
            <Box 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'text.secondary',
                p: 2,
                textAlign: 'center'
              }}
            >
              <Assignment sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
              <Typography variant="body2">
                No tasks in this column
              </Typography>
              <Typography variant="caption">
                Drag and drop tasks here
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };
  
  return (
    <Box sx={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', flexGrow: 1, gap: 2, height: '100%', overflow: 'hidden' }}>
          <Droppable droppableId="to-do">
            {(provided) => (
              <Paper 
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ 
                  width: '33.33%', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {renderColumnContent('to-do', tasksByStatus['to-do'])}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
          
          <Droppable droppableId="in-progress">
            {(provided) => (
              <Paper 
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ 
                  width: '33.33%', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {renderColumnContent('in-progress', tasksByStatus['in-progress'])}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
          
          <Droppable droppableId="completed">
            {(provided) => (
              <Paper 
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ 
                  width: '33.33%', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {renderColumnContent('completed', tasksByStatus['completed'])}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
        </Box>
      </DragDropContext>
      
      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            minWidth: 180
          }
        }}
      >
        <MenuItem onClick={() => handleActionSelect('edit')}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Task</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleActionSelect('delete')}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Task</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleActionSelect('status-todo')}>
          <ListItemIcon>
            <Assignment fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as To Do</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleActionSelect('status-in-progress')}>
          <ListItemIcon>
            <AssignmentLate fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Mark as In Progress</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleActionSelect('status-completed')}>
          <ListItemIcon>
            <CheckCircleOutline fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Mark as Completed</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TaskBoard; 