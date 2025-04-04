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
const port = process.env.PORT || 5050;

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

// In-memory storage
let users = [];
let documents = [];
let folders = [
  { id: 'root', name: 'My Documents', parentId: null }
];
let clients = [];
let matters = [];
let notes = [];
let templates = [];
let timeEntries = [];
let events = [];

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

app.post('/api/documents/extract-entities', (req, res) => {
  const { document, entityTypes } = req.body;
  
  // In a real app, this would call an AI service
  const entities = mockAIService.extractEntities(document, entityTypes);
  res.json(entities);
});

// Billing and Invoicing Endpoints
let invoices = [];
let invoiceLineItems = [];
let payments = [];
let expenses = [];
let trustAccounts = [];
let trustLedgerTransactions = [];

// BI-001: Invoice Generation
app.post('/api/invoices', (req, res) => {
  const { 
    clientId, 
    matterIds, 
    dateRange, 
    selectedTimeEntries, 
    selectedExpenses,
    includeNonBillable, 
    discounts, 
    manualLineItems,
    invoiceDate,
    dueDate,
    notes,
    billingModel,
    template
  } = req.body;
  
  // Generate unique invoice number
  const year = new Date().getFullYear();
  const invoiceCount = invoices.length + 1;
  const invoiceNumber = `INV-${year}-${invoiceCount.toString().padStart(3, '0')}`;
  
  // Calculate total amount
  let totalAmount = 0;
  
  // Process time entries
  if (selectedTimeEntries && selectedTimeEntries.length > 0) {
    selectedTimeEntries.forEach(entryId => {
      const entry = timeEntries.find(te => te.id === entryId);
      if (entry) {
        // Mark as billed
        entry.status = 'billed';
        entry.invoiceId = invoiceNumber;
        
        // Add to invoice line items
        const lineItem = {
          id: uuidv4(),
          invoiceId: invoiceNumber,
          type: 'Time',
          description: entry.description,
          quantity: entry.timeSpent,
          rate: entry.hourlyRate,
          amount: entry.timeSpent * entry.hourlyRate,
          associatedTimeEntryId: entry.id,
          associatedExpenseId: null
        };
        
        invoiceLineItems.push(lineItem);
        totalAmount += lineItem.amount;
      }
    });
  }
  
  // Process expenses
  if (selectedExpenses && selectedExpenses.length > 0) {
    selectedExpenses.forEach(expenseId => {
      const expense = expenses.find(exp => exp.id === expenseId);
      if (expense) {
        // Mark as billed
        expense.status = 'billed';
        expense.invoiceId = invoiceNumber;
        
        // Add to invoice line items
        const lineItem = {
          id: uuidv4(),
          invoiceId: invoiceNumber,
          type: 'Expense',
          description: expense.description,
          quantity: 1,
          rate: expense.amount,
          amount: expense.amount,
          associatedTimeEntryId: null,
          associatedExpenseId: expense.id
        };
        
        invoiceLineItems.push(lineItem);
        totalAmount += lineItem.amount;
      }
    });
  }
  
  // Process manual line items
  if (manualLineItems && manualLineItems.length > 0) {
    manualLineItems.forEach(item => {
      const lineItem = {
        id: uuidv4(),
        invoiceId: invoiceNumber,
        type: item.type, // 'FlatFee', 'Discount', 'Manual'
        description: item.description,
        quantity: item.quantity || 1,
        rate: item.rate || item.amount,
        amount: item.amount,
        associatedTimeEntryId: null,
        associatedExpenseId: null
      };
      
      invoiceLineItems.push(lineItem);
      
      if (item.type === 'Discount') {
        totalAmount -= lineItem.amount;
      } else {
        totalAmount += lineItem.amount;
      }
    });
  }
  
  // Create invoice
  const newInvoice = {
    id: invoiceNumber,
    invoiceNumber,
    clientId,
    matterIds,
    invoiceDate: invoiceDate || new Date().toISOString(),
    dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days later
    totalAmount,
    balanceDue: totalAmount,
    status: 'Draft',
    templateId: template || 'default',
    notes: notes || '',
    billingModel: billingModel || 'hourly',
    createdAt: new Date().toISOString()
  };
  
  invoices.push(newInvoice);
  res.status(201).json({
    invoice: newInvoice,
    lineItems: invoiceLineItems.filter(li => li.invoiceId === invoiceNumber)
  });
});

app.put('/api/invoices/:id/finalize', (req, res) => {
  const { id } = req.params;
  const invoice = invoices.find(inv => inv.id === id);
  
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  
  // Update status
  invoice.status = 'Sent';
  invoice.finalizedAt = new Date().toISOString();
  
  res.json(invoice);
});

app.get('/api/invoices', (req, res) => {
  const { clientId, status, startDate, endDate } = req.query;
  
  let filteredInvoices = [...invoices];
  
  if (clientId) {
    filteredInvoices = filteredInvoices.filter(inv => inv.clientId === clientId);
  }
  
  if (status) {
    filteredInvoices = filteredInvoices.filter(inv => inv.status === status);
  }
  
  if (startDate && endDate) {
    filteredInvoices = filteredInvoices.filter(inv => {
      const invDate = new Date(inv.invoiceDate);
      return invDate >= new Date(startDate) && invDate <= new Date(endDate);
    });
  }
  
  res.json(filteredInvoices);
});

app.get('/api/invoices/:id', (req, res) => {
  const { id } = req.params;
  const invoice = invoices.find(inv => inv.id === id);
  
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  
  const lineItems = invoiceLineItems.filter(li => li.invoiceId === id);
  
  res.json({
    invoice,
    lineItems
  });
});

app.delete('/api/invoices/:id', (req, res) => {
  const { id } = req.params;
  const invoiceIndex = invoices.findIndex(inv => inv.id === id);
  
  if (invoiceIndex === -1) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  
  // Only drafts can be deleted
  if (invoices[invoiceIndex].status !== 'Draft') {
    return res.status(400).json({ error: 'Only draft invoices can be deleted' });
  }
  
  // Remove the invoice
  invoices.splice(invoiceIndex, 1);
  
  // Remove line items
  invoiceLineItems = invoiceLineItems.filter(li => li.invoiceId !== id);
  
  // Update time entries and expenses
  timeEntries.forEach(entry => {
    if (entry.invoiceId === id) {
      entry.invoiceId = null;
      entry.status = 'unbilled';
    }
  });
  
  expenses.forEach(expense => {
    if (expense.invoiceId === id) {
      expense.invoiceId = null;
      expense.status = 'unbilled';
    }
  });
  
  res.json({ message: 'Invoice deleted successfully' });
});

// BI-002: Invoice Templates & Customization
let invoiceTemplates = [
  {
    id: 'default',
    name: 'Default Template',
    logoUrl: null,
    colorScheme: {
      primary: '#1976d2',
      secondary: '#f50057'
    },
    displayColumns: ['date', 'description', 'hours', 'rate', 'amount'],
    headerText: '',
    footerText: 'Thank you for your business!',
    dateFormat: 'MM/dd/yyyy',
    showDetailedDescription: true
  }
];

app.get('/api/invoice-templates', (req, res) => {
  res.json(invoiceTemplates);
});

app.post('/api/invoice-templates', (req, res) => {
  const { 
    name, 
    logoUrl, 
    colorScheme, 
    displayColumns, 
    headerText, 
    footerText, 
    dateFormat,
    showDetailedDescription 
  } = req.body;
  
  const newTemplate = {
    id: uuidv4(),
    name,
    logoUrl,
    colorScheme,
    displayColumns,
    headerText,
    footerText,
    dateFormat,
    showDetailedDescription
  };
  
  invoiceTemplates.push(newTemplate);
  res.status(201).json(newTemplate);
});

app.put('/api/invoice-templates/:id', (req, res) => {
  const { id } = req.params;
  const {
    name, 
    logoUrl, 
    colorScheme, 
    displayColumns, 
    headerText, 
    footerText, 
    dateFormat,
    showDetailedDescription
  } = req.body;
  
  const templateIndex = invoiceTemplates.findIndex(template => template.id === id);
  
  if (templateIndex === -1) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  invoiceTemplates[templateIndex] = {
    ...invoiceTemplates[templateIndex],
    name,
    logoUrl,
    colorScheme,
    displayColumns,
    headerText,
    footerText,
    dateFormat,
    showDetailedDescription
  };
  
  res.json(invoiceTemplates[templateIndex]);
});

// BI-003: Invoice Management & Tracking
app.get('/api/invoices/aging-report', (req, res) => {
  const currentDate = new Date();
  
  const report = {
    current: 0,
    '1-30': 0,
    '31-60': 0,
    '61-90': 0,
    '90+': 0
  };
  
  invoices.forEach(invoice => {
    if (invoice.status !== 'Paid' && invoice.status !== 'Draft') {
      const dueDate = new Date(invoice.dueDate);
      const diffDays = Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        report.current += invoice.balanceDue;
      } else if (diffDays <= 30) {
        report['1-30'] += invoice.balanceDue;
      } else if (diffDays <= 60) {
        report['31-60'] += invoice.balanceDue;
      } else if (diffDays <= 90) {
        report['61-90'] += invoice.balanceDue;
      } else {
        report['90+'] += invoice.balanceDue;
      }
    }
  });
  
  res.json(report);
});

// BI-004: Payment Recording
app.post('/api/payments', (req, res) => {
  const {
    invoiceId,
    clientId,
    amount,
    paymentDate,
    paymentMethod,
    referenceNumber,
    notes,
    depositAccountType
  } = req.body;
  
  // Validate payment
  if (!invoiceId) {
    return res.status(400).json({ error: 'Invoice ID is required' });
  }
  
  const invoice = invoices.find(inv => inv.id === invoiceId);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  
  if (amount > invoice.balanceDue) {
    return res.status(400).json({ error: 'Payment amount cannot exceed balance due' });
  }
  
  // Create payment record
  const newPayment = {
    id: uuidv4(),
    invoiceId,
    clientId: clientId || invoice.clientId,
    amount,
    paymentDate: paymentDate || new Date().toISOString(),
    paymentMethod,
    referenceNumber,
    notes,
    depositAccountType,
    createdAt: new Date().toISOString()
  };
  
  payments.push(newPayment);
  
  // Update invoice balance and status
  invoice.balanceDue -= amount;
  
  if (invoice.balanceDue <= 0) {
    invoice.status = 'Paid';
  } else if (invoice.balanceDue < invoice.totalAmount) {
    invoice.status = 'Partial Payment';
  }
  
  res.status(201).json({
    payment: newPayment,
    invoice
  });
});

app.get('/api/payments', (req, res) => {
  const { invoiceId, clientId } = req.query;
  
  let filteredPayments = [...payments];
  
  if (invoiceId) {
    filteredPayments = filteredPayments.filter(payment => payment.invoiceId === invoiceId);
  }
  
  if (clientId) {
    filteredPayments = filteredPayments.filter(payment => payment.clientId === clientId);
  }
  
  res.json(filteredPayments);
});

// BI-005: Online Payment Integration (Mock Integration)
app.post('/api/payments/online', (req, res) => {
  const { invoiceId, paymentMethod, amount } = req.body;
  
  const invoice = invoices.find(inv => inv.id === invoiceId);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  
  // Simulate payment processing
  const isSuccess = Math.random() > 0.1; // 90% success rate
  
  if (isSuccess) {
    // Create payment record
    const newPayment = {
      id: uuidv4(),
      invoiceId,
      clientId: invoice.clientId,
      amount,
      paymentDate: new Date().toISOString(),
      paymentMethod,
      referenceNumber: `ONLINE-${Date.now()}`,
      notes: 'Online payment',
      depositAccountType: 'Operating',
      createdAt: new Date().toISOString()
    };
    
    payments.push(newPayment);
    
    // Update invoice balance and status
    invoice.balanceDue -= amount;
    
    if (invoice.balanceDue <= 0) {
      invoice.status = 'Paid';
    } else if (invoice.balanceDue < invoice.totalAmount) {
      invoice.status = 'Partial Payment';
    }
    
    res.status(201).json({
      success: true,
      payment: newPayment,
      invoice
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Payment processing failed',
      message: 'The payment gateway declined the transaction.'
    });
  }
});

app.get('/api/payment-methods', (req, res) => {
  // Mock payment methods
  res.json([
    { id: 'credit_card', name: 'Credit Card' },
    { id: 'ach', name: 'ACH Transfer' },
    { id: 'check', name: 'Check' },
    { id: 'wire', name: 'Wire Transfer' },
    { id: 'cash', name: 'Cash' },
    { id: 'trust', name: 'Trust Account' }
  ]);
});

// BI-006: Expense Tracking
app.post('/api/expenses', (req, res) => {
  const {
    matterId,
    date,
    description,
    category,
    amount,
    isBillable,
    receiptUrl
  } = req.body;
  
  const newExpense = {
    id: uuidv4(),
    matterId,
    date: date || new Date().toISOString(),
    description,
    category,
    amount,
    isBillable: isBillable !== false,
    receiptUrl,
    status: 'unbilled',
    invoiceId: null,
    createdAt: new Date().toISOString()
  };
  
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

app.get('/api/expenses', (req, res) => {
  const { matterId, status } = req.query;
  
  let filteredExpenses = [...expenses];
  
  if (matterId) {
    filteredExpenses = filteredExpenses.filter(expense => expense.matterId === matterId);
  }
  
  if (status) {
    filteredExpenses = filteredExpenses.filter(expense => expense.status === status);
  }
  
  res.json(filteredExpenses);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 