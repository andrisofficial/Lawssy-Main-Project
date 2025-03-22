import { createTheme } from '@mui/material/styles';

// Theme based on LegalFlow UI design from the provided image
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0069d1', // Blue color suitable for legal professionals
      light: '#3388dc',
      dark: '#004e9a',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: 'hsl(220, 14%, 96%)', // --secondary updated for legal theme
      light: 'hsl(220, 14%, 98%)',
      dark: 'hsl(220, 14%, 90%)',
      contrastText: 'hsl(224, 71%, 4%)',
    },
    background: {
      default: '#f8fafc', // Light gray background updated for legal theme
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0f172a', // Darker text for legal professionalism
      secondary: '#475569', // Secondary text color updated
    },
    error: {
      main: '#dc2626', // Red color for destructive actions updated
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#059669', // Green color for success indicators updated
    },
    // Chart colors updated for legal professional aesthetics
    chart: {
      1: '#0069d1', // Primary blue
      2: '#475569', // Slate 
      3: '#059669', // Green for positive outcomes
      4: '#d97706', // Amber for warnings/cautions
      5: '#6366f1', // Indigo for additional category
    },
    // Sidebar specific colors updated
    sidebar: {
      background: '#001D51',
      foreground: '#475569',
      primary: '#0069d1',
      primaryForeground: '#FFFFFF',
      accent: '#f1f5f9',
      accentForeground: '#0f172a',
      border: '#e2e8f0',
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
            color: '#0069d1',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#0069d1',
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