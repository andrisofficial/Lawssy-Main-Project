const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Mock AI service (in a real app, this would connect to an AI service like OpenAI)
const mockAIService = require('./mockAIService');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Mock database
let documents = [];
let folders = [
  { id: 'root', name: 'My Documents', parentId: null }
];

// API Routes

// Document Repository Endpoints
app.get('/api/documents', (req, res) => {
  const { folderId } = req.query;
  const filteredDocs = folderId 
    ? documents.filter(doc => doc.folderId === folderId)
    : documents.filter(doc => !doc.folderId);
  
  res.json(filteredDocs);
});

app.get('/api/folders', (req, res) => {
  const { parentId } = req.query;
  const filteredFolders = parentId 
    ? folders.filter(folder => folder.parentId === parentId)
    : folders.filter(folder => !folder.parentId || folder.parentId === 'root');
  
  res.json(filteredFolders);
});

app.post('/api/folders', (req, res) => {
  const newFolder = {
    id: uuidv4(),
    name: req.body.name,
    parentId: req.body.parentId || null,
    createdAt: new Date().toISOString()
  };
  
  folders.push(newFolder);
  res.status(201).json(newFolder);
});

app.post('/api/documents/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const newDocument = {
    id: uuidv4(),
    name: file.originalname,
    path: file.path,
    size: file.size,
    type: file.mimetype,
    folderId: req.body.folderId || null,
    uploadedAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };
  
  documents.push(newDocument);
  res.status(201).json(newDocument);
});

app.delete('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  const docIndex = documents.findIndex(doc => doc.id === id);
  
  if (docIndex === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  const deletedDoc = documents.splice(docIndex, 1)[0];
  
  // Delete the file if it exists
  if (deletedDoc.path && fs.existsSync(deletedDoc.path)) {
    fs.unlinkSync(deletedDoc.path);
  }
  
  res.json({ message: 'Document deleted successfully' });
});

// AI Endpoints
app.post('/api/ai/analyze/:documentId', (req, res) => {
  const { documentId } = req.params;
  const options = req.body;
  
  const document = documents.find(doc => doc.id === documentId);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  // In a real app, this would call an AI service
  const analysis = mockAIService.analyzeDocument(document, options);
  res.json(analysis);
});

app.post('/api/ai/summarize/:documentId', (req, res) => {
  const { documentId } = req.params;
  const options = req.body;
  
  const document = documents.find(doc => doc.id === documentId);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  // In a real app, this would call an AI service
  const summary = mockAIService.summarizeDocument(document, options);
  res.json(summary);
});

app.get('/api/ai/metadata/:documentId', (req, res) => {
  const { documentId } = req.params;
  
  const document = documents.find(doc => doc.id === documentId);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  // In a real app, this would call an AI service
  const metadata = mockAIService.extractMetadata(document);
  res.json(metadata);
});

app.get('/api/ai/tags/:documentId', (req, res) => {
  const { documentId } = req.params;
  
  const document = documents.find(doc => doc.id === documentId);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  // In a real app, this would call an AI service
  const tags = mockAIService.suggestTags(document);
  res.json(tags);
});

app.post('/api/ai/compare', (req, res) => {
  const { documentIds, options } = req.body;
  
  const docsToCompare = documents.filter(doc => documentIds.includes(doc.id));
  if (docsToCompare.length !== documentIds.length) {
    return res.status(404).json({ error: 'One or more documents not found' });
  }
  
  // In a real app, this would call an AI service
  const comparison = mockAIService.compareDocuments(docsToCompare, options);
  res.json(comparison);
});

app.post('/api/ai/clauses/:documentId', (req, res) => {
  const { documentId } = req.params;
  const options = req.body;
  
  const document = documents.find(doc => doc.id === documentId);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  // In a real app, this would call an AI service
  const clauses = mockAIService.extractClauses(document, options);
  res.json(clauses);
});

app.get('/api/ai/classify/:documentId', (req, res) => {
  const { documentId } = req.params;
  
  const document = documents.find(doc => doc.id === documentId);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  // In a real app, this would call an AI service
  const classification = mockAIService.classifyDocument(document);
  res.json(classification);
});

app.post('/api/ai/entities/:documentId', (req, res) => {
  const { documentId } = req.params;
  const { entityTypes } = req.body;
  
  const document = documents.find(doc => doc.id === documentId);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  // In a real app, this would call an AI service
  const entities = mockAIService.extractEntities(document, entityTypes);
  res.json(entities);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 