import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Tabs, 
  Tab,
  Divider,
  useTheme
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import DocumentRepository from '../components/documents/DocumentRepository';
import DocumentSearch from '../components/documents/DocumentSearch';
import DocumentUpload from '../components/documents/DocumentUpload';
import DocumentTemplates from '../components/documents/DocumentTemplates';
import DocumentAnalytics from '../components/documents/DocumentAnalytics';

const DocumentManagementPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <DocumentRepository />;
      case 1:
        return <DocumentTemplates />;
      case 2:
        return <DocumentAnalytics />;
      default:
        return <DocumentRepository />;
    }
  };

  return (
    <MainLayout title="Document Management">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: '10px',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>Document Management</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Securely store, organize, and collaborate on all your legal documents in one centralized location.
              </Typography>
              
              <Box sx={{ width: '100%', mb: 2 }}>
                <DocumentUpload />
              </Box>
              
              <Box sx={{ width: '100%', mb: 2 }}>
                <DocumentSearch />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: '10px',
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      py: 2,
                      fontWeight: 500
                    }
                  }}
                >
                  <Tab label="Document Repository" />
                  <Tab label="Templates Library" />
                  <Tab label="Analytics & Reports" />
                </Tabs>
              </Box>
              <Box sx={{ p: 3 }}>
                {renderTabContent()}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default DocumentManagementPage; 