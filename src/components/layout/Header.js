import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  InputBase, 
  IconButton, 
  Badge,
  Stack,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { alpha } from '@mui/material/styles';

const Header = ({ title }) => {
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#E9D4C3',
        color: theme.palette.text.primary,
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Toolbar>
        {/* App Name and Page Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: 240, pl: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.primary.main,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            LegalFlow
          </Typography>
        </Box>

        {/* Page Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            fontSize: '1.125rem',
            ml: { xs: 0, sm: 2 }
          }}
        >
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search Bar */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: '8px',
            backgroundColor: alpha(theme.palette.common.black, 0.04),
            border: '1px solid transparent',
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.black, 0.06),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.05)}`,
            },
            '&:focus-within': {
              backgroundColor: '#E9D4C3',
              border: `1px solid ${theme.palette.primary.main}`,
              boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
            },
            transition: 'all 0.2s ease-in-out',
            mr: 2,
            width: 'auto',
            maxWidth: 400,
          }}
        >
          <Box sx={{ 
            position: 'absolute', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            pl: 2, 
            pointerEvents: 'none',
            color: (theme) => alpha(theme.palette.common.black, 0.4),
            '.Mui-focused &': {
              color: theme.palette.primary.main
            }
          }}>
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search…"
            sx={{
              color: 'inherit',
              width: '100%',
              '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                width: '100%',
                minWidth: 200,
                transition: theme.transitions.create('width'),
                '&:focus': {
                  color: theme.palette.text.primary,
                }
              },
            }}
          />
        </Box>

        {/* Notifications */}
        <IconButton 
          size="large" 
          aria-label="show notifications"
          sx={{ 
            mr: 1,
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main
            }
          }}
        >
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 