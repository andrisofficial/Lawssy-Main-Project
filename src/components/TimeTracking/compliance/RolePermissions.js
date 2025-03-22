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
  Switch,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

// Sample roles and permissions data
const sampleRoles = [
  {
    id: 1,
    name: 'Administrator',
    description: 'Full access to all system features',
    permissions: {
      timeTracking: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },
      billing: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        viewRates: true,
        editRates: true,
      },
      clients: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        viewFinancials: true,
      },
      trustAccounts: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },
      reports: {
        view: true,
        create: true,
        export: true,
      },
      users: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },
    },
  },
  {
    id: 2,
    name: 'Partner',
    description: 'Access to most features with some restrictions',
    permissions: {
      timeTracking: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },
      billing: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        viewRates: true,
        editRates: true,
      },
      clients: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        viewFinancials: true,
      },
      trustAccounts: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
      reports: {
        view: true,
        create: true,
        export: true,
      },
      users: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
  },
  {
    id: 3,
    name: 'Associate',
    description: 'Limited access to client and billing information',
    permissions: {
      timeTracking: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
      billing: {
        view: true,
        create: true,
        edit: false,
        delete: false,
        viewRates: true,
        editRates: false,
      },
      clients: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        viewFinancials: false,
      },
      trustAccounts: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      reports: {
        view: true,
        create: false,
        export: false,
      },
      users: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    },
  },
  {
    id: 4,
    name: 'Paralegal',
    description: 'Support staff with limited access',
    permissions: {
      timeTracking: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
      billing: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        viewRates: false,
        editRates: false,
      },
      clients: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        viewFinancials: false,
      },
      trustAccounts: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      reports: {
        view: false,
        create: false,
        export: false,
      },
      users: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
    },
  },
];

const permissionCategories = [
  {
    id: 'timeTracking',
    name: 'Time Tracking',
    permissions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'billing',
    name: 'Billing & Invoices',
    permissions: ['view', 'create', 'edit', 'delete', 'viewRates', 'editRates'],
  },
  {
    id: 'clients',
    name: 'Clients & Matters',
    permissions: ['view', 'create', 'edit', 'delete', 'viewFinancials'],
  },
  {
    id: 'trustAccounts',
    name: 'Trust Accounts',
    permissions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    permissions: ['view', 'create', 'export'],
  },
  {
    id: 'users',
    name: 'User Management',
    permissions: ['view', 'create', 'edit', 'delete'],
  },
];

const formatPermissionName = (name) => {
  switch (name) {
    case 'view':
      return 'View';
    case 'create':
      return 'Create';
    case 'edit':
      return 'Edit';
    case 'delete':
      return 'Delete';
    case 'viewRates':
      return 'View Rates';
    case 'editRates':
      return 'Edit Rates';
    case 'viewFinancials':
      return 'View Financials';
    case 'export':
      return 'Export';
    default:
      return name.charAt(0).toUpperCase() + name.slice(1);
  }
};

const RolePermissions = () => {
  const [roles, setRoles] = useState(sampleRoles);
  const [selectedRole, setSelectedRole] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: {},
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleAddRole = () => {
    // Initialize permissions structure
    const initialPermissions = {};
    permissionCategories.forEach((category) => {
      initialPermissions[category.id] = {};
      category.permissions.forEach((permission) => {
        initialPermissions[category.id][permission] = false;
      });
    });

    setNewRole({
      name: '',
      description: '',
      permissions: initialPermissions,
    });
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleEditRole = () => {
    if (!selectedRole) return;
    setNewRole({ ...selectedRole });
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;
    if (window.confirm(`Are you sure you want to delete the role "${selectedRole.name}"?`)) {
      setRoles(roles.filter((role) => role.id !== selectedRole.id));
      setSelectedRole(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSaveRole = () => {
    if (newRole.name.trim() === '') {
      alert('Role name is required');
      return;
    }

    if (editMode) {
      // Update existing role
      setRoles(
        roles.map((role) => (role.id === newRole.id ? { ...newRole } : role))
      );
      setSelectedRole({ ...newRole });
    } else {
      // Add new role
      const newRoleWithId = {
        ...newRole,
        id: Math.max(...roles.map((role) => role.id), 0) + 1,
      };
      setRoles([...roles, newRoleWithId]);
      setSelectedRole(newRoleWithId);
    }

    setDialogOpen(false);
  };

  const handlePermissionChange = (category, permission, checked) => {
    setNewRole({
      ...newRole,
      permissions: {
        ...newRole.permissions,
        [category]: {
          ...newRole.permissions[category],
          [permission]: checked,
        },
      },
    });
  };

  const handleInputChange = (field, value) => {
    setNewRole({
      ...newRole,
      [field]: value,
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  Roles
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddRole}
                >
                  Add Role
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Role Name</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow
                        key={role.id}
                        hover
                        selected={selectedRole?.id === role.id}
                        onClick={() => handleRoleSelect(role)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  {selectedRole ? `Permissions: ${selectedRole.name}` : 'Select a role to view permissions'}
                </Typography>
                {selectedRole && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={handleEditRole}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteRole}
                    >
                      Delete
                    </Button>
                  </Stack>
                )}
              </Box>

              {selectedRole ? (
                <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Permissions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {permissionCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {category.permissions.map((permission) => (
                                <Chip
                                  key={permission}
                                  label={formatPermissionName(permission)}
                                  color={
                                    selectedRole.permissions[category.id][permission]
                                      ? 'success'
                                      : 'default'
                                  }
                                  size="small"
                                  sx={{ m: 0.5 }}
                                />
                              ))}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 400,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Select a role from the list to view its permissions
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Role Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Role' : 'Add New Role'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Role Name"
                value={newRole.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                value={newRole.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Permissions
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Permissions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {permissionCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>
                          <Grid container spacing={1}>
                            {category.permissions.map((permission) => (
                              <Grid item key={permission} xs={6} sm={4} md={3}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Typography variant="body2">
                                    {formatPermissionName(permission)}
                                  </Typography>
                                  <Switch
                                    size="small"
                                    checked={
                                      newRole.permissions[category.id]?.[permission] || false
                                    }
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        category.id,
                                        permission,
                                        e.target.checked
                                      )
                                    }
                                  />
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleSaveRole}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            {editMode ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolePermissions; 