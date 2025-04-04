import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Tabs, 
  Tab,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Gavel as GavelIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';

// Sample data for recent time entries
const recentTimeEntries = [
  { id: 1, client: 'Acme Corp', matter: 'Contract Review', date: '2023-04-01', hours: 2.5 },
  { id: 2, client: 'Global Industries', matter: 'Patent Filing', date: '2023-03-31', hours: 1.75 },
  { id: 3, client: 'Smith Family', matter: 'Estate Planning', date: '2023-03-30', hours: 3.0 },
];

// Sample data for billing stats
const billingStats = {
  billableHours: { week: 28, month: 120, year: 1450 },
  revenue: { week: 5600, month: 24000, year: 290000 },
  outstandingInvoices: { count: 12, amount: 28500 },
  receivables: { current: 15000, overdue: 13500 }
};

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3, mb: 4 }}>
          Dashboard
        </Typography>

        <Grid container spacing={4}>
          {/* Billing Stats Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Billing Statistics
                </Typography>

                <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                  <Tab label="This Week" />
                  <Tab label="This Month" />
                  <Tab label="This Year" />
                </Tabs>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Billable Hours
                      </Typography>
                      <Typography variant="h5" component="p">
                        {activeTab === 0 && billingStats.billableHours.week}
                        {activeTab === 1 && billingStats.billableHours.month}
                        {activeTab === 2 && billingStats.billableHours.year}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Revenue
                      </Typography>
                      <Typography variant="h5" component="p">
                        {activeTab === 0 && formatCurrency(billingStats.revenue.week)}
                        {activeTab === 1 && formatCurrency(billingStats.revenue.month)}
                        {activeTab === 2 && formatCurrency(billingStats.revenue.year)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Outstanding Invoices
                      </Typography>
                      <Typography variant="h5" component="p">
                        {billingStats.outstandingInvoices.count}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatCurrency(billingStats.outstandingInvoices.amount)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Accounts Receivable
                      </Typography>
                      <Typography variant="h5" component="p">
                        {formatCurrency(billingStats.receivables.current + billingStats.receivables.overdue)}
                      </Typography>
                      <Typography variant="body2" color="error">
                        {formatCurrency(billingStats.receivables.overdue)} overdue
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Quick Actions
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      component={Link}
                      to="/time-tracking"
                      variant="outlined"
                      fullWidth
                      startIcon={<AccessTimeIcon />}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      Track Time
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Button
                      component={Link}
                      to="/billing/invoices/new"
                      variant="outlined"
                      fullWidth
                      startIcon={<ReceiptIcon />}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      Create Invoice
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Button
                      component={Link}
                      to="/documents/upload"
                      variant="outlined"
                      fullWidth
                      startIcon={<DescriptionIcon />}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      Upload Document
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Button
                      component={Link}
                      to="/calendar/new"
                      variant="outlined"
                      fullWidth
                      startIcon={<EventIcon />}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      Schedule Event
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Button
                      component={Link}
                      to="/clients"
                      variant="outlined"
                      fullWidth
                      startIcon={<PeopleIcon />}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      Manage Clients
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Button
                      component={Link}
                      to="/cases"
                      variant="outlined"
                      fullWidth
                      startIcon={<GavelIcon />}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      Manage Cases
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Time Entries Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    Recent Time Entries
                  </Typography>
                  <Button component={Link} to="/time-tracking" size="small">
                    View All
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {recentTimeEntries.map((entry) => (
                    <ListItem key={entry.id} divider sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {entry.client.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={entry.matter}
                        secondary={`${entry.client} • ${new Date(entry.date).toLocaleDateString()}`}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {entry.hours} hrs
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default DashboardPage; 