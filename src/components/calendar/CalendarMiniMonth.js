import React from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isSameDay,
  getDay
} from 'date-fns';

const CalendarMiniMonth = ({ currentDate, onDateChange }) => {
  const [viewDate, setViewDate] = React.useState(currentDate);
  
  const handlePrevMonth = () => {
    setViewDate(subMonths(viewDate, 1));
  };

  const handleNextMonth = () => {
    setViewDate(addMonths(viewDate, 1));
  };

  const renderDays = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    return days.map((day, index) => (
      <Grid item xs={1.7} key={index}>
        <Typography 
          variant="caption" 
          align="center" 
          sx={{ 
            display: 'block', 
            fontWeight: 'medium',
            color: 'text.secondary'
          }}
        >
          {day}
        </Typography>
      </Grid>
    ));
  };

  const renderCells = () => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const startDate = monthStart;
    const endDate = monthEnd;

    const dateFormat = 'd';
    const rows = [];

    let days = eachDayOfInterval({
      start: startDate,
      end: endDate
    });

    // Add days from previous month to fill the first row
    const startDay = getDay(monthStart);
    if (startDay > 0) {
      const prevMonthEnd = subMonths(monthStart, 1);
      const prevMonthDays = eachDayOfInterval({
        start: subMonths(monthStart, 1),
        end: prevMonthEnd
      }).slice(-startDay);
      days = [...prevMonthDays, ...days];
    }

    // Add days from next month to fill the last row
    const daysNeeded = 42 - days.length; // 6 rows of 7 days
    if (daysNeeded > 0) {
      const nextMonthStart = addMonths(monthStart, 1);
      const nextMonthDays = eachDayOfInterval({
        start: nextMonthStart,
        end: addMonths(nextMonthStart, 0)
      }).slice(0, daysNeeded);
      days = [...days, ...nextMonthDays];
    }

    // Create rows with 7 days each
    let cells = [];
    days.forEach((day, i) => {
      if (i % 7 === 0 && i > 0) {
        rows.push(cells);
        cells = [];
      }

      const isCurrentMonth = isSameMonth(day, viewDate);
      const isSelectedDay = isSameDay(day, currentDate);
      
      cells.push(
        <Grid item xs={1.7} key={i}>
          <Box
            onClick={() => onDateChange(day)}
            sx={{
              height: 24,
              width: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: '50%',
              mx: 'auto',
              backgroundColor: isSelectedDay ? 'primary.main' : isToday(day) ? 'primary.light' : 'transparent',
              '&:hover': {
                backgroundColor: isSelectedDay ? 'primary.main' : 'primary.light',
                color: 'white'
              },
              color: isSelectedDay 
                ? 'white' 
                : isToday(day) 
                  ? 'primary.contrastText' 
                  : isCurrentMonth 
                    ? 'text.primary' 
                    : 'text.disabled'
            }}
          >
            <Typography 
              variant="caption" 
              component="div"
              sx={{ 
                fontWeight: isToday(day) || isSelectedDay ? 'bold' : 'regular',
                color: isSelectedDay 
                  ? 'white' 
                  : isToday(day) 
                    ? 'primary.main' 
                    : isCurrentMonth 
                      ? 'text.primary' 
                      : 'text.disabled'
              }}
            >
              {format(day, dateFormat)}
            </Typography>
          </Box>
        </Grid>
      );
    });

    if (cells.length > 0) {
      rows.push(cells);
    }

    return rows.map((row, i) => (
      <Grid container spacing={0} key={i} justifyContent="space-between" sx={{ mb: 0.5 }}>
        {row}
      </Grid>
    ));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeft fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
          {format(viewDate, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
      
      <Grid container spacing={0} justifyContent="space-between" sx={{ mb: 1 }}>
        {renderDays()}
      </Grid>
      
      {renderCells()}
    </Box>
  );
};

export default CalendarMiniMonth; 