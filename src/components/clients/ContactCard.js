import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  IconButton,
  Grid,
  Stack,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const ContactCard = ({ contact, onEdit, onDelete }) => {
  if (!contact) return null;

  // Format address for display
  const formatAddress = (address) => {
    const parts = [];
    if (address.street) parts.push(address.street);
    
    const cityStateZip = [];
    if (address.city) cityStateZip.push(address.city);
    if (address.state) cityStateZip.push(address.state);
    if (address.zip) cityStateZip.push(address.zip);
    
    if (cityStateZip.length > 0) {
      parts.push(cityStateZip.join(', '));
    }
    
    if (address.country && address.country !== 'USA') {
      parts.push(address.country);
    }
    
    return parts.join(', ');
  };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, 
        position: 'relative',
        '&:hover': {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      {/* Actions */}
      <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
        <Tooltip title="Edit Contact">
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => onEdit(contact)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Contact">
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => onDelete(contact.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Contact Name and Status */}
      <Box sx={{ mb: 2, pr: 6 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {`${contact.first_name} ${contact.last_name || ''}`}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {contact.role && (
            <Typography variant="body2" color="text.secondary">
              {contact.role}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {contact.is_primary && (
            <Chip 
              label="Primary Contact" 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          )}
          {contact.is_billing && (
            <Chip 
              label="Billing Contact" 
              size="small" 
              color="secondary" 
              variant="outlined" 
            />
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Contact Info */}
      <Grid container spacing={2}>
        {contact.email && (
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {contact.email}
              </Typography>
            </Stack>
          </Grid>
        )}
        
        {contact.phone && (
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {contact.phone}
              </Typography>
            </Stack>
          </Grid>
        )}
      </Grid>

      {/* Addresses */}
      {contact.addresses && contact.addresses.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Addresses
          </Typography>
          
          <Stack spacing={2}>
            {contact.addresses.map((address, index) => (
              <Box key={index}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <LocationIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {address.address_type}
                    </Typography>
                    <Typography variant="body2">
                      {formatAddress(address)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {/* Notes */}
      {contact.notes && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Notes
          </Typography>
          
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {contact.notes}
          </Typography>
        </>
      )}
    </Paper>
  );
};

ContactCard.propTypes = {
  contact: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ContactCard; 