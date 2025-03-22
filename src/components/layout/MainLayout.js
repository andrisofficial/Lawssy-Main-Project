import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';

const MainLayout = ({ children, title }) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  
  return (
    <Box sx={{ 
      display: 'flex', 
      backgroundColor: theme.palette.background.default, 
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      <Header title={title} />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { xs: '100%', sm: `calc(100% - 240px)` },
          ml: 0,  // Remove unnecessary left margin
          mt: '64px',
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)',
          overflow: 'auto',
          maxWidth: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 