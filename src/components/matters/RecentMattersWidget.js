import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Button,
  Chip,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const RecentMattersWidget = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Sample data for recent matters
  const recentMatters = [
    { 
      id: 1, 
      name: 'Johnson v. Smith', 
      client: 'Acme Corporation', 
      status: 'Active', 
      date: '2023-06-15'
    },
    { 
      id: 2, 
      name: 'Patent Filing #2023-05', 
      client: 'Global Industries', 
      status: 'Pending', 
      date: '2023-06-12'
    },
    { 
      id: 3, 
      name: 'Compliance Review Q2', 
      client: 'Tech Innovations', 
      status: 'Active', 
      date: '2023-06-10'
    },
  ];

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

  const handleViewAllClick = () => {
    navigate('/matters');
  };

  const handleMatterClick = (matterId) => {
    navigate(`/matters/${matterId}`);
  };

  return (
    <Paper sx={{ height: '100%', borderRadius: '8px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BusinessCenterIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h6" fontWeight={600}>
            Recent Matters
          </Typography>
        </Box>
        <Button 
          endIcon={<ArrowForwardIcon />} 
          onClick={handleViewAllClick}
          sx={{ 
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: 'transparent',
              opacity: 0.8
            }
          }}
        >
          View All
        </Button>
      </Box>
      <List disablePadding>
        {recentMatters.map((matter, index) => (
          <React.Fragment key={matter.id}>
            <ListItem 
              alignItems="flex-start" 
              sx={{ 
                px: 3, 
                py: 2,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)'
                }
              }}
              onClick={() => handleMatterClick(matter.id)}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {matter.name}
                  </Typography>
                  <Chip 
                    label={matter.status} 
                    size="small"
                    sx={{ 
                      height: 24, 
                      fontSize: '0.75rem',
                      backgroundColor: `${getStatusColor(matter.status)}20`, // 20% opacity
                      color: getStatusColor(matter.status),
                      fontWeight: 500,
                      borderRadius: '4px'
                    }} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {matter.client}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Opened on {matter.date}
                </Typography>
              </Box>
            </ListItem>
            {index < recentMatters.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default RecentMattersWidget; 