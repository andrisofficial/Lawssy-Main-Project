import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Typography,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { formatCurrency } from '../../utils/timeUtils';

const TimeEntriesList = ({ entries, clients, matters, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, entry) => {
    setAnchorEl(event.currentTarget);
    setSelectedEntry(entry);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEntry(null);
  };

  const handleEdit = () => {
    onEdit(selectedEntry);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(selectedEntry.id);
    handleMenuClose();
  };

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'N/A';
  };

  const getMatterName = (matterId) => {
    const matter = matters.find((m) => m.id === matterId);
    return matter ? matter.name : 'N/A';
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Typography variant="h6">Time Entries</Typography>
      </Box>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Matter</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((entry) => (
                <TableRow key={entry.id} hover>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getClientName(entry.clientId)}</TableCell>
                  <TableCell>{getMatterName(entry.matterId)}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{entry.description}</Typography>
                      {entry.activityType && (
                        <Chip
                          label={entry.activityType}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{entry.duration} hrs</TableCell>
                  <TableCell>{formatCurrency(entry.rate)}/hr</TableCell>
                  <TableCell align="right">
                    {formatCurrency(entry.rate * entry.duration)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, entry)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={entries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default TimeEntriesList; 