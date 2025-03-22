import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/timeUtils';

const BillingDashboard = ({ billingData }) => {
  const {
    totalBillableHours = 0,
    targetHours = 160,
    totalRevenue = 0,
    outstandingInvoices = 0,
    revenueByClient = [],
    monthlyRevenue = [],
  } = billingData || {};

  const progressPercentage = (totalBillableHours / targetHours) * 100;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Billing Dashboard
      </Typography>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Billable Hours
              </Typography>
              <Typography variant="h5">
                {totalBillableHours.toFixed(1)} / {targetHours}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h5">{formatCurrency(totalRevenue)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Outstanding Invoices
              </Typography>
              <Typography variant="h5">
                {formatCurrency(outstandingInvoices)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Realization Rate
              </Typography>
              <Typography variant="h5">
                {((totalRevenue / (totalRevenue + outstandingInvoices)) * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Revenue Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue by Client
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByClient}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Revenue
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BillingDashboard; 