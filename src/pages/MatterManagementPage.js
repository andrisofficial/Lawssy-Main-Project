import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  Typography, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  Divider, 
  Stack, 
  useTheme,
  Tab,
  Tabs,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import NewMatterForm from '../components/matters/NewMatterForm';

const MatterManagementPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [newMatterOpen, setNewMatterOpen] = useState(false);
  const [selectedMatterId, setSelectedMatterId] = useState(null);

  // Sample data for matters
  const matters = [
    { 
      id: 1, 
      name: 'Johnson v. Smith', 
      client: 'Acme Corporation', 
      status: 'Active', 
      practiceArea: 'Litigation',
      responsibleAttorney: 'Sarah Johnson',
      openDate: '2023-06-15'
    },
    { 
      id: 2, 
      name: 'Patent Filing #2023-05', 
      client: 'Global Industries', 
      status: 'Pending', 
      practiceArea: 'Intellectual Property',
      responsibleAttorney: 'Michael Brown',
      openDate: '2023-06-12'
    },
    { 
      id: 3, 
      name: 'Compliance Review Q2', 
      client: 'Tech Innovations', 
      status: 'Active', 
      practiceArea: 'Compliance',
      responsibleAttorney: 'Emily Chen',
      openDate: '2023-06-10'
    },
    { 
      id: 4, 
      name: 'Merger Documentation', 
      client: 'Finance Group Ltd', 
      status: 'Urgent', 
      practiceArea: 'Corporate',
      responsibleAttorney: 'Sarah Johnson',
      openDate: '2023-06-05'
    },
    { 
      id: 5, 
      name: 'Employee Handbook Update', 
      client: 'Retail Solutions Inc', 
      status: 'Active', 
      practiceArea: 'Employment',
      responsibleAttorney: 'David Wilson',
      openDate: '2023-06-01'
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event, matterId) => {
    setAnchorEl(event.currentTarget);
    setSelectedMatterId(matterId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleNewMatterOpen = () => {
    setNewMatterOpen(true);
  };

  const handleNewMatterClose = () => {
    setNewMatterOpen(false);
  };

  const handleMatterClick = (matterId) => {
    navigate(`/matters/${matterId}`);
  };

  const handleViewDetails = () => {
    if (selectedMatterId) {
      navigate(`/matters/${selectedMatterId}`);
    }
    handleMenuClose();
  };

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

  return (
    <MainLayout title="Matter Management">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={600}>
            Matter Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleNewMatterOpen}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            New Matter
          </Button>
        </Box>

        <Card sx={{ mb: 3, p: 2, borderRadius: '8px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search matters..."
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1, minWidth: '200px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              variant="outlined" 
              size="medium"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              sx={{ 
                borderColor: '#E5E7EB',
                color: 'text.primary',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'rgba(0, 105, 209, 0.04)'
                }
              }}
            >
              Filter
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
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
                  minWidth: '200px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  mt: 1
                }
              }}
            >
              <MenuItem onClick={handleFilterClose}>Status: Active</MenuItem>
              <MenuItem onClick={handleFilterClose}>Status: Pending</MenuItem>
              <MenuItem onClick={handleFilterClose}>Status: Closed</MenuItem>
              <MenuItem onClick={handleFilterClose}>Practice Area: Litigation</MenuItem>
              <MenuItem onClick={handleFilterClose}>Practice Area: Corporate</MenuItem>
              <MenuItem onClick={handleFilterClose}>Assigned to Me</MenuItem>
            </Menu>
            <Button 
              variant="outlined" 
              size="medium"
              startIcon={<SortIcon />}
              onClick={handleSortClick}
              sx={{ 
                borderColor: '#E5E7EB',
                color: 'text.primary',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'rgba(0, 105, 209, 0.04)'
                }
              }}
            >
              Sort
            </Button>
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleSortClose}
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
                  minWidth: '200px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  mt: 1
                }
              }}
            >
              <MenuItem onClick={handleSortClose}>Date: Newest First</MenuItem>
              <MenuItem onClick={handleSortClose}>Date: Oldest First</MenuItem>
              <MenuItem onClick={handleSortClose}>Name: A-Z</MenuItem>
              <MenuItem onClick={handleSortClose}>Name: Z-A</MenuItem>
              <MenuItem onClick={handleSortClose}>Client: A-Z</MenuItem>
            </Menu>
          </Box>
        </Card>

        <Box sx={{ borderBottom: 1, borderColor: '#F3F4F6', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
              }
            }}
          >
            <Tab 
              label="All Matters" 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                fontSize: '0.875rem',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                }
              }} 
            />
            <Tab 
              label="My Matters" 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                fontSize: '0.875rem',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                }
              }} 
            />
            <Tab 
              label="Active" 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                fontSize: '0.875rem',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                }
              }} 
            />
            <Tab 
              label="Pending" 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                fontSize: '0.875rem',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                }
              }} 
            />
            <Tab 
              label="Closed" 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                fontSize: '0.875rem',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                }
              }} 
            />
          </Tabs>
        </Box>

        <Paper sx={{ borderRadius: '8px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
          <List sx={{ p: 0 }}>
            {matters.map((matter, index) => (
              <React.Fragment key={matter.id}>
                <ListItem 
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
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessCenterIcon 
                          sx={{ 
                            color: '#64748B', 
                            mr: 2, 
                            fontSize: '1.5rem' 
                          }} 
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {matter.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {matter.client}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Typography variant="body2" color="text.secondary">
                        Practice Area
                      </Typography>
                      <Typography variant="body2">
                        {matter.practiceArea}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Typography variant="body2" color="text.secondary">
                        Responsible Attorney
                      </Typography>
                      <Typography variant="body2">
                        {matter.responsibleAttorney}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={1}>
                      <Box 
                        sx={{ 
                          borderRadius: '4px', 
                          px: 1, 
                          py: 0.5, 
                          display: 'inline-block',
                          backgroundColor: `${getStatusColor(matter.status)}20`, // 20% opacity
                          color: getStatusColor(matter.status),
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      >
                        {matter.status}
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={1} sx={{ textAlign: 'right' }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the ListItem click
                          handleMenuClick(e, matter.id);
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
                {index < matters.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
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
            <MenuItem onClick={handleViewDetails}>View Details</MenuItem>
            <MenuItem onClick={handleMenuClose}>Edit Matter</MenuItem>
            <MenuItem onClick={handleMenuClose}>Change Status</MenuItem>
            <MenuItem onClick={handleMenuClose}>Add Task</MenuItem>
            <MenuItem onClick={handleMenuClose}>Add Note</MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose} sx={{ color: '#EF4444' }}>Close Matter</MenuItem>
          </Menu>
        </Paper>
      </Container>
      
      {/* New Matter Form Dialog */}
      <NewMatterForm 
        open={newMatterOpen} 
        onClose={handleNewMatterClose} 
      />
    </MainLayout>
  );
};

export default MatterManagementPage; 