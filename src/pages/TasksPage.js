import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Button, 
  IconButton, 
  Grid, 
  Paper, 
  Divider, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip,
  CircularProgress,
  Badge,
  Chip,
  Avatar,
  Stack,
  useTheme,
  Collapse
} from '@mui/material';
import { 
  Add, 
  FilterList, 
  Sort, 
  MoreVert, 
  Search, 
  Assignment, 
  AssignmentLate, 
  AssignmentTurnedIn, 
  AccessTime, 
  Flag, 
  Person, 
  Folder, 
  CalendarToday,
  Print,
  GetApp,
  Refresh,
  Check,
  ArrowUpward,
  ArrowDownward,
  ViewColumn
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { useTask } from '../contexts/TaskContext';
import TaskList from '../components/tasks/TaskList';
import TaskBoard from '../components/tasks/TaskBoard';
import TaskCalendar from '../components/tasks/TaskCalendar';
import TaskFilters from '../components/tasks/TaskFilters';
import NewTaskDialog from '../components/tasks/NewTaskDialog';
import TaskDetailsDialog from '../components/tasks/TaskDetailsDialog';
import TaskAnalytics from '../components/tasks/TaskAnalytics';
import { useSnackbar } from 'notistack';

const TasksPage = () => {
  const theme = useTheme();
  const { tasks, loading, error, fetchTasks, updateTask, deleteTask } = useTask();
  const { enqueueSnackbar } = useSnackbar();
  const [viewMode, setViewMode] = useState('list'); // 'list', 'board', 'calendar'
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [taskDetailsDialogOpen, setTaskDetailsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    type: [],
    assignee: [],
    case: [],
    dueDate: null
  });
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate', 'priority', 'title', 'createdAt'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc', 'desc'
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle view mode change
  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };

  // Handle filter menu open
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };

  // Handle filter menu close
  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null);
  };

  // Handle sort menu open
  const handleSortMenuOpen = (event) => {
    setSortMenuAnchorEl(event.currentTarget);
  };

  // Handle sort menu close
  const handleSortMenuClose = () => {
    setSortMenuAnchorEl(null);
  };

  // Handle more menu open
  const handleMoreMenuOpen = (event) => {
    setMoreMenuAnchorEl(event.currentTarget);
  };

  // Handle more menu close
  const handleMoreMenuClose = () => {
    setMoreMenuAnchorEl(null);
  };

  // Handle new task dialog open
  const handleNewTaskDialogOpen = () => {
    setNewTaskDialogOpen(true);
  };

  // Handle new task dialog close
  const handleNewTaskDialogClose = () => {
    setNewTaskDialogOpen(false);
  };

  // Handle task details dialog open
  const handleTaskDetailsDialogOpen = (task) => {
    setSelectedTask(task);
    setTaskDetailsDialogOpen(true);
  };

  // Handle task details dialog close
  const handleTaskDetailsDialogClose = () => {
    setTaskDetailsDialogOpen(false);
    setSelectedTask(null);
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    handleSortMenuClose();
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchTasks();
  };

  // Handle toggle filters
  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle toggle analytics
  const handleToggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
    handleMoreMenuClose();
  };

  // Handle task status change
  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      await updateTask({
        ...taskToUpdate,
        status: newStatus
      });
      
      enqueueSnackbar(`Task status updated to ${newStatus === 'to-do' ? 'To Do' : newStatus === 'in-progress' ? 'In Progress' : 'Completed'}`, {
        variant: 'success'
      });
    } catch (err) {
      console.error('Error updating task status:', err);
      enqueueSnackbar('Failed to update task status', {
        variant: 'error'
      });
    }
  };
  
  // Handle task deletion
  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      
      enqueueSnackbar('Task deleted successfully', {
        variant: 'success'
      });
    } catch (err) {
      console.error('Error deleting task:', err);
      enqueueSnackbar('Failed to delete task', {
        variant: 'error'
      });
    }
  };

  // Filter and sort tasks
  const getFilteredAndSortedTasks = () => {
    // Apply filters
    let filteredTasks = [...tasks];
    
    if (filters.status.length > 0) {
      filteredTasks = filteredTasks.filter(task => filters.status.includes(task.status));
    }
    
    if (filters.priority.length > 0) {
      filteredTasks = filteredTasks.filter(task => filters.priority.includes(task.priority));
    }
    
    if (filters.type.length > 0) {
      filteredTasks = filteredTasks.filter(task => filters.type.includes(task.type));
    }
    
    if (filters.assignee.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        task.assignees && task.assignees.some(assignee => 
          filters.assignee.includes(assignee.id)
        )
      );
    }
    
    if (filters.case.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        task.caseReference && filters.case.includes(task.caseReference.id)
      );
    }
    
    if (filters.dueDate) {
      const { start, end } = filters.dueDate;
      filteredTasks = filteredTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= start && dueDate <= end;
      });
    }
    
    // Apply sorting
    filteredTasks.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'dueDate':
          valueA = a.dueDate ? new Date(a.dueDate) : new Date(9999, 11, 31);
          valueB = b.dueDate ? new Date(b.dueDate) : new Date(9999, 11, 31);
          break;
        case 'priority':
          const priorityValues = { high: 3, medium: 2, low: 1 };
          valueA = priorityValues[a.priority] || 0;
          valueB = priorityValues[b.priority] || 0;
          break;
        case 'title':
          valueA = a.title || '';
          valueB = b.title || '';
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
          break;
        default:
          valueA = a.dueDate ? new Date(a.dueDate) : new Date(9999, 11, 31);
          valueB = b.dueDate ? new Date(b.dueDate) : new Date(9999, 11, 31);
      }
      
      if (sortBy === 'title') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        return sortDirection === 'asc' 
          ? valueA - valueB 
          : valueB - valueA;
      }
    });
    
    return filteredTasks;
  };

  // Get task counts by status
  const getTaskCountsByStatus = () => {
    const counts = {
      total: tasks.length,
      'to-do': tasks.filter(task => task.status === 'to-do').length,
      'in-progress': tasks.filter(task => task.status === 'in-progress').length,
      'completed': tasks.filter(task => task.status === 'completed').length
    };
    return counts;
  };

  // Render task counts
  const renderTaskCounts = () => {
    const counts = getTaskCountsByStatus();
    
    return (
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Chip
          icon={<Assignment />}
          label={`Total: ${counts.total}`}
          color="default"
          variant="outlined"
        />
        <Chip
          icon={<AssignmentLate />}
          label={`To Do: ${counts['to-do']}`}
          color="error"
          variant="outlined"
        />
        <Chip
          icon={<AccessTime />}
          label={`In Progress: ${counts['in-progress']}`}
          color="warning"
          variant="outlined"
        />
        <Chip
          icon={<AssignmentTurnedIn />}
          label={`Completed: ${counts.completed}`}
          color="success"
          variant="outlined"
        />
      </Box>
    );
  };

  // Render content based on view mode
  const renderContent = () => {
    const filteredTasks = getFilteredAndSortedTasks();
    
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleRefresh}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      );
    }
    
    if (filteredTasks.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Try adjusting your filters or create a new task.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleNewTaskDialogOpen}
            startIcon={<Add />}
          >
            Create Task
          </Button>
        </Box>
      );
    }
    
    switch (viewMode) {
      case 'list':
        return (
          <TaskList 
            tasks={filteredTasks} 
            onTaskClick={handleTaskDetailsDialogOpen}
            onDeleteTask={handleTaskDelete}
            onStatusChange={handleTaskStatusChange}
          />
        );
      case 'board':
        return (
          <TaskBoard 
            tasks={filteredTasks} 
            onTaskClick={handleTaskDetailsDialogOpen}
            onDeleteTask={handleTaskDelete}
            onStatusChange={handleTaskStatusChange}
          />
        );
      case 'calendar':
        return (
          <TaskCalendar 
            tasks={filteredTasks} 
            onTaskClick={handleTaskDetailsDialogOpen}
            onDeleteTask={handleTaskDelete}
            onStatusChange={handleTaskStatusChange}
          />
        );
      default:
        return (
          <TaskList 
            tasks={filteredTasks} 
            onTaskClick={handleTaskDetailsDialogOpen}
            onDeleteTask={handleTaskDelete}
            onStatusChange={handleTaskStatusChange}
          />
        );
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {/* Header */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1">
                Tasks
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={handleNewTaskDialogOpen}
                  sx={{ mr: 1 }}
                >
                  New Task
                </Button>
                <IconButton onClick={handleFilterMenuOpen} sx={{ mr: 1 }}>
                  <FilterList />
                </IconButton>
                <IconButton onClick={handleSortMenuOpen} sx={{ mr: 1 }}>
                  <Sort />
                </IconButton>
                <IconButton onClick={handleMoreMenuOpen}>
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          
          {/* Task Counts */}
          <Grid item xs={12}>
            {renderTaskCounts()}
          </Grid>
          
          {/* View Tabs */}
          <Grid item xs={12}>
            <Tabs
              value={viewMode}
              onChange={handleViewModeChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              <Tab value="list" label="List View" icon={<Assignment />} />
              <Tab value="board" label="Board View" icon={<ViewColumn />} />
              <Tab value="calendar" label="Calendar View" icon={<CalendarToday />} />
            </Tabs>
          </Grid>
          
          {/* Filters */}
          <Grid item xs={12}>
            <Collapse in={showFilters}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <TaskFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </Paper>
            </Collapse>
          </Grid>
          
          {/* Analytics */}
          <Grid item xs={12}>
            <Collapse in={showAnalytics}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <TaskAnalytics tasks={tasks} />
              </Paper>
            </Collapse>
          </Grid>
          
          {/* Content */}
          <Grid item xs={12}>
            {renderContent()}
          </Grid>
        </Grid>
      </Box>
      
      {/* Task Dialogs */}
      <NewTaskDialog
        open={newTaskDialogOpen}
        onClose={handleNewTaskDialogClose}
      />
      
      {selectedTask && (
        <TaskDetailsDialog
          open={taskDetailsDialogOpen}
          onClose={handleTaskDetailsDialogClose}
          task={selectedTask}
        />
      )}
      
      {/* Menus */}
      <Menu
        anchorEl={filterMenuAnchorEl}
        open={Boolean(filterMenuAnchorEl)}
        onClose={handleFilterMenuClose}
      >
        <MenuItem onClick={() => { setShowFilters(!showFilters); handleFilterMenuClose(); }}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </MenuItem>
        <MenuItem onClick={() => { handleFilterChange({ status: [], priority: [], type: [], assignee: [], case: [], dueDate: null }); handleFilterMenuClose(); }}>
          Clear All Filters
        </MenuItem>
      </Menu>
      
      <Menu
        anchorEl={sortMenuAnchorEl}
        open={Boolean(sortMenuAnchorEl)}
        onClose={handleSortMenuClose}
      >
        <MenuItem onClick={() => handleSortChange('dueDate')}>
          <ListItemIcon>
            {sortBy === 'dueDate' && <Check />}
          </ListItemIcon>
          <ListItemText>Due Date</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('priority')}>
          <ListItemIcon>
            {sortBy === 'priority' && <Check />}
          </ListItemIcon>
          <ListItemText>Priority</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('title')}>
          <ListItemIcon>
            {sortBy === 'title' && <Check />}
          </ListItemIcon>
          <ListItemText>Title</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleSortChange('createdAt')}>
          <ListItemIcon>
            {sortBy === 'createdAt' && <Check />}
          </ListItemIcon>
          <ListItemText>Created Date</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
          <ListItemIcon>
            {sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
          </ListItemIcon>
          <ListItemText>{sortDirection === 'asc' ? 'Ascending' : 'Descending'}</ListItemText>
        </MenuItem>
      </Menu>
      
      <Menu
        anchorEl={moreMenuAnchorEl}
        open={Boolean(moreMenuAnchorEl)}
        onClose={handleMoreMenuClose}
      >
        <MenuItem onClick={() => { setShowAnalytics(!showAnalytics); handleMoreMenuClose(); }}>
          {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
        </MenuItem>
        <MenuItem onClick={() => { handleRefresh(); handleMoreMenuClose(); }}>
          <ListItemIcon>
            <Refresh />
          </ListItemIcon>
          <ListItemText>Refresh</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { window.print(); handleMoreMenuClose(); }}>
          <ListItemIcon>
            <Print />
          </ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { /* Export functionality */ handleMoreMenuClose(); }}>
          <ListItemIcon>
            <GetApp />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
      </Menu>
    </MainLayout>
  );
};

export default TasksPage; 