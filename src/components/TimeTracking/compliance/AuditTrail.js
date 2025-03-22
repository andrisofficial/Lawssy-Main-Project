import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  FileDownload as DownloadIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

// Sample audit trail data
const sampleAuditTrails = [
  {
    id: 1,
    timestamp: new Date('2023-03-05T09:15:00'),
    user: 'John Smith',
    action: 'CREATE',
    entityType: 'TIME_ENTRY',
    entityId: 'TE-2023-001',
    details: 'Created new time entry for Acme Corp - Contract Review',
  },
  {
    id: 2,
    timestamp: new Date('2023-03-05T10:30:00'),
    user: 'Jane Doe',
    action: 'UPDATE',
    entityType: 'TIME_ENTRY',
    entityId: 'TE-2023-001',
    details: 'Updated time entry duration from 1.5 to 2.0 hours',
  },
  {
    id: 3,
    timestamp: new Date('2023-03-05T11:45:00'),
    user: 'John Smith',
    action: 'CREATE',
    entityType: 'INVOICE',
    entityId: 'INV-2023-001',
    details: 'Created new invoice for Acme Corp',
  },
  {
    id: 4,
    timestamp: new Date('2023-03-06T09:00:00'),
    user: 'Admin User',
    action: 'UPDATE',
    entityType: 'BILLING_RATE',
    entityId: 'BR-2023-001',
    details: 'Updated hourly rate for John Smith from $250 to $275',
  },
  {
    id: 5,
    timestamp: new Date('2023-03-06T14:30:00'),
    user: 'Jane Doe',
    action: 'DELETE',
    entityType: 'TIME_ENTRY',
    entityId: 'TE-2023-002',
    details: 'Deleted time entry for Wayne Enterprises - Patent Filing',
  },
  {
    id: 6,
    timestamp: new Date('2023-03-07T10:15:00'),
    user: 'John Smith',
    action: 'UPDATE',
    entityType: 'INVOICE',
    entityId: 'INV-2023-001',
    details: 'Updated invoice status from DRAFT to SENT',
  },
];

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getActionColor = (action) => {
  switch (action) {
    case 'CREATE':
      return 'success';
    case 'UPDATE':
      return 'info';
    case 'DELETE':
      return 'error';
    default:
      return 'default';
  }
};

const getEntityTypeLabel = (type) => {
  switch (type) {
    case 'TIME_ENTRY':
      return 'Time Entry';
    case 'INVOICE':
      return 'Invoice';
    case 'BILLING_RATE':
      return 'Billing Rate';
    default:
      return type;
  }
};

const AuditTrail = () => {
  const [auditTrails, setAuditTrails] = useState(sampleAuditTrails);
  const [filteredAuditTrails, setFilteredAuditTrails] = useState(sampleAuditTrails);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    user: '',
    action: '',
    entityType: '',
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = [...auditTrails];

    if (currentFilters.startDate) {
      filtered = filtered.filter(
        (trail) => new Date(trail.timestamp) >= new Date(currentFilters.startDate)
      );
    }

    if (currentFilters.endDate) {
      filtered = filtered.filter(
        (trail) => new Date(trail.timestamp) <= new Date(currentFilters.endDate)
      );
    }

    if (currentFilters.user) {
      filtered = filtered.filter((trail) =>
        trail.user.toLowerCase().includes(currentFilters.user.toLowerCase())
      );
    }

    if (currentFilters.action) {
      filtered = filtered.filter((trail) => trail.action === currentFilters.action);
    }

    if (currentFilters.entityType) {
      filtered = filtered.filter((trail) => trail.entityType === currentFilters.entityType);
    }

    if (currentFilters.searchTerm) {
      filtered = filtered.filter(
        (trail) =>
          trail.details.toLowerCase().includes(currentFilters.searchTerm.toLowerCase()) ||
          trail.entityId.toLowerCase().includes(currentFilters.searchTerm.toLowerCase())
      );
    }

    setFilteredAuditTrails(filtered);
  };

  const resetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      user: '',
      action: '',
      entityType: '',
      searchTerm: '',
    });
    setFilteredAuditTrails(auditTrails);
  };

  const exportAuditLogs = () => {
    // In a real application, this would generate and download a CSV or PDF file
    alert('Audit logs would be exported here in a real application');
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="600">
              Audit Trail
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                placeholder="Search..."
                size="small"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ width: 250 }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={exportAuditLogs}
              >
                Export Logs
              </Button>
            </Stack>
          </Box>

          {showFilters && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={filters.startDate}
                      onChange={(date) => handleFilterChange('startDate', date)}
                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={filters.endDate}
                      onChange={(date) => handleFilterChange('endDate', date)}
                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label="User"
                    value={filters.user}
                    onChange={(e) => handleFilterChange('user', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Action</InputLabel>
                    <Select
                      value={filters.action}
                      label="Action"
                      onChange={(e) => handleFilterChange('action', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="CREATE">Create</MenuItem>
                      <MenuItem value="UPDATE">Update</MenuItem>
                      <MenuItem value="DELETE">Delete</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Entity Type</InputLabel>
                    <Select
                      value={filters.entityType}
                      label="Entity Type"
                      onChange={(e) => handleFilterChange('entityType', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="TIME_ENTRY">Time Entry</MenuItem>
                      <MenuItem value="INVOICE">Invoice</MenuItem>
                      <MenuItem value="BILLING_RATE">Billing Rate</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Button variant="outlined" onClick={resetFilters} fullWidth>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity Type</TableCell>
                  <TableCell>Entity ID</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAuditTrails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No audit trail records found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAuditTrails.map((trail) => (
                    <TableRow key={trail.id} hover>
                      <TableCell>{formatDateTime(trail.timestamp)}</TableCell>
                      <TableCell>{trail.user}</TableCell>
                      <TableCell>
                        <Chip
                          label={trail.action}
                          size="small"
                          color={getActionColor(trail.action)}
                        />
                      </TableCell>
                      <TableCell>{getEntityTypeLabel(trail.entityType)}</TableCell>
                      <TableCell>{trail.entityId}</TableCell>
                      <TableCell>{trail.details}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuditTrail; 