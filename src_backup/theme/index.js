import { createTheme } from '@mui/material/styles';

// Theme based on LegalFlow UI design from the provided image
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5138ED', // Purple color from the LF logo
      light: '#6A52F2',
      dark: '#4229D9',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: 'hsl(0, 0%, 96.1%)', // --secondary from LegalFlow
      light: 'hsl(0, 0%, 98%)',
      dark: 'hsl(0, 0%, 90%)',
      contrastText: 'hsl(0, 0%, 9%)',
    },
    background: {
      default: '#F9FAFB', // Light gray background from the image
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827', // Dark text color from the image
      secondary: '#6B7280', // Secondary text color from the image
    },
    error: {
      main: '#EF4444', // Red color for destructive actions
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Green color for success indicators
    },
    // Chart colors
    chart: {
      1: '#F97316', // Orange for billable hours
      2: '#8B5CF6', // Purple for outstanding invoices
      3: '#10B981', // Green for revenue
      4: '#F59E0B', // Yellow
      5: '#EC4899', // Pink
    },
    // Sidebar specific colors
    sidebar: {
      background: '#FFFFFF',
      foreground: '#6B7280',
      primary: '#5138ED',
      primaryForeground: '#FFFFFF',
      accent: '#F3F4F6',
      accentForeground: '#111827',
      border: '#E5E7EB',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    caption: {
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: '0.5rem',
          padding: '0.5rem 1rem',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          backgroundColor: '#111827', // Black button in the image
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#374151',
          },
        },
        outlined: {
          borderColor: '#E5E7EB',
          color: '#111827',
          '&:hover': {
            borderColor: '#D1D5DB',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: '0.75rem',
          border: '1px solid #F3F4F6',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
          backgroundColor: '#F3F4F6',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: '48px',
          '&.Mui-selected': {
            color: '#5138ED',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#5138ED',
          height: 3,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '0.75rem 1rem',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#F3F4F6',
        },
      },
    },
  },
});

export default theme; 