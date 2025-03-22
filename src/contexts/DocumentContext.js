import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as documentService from '../services/documentService';
import * as aiService from '../services/aiService';

const DocumentContext = createContext();

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }) => {
  // Document Repository State
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentPath, setCurrentPath] = useState(['My Documents']);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Document Templates State
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Document Analytics State
  const [documentStats, setDocumentStats] = useState([]);
  const [documentActivity, setDocumentActivity] = useState([]);
  const [typeDistribution, setTypeDistribution] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);
  
  // Document Search State
  const [searchResults, setSearchResults] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    documentTypes: [],
    tags: [],
    authors: [],
    dateRange: [null, null],
    sizeRange: [0, 100]
  });
  
  // AI Integration State
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [documentSummary, setDocumentSummary] = useState('');
  
  // Workflow State
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  
  // Compliance State
  const [auditTrail, setAuditTrail] = useState([]);
  const [retentionPolicies, setRetentionPolicies] = useState([]);
  const [legalHolds, setLegalHolds] = useState([]);
  
  // Backup State
  const [backupHistory, setBackupHistory] = useState([]);
  const [automaticBackup, setAutomaticBackup] = useState(true);
  
  // Document Repository Functions
  const fetchDocumentsAndFolders = useCallback(async (folderId = null) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [documentsData, foldersData] = await Promise.all([
        documentService.fetchDocuments(folderId),
        documentService.fetchFolders(folderId)
      ]);
      
      setDocuments(documentsData);
      setFolders(foldersData);
      setCurrentFolderId(folderId);
    } catch (err) {
      setError('Failed to fetch documents and folders');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const navigateToFolder = useCallback(async (folder, index) => {
    if (index !== undefined) {
      // Navigate using breadcrumb
      const newPath = currentPath.slice(0, index + 1);
      setCurrentPath(newPath);
      
      // Get the folder ID for the last item in the path
      const targetFolderId = index === 0 ? null : folder.id;
      await fetchDocumentsAndFolders(targetFolderId);
    } else {
      // Navigate by clicking on a folder
      setCurrentPath([...currentPath, folder.name]);
      await fetchDocumentsAndFolders(folder.id);
    }
  }, [currentPath, fetchDocumentsAndFolders]);
  
  const createNewFolder = useCallback(async (folderName) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const folderData = {
        name: folderName,
        parentId: currentFolderId
      };
      
      const newFolder = await documentService.createFolder(folderData);
      setFolders([...folders, newFolder]);
      return newFolder;
    } catch (err) {
      setError('Failed to create folder');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId, folders]);
  
  const uploadNewDocument = useCallback(async (files, metadata, onProgress) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Append files
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      // Append metadata
      formData.append('metadata', JSON.stringify({
        ...metadata,
        folderId: currentFolderId
      }));
      
      const uploadedDocuments = await documentService.uploadDocument(formData, onProgress);
      setDocuments([...documents, ...uploadedDocuments]);
      return uploadedDocuments;
    } catch (err) {
      setError('Failed to upload documents');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId, documents]);
  
  const deleteExistingDocument = useCallback(async (documentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await documentService.deleteDocument(documentId);
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (err) {
      setError('Failed to delete document');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [documents]);
  
  const shareDocumentWithUsers = useCallback(async (documentId, users, permissions) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const shareData = {
        users,
        permissions
      };
      
      const result = await documentService.shareDocument(documentId, shareData);
      return result;
    } catch (err) {
      setError('Failed to share document');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchDocumentVersionHistory = useCallback(async (documentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const versions = await documentService.getDocumentVersions(documentId);
      return versions;
    } catch (err) {
      setError('Failed to fetch document versions');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const restoreDocumentToVersion = useCallback(async (documentId, versionId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const restoredDocument = await documentService.restoreDocumentVersion(documentId, versionId);
      
      // Update the document in the state
      setDocuments(documents.map(doc => 
        doc.id === documentId ? restoredDocument : doc
      ));
      
      return restoredDocument;
    } catch (err) {
      setError('Failed to restore document version');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [documents]);
  
  // Document Search Functions
  const searchForDocuments = useCallback(async (query, filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await documentService.searchDocuments(query, filters);
      setSearchResults(results);
      return results;
    } catch (err) {
      setError('Failed to search documents');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const updateSearchFilters = useCallback((newFilters) => {
    setSearchFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);
  
  // Document Templates Functions
  const fetchTemplatesByCategory = useCallback(async (category = 'all') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const templatesData = await documentService.fetchTemplates(category);
      setTemplates(templatesData);
      setSelectedCategory(category);
      return templatesData;
    } catch (err) {
      setError('Failed to fetch templates');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const createNewTemplate = useCallback(async (templateData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newTemplate = await documentService.createTemplate(templateData);
      setTemplates([...templates, newTemplate]);
      return newTemplate;
    } catch (err) {
      setError('Failed to create template');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [templates]);
  
  const updateExistingTemplate = useCallback(async (templateId, templateData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedTemplate = await documentService.updateTemplate(templateId, templateData);
      
      setTemplates(templates.map(template => 
        template.id === templateId ? updatedTemplate : template
      ));
      
      return updatedTemplate;
    } catch (err) {
      setError('Failed to update template');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [templates]);
  
  const deleteExistingTemplate = useCallback(async (templateId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await documentService.deleteTemplate(templateId);
      setTemplates(templates.filter(template => template.id !== templateId));
    } catch (err) {
      setError('Failed to delete template');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [templates]);
  
  const useExistingTemplate = useCallback(async (templateId, documentData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newDocument = await documentService.useTemplate(templateId, documentData);
      setDocuments([...documents, newDocument]);
      return newDocument;
    } catch (err) {
      setError('Failed to use template');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [documents]);
  
  // Document Analytics Functions
  const fetchAnalyticsData = useCallback(async (dateRange = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [stats, activity, distribution, timeline] = await Promise.all([
        documentService.fetchDocumentStats(dateRange),
        documentService.fetchDocumentActivity(dateRange),
        documentService.fetchDocumentTypeDistribution(),
        documentService.fetchActivityTimeline(dateRange)
      ]);
      
      setDocumentStats(stats);
      setDocumentActivity(activity);
      setTypeDistribution(distribution);
      setActivityTimeline(timeline);
      
      return {
        stats,
        activity,
        distribution,
        timeline
      };
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const generateAnalyticsReport = useCallback(async (reportType, dateRange = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const reportBlob = await documentService.generateReport(reportType, dateRange);
      
      // Create a download link for the report
      const url = window.URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      return reportBlob;
    } catch (err) {
      setError('Failed to generate report');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // AI Integration Functions
  const analyzeDocumentWithAI = useCallback(async (documentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await aiService.analyzeDocument(documentId);
      setAiAnalysis(analysis);
      return analysis;
    } catch (err) {
      setError('Failed to analyze document');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const extractMetadataWithAI = useCallback(async (documentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const metadata = await aiService.extractMetadata(documentId);
      return metadata;
    } catch (err) {
      setError('Failed to extract metadata');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const getSuggestedTagsWithAI = useCallback(async (documentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const tags = await aiService.suggestTags(documentId);
      setSuggestedTags(tags);
      return tags;
    } catch (err) {
      setError('Failed to suggest tags');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const summarizeDocumentWithAI = useCallback(async (documentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const summary = await aiService.summarizeDocument(documentId);
      setDocumentSummary(summary);
      return summary;
    } catch (err) {
      setError('Failed to summarize document');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const compareDocumentsWithAI = useCallback(async (documentIds) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const comparison = await aiService.compareDocuments(documentIds);
      return comparison;
    } catch (err) {
      setError('Failed to compare documents');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const extractClausesWithAI = useCallback(async (documentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const clauses = await aiService.extractClauses(documentId);
      return clauses;
    } catch (err) {
      setError('Failed to extract clauses');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Workflow Functions
  const startDocumentWorkflow = useCallback(async (documentId, workflowData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const workflow = await documentService.initiateWorkflow(documentId, workflowData);
      setWorkflows([...workflows, workflow]);
      setActiveWorkflow(workflow);
      return workflow;
    } catch (err) {
      setError('Failed to start workflow');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [workflows]);
  
  const checkWorkflowStatus = useCallback(async (workflowId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const workflow = await documentService.getWorkflowStatus(workflowId);
      
      // Update the workflow in the state
      setWorkflows(workflows.map(wf => 
        wf.id === workflowId ? workflow : wf
      ));
      
      if (activeWorkflow && activeWorkflow.id === workflowId) {
        setActiveWorkflow(workflow);
      }
      
      return workflow;
    } catch (err) {
      setError('Failed to check workflow status');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [workflows, activeWorkflow]);
  
  const updateWorkflowStepStatus = useCallback(async (workflowId, stepId, stepData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedWorkflow = await documentService.updateWorkflowStep(workflowId, stepId, stepData);
      
      // Update the workflow in the state
      setWorkflows(workflows.map(wf => 
        wf.id === workflowId ? updatedWorkflow : wf
      ));
      
      if (activeWorkflow && activeWorkflow.id === workflowId) {
        setActiveWorkflow(updatedWorkflow);
      }
      
      return updatedWorkflow;
    } catch (err) {
      setError('Failed to update workflow step');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [workflows, activeWorkflow]);
  
  // Compliance Functions
  const fetchDocumentAuditTrail = useCallback(async (documentId, dateRange = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const trail = await documentService.getAuditTrail(documentId, dateRange);
      setAuditTrail(trail);
      return trail;
    } catch (err) {
      setError('Failed to fetch audit trail');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const applyDocumentRetentionPolicy = useCallback(async (documentIds, policyId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await documentService.applyRetentionPolicy(documentIds, policyId);
      return result;
    } catch (err) {
      setError('Failed to apply retention policy');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const applyDocumentLegalHold = useCallback(async (documentIds, holdData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await documentService.applyLegalHold(documentIds, holdData);
      return result;
    } catch (err) {
      setError('Failed to apply legal hold');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const scanDocumentForSensitiveData = useCallback(async (documentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const scanResult = await documentService.scanForSensitiveData(documentId);
      return scanResult;
    } catch (err) {
      setError('Failed to scan for sensitive data');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Backup Functions
  const backupSelectedDocuments = useCallback(async (documentIds) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const backup = await documentService.backupDocuments(documentIds);
      return backup;
    } catch (err) {
      setError('Failed to backup documents');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const restoreFromBackup = useCallback(async (backupId, documentIds = []) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const restoredDocuments = await documentService.restoreBackup(backupId, documentIds);
      
      // Refresh documents after restore
      await fetchDocumentsAndFolders(currentFolderId);
      
      return restoredDocuments;
    } catch (err) {
      setError('Failed to restore from backup');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId, fetchDocumentsAndFolders]);
  
  const fetchBackupHistoryList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const history = await documentService.getBackupHistory();
      setBackupHistory(history);
      return history;
    } catch (err) {
      setError('Failed to fetch backup history');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const toggleAutomaticBackupSetting = useCallback(async (enabled) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await documentService.toggleAutomaticBackup(enabled);
      setAutomaticBackup(enabled);
      return result;
    } catch (err) {
      setError('Failed to toggle automatic backup');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initialize data on component mount
  useEffect(() => {
    fetchDocumentsAndFolders();
    fetchTemplatesByCategory('all');
    fetchAnalyticsData();
    fetchBackupHistoryList();
  }, [fetchDocumentsAndFolders, fetchTemplatesByCategory, fetchAnalyticsData, fetchBackupHistoryList]);
  
  const value = {
    // Document Repository State
    documents,
    folders,
    currentPath,
    currentFolderId,
    isLoading,
    error,
    
    // Document Templates State
    templates,
    selectedCategory,
    
    // Document Analytics State
    documentStats,
    documentActivity,
    typeDistribution,
    activityTimeline,
    
    // Document Search State
    searchResults,
    searchFilters,
    
    // AI Integration State
    aiAnalysis,
    suggestedTags,
    documentSummary,
    
    // Workflow State
    workflows,
    activeWorkflow,
    
    // Compliance State
    auditTrail,
    retentionPolicies,
    legalHolds,
    
    // Backup State
    backupHistory,
    automaticBackup,
    
    // Document Repository Functions
    fetchDocumentsAndFolders,
    navigateToFolder,
    createNewFolder,
    uploadNewDocument,
    deleteExistingDocument,
    shareDocumentWithUsers,
    fetchDocumentVersionHistory,
    restoreDocumentToVersion,
    
    // Document Search Functions
    searchForDocuments,
    updateSearchFilters,
    
    // Document Templates Functions
    fetchTemplatesByCategory,
    createNewTemplate,
    updateExistingTemplate,
    deleteExistingTemplate,
    useExistingTemplate,
    
    // Document Analytics Functions
    fetchAnalyticsData,
    generateAnalyticsReport,
    
    // AI Integration Functions
    analyzeDocumentWithAI,
    extractMetadataWithAI,
    getSuggestedTagsWithAI,
    summarizeDocumentWithAI,
    compareDocumentsWithAI,
    extractClausesWithAI,
    
    // Workflow Functions
    startDocumentWorkflow,
    checkWorkflowStatus,
    updateWorkflowStepStatus,
    
    // Compliance Functions
    fetchDocumentAuditTrail,
    applyDocumentRetentionPolicy,
    applyDocumentLegalHold,
    scanDocumentForSensitiveData,
    
    // Backup Functions
    backupSelectedDocuments,
    restoreFromBackup,
    fetchBackupHistoryList,
    toggleAutomaticBackupSetting
  };
  
  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentContext; 