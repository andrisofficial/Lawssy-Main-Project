import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { SketchPicker } from 'react-color';

// Mock template preview image URLs
const templatePreviewUrls = {
  'default': 'https://via.placeholder.com/350x200/e3f2fd/0d47a1?text=Default+Template',
  'modern': 'https://via.placeholder.com/350x200/fce4ec/c2185b?text=Modern+Template',
  'professional': 'https://via.placeholder.com/350x200/f3e5f5/7b1fa2?text=Professional+Template',
  'minimalist': 'https://via.placeholder.com/350x200/e8f5e9/2e7d32?text=Minimalist+Template'
};

const InvoiceTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState('primary');
  
  // Template form state
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    logoUrl: null,
    colorScheme: {
      primary: '#1976d2',
      secondary: '#f50057'
    },
    displayColumns: ['date', 'description', 'hours', 'rate', 'amount'],
    headerText: '',
    footerText: 'Thank you for your business!',
    dateFormat: 'MM/dd/yyyy',
    showDetailedDescription: true
  });
  
  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/invoice-templates');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch templates');
        // }
        // const data = await response.json();
        // setTemplates(data);
        
        // For demo purposes, use mock data
        setTemplates([
          {
            id: 'default',
            name: 'Default Template',
            logoUrl: null,
            colorScheme: {
              primary: '#1976d2',
              secondary: '#f50057'
            },
            displayColumns: ['date', 'description', 'hours', 'rate', 'amount'],
            headerText: '',
            footerText: 'Thank you for your business!',
            dateFormat: 'MM/dd/yyyy',
            showDetailedDescription: true
          },
          {
            id: 'modern',
            name: 'Modern Template',
            logoUrl: null,
            colorScheme: {
              primary: '#c2185b',
              secondary: '#7b1fa2'
            },
            displayColumns: ['date', 'description', 'hours', 'rate', 'amount'],
            headerText: '',
            footerText: 'We appreciate your business!',
            dateFormat: 'yyyy-MM-dd',
            showDetailedDescription: true
          },
          {
            id: 'professional',
            name: 'Professional Template',
            logoUrl: null,
            colorScheme: {
              primary: '#0d47a1',
              secondary: '#00838f'
            },
            displayColumns: ['date', 'matter', 'description', 'hours', 'rate', 'amount'],
            headerText: 'CONFIDENTIAL INVOICE',
            footerText: 'Payment due within 30 days. Please make checks payable to Your Law Firm LLC.',
            dateFormat: 'MM/dd/yyyy',
            showDetailedDescription: true
          }
        ]);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);
  
  const handleEditTemplate = (template) => {
    setCurrentTemplate(template);
    setTemplateFormData({ ...template });
    setEditDialogOpen(true);
  };
  
  const handleAddTemplate = () => {
    setCurrentTemplate(null);
    setTemplateFormData({
      name: '',
      logoUrl: null,
      colorScheme: {
        primary: '#1976d2',
        secondary: '#f50057'
      },
      displayColumns: ['date', 'description', 'hours', 'rate', 'amount'],
      headerText: '',
      footerText: 'Thank you for your business!',
      dateFormat: 'MM/dd/yyyy',
      showDetailedDescription: true
    });
    setEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setShowColorPicker(false);
  };
  
  const handleFormChange = (field, value) => {
    setTemplateFormData({
      ...templateFormData,
      [field]: value
    });
  };
  
  const handleColorChange = (color) => {
    setTemplateFormData({
      ...templateFormData,
      colorScheme: {
        ...templateFormData.colorScheme,
        [colorPickerType]: color.hex
      }
    });
  };
  
  const handleSaveTemplate = async () => {
    try {
      // Validate form
      if (!templateFormData.name) {
        setError('Template name is required');
        return;
      }
      
      // In a real app, this would be an API call
      // const response = await fetch('/api/invoice-templates' + (currentTemplate ? `/${currentTemplate.id}` : ''), {
      //   method: currentTemplate ? 'PUT' : 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(templateFormData)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to save template');
      // }
      
      // const savedTemplate = await response.json();
      
      // For demo purposes
      const savedTemplate = {
        ...templateFormData,
        id: currentTemplate ? currentTemplate.id : `template-${Date.now()}`
      };
      
      if (currentTemplate) {
        // Update existing template
        setTemplates(templates.map(tpl => 
          tpl.id === currentTemplate.id ? savedTemplate : tpl
        ));
        setSuccessMessage('Template updated successfully.');
      } else {
        // Add new template
        setTemplates([...templates, savedTemplate]);
        setSuccessMessage('Template created successfully.');
      }
      
      handleCloseEditDialog();
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDeleteTemplate = (template) => {
    if (template.id === 'default') {
      setError('The default template cannot be deleted.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the "${template.name}" template?`)) {
      // In a real app, this would be an API call
      // await fetch(`/api/invoice-templates/${template.id}`, {
      //   method: 'DELETE'
      // });
      
      // For demo purposes
      setTemplates(templates.filter(tpl => tpl.id !== template.id));
      setSuccessMessage('Template deleted successfully.');
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  };
  
  const handleDuplicateTemplate = (template) => {
    const duplicatedTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`
    };
    
    setTemplates([...templates, duplicatedTemplate]);
    setSuccessMessage('Template duplicated successfully.');
    
    // Clear success message after a few seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };
  
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Invoice Templates</Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddTemplate}
        >
          Create New Template
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} md={6} lg={4} key={template.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none'
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={templatePreviewUrls[template.id] || templatePreviewUrls.default}
                  alt={template.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {template.name}
                    {template.id === 'default' && (
                      <Tooltip title="Default Template">
                        <CheckIcon 
                          fontSize="small" 
                          color="primary"
                          sx={{ ml: 1, verticalAlign: 'middle' }}
                        />
                      </Tooltip>
                    )}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      mb: 2
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: template.colorScheme.primary,
                        borderRadius: '50%'
                      }} 
                    />
                    <Box 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: template.colorScheme.secondary,
                        borderRadius: '50%'
                      }} 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {template.displayColumns.join(', ')}
                  </Typography>
                  
                  {template.footerText && (
                    <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                      Footer: {template.footerText}
                    </Typography>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditTemplate(template)}
                    >
                      Edit
                    </Button>
                    
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CopyIcon />}
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      Duplicate
                    </Button>
                    
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTemplate(template)}
                      disabled={template.id === 'default'}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Edit Template Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentTemplate ? `Edit ${currentTemplate.name}` : 'Create New Template'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Template Name"
                value={templateFormData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                margin="normal"
                required
              />
              
              <Button
                variant="outlined"
                component="label"
                sx={{ mt: 2, mb: 2 }}
              >
                Upload Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      // In a real app, this would upload the file to your server
                      // For now, just set a placeholder URL
                      handleFormChange('logoUrl', 'logo.png');
                    }
                  }}
                />
              </Button>
              
              {templateFormData.logoUrl && (
                <Typography variant="caption" display="block">
                  Logo: {templateFormData.logoUrl}
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Color Scheme
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: templateFormData.colorScheme.primary,
                        borderRadius: '50%',
                        mr: 1,
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setColorPickerType('primary');
                        setShowColorPicker(!showColorPicker);
                      }}
                    />
                    <Typography variant="body2">Primary Color</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: templateFormData.colorScheme.secondary,
                        borderRadius: '50%',
                        mr: 1,
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setColorPickerType('secondary');
                        setShowColorPicker(!showColorPicker);
                      }}
                    />
                    <Typography variant="body2">Secondary Color</Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {showColorPicker && (
                <Box sx={{ mb: 2 }}>
                  <SketchPicker
                    color={templateFormData.colorScheme[colorPickerType]}
                    onChange={handleColorChange}
                    disableAlpha
                  />
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Date Format</InputLabel>
                <Select
                  value={templateFormData.dateFormat}
                  label="Date Format"
                  onChange={(e) => handleFormChange('dateFormat', e.target.value)}
                >
                  <MenuItem value="MM/dd/yyyy">MM/DD/YYYY (e.g., 01/31/2023)</MenuItem>
                  <MenuItem value="dd/MM/yyyy">DD/MM/YYYY (e.g., 31/01/2023)</MenuItem>
                  <MenuItem value="yyyy-MM-dd">YYYY-MM-DD (e.g., 2023-01-31)</MenuItem>
                  <MenuItem value="MMMM d, yyyy">Month D, YYYY (e.g., January 31, 2023)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Header Text"
                value={templateFormData.headerText}
                onChange={(e) => handleFormChange('headerText', e.target.value)}
                margin="normal"
                placeholder="Optional header text"
              />
              
              <TextField
                fullWidth
                label="Footer Text"
                value={templateFormData.footerText}
                onChange={(e) => handleFormChange('footerText', e.target.value)}
                margin="normal"
                placeholder="Payment terms, thank you message, etc."
                multiline
                rows={2}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Displayed Columns
              </Typography>
              
              <Grid container spacing={1}>
                {[
                  { id: 'date', label: 'Date' },
                  { id: 'matter', label: 'Matter' },
                  { id: 'description', label: 'Description' },
                  { id: 'hours', label: 'Hours' },
                  { id: 'rate', label: 'Rate' },
                  { id: 'amount', label: 'Amount' }
                ].map((column) => (
                  <Grid item xs={6} key={column.id}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={templateFormData.displayColumns.includes(column.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFormChange('displayColumns', [...templateFormData.displayColumns, column.id]);
                            } else {
                              handleFormChange(
                                'displayColumns',
                                templateFormData.displayColumns.filter(col => col !== column.id)
                              );
                            }
                          }}
                        />
                      }
                      label={column.label}
                    />
                  </Grid>
                ))}
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={templateFormData.showDetailedDescription}
                    onChange={(e) => handleFormChange('showDetailedDescription', e.target.checked)}
                  />
                }
                label="Show detailed time entry descriptions"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSaveTemplate}
          >
            {currentTemplate ? 'Update' : 'Create'} Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceTemplates; 