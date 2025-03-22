import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// AI Document Analysis
export const analyzeDocument = async (documentId, options = {}) => {
  try {
    const response = await axios.post(`${API_URL}/ai/analyze/${documentId}`, options);
    return response.data;
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
};

// AI Document Summarization
export const summarizeDocument = async (documentId, options = {}) => {
  try {
    const response = await axios.post(`${API_URL}/ai/summarize/${documentId}`, options);
    return response.data;
  } catch (error) {
    console.error('Error summarizing document:', error);
    throw error;
  }
};

// AI Document Metadata Extraction
export const extractMetadata = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/ai/metadata/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error extracting metadata:', error);
    throw error;
  }
};

// AI Document Tag Suggestion
export const suggestTags = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/ai/tags/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error suggesting tags:', error);
    throw error;
  }
};

// AI Document Comparison
export const compareDocuments = async (documentIds, options = {}) => {
  try {
    const response = await axios.post(`${API_URL}/ai/compare`, { documentIds, options });
    return response.data;
  } catch (error) {
    console.error('Error comparing documents:', error);
    throw error;
  }
};

// AI Clause Extraction
export const extractClauses = async (documentId, options = {}) => {
  try {
    const response = await axios.post(`${API_URL}/ai/clauses/${documentId}`, options);
    return response.data;
  } catch (error) {
    console.error('Error extracting clauses:', error);
    throw error;
  }
};

// AI Document Classification
export const classifyDocument = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/ai/classify/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error classifying document:', error);
    throw error;
  }
};

// AI Entity Recognition
export const extractEntities = async (documentId, entityTypes = []) => {
  try {
    const response = await axios.post(`${API_URL}/ai/entities/${documentId}`, { entityTypes });
    return response.data;
  } catch (error) {
    console.error('Error extracting entities:', error);
    throw error;
  }
};

// AI Document Translation
export const translateDocument = async (documentId, targetLanguage) => {
  try {
    const response = await axios.post(`${API_URL}/ai/translate/${documentId}`, { targetLanguage });
    return response.data;
  } catch (error) {
    console.error('Error translating document:', error);
    throw error;
  }
};

// AI Document Redaction
export const redactSensitiveInformation = async (documentId, sensitiveTypes = []) => {
  try {
    const response = await axios.post(`${API_URL}/ai/redact/${documentId}`, { sensitiveTypes });
    return response.data;
  } catch (error) {
    console.error('Error redacting document:', error);
    throw error;
  }
};

// AI Document Question Answering
export const askDocumentQuestion = async (documentId, question) => {
  try {
    const response = await axios.post(`${API_URL}/ai/ask/${documentId}`, { question });
    return response.data;
  } catch (error) {
    console.error('Error asking document question:', error);
    throw error;
  }
};

// AI Document Generation
export const generateDocument = async (templateId, data) => {
  try {
    const response = await axios.post(`${API_URL}/ai/generate`, { templateId, data });
    return response.data;
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
};

// AI Document Validation
export const validateDocument = async (documentId, validationRules = []) => {
  try {
    const response = await axios.post(`${API_URL}/ai/validate/${documentId}`, { validationRules });
    return response.data;
  } catch (error) {
    console.error('Error validating document:', error);
    throw error;
  }
};

// AI Document Sentiment Analysis
export const analyzeSentiment = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL}/ai/sentiment/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
};

// AI Document Keyword Extraction
export const extractKeywords = async (documentId, options = {}) => {
  try {
    const response = await axios.post(`${API_URL}/ai/keywords/${documentId}`, options);
    return response.data;
  } catch (error) {
    console.error('Error extracting keywords:', error);
    throw error;
  }
};

// AI Document Similarity Search
export const findSimilarDocuments = async (documentId, limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/ai/similar/${documentId}?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error finding similar documents:', error);
    throw error;
  }
};

// AI Document OCR Enhancement
export const enhanceOcr = async (documentId) => {
  try {
    const response = await axios.post(`${API_URL}/ai/enhance-ocr/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error enhancing OCR:', error);
    throw error;
  }
};

// AI Document Batch Processing
export const processBatch = async (documentIds, operations = []) => {
  try {
    const response = await axios.post(`${API_URL}/ai/batch-process`, { documentIds, operations });
    return response.data;
  } catch (error) {
    console.error('Error batch processing documents:', error);
    throw error;
  }
}; 