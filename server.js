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

// Mock tasks database
let tasks = [];

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

// Task Endpoints
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find(task => task.id === parseInt(id));
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json(task);
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    auditLog: [
      {
        action: 'created',
        userId: req.body.userId || 201, // Default user ID if not provided
        userName: req.body.userName || 'System User', // Default user name if not provided
        timestamp: new Date().toISOString()
      }
    ]
  };
  
  // Check for conflicts if there's a case reference
  if (newTask.caseReference) {
    // This is a simplified conflict check - in a real app, this would query a database
    const caseName = newTask.caseReference.title.toLowerCase();
    
    // Sample conflict database
    const conflictDatabase = [
      {
        id: 'conflict1',
        clientName: 'Johnson',
        opposingParty: 'Smith',
        reason: 'Previously represented opposing party'
      },
      {
        id: 'conflict2',
        clientName: 'Williams',
        opposingParty: 'Davis',
        reason: 'Financial interest in outcome'
      }
    ];
    
    for (const conflict of conflictDatabase) {
      if (
        caseName.includes(conflict.clientName.toLowerCase()) ||
        caseName.includes(conflict.opposingParty.toLowerCase())
      ) {
        newTask.conflict = {
          ...conflict,
          caseReference: newTask.caseReference
        };
        break;
      }
    }
  }
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const oldTask = tasks[taskIndex];
  
  // Determine what fields changed
  const changedFields = Object.keys(req.body).filter(key => {
    if (key === 'auditLog' || key === 'updatedAt' || key === 'createdAt') return false;
    if (typeof req.body[key] === 'object' && req.body[key] !== null) {
      return JSON.stringify(req.body[key]) !== JSON.stringify(oldTask[key]);
    }
    return req.body[key] !== oldTask[key];
  });
  
  // Check for conflicts if case reference changed
  let conflict = oldTask.conflict;
  if (
    req.body.caseReference && 
    (!oldTask.caseReference || 
     oldTask.caseReference.id !== req.body.caseReference.id)
  ) {
    // This is a simplified conflict check - in a real app, this would query a database
    const caseName = req.body.caseReference.title.toLowerCase();
    
    // Sample conflict database
    const conflictDatabase = [
      {
        id: 'conflict1',
        clientName: 'Johnson',
        opposingParty: 'Smith',
        reason: 'Previously represented opposing party'
      },
      {
        id: 'conflict2',
        clientName: 'Williams',
        opposingParty: 'Davis',
        reason: 'Financial interest in outcome'
      }
    ];
    
    for (const conflict of conflictDatabase) {
      if (
        caseName.includes(conflict.clientName.toLowerCase()) ||
        caseName.includes(conflict.opposingParty.toLowerCase())
      ) {
        conflict = {
          ...conflict,
          caseReference: req.body.caseReference
        };
        break;
      }
    }
  }
  
  // Create a new audit log entry
  const auditLogEntry = {
    action: 'updated',
    userId: req.body.userId || 201, // Default user ID if not provided
    userName: req.body.userName || 'System User', // Default user name if not provided
    timestamp: new Date().toISOString(),
    changes: changedFields
  };
  
  // Update the task
  const updatedTask = {
    ...oldTask,
    ...req.body,
    updatedAt: new Date().toISOString(),
    auditLog: [...(oldTask.auditLog || []), auditLogEntry],
    conflict
  };
  
  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  res.json({ success: true });
});

app.post('/api/tasks/:id/subtasks', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const task = tasks[taskIndex];
  
  const newSubtask = {
    id: task.subtasks ? Math.max(...task.subtasks.map(subtask => subtask.id), 0) + 1 : 1,
    ...req.body,
    status: req.body.status || 'to-do'
  };
  
  const updatedTask = {
    ...task,
    subtasks: [...(task.subtasks || []), newSubtask],
    updatedAt: new Date().toISOString(),
    auditLog: [
      ...(task.auditLog || []),
      {
        action: 'subtask_added',
        userId: req.body.userId || 201,
        userName: req.body.userName || 'System User',
        timestamp: new Date().toISOString(),
        changes: ['subtasks']
      }
    ]
  };
  
  tasks[taskIndex] = updatedTask;
  res.status(201).json(updatedTask);
});

app.put('/api/tasks/:taskId/subtasks/:subtaskId', (req, res) => {
  const { taskId, subtaskId } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === parseInt(taskId));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const task = tasks[taskIndex];
  
  if (!task.subtasks) {
    return res.status(404).json({ error: 'Task has no subtasks' });
  }
  
  const subtaskIndex = task.subtasks.findIndex(subtask => subtask.id === parseInt(subtaskId));
  
  if (subtaskIndex === -1) {
    return res.status(404).json({ error: 'Subtask not found' });
  }
  
  const updatedSubtasks = [...task.subtasks];
  updatedSubtasks[subtaskIndex] = {
    ...updatedSubtasks[subtaskIndex],
    ...req.body
  };
  
  const updatedTask = {
    ...task,
    subtasks: updatedSubtasks,
    updatedAt: new Date().toISOString(),
    auditLog: [
      ...(task.auditLog || []),
      {
        action: 'subtask_updated',
        userId: req.body.userId || 201,
        userName: req.body.userName || 'System User',
        timestamp: new Date().toISOString(),
        changes: ['subtasks']
      }
    ]
  };
  
  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

app.post('/api/tasks/:id/comments', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const task = tasks[taskIndex];
  
  const newComment = {
    id: task.comments ? Math.max(...task.comments.map(comment => comment.id), 0) + 1 : 1,
    ...req.body,
    timestamp: new Date().toISOString()
  };
  
  const updatedTask = {
    ...task,
    comments: [...(task.comments || []), newComment],
    updatedAt: new Date().toISOString(),
    auditLog: [
      ...(task.auditLog || []),
      {
        action: 'comment_added',
        userId: req.body.userId || 201,
        userName: req.body.userName || 'System User',
        timestamp: new Date().toISOString(),
        changes: ['comments']
      }
    ]
  };
  
  tasks[taskIndex] = updatedTask;
  res.status(201).json(updatedTask);
});

app.post('/api/tasks/:id/time', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const task = tasks[taskIndex];
  
  const timeEntry = {
    id: task.timeTracking && task.timeTracking.entries ? 
      Math.max(...task.timeTracking.entries.map(entry => entry.id), 0) + 1 : 1,
    ...req.body,
    timestamp: new Date().toISOString()
  };
  
  const currentTimeTracking = task.timeTracking || {
    estimatedHours: 0,
    loggedHours: 0,
    billable: false,
    entries: []
  };
  
  const updatedTimeTracking = {
    ...currentTimeTracking,
    loggedHours: currentTimeTracking.loggedHours + (parseFloat(req.body.hours) || 0),
    entries: [...(currentTimeTracking.entries || []), timeEntry]
  };
  
  const updatedTask = {
    ...task,
    timeTracking: updatedTimeTracking,
    updatedAt: new Date().toISOString(),
    auditLog: [
      ...(task.auditLog || []),
      {
        action: 'time_logged',
        userId: req.body.userId || 201,
        userName: req.body.userName || 'System User',
        timestamp: new Date().toISOString(),
        changes: ['timeTracking']
      }
    ]
  };
  
  tasks[taskIndex] = updatedTask;
  res.status(201).json(updatedTask);
});

app.post('/api/tasks/:id/attachments', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const task = tasks[taskIndex];
  
  const newAttachment = {
    id: task.attachments ? Math.max(...task.attachments.map(attachment => attachment.id), 0) + 1 : 1,
    name: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    type: req.file.mimetype,
    uploadedAt: new Date().toISOString()
  };
  
  const updatedTask = {
    ...task,
    attachments: [...(task.attachments || []), newAttachment],
    updatedAt: new Date().toISOString(),
    auditLog: [
      ...(task.auditLog || []),
      {
        action: 'attachment_added',
        userId: req.body.userId || 201,
        userName: req.body.userName || 'System User',
        timestamp: new Date().toISOString(),
        changes: ['attachments']
      }
    ]
  };
  
  tasks[taskIndex] = updatedTask;
  res.status(201).json(updatedTask);
});

app.post('/api/tasks/:id/recurring', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const task = tasks[taskIndex];
  
  if (!task.recurrence || !task.recurrence.pattern) {
    return res.status(400).json({ error: 'Task is not recurring' });
  }
  
  // Calculate next occurrence date
  let nextDueDate = null;
  const dueDate = new Date(task.dueDate);
  const interval = task.recurrence.interval || 1;
  
  switch (task.recurrence.pattern) {
    case 'daily':
      nextDueDate = new Date(dueDate);
      nextDueDate.setDate(nextDueDate.getDate() + interval);
      break;
    case 'weekly':
      nextDueDate = new Date(dueDate);
      nextDueDate.setDate(nextDueDate.getDate() + (interval * 7));
      break;
    case 'monthly':
      nextDueDate = new Date(dueDate);
      nextDueDate.setMonth(nextDueDate.getMonth() + interval);
      break;
    default:
      return res.status(400).json({ error: 'Invalid recurrence pattern' });
  }
  
  const newTask = {
    ...task,
    id: Math.max(...tasks.map(t => t.id)) + 1,
    title: `${task.title} (Recurring)`,
    status: 'to-do',
    dueDate: nextDueDate.toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parentTaskId: task.id,
    auditLog: [
      {
        action: 'created',
        userId: req.body.userId || 201,
        userName: req.body.userName || 'System User',
        timestamp: new Date().toISOString(),
        changes: ['recurring']
      }
    ]
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.get('/api/tasks/conflicts/check', (req, res) => {
  const { caseId, caseTitle } = req.query;
  
  if (!caseId && !caseTitle) {
    return res.status(400).json({ error: 'Case ID or title is required' });
  }
  
  // This is a simplified conflict check - in a real app, this would query a database
  let caseName = caseTitle ? caseTitle.toLowerCase() : '';
  
  if (!caseName && caseId) {
    // Find the case by ID in a real app
    // For this mock, we'll just return no conflict
    return res.json(null);
  }
  
  // Sample conflict database
  const conflictDatabase = [
    {
      id: 'conflict1',
      clientName: 'Johnson',
      opposingParty: 'Smith',
      reason: 'Previously represented opposing party'
    },
    {
      id: 'conflict2',
      clientName: 'Williams',
      opposingParty: 'Davis',
      reason: 'Financial interest in outcome'
    }
  ];
  
  for (const conflict of conflictDatabase) {
    if (
      caseName.includes(conflict.clientName.toLowerCase()) ||
      caseName.includes(conflict.opposingParty.toLowerCase())
    ) {
      return res.json(conflict);
    }
  }
  
  res.json(null);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 