import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DatePickerTest = () => {
  const [value, setValue] = useState(new Date());

  return (
    <Box sx={{ p: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Basic example"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DatePickerTest; 