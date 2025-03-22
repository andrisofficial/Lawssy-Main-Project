import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Breadcrumbs,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material';
import {
  Folder as FolderIcon,
  Description as DescriptionIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  NavigateNext as NavigateNextIcon,
  CreateNewFolder as CreateNewFolderIcon,
  FileCopy as FileCopyIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Sample data for documents
const sampleDocuments = [
  {
    id: 1,
    name: 'Contract Agreement - Acme Corp',
    type: 'pdf',
    size: '2.4 MB',
    modified: '2023-06-15',
    createdBy: 'John Doe',
    tags: ['Contract', 'Acme Corp', 'NDA'],
    shared: true,
    locked: false
  },
  {
    id: 2,
    name: 'Patent Filing - Tech Innovations',
    type: 'docx',
    size: '1.8 MB',
    modified: '2023-06-14',
    createdBy: 'Jane Smith',
    tags: ['Patent', 'Tech Innovations'],
    shared: false,
    locked: true
  },
  {
    id: 3,
    name: 'Lease Agreement Template',
    type: 'docx',
    size: '1.2 MB',
    modified: '2023-06-10',
    createdBy: 'John Doe',
    tags: ['Template', 'Lease'],
    shared: true,
    locked: false
  },
  {
    id: 4,
    name: 'Client Meeting Notes - Global Industries',
    type: 'txt',
    size: '0.5 MB',
    modified: '2023-06-08',
    createdBy: 'Jane Smith',
    tags: ['Notes', 'Global Industries', 'Meeting'],
    shared: false,
    locked: false
  },
  {
    id: 5,
    name: 'Financial Report Q2',
    type: 'xlsx',
    size: '3.1 MB',
    modified: '2023-06-05',
    createdBy: 'John Doe',
    tags: ['Financial', 'Report', 'Q2'],
    shared: true,
    locked: true
  }
];

// Sample data for folders
const sampleFolders = [
  {
    id: 1,
    name: 'Contracts',
    items: 24,
    modified: '2023-06-15'
  },
  {
    id: 2,
    name: 'Client Files',
    items: 18,
    modified: '2023-06-12'
  },
  {
    id: 3,
    name: 'Templates',
    items: 12,
    modified: '2023-06-10'
  },
  {
    id: 4,
    name: 'Legal Research',
    items: 8,
    modified: '2023-06-05'
  }
];

const DocumentRepository = () => {
  const theme = useTheme();
  const [currentPath, setCurrentPath] = useState(['My Documents']);
  const [documents, setDocuments] = useState(sampleDocuments);
  const [folders, setFolders] = useState(sampleFolders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newFolderDialog, setNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [shareDialog, setShareDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState(['view']);
  const [versionHistoryDialog, setVersionHistoryDialog] = useState(false);

  // Sample users for sharing
  const users = [
    'John Doe',
    'Jane Smith',
    'Robert Johnson',
    'Emily Davis',
    'Michael Wilson'
  ];

  // Sample permissions for sharing
  const permissions = [
    { value: 'view', label: 'View Only' },
    { value: 'comment', label: 'Comment' },
    { value: 'edit', label: 'Edit' },
    { value: 'download', label: 'Download' }
  ];

  // Sample version history
  const versionHistory = [
    { version: 'v3.0', date: '2023-06-15', author: 'John Doe', notes: 'Final revisions' },
    { version: 'v2.1', date: '2023-06-10', author: 'Jane Smith', notes: 'Updated section 3.2' },
    { version: 'v2.0', date: '2023-06-05', author: 'John Doe', notes: 'Major revisions' },
    { version: 'v1.0', date: '2023-06-01', author: 'John Doe', notes: 'Initial draft' }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleFolderClick = (folder) => {
    setCurrentPath([...currentPath, folder.name]);
  };

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleNewFolder = () => {
    setNewFolderDialog(true);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: folders.length + 1,
        name: newFolderName,
        items: 0,
        modified: new Date().toISOString().split('T')[0]
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setNewFolderDialog(false);
    }
  };

  const handleShare = () => {
    setShareDialog(true);
  };

  const handleShareSubmit = () => {
    // In a real app, this would send sharing permissions to the server
    setShareDialog(false);
    setSelectedUsers([]);
    setSelectedPermissions(['view']);
  };

  const handleVersionHistory = () => {
    setVersionHistoryDialog(true);
  };

  const handleUserSelectionChange = (event) => {
    setSelectedUsers(event.target.value);
  };

  const handlePermissionChange = (event) => {
    setSelectedPermissions(event.target.value);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <DescriptionIcon sx={{ color: '#F44336' }} />;
      case 'docx':
        return <DescriptionIcon sx={{ color: '#2196F3' }} />;
      case 'xlsx':
        return <DescriptionIcon sx={{ color: '#4CAF50' }} />;
      case 'txt':
        return <DescriptionIcon sx={{ color: '#9E9E9E' }} />;
      default:
        return <DescriptionIcon />;
    }
  };

  return (
    <Box>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="document-navigation"
        sx={{ mb: 3 }}
      >
        {currentPath.map((path, index) => (
          <Typography
            key={index}
            color={index === currentPath.length - 1 ? 'text.primary' : 'text.secondary'}
            sx={{ 
              cursor: 'pointer',
              fontWeight: index === currentPath.length - 1 ? 600 : 400
            }}
            onClick={() => handleBreadcrumbClick(index)}
          >
            {path}
          </Typography>
        ))}
      </Breadcrumbs>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<CloudUploadIcon />}
          sx={{ 
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark
            }
          }}
        >
          Upload Files
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<CreateNewFolderIcon />}
          onClick={handleNewFolder}
        >
          New Folder
        </Button>
      </Box>

      {/* Folders Section */}
      {folders.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Folders</Typography>
          <Grid container spacing={2}>
            {folders.map((folder) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      borderColor: theme.palette.primary.main
                    }
                  }}
                  onClick={() => handleFolderClick(folder)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FolderIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 40 }} />
                      <Box>
                        <Typography variant="subtitle1" noWrap sx={{ maxWidth: 150 }}>
                          {folder.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {folder.items} items
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, folder);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Documents Table */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Documents</Typography>
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
          <Table sx={{ minWidth: 650 }} aria-label="documents table">
            <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Modified</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((document) => (
                  <TableRow
                    key={document.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getFileIcon(document.type)}
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="body1">{document.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {document.type.toUpperCase()}
                          </Typography>
                        </Box>
                        {document.locked && (
                          <Tooltip title="This document is locked">
                            <LockIcon sx={{ ml: 1, fontSize: 16, color: 'warning.main' }} />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {document.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(0, 0, 0, 0.04)',
                              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{document.modified}</TableCell>
                    <TableCell>{document.size}</TableCell>
                    <TableCell>{document.createdBy}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Download">
                        <IconButton size="small">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share">
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedItem(document);
                            handleShare();
                          }}
                        >
                          <ShareIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Version History">
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedItem(document);
                            handleVersionHistory();
                          }}
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, document)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={documents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 1,
          sx: { minWidth: 180 }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleShare}>
          <ShareIcon fontSize="small" sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={handleVersionHistory}>
          <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
          Version History
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialog} onClose={() => setNewFolderDialog(false)}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="folderName"
            label="Folder Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFolderDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateFolder} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Document</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {selectedItem?.name}
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="share-users-label">Share with</InputLabel>
            <Select
              labelId="share-users-label"
              id="share-users"
              multiple
              value={selectedUsers}
              onChange={handleUserSelectionChange}
              input={<OutlinedInput label="Share with" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {users.map((user) => (
                <MenuItem key={user} value={user}>
                  <Checkbox checked={selectedUsers.indexOf(user) > -1} />
                  <ListItemText primary={user} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel id="permissions-label">Permissions</InputLabel>
            <Select
              labelId="permissions-label"
              id="permissions"
              multiple
              value={selectedPermissions}
              onChange={handlePermissionChange}
              input={<OutlinedInput label="Permissions" />}
              renderValue={(selected) => selected.map(s => {
                const permission = permissions.find(p => p.value === s);
                return permission ? permission.label : s;
              }).join(', ')}
            >
              {permissions.map((permission) => (
                <MenuItem key={permission.value} value={permission.value}>
                  <Checkbox checked={selectedPermissions.indexOf(permission.value) > -1} />
                  <ListItemText primary={permission.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Cancel</Button>
          <Button onClick={handleShareSubmit} variant="contained">Share</Button>
        </DialogActions>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={versionHistoryDialog} onClose={() => setVersionHistoryDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Version History</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {selectedItem?.name}
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Version</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {versionHistory.map((version, index) => (
                  <TableRow key={index}>
                    <TableCell>{version.version}</TableCell>
                    <TableCell>{version.date}</TableCell>
                    <TableCell>{version.author}</TableCell>
                    <TableCell>{version.notes}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Download">
                        <IconButton size="small">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Restore this version">
                        <IconButton size="small">
                          <FileCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVersionHistoryDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentRepository; 