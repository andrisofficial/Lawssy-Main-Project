import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  Grid,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';

const TimeCategories = ({
  practiceAreas = [],
  setPracticeAreas,
  activityTypes = [],
  setActivityTypes
}) => {
  const [newPracticeArea, setNewPracticeArea] = useState('');
  const [newActivityType, setNewActivityType] = useState('');
  const [editingPracticeAreaId, setEditingPracticeAreaId] = useState(null);
  const [editingActivityTypeId, setEditingActivityTypeId] = useState(null);
  const [editPracticeAreaName, setEditPracticeAreaName] = useState('');
  const [editActivityTypeName, setEditActivityTypeName] = useState('');
  const [practiceAreaDialogOpen, setPracticeAreaDialogOpen] = useState(false);
  const [activityTypeDialogOpen, setActivityTypeDialogOpen] = useState(false);

  // Default practice areas if not provided
  const defaultPracticeAreas = practiceAreas.length > 0 ? practiceAreas : [
    { id: 1, name: 'Contract Review' },
    { id: 2, name: 'Litigation' },
    { id: 3, name: 'Corporate Law' },
    { id: 4, name: 'Intellectual Property' },
    { id: 5, name: 'Real Estate' }
  ];

  // Default activity types if not provided
  const defaultActivityTypes = activityTypes.length > 0 ? activityTypes : [
    { id: 1, name: 'Research' },
    { id: 2, name: 'Client Call' },
    { id: 3, name: 'Document Drafting' },
    { id: 4, name: 'Court Appearance' },
    { id: 5, name: 'Meeting' }
  ];

  const handleAddPracticeArea = () => {
    if (!newPracticeArea.trim()) return;
    
    const newArea = {
      id: Date.now(),
      name: newPracticeArea.trim()
    };
    
    setPracticeAreas([...defaultPracticeAreas, newArea]);
    setNewPracticeArea('');
    setPracticeAreaDialogOpen(false);
  };

  const handleAddActivityType = () => {
    if (!newActivityType.trim()) return;
    
    const newType = {
      id: Date.now(),
      name: newActivityType.trim()
    };
    
    setActivityTypes([...defaultActivityTypes, newType]);
    setNewActivityType('');
    setActivityTypeDialogOpen(false);
  };

  const handleDeletePracticeArea = (id) => {
    setPracticeAreas(defaultPracticeAreas.filter(area => area.id !== id));
  };

  const handleDeleteActivityType = (id) => {
    setActivityTypes(defaultActivityTypes.filter(type => type.id !== id));
  };

  const handleEditPracticeArea = (id) => {
    const area = defaultPracticeAreas.find(area => area.id === id);
    setEditingPracticeAreaId(id);
    setEditPracticeAreaName(area.name);
  };

  const handleEditActivityType = (id) => {
    const type = defaultActivityTypes.find(type => type.id === id);
    setEditingActivityTypeId(id);
    setEditActivityTypeName(type.name);
  };

  const handleSavePracticeAreaEdit = () => {
    if (!editPracticeAreaName.trim()) return;
    
    setPracticeAreas(
      defaultPracticeAreas.map(area => 
        area.id === editingPracticeAreaId 
          ? { ...area, name: editPracticeAreaName.trim() } 
          : area
      )
    );
    
    setEditingPracticeAreaId(null);
    setEditPracticeAreaName('');
  };

  const handleSaveActivityTypeEdit = () => {
    if (!editActivityTypeName.trim()) return;
    
    setActivityTypes(
      defaultActivityTypes.map(type => 
        type.id === editingActivityTypeId 
          ? { ...type, name: editActivityTypeName.trim() } 
          : type
      )
    );
    
    setEditingActivityTypeId(null);
    setEditActivityTypeName('');
  };

  const handleCancelPracticeAreaEdit = () => {
    setEditingPracticeAreaId(null);
    setEditPracticeAreaName('');
  };

  const handleCancelActivityTypeEdit = () => {
    setEditingActivityTypeId(null);
    setEditActivityTypeName('');
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
        Time Categorization Settings
      </Typography>
      
      <Grid container spacing={3}>
        {/* Practice Areas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  Practice Areas
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon />}
                  onClick={() => setPracticeAreaDialogOpen(true)}
                >
                  Add New
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={1}>
                {defaultPracticeAreas.map((area) => (
                  <Paper 
                    key={area.id} 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    {editingPracticeAreaId === area.id ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <TextField
                          value={editPracticeAreaName}
                          onChange={(e) => setEditPracticeAreaName(e.target.value)}
                          size="small"
                          fullWidth
                          autoFocus
                        />
                        <IconButton color="primary" onClick={handleSavePracticeAreaEdit}>
                          <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={handleCancelPracticeAreaEdit}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DragIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                          <Typography>{area.name}</Typography>
                        </Box>
                        <Box>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEditPracticeArea(area.id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDeletePracticeArea(area.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>
                    )}
                  </Paper>
                ))}
              </Stack>
              
              {defaultPracticeAreas.length === 0 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    No practice areas defined. Click "Add New" to create one.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Activity Types */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  Activity Types
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<AddIcon />}
                  onClick={() => setActivityTypeDialogOpen(true)}
                >
                  Add New
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={1}>
                {defaultActivityTypes.map((type) => (
                  <Paper 
                    key={type.id} 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    {editingActivityTypeId === type.id ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <TextField
                          value={editActivityTypeName}
                          onChange={(e) => setEditActivityTypeName(e.target.value)}
                          size="small"
                          fullWidth
                          autoFocus
                        />
                        <IconButton color="primary" onClick={handleSaveActivityTypeEdit}>
                          <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={handleCancelActivityTypeEdit}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DragIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                          <Typography>{type.name}</Typography>
                        </Box>
                        <Box>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEditActivityType(type.id)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleDeleteActivityType(type.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>
                    )}
                  </Paper>
                ))}
              </Stack>
              
              {defaultActivityTypes.length === 0 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    No activity types defined. Click "Add New" to create one.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Alert severity="info" sx={{ mt: 3 }}>
        Time entries can be categorized by practice area and activity type to help with reporting and analysis.
      </Alert>
      
      {/* Add Practice Area Dialog */}
      <Dialog open={practiceAreaDialogOpen} onClose={() => setPracticeAreaDialogOpen(false)}>
        <DialogTitle>Add New Practice Area</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Practice Area Name"
            fullWidth
            value={newPracticeArea}
            onChange={(e) => setNewPracticeArea(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPracticeAreaDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddPracticeArea} 
            variant="contained"
            disabled={!newPracticeArea.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Activity Type Dialog */}
      <Dialog open={activityTypeDialogOpen} onClose={() => setActivityTypeDialogOpen(false)}>
        <DialogTitle>Add New Activity Type</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Activity Type Name"
            fullWidth
            value={newActivityType}
            onChange={(e) => setNewActivityType(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActivityTypeDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddActivityType} 
            variant="contained"
            disabled={!newActivityType.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeCategories; 