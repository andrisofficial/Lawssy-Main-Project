import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Chip,
  Popover,
  Paper,
  Typography,
  Divider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Stack,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Label as LabelIcon,
  Person as PersonIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DocumentSearch = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    documentTypes: [],
    tags: [],
    authors: [],
    dateRange: [null, null],
    sizeRange: [0, 100]
  });
  const [activeFilters, setActiveFilters] = useState([]);

  // Sample data for filters
  const documentTypes = ['PDF', 'DOCX', 'XLSX', 'TXT', 'JPG', 'PNG'];
  const tags = ['Contract', 'NDA', 'Patent', 'Lease', 'Template', 'Client', 'Financial', 'Legal'];
  const authors = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'];

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  const handleDateChange = (index, date) => {
    const newDateRange = [...filters.dateRange];
    newDateRange[index] = date;
    handleFilterChange('dateRange', newDateRange);
  };

  const handleSizeRangeChange = (event, newValue) => {
    handleFilterChange('sizeRange', newValue);
  };

  const handleApplyFilters = () => {
    // Build active filters array for display
    const newActiveFilters = [];
    
    if (filters.documentTypes.length > 0) {
      newActiveFilters.push({
        type: 'documentTypes',
        label: `Types: ${filters.documentTypes.join(', ')}`,
        icon: <DescriptionIcon fontSize="small" />
      });
    }
    
    if (filters.tags.length > 0) {
      newActiveFilters.push({
        type: 'tags',
        label: `Tags: ${filters.tags.join(', ')}`,
        icon: <LabelIcon fontSize="small" />
      });
    }
    
    if (filters.authors.length > 0) {
      newActiveFilters.push({
        type: 'authors',
        label: `Authors: ${filters.authors.join(', ')}`,
        icon: <PersonIcon fontSize="small" />
      });
    }
    
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const startDate = filters.dateRange[0].toLocaleDateString();
      const endDate = filters.dateRange[1].toLocaleDateString();
      newActiveFilters.push({
        type: 'dateRange',
        label: `Date: ${startDate} - ${endDate}`,
        icon: <CalendarIcon fontSize="small" />
      });
    }
    
    if (filters.sizeRange[0] !== 0 || filters.sizeRange[1] !== 100) {
      newActiveFilters.push({
        type: 'sizeRange',
        label: `Size: ${filters.sizeRange[0]}MB - ${filters.sizeRange[1]}MB`,
        icon: <DescriptionIcon fontSize="small" />
      });
    }
    
    setActiveFilters(newActiveFilters);
    handleFilterClose();
  };

  const handleRemoveFilter = (filterType) => {
    // Reset the specific filter
    const resetFilters = { ...filters };
    
    switch (filterType) {
      case 'documentTypes':
        resetFilters.documentTypes = [];
        break;
      case 'tags':
        resetFilters.tags = [];
        break;
      case 'authors':
        resetFilters.authors = [];
        break;
      case 'dateRange':
        resetFilters.dateRange = [null, null];
        break;
      case 'sizeRange':
        resetFilters.sizeRange = [0, 100];
        break;
      default:
        break;
    }
    
    setFilters(resetFilters);
    
    // Update active filters
    setActiveFilters(activeFilters.filter(filter => filter.type !== filterType));
  };

  const handleClearAllFilters = () => {
    setFilters({
      documentTypes: [],
      tags: [],
      authors: [],
      dateRange: [null, null],
      sizeRange: [0, 100]
    });
    setActiveFilters([]);
  };

  const handleSearch = () => {
    // In a real app, this would trigger a search with the query and filters
    console.log('Search query:', searchQuery);
    console.log('Filters:', filters);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search documents by name, content, or metadata..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={() => setSearchQuery('')}
                  edge="end"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: '6px',
              bgcolor: 'background.paper'
            }
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={handleFilterClick}
          aria-describedby={id}
          sx={{ ml: 2, height: 56, minWidth: 100 }}
        >
          Filters
        </Button>
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ ml: 2, height: 56, minWidth: 100 }}
        >
          Search
        </Button>
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {activeFilters.map((filter, index) => (
            <Chip
              key={index}
              icon={filter.icon}
              label={filter.label}
              onDelete={() => handleRemoveFilter(filter.type)}
              sx={{ 
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                '& .MuiChip-deleteIcon': {
                  color: theme.palette.text.secondary
                }
              }}
            />
          ))}
          <Chip
            label="Clear All"
            onClick={handleClearAllFilters}
            sx={{ 
              bgcolor: 'transparent',
              border: `1px solid ${theme.palette.divider}`
            }}
          />
        </Box>
      )}

      {/* Filter Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { 
            width: 400, 
            p: 3,
            mt: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '6px'
          }
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Document Type</Typography>
          <FormControl component="fieldset" fullWidth>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {documentTypes.map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={filters.documentTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('documentTypes', [...filters.documentTypes, type]);
                        } else {
                          handleFilterChange(
                            'documentTypes',
                            filters.documentTypes.filter(t => t !== type)
                          );
                        }
                      }}
                      size="small"
                    />
                  }
                  label={type}
                  sx={{ width: '33%' }}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Tags</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                clickable
                color={filters.tags.includes(tag) ? 'primary' : 'default'}
                onClick={() => {
                  if (filters.tags.includes(tag)) {
                    handleFilterChange(
                      'tags',
                      filters.tags.filter(t => t !== tag)
                    );
                  } else {
                    handleFilterChange('tags', [...filters.tags, tag]);
                  }
                }}
                size="small"
                variant={filters.tags.includes(tag) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Author</Typography>
          <FormControl component="fieldset" fullWidth>
            <FormGroup>
              {authors.map((author) => (
                <FormControlLabel
                  key={author}
                  control={
                    <Checkbox
                      checked={filters.authors.includes(author)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('authors', [...filters.authors, author]);
                        } else {
                          handleFilterChange(
                            'authors',
                            filters.authors.filter(a => a !== author)
                          );
                        }
                      }}
                      size="small"
                    />
                  }
                  label={author}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Date Range</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction="row" spacing={2}>
              <DatePicker
                label="From"
                value={filters.dateRange[0]}
                onChange={(date) => handleDateChange(0, date)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
              <DatePicker
                label="To"
                value={filters.dateRange[1]}
                onChange={(date) => handleDateChange(1, date)}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Stack>
          </LocalizationProvider>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>File Size (MB)</Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              value={filters.sizeRange}
              onChange={handleSizeRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              step={1}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {filters.sizeRange[0]} MB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filters.sizeRange[1]} MB
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={handleFilterClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

export default DocumentSearch; 