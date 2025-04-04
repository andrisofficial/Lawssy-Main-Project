import React from 'react';
import { Box, Typography, Paper, useTheme, Container } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import Timer from '../components/TimeTracking/Timer';
import { BillingRatesProvider } from '../components/billing/BillingRateManager';

const TimeTrackingPage = () => {
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

  return (
    <MainLayout title="Time Tracking">
      <BillingRatesProvider>
        <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: '0.75rem',
              border: '1px solid',
              borderColor: '#F3F4F6',
              overflow: 'hidden',
              mb: 3,
              p: { xs: 2, sm: 3 }
            }}
          >
            <Timer clients={clients} matters={matters} />
          </Paper>
        </Container>
      </BillingRatesProvider>
    </MainLayout>
  );
};

export default TimeTrackingPage; 