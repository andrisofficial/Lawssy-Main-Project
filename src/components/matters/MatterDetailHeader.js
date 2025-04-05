import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Button,
  Menu,
  MenuItem,
  Divider,
  useTheme
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const MatterDetailHeader = ({ matter }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#10B981'; // Green
      case 'Pending':
        return '#F59E0B'; // Amber
      case 'Closed':
        return '#6B7280'; // Gray
      case 'Urgent':
        return '#EF4444'; // Red
      default:
        return '#10B981'; // Default to green
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBackClick = () => {
    navigate('/matters');
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Back navigation */}
      <Box sx={{ mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackClick}
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'transparent',
              color: theme.palette.primary.main
            }
          }}
        >
          Back to Matters
        </Button>
      </Box>

      {/* Header with Actions */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            {matter.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Chip 
              label={`Client: ${matter.client}`} 
              sx={{ 
                bgcolor: 'rgba(31, 41, 55, 0.1)', 
                borderRadius: '6px',
                height: 28
              }} 
            />
            <Chip 
              label={`#${matter.id}`} 
              sx={{ 
                bgcolor: 'rgba(31, 41, 55, 0.1)', 
                borderRadius: '6px',
                height: 28
              }} 
            />
            <Chip 
              label={matter.status} 
              sx={{ 
                bgcolor: `${getStatusColor(matter.status)}20`,
                color: getStatusColor(matter.status),
                fontWeight: 500,
                borderRadius: '6px',
                height: 28
              }} 
            />
            <Chip 
              label={matter.practiceArea} 
              sx={{ 
                bgcolor: 'rgba(0, 105, 209, 0.1)', 
                color: theme.palette.primary.main,
                borderRadius: '6px',
                height: 28
              }} 
            />
          </Box>
        </Box>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
            sx={{ 
              mr: 1,
              borderRadius: '6px',
              borderColor: '#E5E7EB',
              color: 'text.primary',
              textTransform: 'none',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: 'rgba(0, 105, 209, 0.04)'
              }
            }}
          >
            Edit
          </Button>
          <IconButton 
            onClick={handleMenuClick}
            sx={{ 
              ml: 1,
              border: '1px solid #E5E7EB',
              '&:hover': {
                backgroundColor: 'rgba(0, 105, 209, 0.04)'
              }
            }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: { 
                minWidth: '180px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <MenuItem onClick={handleMenuClose}>Change Status</MenuItem>
            <MenuItem onClick={handleMenuClose}>Add Task</MenuItem>
            <MenuItem onClick={handleMenuClose}>Add Note</MenuItem>
            <MenuItem onClick={handleMenuClose}>Upload Document</MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose} sx={{ color: '#EF4444' }}>Close Matter</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />
    </Box>
  );
};

export default MatterDetailHeader; 