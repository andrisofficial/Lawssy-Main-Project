import React, { useState, useRef } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Tabs, 
  Tab,
  Divider,
  useTheme,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  Badge,
  styled
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CloudUpload as CloudUploadIcon,
  Sort as SortIcon,
  Add as AddIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import DocumentRepository from '../components/documents/DocumentRepository';
import DocumentSearch from '../components/documents/DocumentSearch';
import DocumentTemplates from '../components/documents/DocumentTemplates';
import DocumentAnalytics from '../components/documents/DocumentAnalytics';

// Styled tab component to match the clients page styling
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  minWidth: '80px',
  padding: '8px 16px',
}));

const DocumentManagementPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [filterCount, setFilterCount] = useState(0);
  const theme = useTheme();
  const templateComponentRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const openFilters = () => {
    // Implement filter opening functionality
    console.log('Open filters');
  };

  const handleNewTemplate = () => {
    // Access the DocumentTemplates component's handleNewTemplate function
    if (templateComponentRef.current && templateComponentRef.current.handleNewTemplate) {
      templateComponentRef.current.handleNewTemplate();
    }
  };

  // Render content based on active tab
  const renderTabContent = () => {
    if (activeTab === 0) {
      return <DocumentRepository />;
    } else if (activeTab === 1) {
      return <DocumentTemplates ref={templateComponentRef} />;
    } else if (activeTab === 2) {
      return <DocumentAnalytics />;
    }
    return <DocumentRepository />;
  };

  // Render specific actions based on active tab
  const renderTabActions = () => {
    if (activeTab === 0) {
      // Documents tab
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          p: 2,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, flex: 1 }}>
            {/* Search Bar */}
            <TextField
              placeholder="Search documents by name, content, or metadata..."
              size="small"
              value={search}
              onChange={handleSearchChange}
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
          
          {/* Right side controls: Filters, Sort, and Upload */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Filters Button */}
            <Tooltip title="Apply filters">
              <Badge badgeContent={filterCount} color="primary">
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  size="medium"
                  onClick={openFilters}
                  sx={{ 
                    borderColor: filterCount > 0 ? '#1a73e8' : '#dadce0',
                    color: filterCount > 0 ? '#1a73e8' : '#3c4043',
                    '&:hover': {
                      borderColor: filterCount > 0 ? '#1765cc' : '#bdc1c6',
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                >
                  Filters
                </Button>
              </Badge>
            </Tooltip>

            {/* Sort Button */}
            <Tooltip title="Sort documents">
              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                size="medium"
                sx={{ 
                  borderColor: '#dadce0',
                  color: '#3c4043',
                  '&:hover': {
                    borderColor: '#bdc1c6',
                    backgroundColor: '#f8f9fa'
                  }
                }}
              >
                Sort By
              </Button>
            </Tooltip>
            
            {/* Upload Files Button */}
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              size="medium"
              sx={{ 
                bgcolor: '#1a73e8', 
                '&:hover': { bgcolor: '#1765cc' },
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none'
              }}
            >
              Upload Files
            </Button>
          </Box>
        </Box>
      );
    } else if (activeTab === 1) {
      // Templates tab - only show "New Template" button
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6">Document Templates Library</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="medium"
            onClick={handleNewTemplate}
            sx={{ 
              bgcolor: '#1a73e8', 
              '&:hover': { bgcolor: '#1765cc' },
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none'
            }}
          >
            New Template
          </Button>
        </Box>
      );
    } else {
      // Analytics tab - no extra controls
      return null;
    }
  };

  return (
    <MainLayout title="Document">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: '10px',
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
            mb: 3
          }}
        >
          {/* Top Navigation Tabs */}
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            px: 2
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{
                '.MuiTabs-indicator': { backgroundColor: '#1a73e8', height: '3px' },
                minHeight: '48px',
              }}
            >
              <StyledTab label="Documents" />
              <StyledTab label="Templates" />
              <StyledTab label="Analytics & Reports" />
            </Tabs>
          </Box>

          {/* Tab-specific action buttons */}
          {renderTabActions()}

          {/* Content Area */}
          <Box sx={{ p: 3 }}>
            {renderTabContent()}
          </Box>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default DocumentManagementPage; 