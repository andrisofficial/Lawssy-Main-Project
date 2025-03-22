import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  AvatarGroup,
  Tooltip,
  Typography,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  alpha,
  LinearProgress,
  Badge,
  useTheme
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Flag,
  Assignment,
  AssignmentLate,
  AssignmentTurnedIn,
  CalendarToday,
  Person,
  Folder,
  Warning,
  Refresh,
  CheckCircleOutline,
  RadioButtonUnchecked,
  PriorityHigh,
  Schedule,
  AttachFile
} from '@mui/icons-material';
import { format, parseISO, isAfter, isBefore, isToday, isTomorrow, isPast } from 'date-fns';
import { useTask } from '../../contexts/TaskContext';

const TaskList = ({ tasks, onTaskClick, onDeleteTask, onStatusChange }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('dueDate');
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [selectedTaskForAction, setSelectedTaskForAction] = useState(null);
  
  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle select all click
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = tasks.map(task => task.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  
  // Handle click on a row checkbox
  const handleSelectClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(item => item !== id);
    }
    
    setSelected(newSelected);
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
  
  // Check if a task is selected
  const isSelected = (id) => selected.indexOf(id) !== -1;
  
  // Get status chip color
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'to-do':
        return 'default';
      case 'in-progress':
        return 'primary';
      case 'review':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'to-do':
        return <Assignment />;
      case 'in-progress':
        return <AssignmentLate />;
      case 'review':
        return <Assignment />;
      case 'completed':
        return <CheckCircleOutline />;
      default:
        return <Assignment />;
    }
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
  
  // Get due date info
  const getDueDateInfo = (dueDate) => {
    if (!dueDate) return { color: theme.palette.text.secondary, text: 'No due date' };
    
    try {
      // Check if dueDate is already a Date object or needs parsing
      let date;
      if (dueDate instanceof Date) {
        date = dueDate;
      } else if (typeof dueDate === 'string') {
        date = parseISO(dueDate);
      } else {
        return { color: theme.palette.text.secondary, text: 'Invalid date format' };
      }
      
      // Validate if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', dueDate);
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
      console.error('Error formatting date:', error, dueDate);
      return { color: theme.palette.text.secondary, text: 'Invalid date format' };
    }
  };
  
  // Calculate completion percentage for subtasks
  const getCompletionPercentage = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(s => s.status === 'completed').length;
    return Math.round((completed / subtasks.length) * 100);
  };
  
  // Sort function for tasks
  const sortFunction = (a, b) => {
    // Helper function to get comparable values
    const getValue = (task, field) => {
      switch (field) {
        case 'title':
          return task.title.toLowerCase();
        case 'type':
          return task.type;
        case 'priority': {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[task.priority] || 999;
        }
        case 'status': {
          const statusOrder = { 'to-do': 0, 'in-progress': 1, 'review': 2, 'completed': 3 };
          return statusOrder[task.status] || 999;
        }
        case 'dueDate':
          return task.dueDate ? new Date(task.dueDate).getTime() : Infinity;
        default:
          return task[field];
      }
    };
    
    const aValue = getValue(a, orderBy);
    const bValue = getValue(b, orderBy);
    
    if (bValue < aValue) {
      return order === 'asc' ? 1 : -1;
    }
    if (bValue > aValue) {
      return order === 'asc' ? -1 : 1;
    }
    return 0;
  };
  
  // Paginate and sort tasks
  const paginatedTasks = tasks
    .slice()
    .sort(sortFunction)
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  return (
    <Box>
      <TableContainer 
        component={Paper} 
        sx={{ 
          mb: 2, 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        <Table size="medium">
          <TableHead sx={{ backgroundColor: theme.palette.background.default }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < tasks.length}
                  checked={tasks.length > 0 && selected.length === tasks.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'title'}
                  direction={orderBy === 'title' ? order : 'asc'}
                  onClick={() => handleRequestSort('title')}
                >
                  <Typography variant="subtitle2" fontWeight={600}>Title</Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'type'}
                  direction={orderBy === 'type' ? order : 'asc'}
                  onClick={() => handleRequestSort('type')}
                >
                  <Typography variant="subtitle2" fontWeight={600}>Type</Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'priority'}
                  direction={orderBy === 'priority' ? order : 'asc'}
                  onClick={() => handleRequestSort('priority')}
                >
                  <Typography variant="subtitle2" fontWeight={600}>Priority</Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  <Typography variant="subtitle2" fontWeight={600}>Status</Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'dueDate'}
                  direction={orderBy === 'dueDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('dueDate')}
                >
                  <Typography variant="subtitle2" fontWeight={600}>Due Date</Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Assignees</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Case</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTasks.map((task) => {
              const isItemSelected = isSelected(task.id);
              const dueDateInfo = getDueDateInfo(task.dueDate);
              const completionPercentage = getCompletionPercentage(task.subtasks);
              const typeColor = getTypeColor(task.type);
              
              return (
                <TableRow
                  hover
                  onClick={() => onTaskClick(task)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={task.id}
                  selected={isItemSelected}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    }
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSelectClick(event, task.id);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {task.conflict && (
                        <Tooltip title="Potential conflict detected">
                          <Warning color="warning" sx={{ mr: 1 }} />
                        </Tooltip>
                      )}
                      {task.recurrence && (
                        <Tooltip title="Recurring task">
                          <Refresh color="info" sx={{ mr: 1 }} />
                        </Tooltip>
                      )}
                      <Typography variant="body2" fontWeight={500}>{task.title}</Typography>
                    </Box>
                    {task.subtasks && task.subtasks.length > 0 && (
                      <Box sx={{ mt: 0.5, width: '100%', maxWidth: 180 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {task.subtasks.filter(s => s.status === 'completed').length}/{task.subtasks.length} subtasks
                          </Typography>
                          <Typography variant="caption" fontWeight={600} color="text.secondary">
                            {completionPercentage}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={completionPercentage} 
                          sx={{ 
                            height: 4, 
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: theme.palette.primary.main,
                            }
                          }} 
                        />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getPriorityIcon(task.priority)}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          ml: 0.5,
                          color: getPriorityColor(task.priority),
                          textTransform: 'capitalize',
                          fontWeight: 500
                        }}
                      >
                        {task.priority}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(task.status)}
                      label={task.status === 'to-do' ? 'To Do' : 
                             task.status === 'in-progress' ? 'In Progress' : 
                             task.status === 'review' ? 'Review' :
                             'Completed'}
                      color={getStatusChipColor(task.status)}
                      size="small"
                      variant={task.status === 'completed' ? 'filled' : 'outlined'}
                      sx={{ 
                        borderRadius: '6px',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Schedule fontSize="small" sx={{ mr: 1, color: dueDateInfo.color }} />
                      <Typography 
                        variant="body2" 
                        color={dueDateInfo.color} 
                        fontWeight={dueDateInfo.text === 'Today' || dueDateInfo.text.includes('Overdue') ? 600 : 400}
                      >
                        {dueDateInfo.text}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {task.assignees && task.assignees.length > 0 ? (
                      <AvatarGroup 
                        max={3} 
                        sx={{ 
                          justifyContent: 'flex-start',
                          '& .MuiAvatar-root': { 
                            width: 28, 
                            height: 28, 
                            fontSize: '0.75rem',
                            border: `2px solid #fff`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          } 
                        }}
                      >
                        {task.assignees.map(assignee => (
                          <Tooltip key={assignee.id} title={assignee.name}>
                            <Avatar alt={assignee.name} src={assignee.avatar} />
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unassigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.caseReference ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Folder fontSize="small" sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 120 }}>
                          {task.caseReference.title}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(event) => handleActionMenuOpen(event, task)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={tasks.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontWeight: 500
          }
        }}
      />
      
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

export default TaskList; 