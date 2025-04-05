import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Stack,
  Chip,
  Tabs,
  Tab,
  styled,
  Drawer,
  FormControl,
  InputLabel,
  FormGroup,
  Popover,
  Divider,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Badge,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  Menu,
  Grid,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdd as BookmarkAddIcon,
  FilterAlt as FilterAltIcon,
  SaveAlt as SaveAltIcon,
  DeleteOutline as DeleteOutlineIcon
} from '@mui/icons-material';
import clientService from '../../services/clientService/clientService';
import MainLayout from '../../components/layout/MainLayout';

// Styled components to match the exact style from the image
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  minWidth: '80px',
  padding: '8px 16px',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '16px 20px',
  fontSize: '14px',
  borderBottom: '1px solid #e0e0e0',
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  padding: '12px 20px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#5f6368',
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #e0e0e0',
}));

// Customized table header cells with specific widths
const NameHeaderCell = styled(StyledTableHeaderCell)({
  width: '20%',
});

const TagsHeaderCell = styled(StyledTableHeaderCell)({
  width: '15%',
});

const EmailHeaderCell = styled(StyledTableHeaderCell)({
  width: '20%',
});

const PhoneHeaderCell = styled(StyledTableHeaderCell)({
  width: '15%',
});

const AddressHeaderCell = styled(StyledTableHeaderCell)({
  width: '20%',
});

const StatusHeaderCell = styled(StyledTableHeaderCell)({
  width: '10%',
});

const ActionsHeaderCell = styled(StyledTableHeaderCell)({
  width: '10%',
});

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    assignedPersonnel: '',
    openMatters: '',
    dateAdded: {
      start: null,
      end: null
    },
    lastActivity: {
      start: null,
      end: null
    },
    company: ''
  });
  const [filterCount, setFilterCount] = useState(0);
  const [statuses, setStatuses] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [savedFilters, setSavedFilters] = useState([]);
  const [saveFilterDialogOpen, setSaveFilterDialogOpen] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [anchorElSavedFilters, setAnchorElSavedFilters] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);

  // Fetch clients and related data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch client statuses
        const statusesData = await clientService.getClientStatuses();
        setStatuses(statusesData);
        
        // Fetch personnel (mock data for now - to be replaced with actual API call)
        // TODO: Replace with actual API call when available
        setPersonnel([
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Smith' },
          { id: 3, name: 'Robert Johnson' }
        ]);
        
        // Fetch companies (mock data for now - to be replaced with actual API call)
        // TODO: Replace with actual API call when available
        setCompanies([
          { id: 1, name: 'Acme Corp' },
          { id: 2, name: 'Wayne Enterprises' },
          { id: 3, name: 'Stark Industries' }
        ]);
        
        // Fetch clients with type filter based on active tab
        let typeFilter = '';
        if (activeTab === 1) typeFilter = 'Individual';
        if (activeTab === 2) typeFilter = 'Organization';
        
        const clientsData = await clientService.getAllClients(
          { ...filters, type: typeFilter, search: search || undefined },
          includeArchived
        );
        setClients(clientsData);
        
        // Load saved filters from localStorage
        const savedFiltersFromStorage = localStorage.getItem('savedClientFilters');
        if (savedFiltersFromStorage) {
          setSavedFilters(JSON.parse(savedFiltersFromStorage));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (show notification, etc.)
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [includeArchived, activeTab]);

  // Update clients when filters or search changes
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        // Apply type filter based on active tab
        let typeFilter = '';
        if (activeTab === 1) typeFilter = 'Individual';
        if (activeTab === 2) typeFilter = 'Organization';
        
        const clientsData = await clientService.getAllClients(
          { ...filters, type: typeFilter, search: search || undefined },
          includeArchived
        );
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(() => {
      fetchClients();
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [filters, search, includeArchived, activeTab]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.assignedPersonnel) count++;
    if (filters.openMatters) count++;
    if (filters.dateAdded.start || filters.dateAdded.end) count++;
    if (filters.lastActivity.start || filters.lastActivity.end) count++;
    if (filters.company) count++;
    
    setFilterCount(count);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0);
  };

  // Handle date filter changes
  const handleDateFilterChange = (filterName, dateType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: {
        ...prev[filterName],
        [dateType]: value
      }
    }));
    setPage(0);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      status: '',
      type: '',
      assignedPersonnel: '',
      openMatters: '',
      dateAdded: {
        start: null,
        end: null
      },
      lastActivity: {
        start: null,
        end: null
      },
      company: ''
    });
    setPage(0);
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setLoading(true);
      // Apply type filter based on active tab
      let typeFilter = '';
      if (activeTab === 1) typeFilter = 'Individual';
      if (activeTab === 2) typeFilter = 'Organization';
      
      const data = await clientService.getAllClients(
        { ...filters, type: typeFilter, search: search || undefined },
        includeArchived
      );
      setClients(data);
    } catch (error) {
      console.error('Error refreshing clients:', error);
      // Handle error (show notification, etc.)
    } finally {
      setLoading(false);
    }
  };

  // Handle archive button click
  const handleArchive = async (id) => {
    if (window.confirm('Are you sure you want to archive this client?')) {
      try {
        await clientService.archiveClient(id);
        // Refresh client list
        handleRefresh();
      } catch (error) {
        console.error('Error archiving client:', error);
        // Handle error (show notification, etc.)
      }
    }
  };

  // Get client full name or organization name
  const getClientName = (client) => {
    if (client.client_type === 'Individual') {
      return `${client.first_name} ${client.last_name || ''}`.trim();
    }
    return client.organization_name;
  };

  // Get client notes (tags)
  const getClientNotes = (client) => {
    if (client.tags && Array.isArray(client.tags) && client.tags.length > 0) {
      return client.tags.join(', ');
    }
    return client.notes || 'Organization';
  };

  // Get client address
  const getClientAddress = (client) => {
    if (client.addresses && client.addresses.length > 0) {
      const address = client.addresses[0];
      return `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.postal_code || ''}`.trim().replace(/^,\s*/, '').replace(/,\s*,/g, ',');
    }
    return 'N/A';
  };

  // Open/close filter popover
  const openFilterPopover = (event) => {
    setAnchorElFilter(event.currentTarget);
  };

  const closeFilterPopover = () => {
    setAnchorElFilter(null);
  };

  // Save current filter
  const handleSaveFilter = () => {
    setSaveFilterDialogOpen(true);
  };

  // Handle save filter dialog close
  const handleSaveFilterDialogClose = () => {
    setSaveFilterDialogOpen(false);
    setNewFilterName('');
  };

  // Handle save filter submit
  const handleSaveFilterSubmit = () => {
    if (!newFilterName.trim()) return;
    
    const newFilter = {
      id: Date.now().toString(),
      name: newFilterName,
      filters: { ...filters }
    };
    
    const updatedSavedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedSavedFilters);
    
    // Save to localStorage
    localStorage.setItem('savedClientFilters', JSON.stringify(updatedSavedFilters));
    
    setSaveFilterDialogOpen(false);
    setNewFilterName('');
  };

  // Handle saved filter click
  const handleSavedFilterClick = (savedFilter) => {
    setFilters(savedFilter.filters);
    setAnchorElSavedFilters(null);
  };

  // Handle delete saved filter
  const handleDeleteSavedFilter = (id) => {
    const updatedSavedFilters = savedFilters.filter(filter => filter.id !== id);
    setSavedFilters(updatedSavedFilters);
    
    // Save to localStorage
    localStorage.setItem('savedClientFilters', JSON.stringify(updatedSavedFilters));
  };

  // Open saved filters menu
  const handleOpenSavedFiltersMenu = (event) => {
    setAnchorElSavedFilters(event.currentTarget);
  };

  // Close saved filters menu
  const handleCloseSavedFiltersMenu = () => {
    setAnchorElSavedFilters(null);
  };

  return (
    <MainLayout>
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Paper sx={{ borderRadius: '6px', overflow: 'hidden', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                sx={{ 
                  '.MuiTabs-indicator': { backgroundColor: '#1a73e8', height: '3px' },
                  ml: 2,
                  minHeight: '48px',
                }}
              >
                <StyledTab label="All" />
                <StyledTab label="People" />
                <StyledTab label="Companies" />
              </Tabs>
            </Box>

            {/* Filters and Actions Bar */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              p: 2,
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, flex: 1 }}>
                {/* Enhanced Search Bar */}
                <TextField
                  placeholder="Search by name, phone, email, or company"
                  size="small"
                  value={search}
                  onChange={handleSearchChange}
                  sx={{ 
                    minWidth: '300px', 
                    maxWidth: '400px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: '#5f6368' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Tooltip title="Apply filters">
                  <Badge badgeContent={filterCount} color="primary" sx={{ ml: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterListIcon />}
                      size="medium"
                      onClick={openFilterPopover}
                      sx={{ 
                        borderColor: filterCount > 0 ? '#1a73e8' : '#dadce0',
                        color: filterCount > 0 ? '#1a73e8' : '#3c4043',
                        '&:hover': {
                          borderColor: filterCount > 0 ? '#1765cc' : '#bdc1c6',
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    >
                      Filters
                    </Button>
                  </Badge>
                </Tooltip>
                
                {savedFilters.length > 0 && (
                  <Tooltip title="Saved Filters">
                    <Button
                      variant="outlined"
                      startIcon={<BookmarkIcon />}
                      size="medium"
                      onClick={handleOpenSavedFiltersMenu}
                      sx={{ 
                        borderColor: '#dadce0',
                        color: '#3c4043',
                        '&:hover': {
                          borderColor: '#bdc1c6',
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    >
                      Saved
                    </Button>
                  </Tooltip>
                )}
                
                <Menu
                  anchorEl={anchorElSavedFilters}
                  open={Boolean(anchorElSavedFilters)}
                  onClose={handleCloseSavedFiltersMenu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  {savedFilters.map((filter) => (
                    <MenuItem key={filter.id} sx={{ width: 240 }}>
                      <ListItemText 
                        primary={filter.name} 
                        onClick={() => handleSavedFilterClick(filter)} 
                        sx={{ flex: 1 }}
                      />
                      <IconButton 
                        edge="end" 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSavedFilter(filter.id);
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to="/clients/new"
                size="medium"
                sx={{ 
                  bgcolor: '#1a73e8', 
                  '&:hover': { bgcolor: '#1765cc' },
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 'none'
                }}
              >
                Add New Client
              </Button>
            </Box>

            {/* Clients Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <NameHeaderCell>Name</NameHeaderCell>
                    <TagsHeaderCell>Tags</TagsHeaderCell>
                    <EmailHeaderCell>Email</EmailHeaderCell>
                    <PhoneHeaderCell>Phone</PhoneHeaderCell>
                    <AddressHeaderCell>Address</AddressHeaderCell>
                    <StatusHeaderCell>Status</StatusHeaderCell>
                    <ActionsHeaderCell align="center">Actions</ActionsHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <StyledTableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <CircularProgress size={24} sx={{ color: '#1a73e8' }} />
                      </StyledTableCell>
                    </TableRow>
                  ) : clients.length === 0 ? (
                    <TableRow>
                      <StyledTableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        No clients found. Try adjusting your filters or add a new client.
                      </StyledTableCell>
                    </TableRow>
                  ) : (
                    clients
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((client) => (
                        <TableRow key={client.id} hover>
                          <StyledTableCell>
                            <Typography 
                              variant="body2" 
                              component={Link} 
                              to={`/clients/${client.id}`}
                              sx={{ 
                                color: '#1a73e8', 
                                textDecoration: 'none',
                                fontWeight: 500,
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              {getClientName(client)}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell>{getClientNotes(client)}</StyledTableCell>
                          <StyledTableCell>{client.primary_email || 'N/A'}</StyledTableCell>
                          <StyledTableCell>{client.primary_phone || 'N/A'}</StyledTableCell>
                          <StyledTableCell>{getClientAddress(client)}</StyledTableCell>
                          <StyledTableCell>
                            {client.status ? (
                              <Chip
                                label={client.status.name}
                                size="small"
                                sx={{ 
                                  bgcolor: client.status.name === 'Active' ? '#e6f4ea' : 
                                          client.status.name === 'Pending' ? '#fff8e6' : 
                                          client.status.name === 'Inactive' ? '#f5f5f5' : 'grey.100',
                                  color: client.status.name === 'Active' ? '#137333' : 
                                          client.status.name === 'Pending' ? '#b06000' : 
                                          client.status.name === 'Inactive' ? '#5f6368' : 'text.primary',
                                  fontWeight: 500,
                                  borderRadius: '6px',
                                  height: '24px'
                                }}
                              />
                            ) : (
                              'Unknown'
                            )}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Button 
                                size="small" 
                                variant="outlined" 
                                component={Link} 
                                to={`/clients/${client.id}/edit`}
                                sx={{
                                  color: '#5f6368',
                                  borderColor: '#dadce0',
                                  textTransform: 'none',
                                  fontWeight: 500,
                                  minWidth: '60px',
                                  padding: '2px 8px',
                                  fontSize: '13px'
                                }}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined" 
                                component={Link} 
                                to={`/clients/${client.id}`}
                                sx={{
                                  color: '#5f6368',
                                  borderColor: '#dadce0',
                                  textTransform: 'none',
                                  fontWeight: 500,
                                  minWidth: '60px',
                                  padding: '2px 8px',
                                  fontSize: '13px'
                                }}
                              >
                                View
                              </Button>
                            </Stack>
                          </StyledTableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 2 }}>
              <Typography variant="body2" color="#5f6368" sx={{ mr: 2, fontSize: '14px' }}>
                Rows per page:
              </Typography>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                displayEmpty
                size="small"
                sx={{ 
                  minWidth: 60, 
                  mr: 2,
                  fontSize: '14px',
                  color: '#5f6368',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
              <Typography variant="body2" color="#5f6368" sx={{ mr: 2, fontSize: '14px' }}>
                {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, clients.length)} of {clients.length}
              </Typography>
              <IconButton 
                disabled={page === 0} 
                onClick={(e) => handleChangePage(e, page - 1)}
                size="small"
                sx={{ color: '#5f6368' }}
              >
                &lt;
              </IconButton>
              <IconButton 
                disabled={page >= Math.ceil(clients.length / rowsPerPage) - 1} 
                onClick={(e) => handleChangePage(e, page + 1)}
                size="small"
                sx={{ color: '#5f6368' }}
              >
                &gt;
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Container>
      
      {/* Filter Popover */}
      <Popover
        open={Boolean(anchorElFilter)}
        anchorEl={anchorElFilter}
        onClose={closeFilterPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 350,
              mt: 1,
              borderRadius: '8px',
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)'
            }
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>Filter Clients</Typography>
            <IconButton onClick={closeFilterPopover} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Stack spacing={2}>
            {/* Client Status Filter */}
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Client Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={filters.status}
                label="Client Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">Any Status</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Practice Area Filter */}
            <FormControl fullWidth size="small">
              <InputLabel id="practice-area-label">Practice Area</InputLabel>
              <Select
                labelId="practice-area-label"
                id="practice-area"
                value={filters.practiceArea}
                label="Practice Area"
                onChange={(e) => handleFilterChange('practiceArea', e.target.value)}
              >
                <MenuItem value="">Any Practice Area</MenuItem>
                <MenuItem value="family">Family Law</MenuItem>
                <MenuItem value="criminal">Criminal Law</MenuItem>
                <MenuItem value="corporate">Corporate Law</MenuItem>
                <MenuItem value="realestate">Real Estate Law</MenuItem>
                <MenuItem value="immigration">Immigration Law</MenuItem>
                <MenuItem value="intellectual">Intellectual Property</MenuItem>
              </Select>
            </FormControl>
            
            {/* Assigned Personnel Filter */}
            <FormControl fullWidth size="small">
              <InputLabel id="assigned-personnel-label">Assigned Personnel</InputLabel>
              <Select
                labelId="assigned-personnel-label"
                id="assigned-personnel"
                value={filters.assignedPersonnel}
                label="Assigned Personnel"
                onChange={(e) => handleFilterChange('assignedPersonnel', e.target.value)}
              >
                <MenuItem value="">Any Personnel</MenuItem>
                {personnel.map((person) => (
                  <MenuItem key={person.id} value={person.id}>
                    {person.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Open Matters Filter */}
            <FormControl fullWidth size="small">
              <InputLabel id="open-matters-label">Open Matters</InputLabel>
              <Select
                labelId="open-matters-label"
                id="open-matters"
                value={filters.openMatters}
                label="Open Matters"
                onChange={(e) => handleFilterChange('openMatters', e.target.value)}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="yes">Yes (Has Open Matters)</MenuItem>
                <MenuItem value="no">No (No Open Matters)</MenuItem>
                <MenuItem value="1-5">1-5 Open Matters</MenuItem>
                <MenuItem value="6-10">6-10 Open Matters</MenuItem>
                <MenuItem value="10+">10+ Open Matters</MenuItem>
              </Select>
            </FormControl>
            
            {/* Date Added Filter */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '14px' }}>Date Added</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <DatePicker
                      label="From"
                      value={filters.dateAdded.start}
                      onChange={(date) => handleDateFilterChange('dateAdded', 'start', date)}
                      slotProps={{ 
                        textField: { 
                          size: 'small',
                          fullWidth: true
                        } 
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="To"
                      value={filters.dateAdded.end}
                      onChange={(date) => handleDateFilterChange('dateAdded', 'end', date)}
                      slotProps={{ 
                        textField: { 
                          size: 'small',
                          fullWidth: true
                        } 
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </LocalizationProvider>
            
            {/* Last Activity Filter */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '14px' }}>Last Activity</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <DatePicker
                      label="From"
                      value={filters.lastActivity.start}
                      onChange={(date) => handleDateFilterChange('lastActivity', 'start', date)}
                      slotProps={{ 
                        textField: { 
                          size: 'small',
                          fullWidth: true
                        } 
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="To"
                      value={filters.lastActivity.end}
                      onChange={(date) => handleDateFilterChange('lastActivity', 'end', date)}
                      slotProps={{ 
                        textField: { 
                          size: 'small',
                          fullWidth: true
                        } 
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </LocalizationProvider>
            
            {/* Company Filter */}
            <FormControl fullWidth size="small">
              <InputLabel id="company-filter-label">Company</InputLabel>
              <Select
                labelId="company-filter-label"
                id="company-filter"
                value={filters.company}
                label="Company"
                onChange={(e) => handleFilterChange('company', e.target.value)}
              >
                <MenuItem value="">Any Company</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              onClick={handleResetFilters}
              color="inherit"
              size="small"
              sx={{ color: '#5f6368' }}
            >
              Reset All
            </Button>
            <Box>
              <Button 
                onClick={handleSaveFilter}
                startIcon={<SaveAltIcon />}
                size="small"
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button 
                variant="contained" 
                onClick={closeFilterPopover}
                size="small"
                disableElevation
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
      
      {/* Save Filter Dialog */}
      <Dialog open={saveFilterDialogOpen} onClose={handleSaveFilterDialogClose}>
        <DialogTitle>Save Filter</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for this filter to save it for future use.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Filter Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newFilterName}
            onChange={(e) => setNewFilterName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveFilterDialogClose} color="inherit">Cancel</Button>
          <Button onClick={handleSaveFilterSubmit} variant="contained" disableElevation>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ClientsPage; 