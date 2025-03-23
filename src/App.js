import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from './theme';
import DashboardPage from './pages/DashboardPage';
import TimeTrackingPage from './pages/TimeTrackingPage';
import DocumentManagementPage from './pages/DocumentManagementPage';
import CalendarPage from './pages/CalendarPage';
import TasksPage from './pages/TasksPage';
import { CalendarProvider } from './contexts/CalendarContext';
import { TaskProvider } from './contexts/TaskContext';
import { TimeTrackingProvider } from './contexts/TimeTrackingContext';
import SupabaseConnectionTest from './components/SupabaseConnectionTest';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimeTrackingProvider>
          <CalendarProvider>
            <TaskProvider>
              <Router>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/time-tracking" element={<TimeTrackingPage />} />
                  <Route path="/documents" element={<DocumentManagementPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/supabase-test" element={<SupabaseConnectionTest />} />
                  {/* Redirect root to dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  {/* Add more routes for other features as they're developed */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Router>
            </TaskProvider>
          </CalendarProvider>
        </TimeTrackingProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
