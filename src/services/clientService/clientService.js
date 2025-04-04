import supabase from '../../supabaseClient';

/**
 * Client Service - Handles all client-related API operations
 */
const clientService = {
  /**
   * Fetch all clients with optional filtering
   * @param {Object} filters - Optional filters to apply
   * @param {boolean} includeArchived - Whether to include archived clients
   * @returns {Promise<Array>} - Array of client objects
   */
  async getAllClients(filters = {}, includeArchived = false) {
    let query = supabase
      .from('clients')
      .select(`
        *,
        status:client_statuses(id, name, color)
      `);
    
    // Apply filters
    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }
    
    if (filters.status) {
      query = query.eq('status_id', filters.status);
    }
    
    if (filters.type) {
      query = query.eq('client_type', filters.type);
    }
    
    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},organization_name.ilike.${searchTerm},primary_email.ilike.${searchTerm},primary_phone.ilike.${searchTerm}`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw new Error(`Error fetching clients: ${error.message}`);
    }
    
    return data;
  },
  
  /**
   * Fetch a single client by ID
   * @param {string} id - Client UUID
   * @returns {Promise<Object>} - Client object with detailed information
   */
  async getClientById(id) {
    try {
      // First get the client basic info
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select(`
          *,
          status:client_statuses(id, name, color)
        `)
        .eq('id', id)
        .single();
      
      if (clientError) {
        console.error(`Error fetching client with ID ${id}:`, clientError);
        throw new Error(`Error fetching client: ${clientError.message}`);
      }

      // Fetch emails
      const { data: emailsData, error: emailsError } = await supabase
        .from('client_emails')
        .select('*')
        .eq('client_id', id)
        .order('is_primary', { ascending: false });
      
      if (emailsError) {
        console.error(`Error fetching emails for client ${id}:`, emailsError);
      }
      
      // Fetch phone numbers
      const { data: phonesData, error: phonesError } = await supabase
        .from('client_phones')
        .select('*')
        .eq('client_id', id)
        .order('is_primary', { ascending: false });
      
      if (phonesError) {
        console.error(`Error fetching phones for client ${id}:`, phonesError);
      }
      
      // Fetch websites
      const { data: websitesData, error: websitesError } = await supabase
        .from('client_websites')
        .select('*')
        .eq('client_id', id)
        .order('is_primary', { ascending: false });
      
      if (websitesError) {
        console.error(`Error fetching websites for client ${id}:`, websitesError);
      }
      
      // Fetch addresses
      const { data: addressesData, error: addressesError } = await supabase
        .from('client_addresses_direct')
        .select('*')
        .eq('client_id', id);
      
      if (addressesError) {
        console.error(`Error fetching addresses for client ${id}:`, addressesError);
      }
      
      // Fetch contacts data (for backward compatibility)
      const { data: contactsData, error: contactsError } = await supabase
        .from('client_contacts')
        .select(`
          *,
          addresses:client_addresses(*)
        `)
        .eq('client_id', id);
      
      if (contactsError) {
        console.error(`Error fetching contacts for client ${id}:`, contactsError);
      }
      
      // Combine all data
      const fullClientData = {
        ...clientData,
        emails: emailsData || [],
        phones: phonesData || [],
        websites: websitesData || [],
        addresses: addressesData || [],
        contacts: contactsData || [],
      };
      
      // Parse JSON fields if stored as strings
      if (typeof fullClientData.tags === 'string') {
        try {
          fullClientData.tags = JSON.parse(fullClientData.tags);
        } catch (e) {
          fullClientData.tags = [];
        }
      }
      
      if (typeof fullClientData.custom_fields === 'string') {
        try {
          fullClientData.custom_fields = JSON.parse(fullClientData.custom_fields);
        } catch (e) {
          fullClientData.custom_fields = [];
        }
      }
      
      return fullClientData;
    } catch (error) {
      console.error(`Error in getClientById for ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new client
   * @param {Object} clientData - Client information
   * @returns {Promise<Object>} - Created client object
   */
  async createClient(clientData) {
    try {
      // First, get the default status ID (Pending) if not provided
      let statusId = clientData.status_id;
      if (!statusId) {
        const { data: statusData, error: statusError } = await supabase
          .from('client_statuses')
          .select('id')
          .eq('name', 'Pending')
          .single();
        
        if (statusError) {
          console.error('Error fetching default status:', statusError);
          throw new Error(`Error fetching default status: ${statusError.message}`);
        }
        
        statusId = statusData.id;
      }
      
      // Process profile photo if provided
      let profilePhotoUrl = null;
      if (clientData.profile_photo) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('client-photos')
          .upload(`client-photos/${Date.now()}_${clientData.profile_photo.name}`, clientData.profile_photo, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error('Error uploading profile photo:', uploadError);
        } else {
          // Get public URL for the uploaded photo
          const { data: urlData } = await supabase.storage
            .from('client-photos')
            .getPublicUrl(uploadData.path);
          
          profilePhotoUrl = urlData?.publicUrl || null;
        }
      }
      
      // Parse contacts data if it's a string
      let contactsData = clientData.contacts_data;
      if (typeof contactsData === 'string') {
        try {
          contactsData = JSON.parse(contactsData);
        } catch (e) {
          console.error('Error parsing contacts data:', e);
          contactsData = null;
        }
      }
      
      // Create client record
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          client_type: clientData.client_type,
          prefix: clientData.prefix,
          first_name: clientData.first_name,
          middle_name: clientData.middle_name,
          last_name: clientData.last_name,
          date_of_birth: clientData.date_of_birth,
          organization_name: clientData.organization_name,
          title: clientData.title,
          primary_email: clientData.primary_email,
          primary_phone: clientData.primary_phone,
          profile_photo_url: profilePhotoUrl,
          status_id: statusId,
          tags: clientData.tags,
          custom_fields: clientData.custom_fields,
          payment_type: clientData.payment_type,
          hourly_rate: clientData.hourly_rate,
          ledes_id: clientData.ledes_id,
          notes: clientData.notes,
          added_by: clientData.added_by || null // Should be the current user ID
        })
        .select();
      
      if (clientError) {
        console.error('Error creating client:', clientError);
        throw new Error(`Error creating client: ${clientError.message}`);
      }
      
      const newClient = clientData[0];
      
      // Store additional contact information if provided
      if (contactsData && newClient.id) {
        const clientId = newClient.id;
        
        // Process emails
        if (contactsData.emails && Array.isArray(contactsData.emails)) {
          const emailsToInsert = contactsData.emails
            .filter(item => item.email.trim())
            .map(item => ({
              client_id: clientId,
              email: item.email,
              email_type: item.type,
              is_primary: item.is_primary
            }));
          
          if (emailsToInsert.length > 0) {
            const { error: emailsError } = await supabase
              .from('client_emails')
              .insert(emailsToInsert);
            
            if (emailsError) {
              console.error('Error storing client emails:', emailsError);
            }
          }
        }
        
        // Process phones
        if (contactsData.phones && Array.isArray(contactsData.phones)) {
          const phonesToInsert = contactsData.phones
            .filter(item => item.phone.trim())
            .map(item => ({
              client_id: clientId,
              phone: item.phone,
              phone_type: item.type,
              is_primary: item.is_primary
            }));
          
          if (phonesToInsert.length > 0) {
            const { error: phonesError } = await supabase
              .from('client_phones')
              .insert(phonesToInsert);
            
            if (phonesError) {
              console.error('Error storing client phones:', phonesError);
            }
          }
        }
        
        // Process websites
        if (contactsData.websites && Array.isArray(contactsData.websites)) {
          const websitesToInsert = contactsData.websites
            .filter(item => item.url.trim())
            .map(item => ({
              client_id: clientId,
              url: item.url,
              website_type: item.type,
              is_primary: item.is_primary
            }));
          
          if (websitesToInsert.length > 0) {
            const { error: websitesError } = await supabase
              .from('client_websites')
              .insert(websitesToInsert);
            
            if (websitesError) {
              console.error('Error storing client websites:', websitesError);
            }
          }
        }
        
        // Process addresses
        if (contactsData.addresses && Array.isArray(contactsData.addresses)) {
          const addressesToInsert = contactsData.addresses
            .filter(item => item.street.trim() || item.city.trim())
            .map(item => ({
              client_id: clientId,
              address_type: item.type,
              street: item.street,
              city: item.city,
              state: item.state,
              zip: item.zip,
              country: item.country
            }));
          
          if (addressesToInsert.length > 0) {
            const { error: addressesError } = await supabase
              .from('client_addresses_direct')
              .insert(addressesToInsert);
            
            if (addressesError) {
              console.error('Error storing client addresses:', addressesError);
            }
          }
        }
      }
      
      return newClient;
    } catch (error) {
      console.error('Error in createClient:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing client
   * @param {string} id - Client UUID
   * @param {Object} clientData - Updated client information
   * @returns {Promise<Object>} - Updated client object
   */
  async updateClient(id, clientData) {
    try {
      // Process profile photo if provided
      let profilePhotoUrl = clientData.profile_photo_url;
      if (clientData.profile_photo) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('client-photos')
          .upload(`client-photos/${Date.now()}_${clientData.profile_photo.name}`, clientData.profile_photo, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error('Error uploading profile photo:', uploadError);
        } else {
          // Get public URL for the uploaded photo
          const { data: urlData } = await supabase.storage
            .from('client-photos')
            .getPublicUrl(uploadData.path);
          
          profilePhotoUrl = urlData?.publicUrl || null;
        }
      }
      
      // Parse contacts data if it's a string
      let contactsData = clientData.contacts_data;
      if (typeof contactsData === 'string') {
        try {
          contactsData = JSON.parse(contactsData);
        } catch (e) {
          console.error('Error parsing contacts data:', e);
          contactsData = null;
        }
      }
      
      // Update the client
      const { data: updatedClientData, error: clientError } = await supabase
        .from('clients')
        .update({
          client_type: clientData.client_type,
          prefix: clientData.prefix,
          first_name: clientData.first_name,
          middle_name: clientData.middle_name,
          last_name: clientData.last_name,
          date_of_birth: clientData.date_of_birth,
          organization_name: clientData.organization_name,
          title: clientData.title,
          primary_email: clientData.primary_email,
          primary_phone: clientData.primary_phone,
          profile_photo_url: profilePhotoUrl || clientData.profile_photo_url,
          status_id: clientData.status_id,
          tags: clientData.tags,
          custom_fields: clientData.custom_fields,
          payment_type: clientData.payment_type,
          hourly_rate: clientData.hourly_rate,
          ledes_id: clientData.ledes_id,
          notes: clientData.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
    
      if (clientError) {
        console.error(`Error updating client with ID ${id}:`, clientError);
        throw new Error(`Error updating client: ${clientError.message}`);
      }
      
      // Handle additional contact information if provided
      if (contactsData && id) {
        // Update emails: first delete existing
        const { error: deleteEmailsError } = await supabase
          .from('client_emails')
          .delete()
          .eq('client_id', id);
        
        if (deleteEmailsError) {
          console.error('Error deleting existing emails:', deleteEmailsError);
        }
        
        // Then insert new emails
        if (contactsData.emails && Array.isArray(contactsData.emails)) {
          const emailsToInsert = contactsData.emails
            .filter(item => item.email.trim())
            .map(item => ({
              client_id: id,
              email: item.email,
              email_type: item.type,
              is_primary: item.is_primary
            }));
          
          if (emailsToInsert.length > 0) {
            const { error: emailsError } = await supabase
              .from('client_emails')
              .insert(emailsToInsert);
            
            if (emailsError) {
              console.error('Error updating client emails:', emailsError);
            }
          }
        }
        
        // Update phones: first delete existing
        const { error: deletePhonesError } = await supabase
          .from('client_phones')
          .delete()
          .eq('client_id', id);
        
        if (deletePhonesError) {
          console.error('Error deleting existing phones:', deletePhonesError);
        }
        
        // Then insert new phones
        if (contactsData.phones && Array.isArray(contactsData.phones)) {
          const phonesToInsert = contactsData.phones
            .filter(item => item.phone.trim())
            .map(item => ({
              client_id: id,
              phone: item.phone,
              phone_type: item.type,
              is_primary: item.is_primary
            }));
          
          if (phonesToInsert.length > 0) {
            const { error: phonesError } = await supabase
              .from('client_phones')
              .insert(phonesToInsert);
            
            if (phonesError) {
              console.error('Error updating client phones:', phonesError);
            }
          }
        }
        
        // Update websites: first delete existing
        const { error: deleteWebsitesError } = await supabase
          .from('client_websites')
          .delete()
          .eq('client_id', id);
        
        if (deleteWebsitesError) {
          console.error('Error deleting existing websites:', deleteWebsitesError);
        }
        
        // Then insert new websites
        if (contactsData.websites && Array.isArray(contactsData.websites)) {
          const websitesToInsert = contactsData.websites
            .filter(item => item.url.trim())
            .map(item => ({
              client_id: id,
              url: item.url,
              website_type: item.type,
              is_primary: item.is_primary
            }));
          
          if (websitesToInsert.length > 0) {
            const { error: websitesError } = await supabase
              .from('client_websites')
              .insert(websitesToInsert);
            
            if (websitesError) {
              console.error('Error updating client websites:', websitesError);
            }
          }
        }
        
        // Update addresses: first delete existing
        const { error: deleteAddressesError } = await supabase
          .from('client_addresses_direct')
          .delete()
          .eq('client_id', id);
        
        if (deleteAddressesError) {
          console.error('Error deleting existing addresses:', deleteAddressesError);
        }
        
        // Then insert new addresses
        if (contactsData.addresses && Array.isArray(contactsData.addresses)) {
          const addressesToInsert = contactsData.addresses
            .filter(item => item.street.trim() || item.city.trim())
            .map(item => ({
              client_id: id,
              address_type: item.type,
              street: item.street,
              city: item.city,
              state: item.state,
              zip: item.zip,
              country: item.country
            }));
          
          if (addressesToInsert.length > 0) {
            const { error: addressesError } = await supabase
              .from('client_addresses_direct')
              .insert(addressesToInsert);
            
            if (addressesError) {
              console.error('Error updating client addresses:', addressesError);
            }
          }
        }
      }
      
      return updatedClientData[0];
    } catch (error) {
      console.error(`Error updating client with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Archive a client
   * @param {string} id - Client UUID
   * @returns {Promise<void>}
   */
  async archiveClient(id) {
    // Get the archive status ID
    const { data: statusData, error: statusError } = await supabase
      .from('client_statuses')
      .select('id')
      .eq('name', 'Archived')
      .single();
    
    if (statusError) {
      console.error('Error fetching archive status:', statusError);
      throw new Error(`Error fetching archive status: ${statusError.message}`);
    }
    
    // Update client to archived status
    const { error } = await supabase
      .from('clients')
      .update({
        is_archived: true,
        status_id: statusData.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error(`Error archiving client with ID ${id}:`, error);
      throw new Error(`Error archiving client: ${error.message}`);
    }
  },
  
  /**
   * Permanently delete a client
   * @param {string} id - Client UUID
   * @returns {Promise<void>}
   */
  async deleteClient(id) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting client with ID ${id}:`, error);
      throw new Error(`Error deleting client: ${error.message}`);
    }
  },
  
  /**
   * Check if a client with the given email already exists
   * @param {string} email - Email address to check
   * @param {string} excludeId - Optional client ID to exclude from check (for updates)
   * @returns {Promise<boolean>} - True if email exists, false otherwise
   */
  async checkEmailExists(email, excludeId = null) {
    let query = supabase
      .from('clients')
      .select('id')
      .eq('primary_email', email);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error checking email existence:', error);
      throw new Error(`Error checking email existence: ${error.message}`);
    }
    
    return data.length > 0;
  },
  
  /**
   * Get all available client statuses
   * @returns {Promise<Array>} - Array of status objects
   */
  async getClientStatuses() {
    try {
      console.log('Calling supabase to fetch client statuses');
      const { data, error } = await supabase
        .from('client_statuses')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching client statuses:', error);
        throw new Error(`Error fetching client statuses: ${error.message}`);
      }
      
      if (!data || !Array.isArray(data)) {
        console.error('Invalid data format returned for client statuses');
        return [];
      }
      
      console.log(`Successfully fetched ${data.length} client statuses`);
      return data;
    } catch (err) {
      console.error('Exception in getClientStatuses:', err);
      // Return empty array instead of throwing to make the UI more resilient
      return [];
    }
  },

  /**
   * Get all contacts for a client
   * @param {string} clientId - Client UUID
   * @returns {Promise<Array>} - Array of contact objects with addresses
   */
  async getClientContacts(clientId) {
    const { data, error } = await supabase
      .from('client_contacts')
      .select(`
        *,
        addresses:client_addresses(*)
      `)
      .eq('client_id', clientId)
      .order('is_primary', { ascending: false });
    
    if (error) {
      console.error(`Error fetching contacts for client ${clientId}:`, error);
      throw new Error(`Error fetching contacts: ${error.message}`);
    }
    
    return data;
  },

  /**
   * Get a single contact by ID
   * @param {string} contactId - Contact UUID
   * @returns {Promise<Object>} - Contact object with addresses
   */
  async getContactById(contactId) {
    const { data, error } = await supabase
      .from('client_contacts')
      .select(`
        *,
        addresses:client_addresses(*)
      `)
      .eq('id', contactId)
      .single();
    
    if (error) {
      console.error(`Error fetching contact with ID ${contactId}:`, error);
      throw new Error(`Error fetching contact: ${error.message}`);
    }
    
    return data;
  },

  /**
   * Create a new contact for a client
   * @param {string} clientId - Client UUID
   * @param {Object} contactData - Contact information including addresses
   * @returns {Promise<Object>} - Created contact object
   */
  async createContact(clientId, contactData) {
    // Start a transaction
    try {
      // First, if this is a primary contact and the "is_primary" flag is true,
      // we need to remove the primary flag from any existing primary contact
      if (contactData.is_primary) {
        await this.clearPrimaryContact(clientId);
      }
      
      // If this is a billing contact and the "is_billing" flag is true,
      // we need to remove the billing flag from any existing billing contact
      if (contactData.is_billing) {
        await this.clearBillingContact(clientId);
      }
      
      // Extract addresses from contact data
      const { addresses, ...contactInfo } = contactData;
      
      // Create the contact
      const { data: contact, error: contactError } = await supabase
        .from('client_contacts')
        .insert({
          ...contactInfo,
          client_id: clientId
        })
        .select()
        .single();
      
      if (contactError) {
        throw new Error(`Error creating contact: ${contactError.message}`);
      }
      
      // Now create addresses if any
      if (addresses && addresses.length > 0) {
        const addressesWithContactId = addresses.map(address => ({
          ...address,
          client_contact_id: contact.id
        }));
        
        const { error: addressesError } = await supabase
          .from('client_addresses')
          .insert(addressesWithContactId);
        
        if (addressesError) {
          throw new Error(`Error creating addresses: ${addressesError.message}`);
        }
      }
      
      // Fetch the complete contact with addresses
      return await this.getContactById(contact.id);
    } catch (error) {
      console.error('Error in transaction:', error);
      throw error;
    }
  },

  /**
   * Update an existing contact
   * @param {string} contactId - Contact UUID
   * @param {Object} contactData - Updated contact information including addresses
   * @returns {Promise<Object>} - Updated contact object
   */
  async updateContact(contactId, contactData) {
    try {
      // First get the client ID from the contact
      const { data: existingContact, error: fetchError } = await supabase
        .from('client_contacts')
        .select('client_id, is_primary, is_billing')
        .eq('id', contactId)
        .single();
      
      if (fetchError) {
        throw new Error(`Error fetching existing contact: ${fetchError.message}`);
      }
      
      // Check if primary status is changing
      if (contactData.is_primary && !existingContact.is_primary) {
        await this.clearPrimaryContact(existingContact.client_id);
      }
      
      // Check if billing status is changing
      if (contactData.is_billing && !existingContact.is_billing) {
        await this.clearBillingContact(existingContact.client_id);
      }
      
      // Extract addresses from contact data
      const { addresses, ...contactInfo } = contactData;
      
      // Update the contact
      const { error: contactError } = await supabase
        .from('client_contacts')
        .update({
          ...contactInfo,
          updated_at: new Date().toISOString()
        })
        .eq('id', contactId);
      
      if (contactError) {
        throw new Error(`Error updating contact: ${contactError.message}`);
      }
      
      // Handle addresses
      if (addresses && addresses.length > 0) {
        // First, delete all existing addresses
        const { error: deleteError } = await supabase
          .from('client_addresses')
          .delete()
          .eq('client_contact_id', contactId);
        
        if (deleteError) {
          throw new Error(`Error deleting existing addresses: ${deleteError.message}`);
        }
        
        // Then create new addresses
        const addressesWithContactId = addresses.map(address => ({
          ...address,
          client_contact_id: contactId
        }));
        
        const { error: addressesError } = await supabase
          .from('client_addresses')
          .insert(addressesWithContactId);
        
        if (addressesError) {
          throw new Error(`Error creating new addresses: ${addressesError.message}`);
        }
      }
      
      // Fetch and return the updated contact
      return await this.getContactById(contactId);
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  /**
   * Delete a contact
   * @param {string} contactId - Contact UUID
   * @returns {Promise<void>}
   */
  async deleteContact(contactId) {
    // First check if this is the primary or billing contact
    const { data: contact, error: fetchError } = await supabase
      .from('client_contacts')
      .select('is_primary, is_billing')
      .eq('id', contactId)
      .single();
    
    if (fetchError) {
      console.error(`Error fetching contact with ID ${contactId}:`, fetchError);
      throw new Error(`Error fetching contact: ${fetchError.message}`);
    }
    
    // Warn if trying to delete a primary or billing contact
    if (contact.is_primary || contact.is_billing) {
      throw new Error(`Cannot delete a ${contact.is_primary ? 'primary' : 'billing'} contact. Please assign another contact as ${contact.is_primary ? 'primary' : 'billing'} first.`);
    }
    
    // Addresses will be automatically deleted due to ON DELETE CASCADE
    const { error } = await supabase
      .from('client_contacts')
      .delete()
      .eq('id', contactId);
    
    if (error) {
      console.error(`Error deleting contact with ID ${contactId}:`, error);
      throw new Error(`Error deleting contact: ${error.message}`);
    }
  },

  /**
   * Clear the primary contact flag for all contacts of a client
   * @param {string} clientId - Client UUID
   * @returns {Promise<void>}
   * @private
   */
  async clearPrimaryContact(clientId) {
    const { error } = await supabase
      .from('client_contacts')
      .update({ is_primary: false })
      .eq('client_id', clientId)
      .eq('is_primary', true);
    
    if (error) {
      console.error(`Error clearing primary contact for client ${clientId}:`, error);
      throw new Error(`Error clearing primary contact: ${error.message}`);
    }
  },

  /**
   * Clear the billing contact flag for all contacts of a client
   * @param {string} clientId - Client UUID
   * @returns {Promise<void>}
   * @private
   */
  async clearBillingContact(clientId) {
    const { error } = await supabase
      .from('client_contacts')
      .update({ is_billing: false })
      .eq('client_id', clientId)
      .eq('is_billing', true);
    
    if (error) {
      console.error(`Error clearing billing contact for client ${clientId}:`, error);
      throw new Error(`Error clearing billing contact: ${error.message}`);
    }
  },

  /**
   * Get all cases associated with a client
   * @param {string} clientId - Client UUID
   * @param {boolean} includeArchived - Whether to include archived cases
   * @returns {Promise<Array>} - Array of case objects with association details
   */
  async getClientCases(clientId, includeArchived = false) {
    let query = supabase
      .from('client_case_associations')
      .select(`
        id,
        role,
        is_primary,
        notes,
        case:case_id(
          id,
          case_number,
          title,
          description,
          type_id,
          status_id,
          opened_date,
          closed_date,
          priority,
          is_archived,
          type:case_types(id, name, color),
          status:case_statuses(id, name, color)
        )
      `)
      .eq('client_id', clientId);
    
    if (!includeArchived) {
      query = query.eq('case.is_archived', false);
    }
    
    const { data, error } = await query.order('case.opened_date', { ascending: false });
    
    if (error) {
      console.error(`Error fetching cases for client ${clientId}:`, error);
      throw new Error(`Error fetching client cases: ${error.message}`);
    }
    
    // Format the response to return just the cases with the association details
    return data.map(item => ({
      ...item.case,
      association: {
        id: item.id,
        role: item.role,
        is_primary: item.is_primary,
        notes: item.notes
      }
    })).filter(item => item.id); // Filter out any null items (in case of deleted cases)
  },

  /**
   * Associate a client with a case
   * @param {string} clientId - Client UUID
   * @param {string} caseId - Case UUID
   * @param {Object} associationData - Association details
   * @returns {Promise<Object>} - Created association object
   */
  async associateClientWithCase(clientId, caseId, associationData = {}) {
    const { data, error } = await supabase
      .from('client_case_associations')
      .insert({
        client_id: clientId,
        case_id: caseId,
        role: associationData.role || null,
        is_primary: associationData.is_primary || false,
        notes: associationData.notes || null
      })
      .select();
    
    if (error) {
      console.error(`Error associating client ${clientId} with case ${caseId}:`, error);
      throw new Error(`Error associating client with case: ${error.message}`);
    }
    
    return data[0];
  },

  /**
   * Update a client-case association
   * @param {string} associationId - Association UUID
   * @param {Object} associationData - Updated association details
   * @returns {Promise<Object>} - Updated association object
   */
  async updateClientCaseAssociation(associationId, associationData) {
    const { data, error } = await supabase
      .from('client_case_associations')
      .update({
        role: associationData.role,
        is_primary: associationData.is_primary,
        notes: associationData.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', associationId)
      .select();
    
    if (error) {
      console.error(`Error updating association ${associationId}:`, error);
      throw new Error(`Error updating client-case association: ${error.message}`);
    }
    
    return data[0];
  },

  /**
   * Remove a client-case association
   * @param {string} associationId - Association UUID
   * @returns {Promise<void>}
   */
  async removeClientCaseAssociation(associationId) {
    const { error } = await supabase
      .from('client_case_associations')
      .delete()
      .eq('id', associationId);
    
    if (error) {
      console.error(`Error removing association ${associationId}:`, error);
      throw new Error(`Error removing client-case association: ${error.message}`);
    }
  },

  /**
   * Remove client from a case
   * @param {string} clientId - Client UUID
   * @param {string} caseId - Case UUID
   * @returns {Promise<void>}
   */
  async removeClientFromCase(clientId, caseId) {
    const { error } = await supabase
      .from('client_case_associations')
      .delete()
      .eq('client_id', clientId)
      .eq('case_id', caseId);
    
    if (error) {
      console.error(`Error removing client ${clientId} from case ${caseId}:`, error);
      throw new Error(`Error removing client from case: ${error.message}`);
    }
  }
};

export default clientService; 