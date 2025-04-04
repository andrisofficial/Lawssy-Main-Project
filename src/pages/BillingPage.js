import React, { useState } from 'react';
import { Box, Typography, Paper, useTheme, Container, Tabs, Tab } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import { BillingRatesProvider } from '../components/billing/BillingRateManager';
import InvoiceGenerator from '../components/billing/InvoiceGenerator';
import InvoiceList from '../components/billing/InvoiceList';
import InvoiceTemplates from '../components/billing/InvoiceTemplates';
import PaymentRecording from '../components/billing/PaymentRecording';
import ExpenseTracking from '../components/billing/ExpenseTracking';

const BillingPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <MainLayout title="Billing">
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
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: '#FAFAFA',
                px: 2
              }}
            >
              <Tab label="Invoices" />
              <Tab label="Generate Invoice" />
              <Tab label="Payments" />
              <Tab label="Expenses" />
              <Tab label="Templates" />
            </Tabs>
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {activeTab === 0 && <InvoiceList />}
              {activeTab === 1 && <InvoiceGenerator />}
              {activeTab === 2 && <PaymentRecording />}
              {activeTab === 3 && <ExpenseTracking />}
              {activeTab === 4 && <InvoiceTemplates />}
            </Box>
          </Paper>
        </Container>
      </BillingRatesProvider>
    </MainLayout>
  );
};

export default BillingPage; 