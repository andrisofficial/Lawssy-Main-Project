import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Dialog, DialogContent, DialogTitle, IconButton, CircularProgress, Grid, Alert, Divider } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import clientService from '../../services/clientService/clientService';
import ContactCard from './ContactCard';
import ContactForm from './ContactForm';
import ContactsImportExport from './ContactsImportExport';

/**
 * ContactsManager component - Manages contacts for a specific client
 * Displays a list of contacts and provides functionality to add, edit, and delete contacts
 */
const ContactsManager = ({ clientId, clientName, initialContacts = [] }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load contacts if not provided initially
  useEffect(() => {
    if (initialContacts.length === 0 && clientId) {
      loadContacts();
    }
  }, [clientId]);

  // Load contacts from the server
  const loadContacts = async () => {
    if (!clientId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchedContacts = await clientService.getClientContacts(clientId);
      setContacts(fetchedContacts);
    } catch (err) {
      console.error('Error loading contacts:', err);
      setError(`Failed to load contacts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Open the form to add a new contact
  const handleAddContact = () => {
    setCurrentContact(null);
    setIsFormOpen(true);
  };

  // Open the form to edit an existing contact
  const handleEditContact = (contact) => {
    setCurrentContact(contact);
    setIsFormOpen(true);
  };

  // Handle form submission (create or update)
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      let updatedContact;
      
      if (currentContact) {
        // Update existing contact
        updatedContact = await clientService.updateContact(currentContact.id, formData);
        
        // Update the contacts list
        setContacts(prevContacts => 
          prevContacts.map(c => c.id === updatedContact.id ? updatedContact : c)
        );
      } else {
        // Create new contact
        updatedContact = await clientService.createContact(clientId, formData);
        
        // Add to contacts list
        setContacts(prevContacts => [...prevContacts, updatedContact]);
      }
      
      // Close the form
      setIsFormOpen(false);
      
      // If we updated/added a primary or billing contact, refresh all contacts
      // to ensure proper state updates across all contacts
      if (formData.is_primary || formData.is_billing) {
        loadContacts();
      }
    } catch (err) {
      console.error('Error saving contact:', err);
      setError(`Failed to save contact: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle contact deletion
  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setIsDeleting(true);
      setError(null);
      
      try {
        await clientService.deleteContact(contactId);
        
        // Remove from contacts list
        setContacts(prevContacts => prevContacts.filter(c => c.id !== contactId));
      } catch (err) {
        console.error('Error deleting contact:', err);
        setError(`Failed to delete contact: ${err.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Close the form dialog
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentContact(null);
    setError(null);
  };

  // Handler for when contacts are imported
  const handleContactsImported = () => {
    loadContacts();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Contacts for {clientName}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddContact}
          disabled={loading || isDeleting}
        >
          Add Contact
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && !isFormOpen ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : contacts.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            No contacts available. Click "Add Contact" to create one.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {contacts.map((contact) => (
            <Grid item xs={12} key={contact.id}>
              <ContactCard
                contact={contact}
                onEdit={() => handleEditContact(contact)}
                onDelete={() => handleDeleteContact(contact.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Import/Export functionality */}
      <ContactsImportExport 
        clientId={clientId}
        clientName={clientName}
        onContactsImported={handleContactsImported}
      />

      {/* Contact Form Dialog */}
      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {currentContact ? 'Edit Contact' : 'Add New Contact'}
            <IconButton aria-label="close" onClick={handleCloseForm} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <ContactForm
            initialData={currentContact}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isSubmitting={loading}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ContactsManager; 