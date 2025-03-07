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

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const currentPath = location.pathname;

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/' 
    },
    { 
      text: 'Time Tracking & Billing', 
      icon: <AccessTimeIcon />, 
      path: '/time-tracking' 
    },
    { 
      text: 'Clients', 
      icon: <PeopleIcon />, 
      path: '/clients' 
    },
    { 
      text: 'Document Management', 
      icon: <FolderIcon />, 
      path: '/documents' 
    },
    { 
      text: 'AI Contract Review', 
      icon: <DescriptionIcon />, 
      path: '/contract-review' 
    },
    { 
      text: 'Legal Research', 
      icon: <SearchIcon />, 
      path: '/legal-research' 
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
          selected={isActive}
          sx={{
            minHeight: 48,
            px: 2.5,
            py: 1,
            borderRadius: '8px',
            mx: 1,
            backgroundColor: isActive ? 'rgba(81, 56, 237, 0.08)' : 'transparent',
            '&:hover': {
              backgroundColor: isActive ? 'rgba(81, 56, 237, 0.12)' : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              mr: 1.5,
              color: isActive ? theme.palette.primary.main : 'inherit',
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
              color: isActive ? theme.palette.primary.main : 'inherit',
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
          backgroundColor: '#FFFFFF',
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
        <Typography variant="h6" fontWeight={600} color="primary">
          LegalFlow
        </Typography>
      </Box>

      <Divider />

      {/* Main Menu Items */}
      <Box sx={{ overflow: 'auto', flexGrow: 1, py: 2 }}>
        <List>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </List>
      </Box>

      <Divider />

      {/* Bottom Menu Items */}
      <List sx={{ py: 2 }}>
        {bottomMenuItems.map((item, index) => renderMenuItem(item, index))}
      </List>

      {/* User Profile */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: '#F3F4F6' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            src="/avatar.jpg" 
            alt="User Avatar"
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Sarah Johnson
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Senior Attorney
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 