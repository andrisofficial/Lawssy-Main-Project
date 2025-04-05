import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper,
  useTheme 
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteIcon from '@mui/icons-material/Note';
import PaymentIcon from '@mui/icons-material/Payment';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';

// TabPanel component for displaying tab content
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`matter-tabpanel-${index}`}
      aria-labelledby={`matter-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const MatterTabs = ({ matter }) => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Placeholder content for tabs
  const OverviewTab = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Overview
      </Typography>
      <Paper sx={{ p: 3, borderRadius: '6px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)' }}>
        <Typography variant="body1">
          <strong>Matter Name:</strong> {matter.name}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Client:</strong> {matter.client}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Responsible Attorney:</strong> {matter.responsibleAttorney}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Practice Area:</strong> {matter.practiceArea}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Open Date:</strong> {matter.openDate}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
          Sed euismod, tellus ac aliquam tincidunt, eros nibh tincidunt nisl, ac facilisis nisi nisl ac elit.
        </Typography>
      </Paper>
    </Box>
  );

  const TasksTab = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Tasks
      </Typography>
      <Typography variant="body1" color="text.secondary">
        No tasks available yet. Click "Add Task" to create a new task.
      </Typography>
    </Box>
  );

  const DocumentsTab = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Documents
      </Typography>
      <Typography variant="body1" color="text.secondary">
        No documents available yet. Click "Upload Document" to add a document.
      </Typography>
    </Box>
  );

  const NotesTab = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Notes
      </Typography>
      <Typography variant="body1" color="text.secondary">
        No notes available yet. Click "Add Note" to create a new note.
      </Typography>
    </Box>
  );

  const BillingTab = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Time & Billing
      </Typography>
      <Typography variant="body1" color="text.secondary">
        No time entries or billing information available yet.
      </Typography>
    </Box>
  );

  const CalendarTab = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Calendar
      </Typography>
      <Typography variant="body1" color="text.secondary">
        No events available yet. Click "Add Event" to schedule a new event.
      </Typography>
    </Box>
  );

  const ClientTab = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Client
      </Typography>
      <Paper sx={{ p: 3, borderRadius: '6px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)' }}>
        <Typography variant="body1">
          <strong>Client Name:</strong> {matter.client}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Contact Person:</strong> John Smith
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Email:</strong> john.smith@example.com
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Phone:</strong> (555) 123-4567
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Address:</strong> 123 Main St, Anytown, CA 12345
        </Typography>
      </Paper>
    </Box>
  );

  const ActivityTab = () => (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Activity
      </Typography>
      <Typography variant="body1" color="text.secondary">
        No activity recorded yet.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
            }
          }}
        >
          <Tab 
            icon={<InfoIcon />} 
            iconPosition="start" 
            label="Overview" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              }
            }} 
          />
          <Tab 
            icon={<AssignmentIcon />} 
            iconPosition="start" 
            label="Tasks" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              }
            }} 
          />
          <Tab 
            icon={<DescriptionIcon />} 
            iconPosition="start" 
            label="Documents" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              }
            }} 
          />
          <Tab 
            icon={<NoteIcon />} 
            iconPosition="start" 
            label="Notes" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              }
            }} 
          />
          <Tab 
            icon={<PaymentIcon />} 
            iconPosition="start" 
            label="Time & Billing" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              }
            }} 
          />
          <Tab 
            icon={<EventIcon />} 
            iconPosition="start" 
            label="Calendar" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              }
            }} 
          />
          <Tab 
            icon={<PersonIcon />} 
            iconPosition="start" 
            label="Client" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              }
            }} 
          />
          <Tab 
            icon={<HistoryIcon />} 
            iconPosition="start" 
            label="Activity" 
            sx={{ 
              textTransform: 'none', 
              fontWeight: 500,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              }
            }} 
          />        
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <OverviewTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TasksTab />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DocumentsTab />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <NotesTab />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <BillingTab />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <CalendarTab />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <ClientTab />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <ActivityTab />
      </TabPanel>
    </Box>
  );
};

export default MatterTabs; 