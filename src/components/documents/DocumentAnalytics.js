import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Folder as FolderIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Mock data for document analytics
const documentActivityData = [
  { id: 1, document: 'Contract Agreement - Acme Corp', type: 'pdf', user: 'John Doe', action: 'Viewed', date: '2023-06-15 14:30' },
  { id: 2, document: 'Patent Filing - Tech Innovations', type: 'docx', user: 'Jane Smith', action: 'Downloaded', date: '2023-06-15 11:45' },
  { id: 3, document: 'NDA Template', type: 'docx', user: 'Robert Johnson', action: 'Edited', date: '2023-06-14 16:20' },
  { id: 4, document: 'Client Meeting Notes - Global Industries', type: 'txt', user: 'Emily Davis', action: 'Created', date: '2023-06-14 10:15' },
  { id: 5, document: 'Financial Report Q2', type: 'xlsx', user: 'John Doe', action: 'Shared', date: '2023-06-13 15:30' },
  { id: 6, document: 'Lease Agreement Template', type: 'docx', user: 'Jane Smith', action: 'Printed', date: '2023-06-13 13:45' },
  { id: 7, document: 'Patent Filing - Tech Innovations', type: 'docx', user: 'Robert Johnson', action: 'Commented', date: '2023-06-12 11:20' },
  { id: 8, document: 'Contract Agreement - Acme Corp', type: 'pdf', user: 'Emily Davis', action: 'Approved', date: '2023-06-12 09:15' },
  { id: 9, document: 'NDA Template', type: 'docx', user: 'John Doe', action: 'Edited', date: '2023-06-11 16:30' },
  { id: 10, document: 'Financial Report Q2', type: 'xlsx', user: 'Jane Smith', action: 'Downloaded', date: '2023-06-11 14:45' }
];

// Mock data for document stats
const documentStats = [
  { id: 1, title: 'Total Documents', value: 256, icon: <DescriptionIcon />, color: '#0069d1' },
  { id: 2, title: 'Active Users', value: 18, icon: <PersonIcon />, color: '#00C853' },
  { id: 3, title: 'Storage Used', value: '4.2 GB', icon: <FolderIcon />, color: '#FF9800' },
  { id: 4, title: 'Documents This Month', value: 42, icon: <CalendarIcon />, color: '#2196F3' }
];

// Mock data for document types distribution
const documentTypesData = [
  { type: 'PDF', count: 98, color: '#F44336' },
  { type: 'DOCX', count: 76, color: '#2196F3' },
  { type: 'XLSX', count: 45, color: '#4CAF50' },
  { type: 'TXT', count: 22, color: '#9E9E9E' },
  { type: 'JPG/PNG', count: 15, color: '#FF9800' }
];

// Mock data for document activity over time
const activityTimelineData = [
  { date: 'Jun 10', views: 24, downloads: 8, edits: 12 },
  { date: 'Jun 11', views: 30, downloads: 10, edits: 15 },
  { date: 'Jun 12', views: 28, downloads: 12, edits: 10 },
  { date: 'Jun 13', views: 32, downloads: 15, edits: 18 },
  { date: 'Jun 14', views: 36, downloads: 18, edits: 20 },
  { date: 'Jun 15', views: 42, downloads: 22, edits: 25 }
];

const DocumentAnalytics = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportType, setReportType] = useState('activity');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (index, date) => {
    const newDateRange = [...dateRange];
    newDateRange[index] = date;
    setDateRange(newDateRange);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleGenerateReport = () => {
    // In a real app, this would generate and download a report
    console.log('Generating report:', reportType, dateRange);
    handleMenuClose();
  };

  // Simple bar chart component
  const BarChart = ({ data, dataKey, nameKey, colors }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    
    return (
      <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mt: 2 }}>
        {data.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${100 / data.length}%` }}>
            <Box 
              sx={{ 
                height: `${(item[dataKey] / maxValue) * 180}px`, 
                width: '70%', 
                bgcolor: colors[index % colors.length],
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.3s ease',
                '&:hover': {
                  opacity: 0.8
                }
              }} 
            />
            <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
              {item[nameKey]}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  // Simple pie chart component
  const PieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let cumulativeAngle = 0;
    
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <Box sx={{ position: 'relative', width: 200, height: 200 }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="#f5f5f5" />
            {data.map((item, index) => {
              const percentage = (item.count / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = cumulativeAngle;
              cumulativeAngle += angle;
              const endAngle = cumulativeAngle;
              
              const startRadians = (startAngle - 90) * (Math.PI / 180);
              const endRadians = (endAngle - 90) * (Math.PI / 180);
              
              const x1 = 100 + 80 * Math.cos(startRadians);
              const y1 = 100 + 80 * Math.sin(startRadians);
              const x2 = 100 + 80 * Math.cos(endRadians);
              const y2 = 100 + 80 * Math.sin(endRadians);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  stroke="#fff"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
        </Box>
        <Box sx={{ ml: 4 }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: item.color, mr: 1, borderRadius: 1 }} />
              <Typography variant="body2">
                {item.type} ({item.count}) - {Math.round((item.count / total) * 100)}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  // Simple line chart component
  const LineChart = ({ data }) => {
    const maxViews = Math.max(...data.map(item => item.views));
    const maxDownloads = Math.max(...data.map(item => item.downloads));
    const maxEdits = Math.max(...data.map(item => item.edits));
    const maxValue = Math.max(maxViews, maxDownloads, maxEdits);
    
    const getPoints = (dataKey) => {
      const width = 500;
      const height = 180;
      const padding = 30;
      const availableWidth = width - (padding * 2);
      const availableHeight = height - (padding * 2);
      
      return data.map((item, index) => {
        const x = padding + (index * (availableWidth / (data.length - 1)));
        const y = height - padding - ((item[dataKey] / maxValue) * availableHeight);
        return `${x},${y}`;
      }).join(' ');
    };
    
    return (
      <Box sx={{ mt: 2 }}>
        <svg width="100%" height="200" viewBox="0 0 500 200" preserveAspectRatio="none">
          {/* X and Y axes */}
          <line x1="30" y1="170" x2="470" y2="170" stroke="#ccc" strokeWidth="1" />
          <line x1="30" y1="30" x2="30" y2="170" stroke="#ccc" strokeWidth="1" />
          
          {/* Views line */}
          <polyline
            fill="none"
            stroke="#0069d1"
            strokeWidth="2"
            points={getPoints('views')}
          />
          
          {/* Downloads line */}
          <polyline
            fill="none"
            stroke="#00C853"
            strokeWidth="2"
            points={getPoints('downloads')}
          />
          
          {/* Edits line */}
          <polyline
            fill="none"
            stroke="#FF9800"
            strokeWidth="2"
            points={getPoints('edits')}
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const width = 500;
            const height = 180;
            const padding = 30;
            const availableWidth = width - (padding * 2);
            const availableHeight = height - (padding * 2);
            const x = padding + (index * (availableWidth / (data.length - 1)));
            
            const yViews = height - padding - ((item.views / maxValue) * availableHeight);
            const yDownloads = height - padding - ((item.downloads / maxValue) * availableHeight);
            const yEdits = height - padding - ((item.edits / maxValue) * availableHeight);
            
            return (
              <g key={index}>
                <circle cx={x} cy={yViews} r="4" fill="#0069d1" />
                <circle cx={x} cy={yDownloads} r="4" fill="#00C853" />
                <circle cx={x} cy={yEdits} r="4" fill="#FF9800" />
                
                {/* X-axis labels */}
                <text x={x} y="185" textAnchor="middle" fontSize="10">
                  {item.date}
                </text>
              </g>
            );
          })}
        </svg>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: '#0069d1', mr: 1, borderRadius: '50%' }} />
            <Typography variant="caption">Views</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: '#00C853', mr: 1, borderRadius: '50%' }} />
            <Typography variant="caption">Downloads</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, bgcolor: '#FF9800', mr: 1, borderRadius: '50%' }} />
            <Typography variant="caption">Edits</Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Document Analytics & Reports</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{ mr: 1 }}
          >
            Refresh Data
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleMenuOpen}
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {documentStats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.id}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '6px'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: `${stat.color}20`,
                      color: stat.color,
                      mr: 2
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight={600}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '6px'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Document Types Distribution
              </Typography>
              <IconButton size="small">
                <PieChartIcon fontSize="small" />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <PieChart data={documentTypesData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '6px'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Document Activity (Last 7 Days)
              </Typography>
              <IconButton size="small">
                <TimelineIcon fontSize="small" />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <LineChart data={activityTimelineData} />
          </Paper>
        </Grid>
      </Grid>

      {/* Activity Log */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '6px'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Recent Document Activity
          </Typography>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack direction="row" spacing={2} sx={{ mr: 2, display: 'inline-flex' }}>
                <DatePicker
                  label="From"
                  value={dateRange[0]}
                  onChange={(date) => handleDateChange(0, date)}
                  slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
                />
                <DatePicker
                  label="To"
                  value={dateRange[1]}
                  onChange={(date) => handleDateChange(1, date)}
                  slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
                />
              </Stack>
            </LocalizationProvider>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              size="small"
            >
              Filter
            </Button>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="document activity table">
            <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Date & Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentActivityData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.document}
                    </TableCell>
                    <TableCell>{row.type.toUpperCase()}</TableCell>
                    <TableCell>{row.user}</TableCell>
                    <TableCell>{row.action}</TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={documentActivityData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Report Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 1,
          sx: { minWidth: 300, p: 2 }
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Generate Report</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="report-type-label">Report Type</InputLabel>
          <Select
            labelId="report-type-label"
            id="report-type"
            value={reportType}
            label="Report Type"
            onChange={handleReportTypeChange}
            size="small"
          >
            <MenuItem value="activity">Document Activity</MenuItem>
            <MenuItem value="usage">Document Usage</MenuItem>
            <MenuItem value="storage">Storage Analysis</MenuItem>
            <MenuItem value="user">User Activity</MenuItem>
          </Select>
        </FormControl>
        
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={2} sx={{ mb: 2 }}>
            <DatePicker
              label="From Date"
              value={dateRange[0]}
              onChange={(date) => handleDateChange(0, date)}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
            <DatePicker
              label="To Date"
              value={dateRange[1]}
              onChange={(date) => handleDateChange(1, date)}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </Stack>
        </LocalizationProvider>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handleMenuClose}
          >
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleGenerateReport}
          >
            Download
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default DocumentAnalytics;