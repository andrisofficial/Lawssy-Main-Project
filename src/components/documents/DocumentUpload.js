import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
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
  OutlinedInput,
  Autocomplete,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  useTheme
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const DocumentUpload = () => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [documentMetadata, setDocumentMetadata] = useState({
    title: '',
    tags: [],
    folder: '',
    description: ''
  });
  const [dragActive, setDragActive] = useState(false);

  // Sample data
  const availableTags = ['Contract', 'NDA', 'Patent', 'Lease', 'Template', 'Client', 'Financial', 'Legal'];
  const availableFolders = ['My Documents', 'Contracts', 'Client Files', 'Templates', 'Legal Research'];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    setFiles([...files, ...newFiles]);
    setOpen(true);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    // If no files left, close the dialog
    if (newFiles.length === 0) {
      setOpen(false);
    }
  };

  const handleUpload = () => {
    setUploading(true);
    
    // Initialize progress for each file
    const initialProgress = {};
    files.forEach((file, index) => {
      initialProgress[index] = 0;
    });
    setUploadProgress(initialProgress);
    
    // Simulate upload progress for each file
    files.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Check if all files are uploaded
          const allUploaded = Object.values({
            ...uploadProgress,
            [index]: progress
          }).every(p => p === 100);
          
          if (allUploaded) {
            setTimeout(() => {
              setUploading(false);
              setFiles([]);
              setDocumentMetadata({
                title: '',
                tags: [],
                folder: '',
                description: ''
              });
              setOpen(false);
              setUploadProgress({});
            }, 1000);
          }
        }
        
        setUploadProgress(prev => ({
          ...prev,
          [index]: progress
        }));
      }, 300);
    });
  };

  const handleMetadataChange = (field, value) => {
    setDocumentMetadata({
      ...documentMetadata,
      [field]: value
    });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <DescriptionIcon sx={{ color: '#F44336' }} />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon sx={{ color: '#2196F3' }} />;
      case 'xls':
      case 'xlsx':
        return <DescriptionIcon sx={{ color: '#4CAF50' }} />;
      case 'txt':
        return <DescriptionIcon sx={{ color: '#9E9E9E' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <DescriptionIcon sx={{ color: '#FF9800' }} />;
      default:
        return <DescriptionIcon />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Box
        sx={{
          border: `2px dashed ${dragActive ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: '8px',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: dragActive ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
          transition: 'all 0.2s',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.02)',
            borderColor: theme.palette.primary.main
          }
        }}
        onClick={() => fileInputRef.current.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          onChange={handleFileInputChange}
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Drag & Drop Files Here
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          or click to browse your files
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          Supports PDF, Word, Excel, Images, and more
        </Typography>
      </Box>

      {/* Upload Dialog */}
      <Dialog 
        open={open} 
        onClose={() => !uploading && setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Upload Documents
          {!uploading && (
            <IconButton
              aria-label="close"
              onClick={() => setOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Selected Files</Typography>
            <List>
              {files.map((file, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {getFileIcon(file.name)}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={formatFileSize(file.size)}
                    />
                    {uploading ? (
                      <Box sx={{ width: '50%', mr: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={uploadProgress[index] || 0} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                          {Math.round(uploadProgress[index] || 0)}%
                        </Typography>
                      </Box>
                    ) : (
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  {index < files.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
            {!uploading && (
              <Button
                startIcon={<AddIcon />}
                onClick={() => fileInputRef.current.click()}
                sx={{ mt: 2 }}
              >
                Add More Files
              </Button>
            )}
          </Box>

          {!uploading && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Document Metadata</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Document Title"
                    fullWidth
                    value={documentMetadata.title}
                    onChange={(e) => handleMetadataChange('title', e.target.value)}
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    multiple
                    options={availableTags}
                    value={documentMetadata.tags}
                    onChange={(e, newValue) => handleMetadataChange('tags', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Tags"
                        margin="dense"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          key={index}
                          size="small"
                        />
                      ))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="folder-label">Folder</InputLabel>
                    <Select
                      labelId="folder-label"
                      value={documentMetadata.folder}
                      onChange={(e) => handleMetadataChange('folder', e.target.value)}
                      input={<OutlinedInput label="Folder" />}
                    >
                      {availableFolders.map((folder) => (
                        <MenuItem key={folder} value={folder}>
                          {folder}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description (Optional)"
                    fullWidth
                    multiline
                    rows={3}
                    value={documentMetadata.description}
                    onChange={(e) => handleMetadataChange('description', e.target.value)}
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          {!uploading && (
            <Button onClick={() => setOpen(false)}>
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            startIcon={uploading ? null : <CloudUploadIcon />}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Helper component for the grid layout
const Grid = ({ container, item, xs, sm, md, lg, spacing, children, ...props }) => {
  const gridTheme = useTheme();
  
  if (container) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: spacing ? -spacing/2 : 0,
          ...props.sx
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
  
  if (item) {
    const getWidth = (size) => {
      if (!size) return undefined;
      return `${(size / 12) * 100}%`;
    };
    
    return (
      <Box
        sx={{
          padding: spacing ? spacing/2 : 0,
          flexBasis: getWidth(xs),
          maxWidth: getWidth(xs),
          flexGrow: 0,
          [gridTheme.breakpoints.up('sm')]: {
            flexBasis: getWidth(sm),
            maxWidth: getWidth(sm),
          },
          [gridTheme.breakpoints.up('md')]: {
            flexBasis: getWidth(md),
            maxWidth: getWidth(md),
          },
          [gridTheme.breakpoints.up('lg')]: {
            flexBasis: getWidth(lg),
            maxWidth: getWidth(lg),
          },
          ...props.sx
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
  
  return <Box {...props}>{children}</Box>;
};

export default DocumentUpload; 