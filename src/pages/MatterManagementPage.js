import React, { useState, useRef, useEffect } from 'react';
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
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Dialog,
  DialogContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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

  // Scrollable references
  const titleBarRef = useRef(null);
  const contentRef = useRef(null);

  // Function to scroll both sections together
  const scrollTitleBar = (direction) => {
    if (titleBarRef.current) {
      const scrollAmount = 200; // Adjust as needed
      if (direction === 'left') {
        titleBarRef.current.scrollLeft -= scrollAmount;
      } else {
        titleBarRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  // Sync scrolling between title bar and content
  useEffect(() => {
    const titleBar = titleBarRef.current;
    const content = contentRef.current;
    
    if (!titleBar || !content) return;
    
    const handleTitleBarScroll = () => {
      content.scrollLeft = titleBar.scrollLeft;
    };
    
    const handleContentScroll = () => {
      titleBar.scrollLeft = content.scrollLeft;
    };
    
    titleBar.addEventListener('scroll', handleTitleBarScroll);
    content.addEventListener('scroll', handleContentScroll);
    
    return () => {
      titleBar.removeEventListener('scroll', handleTitleBarScroll);
      content.removeEventListener('scroll', handleContentScroll);
    };
  }, []);

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
    navigate('/matters/new');
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
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <Paper sx={{ borderRadius: '6px', overflow: 'hidden', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
          {/* Tabs moved to top */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                ml: 2,
                minHeight: '48px',
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                  height: '3px'
                }
              }}
            >
              <Tab 
                label="All Matters" 
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  fontSize: '14px',
                  minWidth: '80px',
                  padding: '8px 16px',
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  }
                }} 
              />
              <Tab 
                label="Active" 
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  fontSize: '14px',
                  minWidth: '80px',
                  padding: '8px 16px',
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  }
                }} 
              />
              <Tab 
                label="Pending" 
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  fontSize: '14px',
                  minWidth: '80px',
                  padding: '8px 16px',
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  }
                }} 
              />
              <Tab 
                label="Closed" 
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 600,
                  fontSize: '14px',
                  minWidth: '80px',
                  padding: '8px 16px',
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  }
                }} 
              />
            </Tabs>
          </Box>

          {/* Search & Actions Bar */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            p: 2,
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, flex: 1 }}>
              {/* Reduced search bar size */}
              <TextField
                placeholder="Search matters..."
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: '300px', 
                  maxWidth: '400px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: '#5f6368' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Action buttons on the right side */}
            <Stack direction="row" spacing={2}>
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
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleNewMatterOpen}
                sx={{ 
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                New Matter
              </Button>
            </Stack>
            
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

          {/* Title Bar Section with Column Headers */}
          <Box 
            sx={{ 
              borderBottom: '1px solid #e0e0e0',
              bgcolor: '#f9fafb',
              py: 1.5,
              px: 3,
              overflowX: 'auto',
              scrollbarWidth: 'none', // Hide scrollbar for Firefox
              '&::-webkit-scrollbar': { // Hide scrollbar for Chrome
                display: 'none'
              },
              position: 'relative'
            }}
            ref={titleBarRef}
          >
            <Box sx={{ 
              display: 'flex', 
              minWidth: '900px',
              alignItems: 'center'
            }}>
              <Box sx={{ width: '25%', fontWeight: 600, color: '#4b5563', fontSize: '0.875rem', paddingLeft: '44px' }}>
                Matter
              </Box>
              <Box sx={{ width: '15%', fontWeight: 600, color: '#4b5563', fontSize: '0.875rem' }}>
                Client
              </Box>
              <Box sx={{ width: '20%', fontWeight: 600, color: '#4b5563', fontSize: '0.875rem' }}>
                Responsible attorney
              </Box>
              <Box sx={{ width: '20%', fontWeight: 600, color: '#4b5563', fontSize: '0.875rem' }}>
                Practice area
              </Box>
              <Box sx={{ width: '10%', fontWeight: 600, color: '#4b5563', fontSize: '0.875rem' }}>
                Status
              </Box>
              <Box sx={{ width: '10%', fontWeight: 600, color: '#4b5563', fontSize: '0.875rem' }}>
                Action
              </Box>
            </Box>
          </Box>
          
          {/* Paper component containing the list with relative positioning */}
          <Paper 
            sx={{ 
              borderRadius: '6px', 
              boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)', 
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Scroll Indicators - moved here to be positioned relative to the entire section */}
            <Box 
              sx={{ 
                position: 'absolute', 
                right: 16, 
                top: '50%', 
                transform: 'translateY(-50%)',
                display: { xs: 'flex', md: 'none' },
                gap: 1,
                zIndex: 10
              }}
            >
              <IconButton 
                size="small" 
                onClick={() => scrollTitleBar('left')}
                sx={{ 
                  bgcolor: 'white', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: '#f9fafb'
                  }
                }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => scrollTitleBar('right')}
                sx={{ 
                  bgcolor: 'white', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: '#f9fafb'
                  }
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box
              ref={contentRef}
              sx={{ 
                overflowX: 'auto',
                scrollbarWidth: 'none', // Hide scrollbar for Firefox
                '&::-webkit-scrollbar': { // Hide scrollbar for Chrome
                  display: 'none'
                },
                scrollBehavior: 'smooth'
              }}
            >
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
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          width: '100%',
                          minWidth: '900px',
                          alignItems: 'center'
                        }}
                      >
                        {/* Matter Column - 25% */}
                        <Box sx={{ width: '25%' }}>
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
                            </Box>
                          </Box>
                        </Box>
                        
                        {/* Client Column - 15% */}
                        <Box sx={{ width: '15%' }}>
                          <Typography variant="body2">
                            {matter.client}
                          </Typography>
                        </Box>
                        
                        {/* Responsible Attorney Column - 20% */}
                        <Box sx={{ width: '20%' }}>
                          <Typography variant="body2">
                            {matter.responsibleAttorney}
                          </Typography>
                        </Box>
                        
                        {/* Practice Area Column - 20% */}
                        <Box sx={{ width: '20%' }}>
                          <Typography variant="body2">
                            {matter.practiceArea}
                          </Typography>
                        </Box>
                        
                        {/* Status Column - 10% */}
                        <Box sx={{ width: '10%' }}>
                          <Box 
                            sx={{ 
                              borderRadius: '6px', 
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
                        </Box>
                        
                        {/* Action Column - 10% */}
                        <Box sx={{ width: '10%' }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the ListItem click
                              handleMenuClick(e, matter.id);
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
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
            </Box>
          </Paper>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default MatterManagementPage; 