import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  Typography, 
  Avatar, 
  Stack,
  Badge,
  useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const currentPath = location.pathname;

  // Theme colors for easy future changes
  const COLORS = {
    active: '#1F4290',        // Active/selected item background
    hover: 'rgba(0, 54, 109, 0.8)', // Hover state background
    textActive: '#FFFFFF',    // Active text color
    textNormal: 'rgba(255, 255, 255, 0.8)', // Normal text color
    divider: 'rgba(255, 255, 255, 0.1)', // Divider color
    background: '#001D51'     // Sidebar background
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/dashboard' 
    },
    { 
      text: 'Calendar', 
      icon: <CalendarMonthIcon />, 
      path: '/calendar' 
    },
    { 
      text: 'Time Tracking', 
      icon: <AccessTimeIcon />, 
      path: '/time-tracking' 
    },
    { 
      text: 'Billing', 
      icon: <ReceiptIcon />, 
      path: '/billing' 
    },
    { 
      text: 'Matters', 
      icon: <BusinessCenterIcon />, 
      path: '/matters' 
    },
    { 
      text: 'Document', 
      icon: <FolderIcon />, 
      path: '/documents' 
    },
    { 
      text: 'Clients', 
      icon: <PeopleIcon />, 
      path: '/clients' 
    },
  ];

  const bottomMenuItems = [
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: '/settings' 
    },
    { 
      text: 'Logout', 
      icon: <LogoutIcon />, 
      path: '/logout' 
    },
  ];

  const renderMenuItem = (item, index) => {
    const isActive = currentPath === item.path || 
                    (item.path !== '/' && currentPath.startsWith(item.path));
    
    return (
      <ListItem key={index} disablePadding sx={{ display: 'block', mb: 0.5 }}>
        <ListItemButton
          component={Link}
          to={item.path}
          sx={{
            minHeight: 48,
            px: 2.5,
            py: 1,
            borderRadius: '6px',
            mx: 1,
            backgroundColor: isActive ? COLORS.active : 'transparent',
            '&:hover': {
              backgroundColor: isActive ? COLORS.active : COLORS.hover,
            },
            '&.Mui-selected': {
              backgroundColor: COLORS.active,
              '&:hover': {
                backgroundColor: COLORS.active,
              },
            },
          }}
          selected={isActive}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              mr: 1.5,
              color: isActive ? COLORS.textActive : COLORS.textNormal,
            }}
          >
            {item.text === 'Notifications' ? (
              <Badge badgeContent={3} color="error">
                {item.icon}
              </Badge>
            ) : (
              item.icon
            )}
          </ListItemIcon>
          <ListItemText 
            primary={item.text} 
            primaryTypographyProps={{ 
              fontWeight: isActive ? 600 : 400,
              color: isActive ? COLORS.textActive : COLORS.textNormal,
              fontSize: '0.875rem',
              whiteSpace: 'normal',
              overflow: 'visible'
            }} 
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
          backgroundColor: COLORS.background,
        },
      }}
    >
      {/* Logo and App Name */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', height: 64 }}>
        <Box 
          component="img" 
          src="/logo.svg" 
          alt="LegalFlow Logo"
          sx={{ height: 32, width: 32, mr: 1 }}
        />
        <Typography variant="h6" fontWeight={600} color="white">
          LegalFlow
        </Typography>
      </Box>

      <Divider sx={{ borderColor: COLORS.divider }} />

      {/* Main Menu Items */}
      <Box sx={{ overflow: 'auto', flexGrow: 1, py: 2 }}>
        <List>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </List>
      </Box>

      <Divider sx={{ borderColor: COLORS.divider }} />

      {/* Bottom Menu Items */}
      <List sx={{ py: 2 }}>
        {bottomMenuItems.map((item, index) => renderMenuItem(item, index))}
      </List>

      {/* User Profile */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: COLORS.divider }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            src="/avatar.jpg" 
            alt="User Avatar"
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="white">
              Sarah Johnson
            </Typography>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
              Senior Attorney
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 