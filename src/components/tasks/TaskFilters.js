import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  OutlinedInput, 
  Checkbox, 
  ListItemText,
  Grid,
  Button,
  IconButton,
  useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Close, FilterList, Refresh } from '@mui/icons-material';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const TaskFilters = ({ filters, onFilterChange }) => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(filters.dueDate ? filters.dueDate.start : null);
  const [endDate, setEndDate] = useState(filters.dueDate ? filters.dueDate.end : null);

  // Status options
  const statusOptions = [
    { value: 'to-do', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  // Priority options
  const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  // Type options
  const typeOptions = [
    { value: 'document', label: 'Document' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'research', label: 'Research' },
    { value: 'court', label: 'Court' },
    { value: 'deadline', label: 'Deadline' }
  ];

  // Mock assignee options (in a real app, these would come from an API)
  const assigneeOptions = [
    { id: 201, name: 'Sarah Johnson' },
    { id: 202, name: 'Michael Brown' },
    { id: 203, name: 'Lisa Brown' },
    { id: 204, name: 'David Wilson' }
  ];

  // Mock case options (in a real app, these would come from an API)
  const caseOptions = [
    { id: 101, title: 'Johnson v. Smith' },
    { id: 102, title: 'Williams v. Johnson' },
    { id: 103, title: 'Davis Appeal' }
  ];

  // Handle status change
  const handleStatusChange = (event) => {
    const {
      target: { value },
    } = event;
    
    onFilterChange({
      ...filters,
      status: typeof value === 'string' ? value.split(',') : value,
    });
  };

  // Handle priority change
  const handlePriorityChange = (event) => {
    const {
      target: { value },
    } = event;
    
    onFilterChange({
      ...filters,
      priority: typeof value === 'string' ? value.split(',') : value,
    });
  };

  // Handle type change
  const handleTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    
    onFilterChange({
      ...filters,
      type: typeof value === 'string' ? value.split(',') : value,
    });
  };

  // Handle assignee change
  const handleAssigneeChange = (event) => {
    const {
      target: { value },
    } = event;
    
    onFilterChange({
      ...filters,
      assignee: typeof value === 'string' ? value.split(',') : value,
    });
  };

  // Handle case change
  const handleCaseChange = (event) => {
    const {
      target: { value },
    } = event;
    
    onFilterChange({
      ...filters,
      case: typeof value === 'string' ? value.split(',') : value,
    });
  };

  // Handle start date change
  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    
    if (newValue) {
      onFilterChange({
        ...filters,
        dueDate: {
          start: startOfDay(newValue),
          end: endDate ? endOfDay(endDate) : endOfDay(addDays(newValue, 30))
        }
      });
    } else if (!endDate) {
      onFilterChange({
        ...filters,
        dueDate: null
      });
    } else {
      onFilterChange({
        ...filters,
        dueDate: {
          start: startOfDay(new Date()),
          end: endOfDay(endDate)
        }
      });
    }
  };

  // Handle end date change
  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    
    if (newValue) {
      onFilterChange({
        ...filters,
        dueDate: {
          start: startDate ? startOfDay(startDate) : startOfDay(new Date()),
          end: endOfDay(newValue)
        }
      });
    } else if (!startDate) {
      onFilterChange({
        ...filters,
        dueDate: null
      });
    } else {
      onFilterChange({
        ...filters,
        dueDate: {
          start: startOfDay(startDate),
          end: endOfDay(addDays(startDate, 30))
        }
      });
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    
    onFilterChange({
      status: [],
      priority: [],
      type: [],
      assignee: [],
      case: [],
      dueDate: null
    });
  };

  // Get assignee name by ID
  const getAssigneeName = (id) => {
    const assignee = assigneeOptions.find(a => a.id === id);
    return assignee ? assignee.name : '';
  };

  // Get case title by ID
  const getCaseTitle = (id) => {
    const caseItem = caseOptions.find(c => c.id === id);
    return caseItem ? caseItem.title : '';
  };

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <Button 
          startIcon={<Refresh />} 
          onClick={handleClearFilters}
          size="small"
        >
          Clear All
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {/* Status Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              multiple
              value={filters.status}
              onChange={handleStatusChange}
              input={<OutlinedInput label="Status" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={statusOptions.find(option => option.value === value)?.label} 
                      size="small"
                      color={value === 'to-do' ? 'error' : value === 'in-progress' ? 'warning' : 'success'}
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={filters.status.indexOf(option.value) > -1} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Priority Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
              labelId="priority-filter-label"
              id="priority-filter"
              multiple
              value={filters.priority}
              onChange={handlePriorityChange}
              input={<OutlinedInput label="Priority" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={priorityOptions.find(option => option.value === value)?.label} 
                      size="small"
                      color={value === 'high' ? 'error' : value === 'medium' ? 'warning' : 'success'}
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={filters.priority.indexOf(option.value) > -1} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Type Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="type-filter-label">Type</InputLabel>
            <Select
              labelId="type-filter-label"
              id="type-filter"
              multiple
              value={filters.type}
              onChange={handleTypeChange}
              input={<OutlinedInput label="Type" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={typeOptions.find(option => option.value === value)?.label} 
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {typeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={filters.type.indexOf(option.value) > -1} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Assignee Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="assignee-filter-label">Assignee</InputLabel>
            <Select
              labelId="assignee-filter-label"
              id="assignee-filter"
              multiple
              value={filters.assignee}
              onChange={handleAssigneeChange}
              input={<OutlinedInput label="Assignee" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={getAssigneeName(value)} 
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {assigneeOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  <Checkbox checked={filters.assignee.indexOf(option.id) > -1} />
                  <ListItemText primary={option.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Case Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="case-filter-label">Case</InputLabel>
            <Select
              labelId="case-filter-label"
              id="case-filter"
              multiple
              value={filters.case}
              onChange={handleCaseChange}
              input={<OutlinedInput label="Case" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={getCaseTitle(value)} 
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {caseOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  <Checkbox checked={filters.case.indexOf(option.id) > -1} />
                  <ListItemText primary={option.title} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Due Date Range */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <DatePicker
              label="Due From"
              value={startDate}
              onChange={handleStartDateChange}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
            <DatePicker
              label="Due To"
              value={endDate}
              onChange={handleEndDateChange}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TaskFilters; 