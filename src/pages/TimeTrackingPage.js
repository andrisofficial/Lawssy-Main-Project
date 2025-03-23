import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography, Paper, useTheme, Container } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import MainLayout from '../components/layout/MainLayout';
import Timer from '../components/TimeTracking/Timer';
import Billing from '../components/TimeTracking/Billing';
import { BillingRatesProvider } from '../components/billing/BillingRateManager';

const TimeTrackingPage = () => {
  const [tabValue, setTabValue] = useState('timer');
  const theme = useTheme();

  // Sample data for clients and matters
  const clients = [
    { id: 1, name: 'Acme Corporation' },
    { id: 2, name: 'Wayne Enterprises' },
    { id: 3, name: 'Stark Industries' },
    { id: 4, name: 'LexCorp' },
    { id: 5, name: 'Umbrella Corporation' },
  ];

  const matters = [
    { id: 1, name: 'Corporate Restructuring', clientId: 1, caseNumber: 'ACM-2023-001' },
    { id: 2, name: 'Patent Infringement', clientId: 1, caseNumber: 'ACM-2023-002' },
    { id: 3, name: 'Merger Review', clientId: 2, caseNumber: 'WE-2023-001' },
    { id: 4, name: 'Intellectual Property', clientId: 3, caseNumber: 'SI-2023-001' },
    { id: 5, name: 'Contract Dispute', clientId: 4, caseNumber: 'LC-2023-001' },
    { id: 6, name: 'Regulatory Compliance', clientId: 5, caseNumber: 'UC-2023-001' },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <MainLayout title="Time Tracking & Billing">
      <BillingRatesProvider>
        <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: '0.75rem',
              border: '1px solid',
              borderColor: '#F3F4F6',
              overflow: 'hidden',
              mb: 3
            }}
          >
            <TabContext value={tabValue}>
              <Box sx={{ 
                borderBottom: 1, 
                borderColor: '#F3F4F6'
              }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  aria-label="time tracking tabs"
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: theme.palette.primary.main,
                      height: 3
                    },
                    px: 2,
                    pt: 2
                  }}
                >
                  <Tab 
                    label="Time Tracking" 
                    value="timer" 
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      minHeight: '48px',
                      '&.Mui-selected': {
                        color: theme.palette.primary.main
                      }
                    }}
                  />
                  <Tab 
                    label="Billing & Invoices" 
                    value="billing" 
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      minHeight: '48px',
                      '&.Mui-selected': {
                        color: theme.palette.primary.main
                      }
                    }}
                  />
                </Tabs>
              </Box>
              
              <TabPanel value="timer" sx={{ p: { xs: 2, sm: 3 } }}>
                <Timer clients={clients} matters={matters} />
              </TabPanel>
              
              <TabPanel value="billing" sx={{ p: { xs: 2, sm: 3 } }}>
                <Billing clients={clients} matters={matters} />
              </TabPanel>
            </TabContext>
          </Paper>
        </Container>
      </BillingRatesProvider>
    </MainLayout>
  );
};

export default TimeTrackingPage; 