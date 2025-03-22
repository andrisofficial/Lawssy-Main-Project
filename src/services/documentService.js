import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Document Repository API calls
export const fetchDocuments = async (folderId = null, filters = {}) => {
  try {
    const params = { ...filters };
    if (folderId) params.folderId = folderId;
    
    const response = await axios.get(`${API_URL}/documents`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const fetchFolders = async (parentFolderId = null) => {
  try {
    const params = {};
    if (parentFolderId) params.parentId = parentFolderId;
    
    const response = await axios.get(`${API_URL}/folders`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
};

export const createFolder = async (folderData) => {
  try {
    const response = await axios.post(`${API_URL}/folders`, folderData);
    return response.data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

export const uploadDocument = async (formData, onUploadProgress) => {
  try {
    const response = await axios.post(`${API_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onUploadProgress) onUploadProgress(percentCompleted);
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const deleteDocument = async (documentId) => {
  try {
    const response = await axios.delete(`${API_URL}/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const shareDocument = async (documentId, shareData) => {
  try {
    const response = await axios.post(`${API_URL}/documents/${documentId}/share`, shareData);
    return response.data;
  } catch (error) {
    console.error('Error sharing document:', error);
    throw error;
  }
};

export const getDocumentVersions = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/documents/${documentId}/versions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document versions:', error);
    throw error;
  }
};

export const restoreDocumentVersion = async (documentId, versionId) => {
  try {
    const response = await axios.post(`${API_URL}/documents/${documentId}/versions/${versionId}/restore`);
    return response.data;
  } catch (error) {
    console.error('Error restoring document version:', error);
    throw error;
  }
};

// Document Search API calls
export const searchDocuments = async (query, filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/documents/search`, { 
      params: { 
        query,
        ...filters
      } 
    });
    return response.data;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
};

// Document Templates API calls
export const fetchTemplates = async (category = null) => {
  try {
    const params = {};
    if (category && category !== 'all') params.category = category;
    
    const response = await axios.get(`${API_URL}/templates`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const createTemplate = async (templateData) => {
  try {
    const response = await axios.post(`${API_URL}/templates`, templateData);
    return response.data;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

export const updateTemplate = async (templateId, templateData) => {
  try {
    const response = await axios.put(`${API_URL}/templates/${templateId}`, templateData);
    return response.data;
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
};

export const deleteTemplate = async (templateId) => {
  try {
    const response = await axios.delete(`${API_URL}/templates/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
};

export const useTemplate = async (templateId, documentData) => {
  try {
    const response = await axios.post(`${API_URL}/templates/${templateId}/use`, documentData);
    return response.data;
  } catch (error) {
    console.error('Error using template:', error);
    throw error;
  }
};

// Document Analytics API calls
export const fetchDocumentStats = async (dateRange = {}) => {
  try {
    const response = await axios.get(`${API_URL}/analytics/stats`, { params: dateRange });
    return response.data;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    throw error;
  }
};

export const fetchDocumentActivity = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/analytics/activity`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching document activity:', error);
    throw error;
  }
};

export const fetchDocumentTypeDistribution = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/type-distribution`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document type distribution:', error);
    throw error;
  }
};

export const fetchActivityTimeline = async (dateRange = {}) => {
  try {
    const response = await axios.get(`${API_URL}/analytics/timeline`, { params: dateRange });
    return response.data;
  } catch (error) {
    console.error('Error fetching activity timeline:', error);
    throw error;
  }
};

export const generateReport = async (reportType, dateRange = {}) => {
  try {
    const response = await axios.get(`${API_URL}/analytics/reports/${reportType}`, { 
      params: dateRange,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

// AI Integration API calls
export const analyzeDocument = async (documentId) => {
  try {
    const response = await axios.post(`${API_URL}/ai/analyze/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
};

export const extractDocumentMetadata = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/ai/extract-metadata/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error extracting document metadata:', error);
    throw error;
  }
};

export const suggestTags = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/ai/suggest-tags/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error suggesting tags:', error);
    throw error;
  }
};

export const summarizeDocument = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/ai/summarize/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error summarizing document:', error);
    throw error;
  }
};

export const compareDocuments = async (documentIds) => {
  try {
    const response = await axios.post(`${API_URL}/ai/compare`, { documentIds });
    return response.data;
  } catch (error) {
    console.error('Error comparing documents:', error);
    throw error;
  }
};

export const extractClauses = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/ai/extract-clauses/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error extracting clauses:', error);
    throw error;
  }
};

// Document Workflow API calls
export const initiateWorkflow = async (documentId, workflowData) => {
  try {
    const response = await axios.post(`${API_URL}/workflows`, { 
      documentId,
      ...workflowData
    });
    return response.data;
  } catch (error) {
    console.error('Error initiating workflow:', error);
    throw error;
  }
};

export const getWorkflowStatus = async (workflowId) => {
  try {
    const response = await axios.get(`${API_URL}/workflows/${workflowId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting workflow status:', error);
    throw error;
  }
};

export const updateWorkflowStep = async (workflowId, stepId, stepData) => {
  try {
    const response = await axios.put(`${API_URL}/workflows/${workflowId}/steps/${stepId}`, stepData);
    return response.data;
  } catch (error) {
    console.error('Error updating workflow step:', error);
    throw error;
  }
};

// Document Compliance API calls
export const getAuditTrail = async (documentId, dateRange = {}) => {
  try {
    const response = await axios.get(`${API_URL}/compliance/audit-trail/${documentId}`, { params: dateRange });
    return response.data;
  } catch (error) {
    console.error('Error getting audit trail:', error);
    throw error;
  }
};

export const applyRetentionPolicy = async (documentIds, policyId) => {
  try {
    const response = await axios.post(`${API_URL}/compliance/retention-policy`, { 
      documentIds,
      policyId
    });
    return response.data;
  } catch (error) {
    console.error('Error applying retention policy:', error);
    throw error;
  }
};

export const applyLegalHold = async (documentIds, holdData) => {
  try {
    const response = await axios.post(`${API_URL}/compliance/legal-hold`, { 
      documentIds,
      ...holdData
    });
    return response.data;
  } catch (error) {
    console.error('Error applying legal hold:', error);
    throw error;
  }
};

export const scanForSensitiveData = async (documentId) => {
  try {
    const response = await axios.post(`${API_URL}/compliance/scan/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error scanning for sensitive data:', error);
    throw error;
  }
};

// Document Backup API calls
export const backupDocuments = async (documentIds) => {
  try {
    const response = await axios.post(`${API_URL}/backup`, { documentIds });
    return response.data;
  } catch (error) {
    console.error('Error backing up documents:', error);
    throw error;
  }
};

export const restoreBackup = async (backupId, documentIds = []) => {
  try {
    const response = await axios.post(`${API_URL}/backup/${backupId}/restore`, { documentIds });
    return response.data;
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw error;
  }
};

export const getBackupHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/backup/history`);
    return response.data;
  } catch (error) {
    console.error('Error getting backup history:', error);
    throw error;
  }
};

export const toggleAutomaticBackup = async (enabled) => {
  try {
    const response = await axios.put(`${API_URL}/backup/settings`, { enabled });
    return response.data;
  } catch (error) {
    console.error('Error toggling automatic backup:', error);
    throw error;
  }
}; 