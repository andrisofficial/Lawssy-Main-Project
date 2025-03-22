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
  LinearProgress, 
  useTheme,
  Tab,
  Tabs,
  Container
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FolderIcon from '@mui/icons-material/Folder';
import BusinessIcon from '@mui/icons-material/Business';

const DashboardPage = () => {
  const [entriesTab, setEntriesTab] = useState(0);
  const theme = useTheme();

  // Sample data for recent time entries
  const recentTimeEntries = [
    { id: 1, client: 'Acme Corporation', matter: 'Contract Review', date: '2023-06-15', time: '2.5 hours' },
    { id: 2, client: 'Global Industries', matter: 'Patent Filing', date: '2023-06-14', time: '1.75 hours' },
    { id: 3, client: 'Tech Innovations', matter: 'Compliance Review', date: '2023-06-13', time: '3 hours' },
  ];

  // Sample data for upcoming deadlines
  const upcomingDeadlines = [
    { id: 1, task: 'File Motion for Summary Judgment', client: 'Acme Corp', dueDate: 'Jun 20, 2023' },
    { id: 2, task: 'Contract Review Deadline', client: 'Global Industries', dueDate: 'Jun 22, 2023' },
    { id: 3, task: 'Patent Application Submission', client: 'Tech Innovations', dueDate: 'Jun 25, 2023' },
  ];

  // Sample data for billing stats
  const billingStats = [
    { 
      id: 1, 
      label: 'Billable Hours', 
      value: '32.5', 
      target: '40', 
      percentage: 81, 
      color:  theme.palette.primary.main
    },
    { 
      id: 2, 
      label: 'Outstanding Invoices', 
      value: '$12,450', 
      target: '$15,000', 
      percentage: 83, 
      color:  theme.palette.primary.main
    },
    { 
      id: 3, 
      label: 'Revenue', 
      value: '$28,350', 
      target: '$35,000', 
      percentage: 81, 
      color: theme.palette.primary.main
    },
  ];

  const handleTabChange = (event, newValue) => {
    setEntriesTab(newValue);
  };

  return (
    <MainLayout title="Dashboard">
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={3}>
          {/* Billing Stats */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {billingStats.map((stat) => (
                <Grid item xs={12} md={4} key={stat.id}>
                  <Card sx={{ p: 3, height: '100%', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                    <Stack spacing={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Typography variant="h4" fontWeight={600}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Target: {stat.target}
                        </Typography>
                      </Box>
                      <Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={stat.percentage} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: stat.color,
                              borderRadius: 4
                            }
                          }} 
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {stat.percentage}%
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<AccessTimeIcon />}
                  sx={{ 
                    py: 1.5, 
                    justifyContent: 'flex-start',
                    borderColor: '#E5E7EB',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(0, 105, 209, 0.04)'
                    }
                  }}
                >
                  Track Time
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<ReceiptIcon />}
                  sx={{ 
                    py: 1.5, 
                    justifyContent: 'flex-start',
                    borderColor: '#E5E7EB',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(0, 105, 209, 0.04)'
                    }
                  }}
                >
                  Create Invoice
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<DescriptionIcon />}
                  sx={{ 
                    py: 1.5, 
                    justifyContent: 'flex-start',
                    borderColor: '#E5E7EB',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(0, 105, 209, 0.04)'
                    }
                  }}
                >
                  Upload Document
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<EventIcon />}
                  sx={{ 
                    py: 1.5, 
                    justifyContent: 'flex-start',
                    borderColor: '#E5E7EB',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(0, 105, 209, 0.04)'
                    }
                  }}
                >
                  Schedule Event
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Recent Time Entries */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 0, borderRadius: '8px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
              <Box sx={{ borderBottom: 1, borderColor: '#F3F4F6' }}>
                <Tabs 
                  value={entriesTab} 
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: theme.palette.primary.main,
                    },
                    px: 2
                  }}
                >
                  <Tab 
                    label="Recent Time Entries" 
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
                    label="All Entries" 
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
              <List sx={{ p: 0 }}>
                {recentTimeEntries.map((entry, index) => (
                  <React.Fragment key={entry.id}>
                    <ListItem sx={{ px: 3, py: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {entry.client}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {entry.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {entry.matter}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {entry.date}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < recentTimeEntries.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Upcoming Deadlines */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ height: '100%', borderRadius: '8px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: '#F3F4F6', display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Upcoming Deadlines
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {upcomingDeadlines.map((deadline, index) => (
                  <React.Fragment key={deadline.id}>
                    <ListItem sx={{ px: 3, py: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {deadline.task}
                          </Typography>
                          <Typography variant="body2" color="error.main" fontWeight={500}>
                            {deadline.dueDate}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {deadline.client}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < upcomingDeadlines.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default DashboardPage; 