import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';

// Sample template categories
const templateCategories = [
  { id: 'all', label: 'All Templates' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'legal', label: 'Legal Forms' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'litigation', label: 'Litigation' },
  { id: 'estate', label: 'Estate Planning' }
];

// Sample templates data
const sampleTemplates = [
  {
    id: 1,
    title: 'Non-Disclosure Agreement',
    description: 'Standard NDA template for protecting confidential information',
    category: 'contracts',
    tags: ['NDA', 'Confidentiality', 'Contract'],
    lastModified: '2023-06-10',
    author: 'John Doe',
    starred: true,
    usageCount: 42
  },
  {
    id: 2,
    title: 'Employment Agreement',
    description: 'Standard employment contract with customizable terms',
    category: 'contracts',
    tags: ['Employment', 'Contract', 'HR'],
    lastModified: '2023-06-05',
    author: 'Jane Smith',
    starred: false,
    usageCount: 28
  },
  {
    id: 3,
    title: 'Motion to Dismiss',
    description: 'Template for filing a motion to dismiss in civil litigation',
    category: 'litigation',
    tags: ['Litigation', 'Motion', 'Civil'],
    lastModified: '2023-05-28',
    author: 'Robert Johnson',
    starred: true,
    usageCount: 15
  },
  {
    id: 4,
    title: 'Last Will and Testament',
    description: 'Comprehensive will template with asset distribution clauses',
    category: 'estate',
    tags: ['Will', 'Estate', 'Testament'],
    lastModified: '2023-05-20',
    author: 'Emily Davis',
    starred: false,
    usageCount: 31
  },
  {
    id: 5,
    title: 'LLC Operating Agreement',
    description: 'Standard operating agreement for Limited Liability Companies',
    category: 'corporate',
    tags: ['LLC', 'Corporate', 'Agreement'],
    lastModified: '2023-05-15',
    author: 'John Doe',
    starred: false,
    usageCount: 24
  },
  {
    id: 6,
    title: 'Commercial Lease Agreement',
    description: 'Template for commercial property leasing with customizable terms',
    category: 'contracts',
    tags: ['Lease', 'Commercial', 'Property'],
    lastModified: '2023-05-10',
    author: 'Jane Smith',
    starred: true,
    usageCount: 19
  }
];

const DocumentTemplates = forwardRef((props, ref) => {
  const theme = useTheme();
  const [templates, setTemplates] = useState(sampleTemplates);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newTemplateDialog, setNewTemplateDialog] = useState(false);
  const [templateFormData, setTemplateFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  });
  const [previewDialog, setPreviewDialog] = useState(false);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleNewTemplate: () => {
      setTemplateFormData({
        title: '',
        description: '',
        category: '',
        tags: ''
      });
      setNewTemplateDialog(true);
    }
  }));

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleMenuOpen = (event, template) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStarToggle = (templateId) => {
    setTemplates(templates.map(template => 
      template.id === templateId 
        ? { ...template, starred: !template.starred } 
        : template
    ));
  };

  const handleNewTemplate = () => {
    setTemplateFormData({
      title: '',
      description: '',
      category: '',
      tags: ''
    });
    setNewTemplateDialog(true);
  };

  const handleEditTemplate = () => {
    if (selectedTemplate) {
      setTemplateFormData({
        title: selectedTemplate.title,
        description: selectedTemplate.description,
        category: selectedTemplate.category,
        tags: selectedTemplate.tags.join(', ')
      });
      setNewTemplateDialog(true);
      handleMenuClose();
    }
  };

  const handleDeleteTemplate = () => {
    if (selectedTemplate) {
      setTemplates(templates.filter(template => template.id !== selectedTemplate.id));
      handleMenuClose();
    }
  };

  const handlePreviewTemplate = () => {
    setPreviewDialog(true);
    handleMenuClose();
  };

  const handleFormChange = (field, value) => {
    setTemplateFormData({
      ...templateFormData,
      [field]: value
    });
  };

  const handleSaveTemplate = () => {
    const tagsArray = templateFormData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);

    const newTemplate = {
      id: selectedTemplate ? selectedTemplate.id : templates.length + 1,
      title: templateFormData.title,
      description: templateFormData.description,
      category: templateFormData.category || 'contracts',
      tags: tagsArray,
      lastModified: new Date().toISOString().split('T')[0],
      author: 'John Doe', // Would come from user session in a real app
      starred: selectedTemplate ? selectedTemplate.starred : false,
      usageCount: selectedTemplate ? selectedTemplate.usageCount : 0
    };

    if (selectedTemplate) {
      setTemplates(templates.map(template => 
        template.id === selectedTemplate.id ? newTemplate : template
      ));
    } else {
      setTemplates([...templates, newTemplate]);
    }

    setNewTemplateDialog(false);
    setSelectedTemplate(null);
  };

  // Filter templates based on selected category
  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(template => template.category === selectedCategory);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 3,
              py: 1.5
            }
          }}
        >
          {templateCategories.map(category => (
            <Tab 
              key={category.id} 
              value={category.id} 
              label={category.label} 
            />
          ))}
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {filteredTemplates.map(template => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '6px',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" component="div" noWrap>
                      {template.title}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleStarToggle(template.id)}
                      sx={{ mr: 0.5 }}
                    >
                      {template.starred ? (
                        <StarIcon sx={{ color: theme.palette.warning.main }} />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleMenuOpen(e, template)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {template.description}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {template.tags.map((tag, index) => (
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
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Last modified: {template.lastModified}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Used {template.usageCount} times
                  </Typography>
                </Box>
              </CardContent>
              
              <Divider />
              
              <CardActions sx={{ px: 2, py: 1 }}>
                <Button 
                  size="small" 
                  startIcon={<FileCopyIcon />}
                  onClick={handlePreviewTemplate}
                >
                  Use Template
                </Button>
                <Button 
                  size="small" 
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setSelectedTemplate(template);
                    handleEditTemplate();
                  }}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Template Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 1,
          sx: { minWidth: 180 }
        }}
      >
        <MenuItem onClick={handlePreviewTemplate}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Preview</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          // In a real app, this would trigger a download
        }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditTemplate}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          // In a real app, this would open a share dialog
        }}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteTemplate} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* New/Edit Template Dialog */}
      <Dialog 
        open={newTemplateDialog} 
        onClose={() => setNewTemplateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedTemplate ? 'Edit Template' : 'Create New Template'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Template Title"
              fullWidth
              value={templateFormData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              required
            />
            
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={templateFormData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
            />
            
            <TextField
              select
              label="Category"
              fullWidth
              value={templateFormData.category}
              onChange={(e) => handleFormChange('category', e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="" disabled>Select a category</option>
              {templateCategories.filter(c => c.id !== 'all').map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </TextField>
            
            <TextField
              label="Tags (comma separated)"
              fullWidth
              value={templateFormData.tags}
              onChange={(e) => handleFormChange('tags', e.target.value)}
              placeholder="e.g. contract, legal, employment"
              helperText="Enter tags separated by commas"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTemplateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveTemplate} 
            variant="contained"
            disabled={!templateFormData.title}
          >
            {selectedTemplate ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Template Preview
          {selectedTemplate && `: ${selectedTemplate.title}`}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This is a preview of the template. In a real application, this would display the actual document content.
          </Typography>
          
          <Box sx={{ 
            p: 3, 
            bgcolor: 'background.default', 
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
            height: 400,
            overflowY: 'auto'
          }}>
            <Typography variant="h6" gutterBottom>Sample Document Content</Typography>
            <Typography paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
            </Typography>
            <Typography paragraph>
              Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.
            </Typography>
            <Typography paragraph>
              Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
          <Button variant="contained">Use This Template</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

// Ensure proper display name for debugging
DocumentTemplates.displayName = 'DocumentTemplates';

export default DocumentTemplates; 