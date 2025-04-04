import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from './theme';
import DashboardPage from './pages/DashboardPage';
import TimeTrackingPage from './pages/TimeTrackingPage';
import BillingPage from './pages/BillingPage';
import DocumentManagementPage from './pages/DocumentManagementPage';
import CalendarPage from './pages/CalendarPage';
import MatterManagementPage from './pages/MatterManagementPage';
import MatterDetailPage from './pages/MatterDetailPage';
import ClientsPage from './pages/clients/ClientsPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import CreateClientPage from './pages/clients/CreateClientPage';
import EditClientPage from './pages/clients/EditClientPage';

// Case management
import CasesPage from './pages/cases/CasesPage';
import CreateCasePage from './pages/cases/CreateCasePage';
import CaseDetailPage from './pages/cases/CaseDetailPage';
import EditCasePage from './pages/cases/EditCasePage';

import { CalendarProvider } from './contexts/CalendarContext';
import { TimeTrackingProvider } from './contexts/TimeTrackingContext';
import SupabaseConnectionTest from './components/SupabaseConnectionTest';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimeTrackingProvider>
          <CalendarProvider>
            <Router>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/time-tracking" element={<TimeTrackingPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/documents" element={<DocumentManagementPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/matters" element={<MatterManagementPage />} />
                <Route path="/matters/:id" element={<MatterDetailPage />} />
                
                {/* Client Routes */}
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/clients/new" element={<CreateClientPage />} />
                <Route path="/clients/:id" element={<ClientDetailPage />} />
                <Route path="/clients/:id/edit" element={<EditClientPage />} />
                
                {/* Case Routes */}
                <Route path="/cases" element={<CasesPage />} />
                <Route path="/cases/new" element={<CreateCasePage />} />
                <Route path="/cases/:id" element={<CaseDetailPage />} />
                <Route path="/cases/:id/edit" element={<EditCasePage />} />
                
                <Route path="/supabase-test" element={<SupabaseConnectionTest />} />
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                {/* Add more routes for other features as they're developed */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </CalendarProvider>
        </TimeTrackingProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
