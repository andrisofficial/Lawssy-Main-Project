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
import caseService from '../../services/caseService/caseService';
import MainLayout from '../../components/layout/MainLayout';

const CasesPage = () => {
  const [cases, setCases] = useState([]);
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

  // Fetch cases and statuses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch case statuses
        const statusesData = await caseService.getCaseStatuses();
        setStatuses(statusesData);
        
        // Fetch cases
        const casesData = await caseService.getAllCases(
          { ...filters, search: search || undefined },
          includeArchived
        );
        setCases(casesData);
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
      const data = await caseService.getAllCases(
        { ...filters, search: search || undefined },
        includeArchived
      );
      setCases(data);
    } catch (error) {
      console.error('Error refreshing cases:', error);
      // Handle error (show notification, etc.)
    } finally {
      setLoading(false);
    }
  };

  // Handle archive button click
  const handleArchive = async (id) => {
    if (window.confirm('Are you sure you want to archive this case?')) {
      try {
        await caseService.archiveCase(id);
        // Refresh case list
        handleRefresh();
      } catch (error) {
        console.error('Error archiving case:', error);
        // Handle error (show notification, etc.)
      }
    }
  };

  // Get case name
  const getCaseName = (caseItem) => {
    return caseItem.title || caseItem.case_number || 'Untitled Case';
  };

  // Get case client
  const getCaseClient = (caseItem) => {
    return caseItem.client_name || 'No client assigned';
  };

  return (
    <MainLayout>
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Cases
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/cases/new"
            >
              New Case
            </Button>
          </Box>

          {/* Filters and Search */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search cases..."
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
                    <MenuItem value="Litigation">Litigation</MenuItem>
                    <MenuItem value="Corporate">Corporate</MenuItem>
                    <MenuItem value="Family">Family</MenuItem>
                    <MenuItem value="Real Estate">Real Estate</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Include Archived</InputLabel>
                  <Select
                    value={includeArchived}
                    onChange={(e) => setIncludeArchived(e.target.value)}
                    label="Include Archived"
                  >
                    <MenuItem value={false}>Active Only</MenuItem>
                    <MenuItem value={true}>Include Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Case Table */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Case Name/Number</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress sx={{ my: 3 }} />
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && cases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body1" sx={{ py: 2 }}>
                          No cases found. Try adjusting your filters or create a new case.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading &&
                    cases
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((caseItem) => (
                        <TableRow key={caseItem.id}>
                          <TableCell>
                            <Link to={`/cases/${caseItem.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {getCaseName(caseItem)}
                              </Typography>
                              {caseItem.case_number && caseItem.title && (
                                <Typography variant="body2" color="textSecondary">
                                  {caseItem.case_number}
                                </Typography>
                              )}
                            </Link>
                          </TableCell>
                          <TableCell>{getCaseClient(caseItem)}</TableCell>
                          <TableCell>
                            <Chip
                              label={caseItem.status_name || 'Unknown'}
                              color={
                                caseItem.status_name === 'Active'
                                  ? 'success'
                                  : caseItem.status_name === 'Pending'
                                  ? 'warning'
                                  : caseItem.status_name === 'Closed'
                                  ? 'default'
                                  : caseItem.status_name === 'Archived'
                                  ? 'error'
                                  : 'primary'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{caseItem.case_type || 'N/A'}</TableCell>
                          <TableCell>
                            {new Date(caseItem.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Details">
                              <IconButton
                                component={Link}
                                to={`/cases/${caseItem.id}`}
                                size="small"
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Case">
                              <IconButton
                                component={Link}
                                to={`/cases/${caseItem.id}/edit`}
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            {caseItem.status_name !== 'Archived' && (
                              <Tooltip title="Archive Case">
                                <IconButton
                                  size="small"
                                  onClick={() => handleArchive(caseItem.id)}
                                >
                                  <ArchiveIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={cases.length}
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

export default CasesPage; 