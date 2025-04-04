import supabase from '../../supabaseClient';

/**
 * Case Service - Handles all case-related API operations
 */
const caseService = {
  /**
   * Fetch all cases with optional filtering
   * @param {Object} filters - Optional filters to apply
   * @param {boolean} includeArchived - Whether to include archived cases
   * @returns {Promise<Array>} - Array of case objects
   */
  async getAllCases(filters = {}, includeArchived = false) {
    let query = supabase
      .from('cases')
      .select(`
        *,
        type:case_types(id, name, color),
        status:case_statuses(id, name, color),
        assigned_user:assigned_to(id, email, user_metadata),
        clients:client_case_associations(
          id,
          role,
          is_primary,
          client:client_id(
            id,
            first_name,
            last_name,
            organization_name,
            client_type
          )
        )
      `);
    
    // Apply filters
    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }
    
    if (filters.type) {
      query = query.eq('type_id', filters.type);
    }
    
    if (filters.status) {
      query = query.eq('status_id', filters.status);
    }
    
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    
    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      query = query.or(`case_number.ilike.${searchTerm},title.ilike.${searchTerm}`);
    }
    
    // Add client filter if provided
    if (filters.client) {
      query = query.or(`clients.client_id.eq.${filters.client}`);
    }
    
    // Add assigned_to filter if provided
    if (filters.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }
    
    const { data, error } = await query.order('opened_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching cases:', error);
      throw new Error(`Error fetching cases: ${error.message}`);
    }
    
    return data;
  },
  
  /**
   * Fetch a single case by ID
   * @param {string} id - Case UUID
   * @returns {Promise<Object>} - Case object with detailed information
   */
  async getCaseById(id) {
    const { data, error } = await supabase
      .from('cases')
      .select(`
        *,
        type:case_types(id, name, description, color),
        status:case_statuses(id, name, description, color),
        assigned_user:assigned_to(id, email, user_metadata),
        clients:client_case_associations(
          id,
          role,
          is_primary,
          notes,
          client:client_id(
            id,
            first_name,
            last_name,
            organization_name,
            client_type,
            primary_email,
            primary_phone,
            status_id,
            status:client_statuses(id, name, color)
          )
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching case with ID ${id}:`, error);
      throw new Error(`Error fetching case: ${error.message}`);
    }
    
    return data;
  },
  
  /**
   * Create a new case
   * @param {Object} caseData - Case information
   * @returns {Promise<Object>} - Created case object
   */
  async createCase(caseData) {
    // First, get the default status ID (Open)
    const { data: statusData, error: statusError } = await supabase
      .from('case_statuses')
      .select('id')
      .eq('is_default', true)
      .single();
    
    if (statusError) {
      console.error('Error fetching default status:', statusError);
      throw new Error(`Error fetching default status: ${statusError.message}`);
    }
    
    // Extract clients from case data for association later
    const { clients, ...caseInfo } = caseData;
    
    // Create case with default status if not provided
    const { data, error } = await supabase
      .from('cases')
      .insert({
        ...caseInfo,
        status_id: caseInfo.status_id || statusData.id,
        opened_date: caseInfo.opened_date || new Date().toISOString().split('T')[0],
        created_by: caseInfo.created_by || null // Should be the current user ID
      })
      .select();
    
    if (error) {
      console.error('Error creating case:', error);
      throw new Error(`Error creating case: ${error.message}`);
    }
    
    const newCase = data[0];
    
    // If clients are provided, create associations
    if (clients && clients.length > 0) {
      await this.associateClientsWithCase(newCase.id, clients);
    }
    
    // Return the created case with full details
    return await this.getCaseById(newCase.id);
  },
  
  /**
   * Update an existing case
   * @param {string} id - Case UUID
   * @param {Object} caseData - Updated case information
   * @returns {Promise<Object>} - Updated case object
   */
  async updateCase(id, caseData) {
    // Extract clients from case data for association later
    const { clients, ...caseInfo } = caseData;
    
    // Update the case
    const { data, error } = await supabase
      .from('cases')
      .update({
        ...caseInfo,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating case with ID ${id}:`, error);
      throw new Error(`Error updating case: ${error.message}`);
    }
    
    // If clients are provided, update associations
    if (clients !== undefined) {
      // First remove all existing associations
      await this.removeAllClientAssociations(id);
      
      // Then create new associations if any clients are provided
      if (clients && clients.length > 0) {
        await this.associateClientsWithCase(id, clients);
      }
    }
    
    // Return the updated case with full details
    return await this.getCaseById(id);
  },
  
  /**
   * Archive a case
   * @param {string} id - Case UUID
   * @returns {Promise<void>}
   */
  async archiveCase(id) {
    // Get the archive status ID
    const { data: statusData, error: statusError } = await supabase
      .from('case_statuses')
      .select('id')
      .eq('name', 'Archived')
      .single();
    
    if (statusError) {
      console.error('Error fetching archive status:', statusError);
      throw new Error(`Error fetching archive status: ${statusError.message}`);
    }
    
    // Update case to archived status
    const { error } = await supabase
      .from('cases')
      .update({
        is_archived: true,
        status_id: statusData.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error(`Error archiving case with ID ${id}:`, error);
      throw new Error(`Error archiving case: ${error.message}`);
    }
  },
  
  /**
   * Permanently delete a case
   * @param {string} id - Case UUID
   * @returns {Promise<void>}
   */
  async deleteCase(id) {
    // Client-case associations will be automatically deleted due to CASCADE
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting case with ID ${id}:`, error);
      throw new Error(`Error deleting case: ${error.message}`);
    }
  },
  
  /**
   * Get all available case types
   * @returns {Promise<Array>} - Array of case type objects
   */
  async getCaseTypes() {
    const { data, error } = await supabase
      .from('case_types')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      console.error('Error fetching case types:', error);
      throw new Error(`Error fetching case types: ${error.message}`);
    }
    
    return data;
  },
  
  /**
   * Get all available case statuses
   * @returns {Promise<Array>} - Array of case status objects
   */
  async getCaseStatuses() {
    const { data, error } = await supabase
      .from('case_statuses')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (error) {
      console.error('Error fetching case statuses:', error);
      throw new Error(`Error fetching case statuses: ${error.message}`);
    }
    
    return data;
  },
  
  /**
   * Associate clients with a case
   * @param {string} caseId - Case UUID
   * @param {Array} clients - Array of client association objects
   * @returns {Promise<void>}
   */
  async associateClientsWithCase(caseId, clients) {
    // Prepare the associations
    const associations = clients.map(client => ({
      case_id: caseId,
      client_id: client.client_id,
      role: client.role || null,
      is_primary: client.is_primary || false,
      notes: client.notes || null
    }));
    
    const { error } = await supabase
      .from('client_case_associations')
      .insert(associations);
    
    if (error) {
      console.error('Error associating clients with case:', error);
      throw new Error(`Error associating clients with case: ${error.message}`);
    }
  },
  
  /**
   * Remove all client associations for a case
   * @param {string} caseId - Case UUID
   * @returns {Promise<void>}
   */
  async removeAllClientAssociations(caseId) {
    const { error } = await supabase
      .from('client_case_associations')
      .delete()
      .eq('case_id', caseId);
    
    if (error) {
      console.error(`Error removing client associations for case ${caseId}:`, error);
      throw new Error(`Error removing client associations: ${error.message}`);
    }
  },
  
  /**
   * Get all cases for a specific client
   * @param {string} clientId - Client UUID
   * @param {boolean} includeArchived - Whether to include archived cases
   * @returns {Promise<Array>} - Array of case objects
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
    }));
  },
  
  /**
   * Check if a case number already exists
   * @param {string} caseNumber - Case number to check
   * @param {string} excludeId - Optional case ID to exclude from check (for updates)
   * @returns {Promise<boolean>} - True if the case number exists, false otherwise
   */
  async checkCaseNumberExists(caseNumber, excludeId = null) {
    let query = supabase
      .from('cases')
      .select('id')
      .eq('case_number', caseNumber);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error checking case number existence:', error);
      throw new Error(`Error checking case number existence: ${error.message}`);
    }
    
    return data.length > 0;
  },
  
  /**
   * Generate a unique case number
   * @param {string} prefix - Optional prefix for the case number
   * @returns {Promise<string>} - A unique case number
   */
  async generateCaseNumber(prefix = 'CASE') {
    // Get current year
    const year = new Date().getFullYear();
    
    // Count existing cases for this year to generate a sequential number
    const { count, error } = await supabase
      .from('cases')
      .select('id', { count: 'exact', head: true })
      .like('case_number', `${prefix}-${year}-%`);
    
    if (error) {
      console.error('Error counting cases:', error);
      throw new Error(`Error generating case number: ${error.message}`);
    }
    
    // Generate a case number with format: PREFIX-YEAR-SEQUENTIAL (e.g., CASE-2023-0001)
    const sequentialNumber = String(count + 1).padStart(4, '0');
    const caseNumber = `${prefix}-${year}-${sequentialNumber}`;
    
    // Check if by chance this number already exists
    const exists = await this.checkCaseNumberExists(caseNumber);
    if (exists) {
      // If it exists, try again with a different number
      return this.generateCaseNumber(prefix);
    }
    
    return caseNumber;
  }
};

export default caseService; 