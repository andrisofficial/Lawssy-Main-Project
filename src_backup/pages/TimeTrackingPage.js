import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Paper,
  Typography,
  Grid,
  useTheme,
  Divider,
} from '@mui/material';
import TimeTracker from '../components/TimeTracking/TimeTracker.js';
import TimeEntryForm from '../components/TimeTracking/TimeEntryForm.js';
import BillingDashboard from '../components/billing/BillingDashboard';
import InvoiceGenerator from '../components/billing/InvoiceGenerator';
import TimeEntriesList from '../components/TimeTracking/TimeEntriesList.js';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`time-tracking-tabpanel-${index}`}
    aria-labelledby={`time-tracking-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const TimeTrackingPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [timeEntries, setTimeEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [clients] = useState([
    { id: 1, name: 'Acme Corp', address: '123 Business St, City, State' },
    { id: 2, name: 'Tech Solutions Inc', address: '456 Innovation Ave, City, State' },
  ]);
  const [matters] = useState([
    { id: 1, name: 'Contract Review', clientId: 1 },
    { id: 2, name: 'Patent Filing', clientId: 2 },
  ]);

  // Load saved time entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
      try {
        setTimeEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error('Error loading saved time entries:', e);
      }
    }
  }, []);

  // Save time entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  // Mock billing data for demonstration
  const billingData = {
    totalBillableHours: timeEntries.reduce((total, entry) => total + parseFloat(entry.duration || 0), 0),
    targetHours: 160,
    totalRevenue: timeEntries.reduce((total, entry) => total + (parseFloat(entry.duration || 0) * (entry.rate || 0)), 0),
    outstandingInvoices: 12000,
    revenueByClient: [
      { name: 'Acme Corp', revenue: 15000 },
      { name: 'Tech Solutions Inc', revenue: 13500 },
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 8000 },
      { month: 'Feb', revenue: 9500 },
      { month: 'Mar', revenue: 11000 },
    ],
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTimeEntry = (entry) => {
    if (editingEntry) {
      // Update existing entry
      setTimeEntries(prev => 
        prev.map(item => item.id === editingEntry.id ? { ...entry, id: editingEntry.id } : item)
      );
      setEditingEntry(null);
    } else {
      // Add new entry
      setTimeEntries(prev => [...prev, { ...entry, id: Date.now() }]);
    }
    
    // Switch to the Time Entries tab after adding/editing
    setActiveTab(1);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setActiveTab(0); // Switch to the Time Tracking tab for editing
  };

  const handleDeleteEntry = (entryId) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: '100%', mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Time Tracking & Billing
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Paper 
          sx={{ 
            width: '100%', 
            mb: 4, 
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Tab label="Time Tracking" sx={{ py: 2 }} />
            <Tab label="Time Entries" sx={{ py: 2 }} />
            <Tab label="Billing Dashboard" sx={{ py: 2 }} />
            <Tab label="Invoicing" sx={{ py: 2 }} />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <TimeTracker onSave={handleTimeEntry} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimeEntryForm
                  clients={clients}
                  matters={matters}
                  initialData={editingEntry}
                  onSubmit={handleTimeEntry}
                />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <TimeEntriesList
              entries={timeEntries}
              clients={clients}
              matters={matters}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <BillingDashboard billingData={billingData} />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <InvoiceGenerator
              timeEntries={timeEntries}
              clients={clients}
              matters={matters}
            />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default TimeTrackingPage; 