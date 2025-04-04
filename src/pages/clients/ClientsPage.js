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
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import clientService from '../../services/clientService/clientService';
import MainLayout from '../../components/layout/MainLayout';

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

  // Fetch clients and statuses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch client statuses
        const statusesData = await clientService.getClientStatuses();
        setStatuses(statusesData);
        
        // Fetch clients
        const clientsData = await clientService.getAllClients(
          { ...filters, search: search || undefined },
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
  }, [filters, search, includeArchived]);

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
      const data = await clientService.getAllClients(
        { ...filters, search: search || undefined },
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

  // Display the client email or phone
  const getClientContact = (client) => {
    return client.primary_email || client.primary_phone || 'No contact info';
  };

  return (
    <MainLayout>
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Clients
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/clients/new"
            >
              New Client
            </Button>
          </Box>

          {/* Filters and Search */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search clients..."
                  value={search}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    label="Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {statuses.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    label="Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Individual">Individual</MenuItem>
                    <MenuItem value="Organization">Organization</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Show Archived</InputLabel>
                  <Select
                    value={includeArchived}
                    onChange={(e) => setIncludeArchived(e.target.value)}
                    label="Show Archived"
                  >
                    <MenuItem value={false}>Hide Archived</MenuItem>
                    <MenuItem value={true}>Show Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title="Refresh">
                  <IconButton onClick={handleRefresh} color="primary">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>

          {/* Clients Table */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date Added</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : clients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        No clients found. Try adjusting your filters or add a new client.
                      </TableCell>
                    </TableRow>
                  ) : (
                    clients
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((client) => (
                        <TableRow key={client.id} hover>
                          <TableCell>{getClientName(client)}</TableCell>
                          <TableCell>{client.client_type}</TableCell>
                          <TableCell>{getClientContact(client)}</TableCell>
                          <TableCell>
                            {client.status ? (
                              <Chip
                                label={client.status.name}
                                size="small"
                                sx={{ 
                                  bgcolor: client.status.color || 'grey.500',
                                  color: 'white'
                                }}
                              />
                            ) : (
                              'Unknown'
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(client.date_added).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View">
                              <IconButton 
                                component={Link} 
                                to={`/clients/${client.id}`}
                                size="small"
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton 
                                component={Link} 
                                to={`/clients/${client.id}/edit`}
                                size="small"
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            {!client.is_archived && (
                              <Tooltip title="Archive">
                                <IconButton 
                                  onClick={() => handleArchive(client.id)}
                                  size="small"
                                  color="warning"
                                >
                                  <ArchiveIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={clients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default ClientsPage; 