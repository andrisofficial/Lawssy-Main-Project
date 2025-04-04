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
  styled
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
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
    type: ''
  });
  const [statuses, setStatuses] = useState([]);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch clients and statuses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch client statuses
        const statusesData = await clientService.getClientStatuses();
        setStatuses(statusesData);
        
        // Fetch clients with type filter based on active tab
        let typeFilter = '';
        if (activeTab === 1) typeFilter = 'Individual';
        if (activeTab === 2) typeFilter = 'Organization';
        
        const clientsData = await clientService.getAllClients(
          { ...filters, type: typeFilter, search: search || undefined },
          includeArchived
        );
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (show notification, etc.)
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filters, search, includeArchived, activeTab]);

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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

  return (
    <MainLayout>
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Paper sx={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
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
                {/* Search Bar */}
                <TextField
                  placeholder="Search..."
                  size="small"
                  value={search}
                  onChange={handleSearchChange}
                  sx={{ 
                    minWidth: '250px', 
                    maxWidth: '300px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
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
                
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  size="medium"
                  sx={{ 
                    ml: 2,
                    borderColor: '#dadce0',
                    color: '#3c4043',
                    '&:hover': {
                      borderColor: '#bdc1c6',
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                >
                  Filters
                </Button>
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
                  borderRadius: '4px',
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
                                  borderRadius: '4px',
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
    </MainLayout>
  );
};

export default ClientsPage; 