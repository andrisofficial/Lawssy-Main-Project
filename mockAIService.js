/**
 * Mock AI Service Module
 * 
 * This module provides mock implementations for AI-related functions that would typically
 * connect to a real AI service like OpenAI in a production environment.
 */

// Helper function to generate random response delay (100-2000ms)
const randomDelay = () => Math.floor(Math.random() * 1900) + 100;

// Helper function to generate random text
const generateRandomText = (wordCount) => {
  const words = ['legal', 'document', 'contract', 'clause', 'agreement', 'party', 'law', 'case', 'court', 'client',
                'service', 'provision', 'liability', 'obligation', 'rights', 'term', 'dispute', 'resolution',
                'confidential', 'disclosure', 'severability', 'jurisdiction', 'governing', 'indemnification'];
  
  let result = '';
  for (let i = 0; i < wordCount; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    result += randomWord + ' ';
  }
  return result.trim();
};

// Analyze document and return mock insights
const analyzeDocument = (document, options = {}) => {
  return {
    documentId: document.id,
    name: document.name,
    analysis: {
      documentType: 'Contract',
      legalCompliance: 'High',
      riskAssessment: {
        riskLevel: 'Medium',
        keyRisks: [
          'Ambiguous termination clause',
          'Missing liability limits',
          'Unclear jurisdiction'
        ]
      },
      languages: ['English'],
      partyInformation: [
        { name: 'Company A', role: 'Service Provider' },
        { name: 'Company B', role: 'Client' }
      ],
      sentimentScore: 0.68,
      complexity: {
        score: 7.4,
        readabilityLevel: 'Advanced',
        averageSentenceLength: 24.6
      }
    },
    timestamp: new Date().toISOString(),
    processingTime: randomDelay()
  };
};

// Generate a document summary
const summarizeDocument = (document, options = {}) => {
  const length = options.length || 'medium';
  
  let wordCount;
  switch (length) {
    case 'short': wordCount = 50; break;
    case 'medium': wordCount = 150; break;
    case 'long': wordCount = 300; break;
    default: wordCount = 150;
  }
  
  return {
    documentId: document.id,
    name: document.name,
    summary: generateRandomText(wordCount),
    keyPoints: [
      'This agreement establishes a service relationship between the parties',
      'Service fees are payable within 30 days of invoice',
      'Initial term is 24 months with automatic renewal',
      'Either party may terminate with 60 days notice'
    ],
    timestamp: new Date().toISOString(),
    processingTime: randomDelay()
  };
};

// Extract metadata from a document
const extractMetadata = (document) => {
  return {
    documentId: document.id,
    name: document.name,
    metadata: {
      documentType: 'Service Agreement',
      parties: ['Company A', 'Company B'],
      effectiveDate: '2023-01-15',
      executionDate: '2023-01-10',
      termLength: '24 months',
      governingLaw: 'State of Delaware',
      signatories: [
        { name: 'John Smith', title: 'CEO', company: 'Company A' },
        { name: 'Jane Doe', title: 'CFO', company: 'Company B' }
      ],
      totalPages: 12,
      containsExhibits: true
    },
    confidence: 0.89,
    timestamp: new Date().toISOString(),
    processingTime: randomDelay()
  };
};

// Suggest tags for document organization
const suggestTags = (document) => {
  const possibleTags = ['contract', 'legal', 'agreement', 'service', 'confidential', 
                       'financial', 'employment', 'vendor', 'client', 'corporate',
                       'draft', 'executed', 'pending', 'template'];
  
  // Select random 3-7 tags
  const tagCount = Math.floor(Math.random() * 5) + 3;
  const tags = [];
  for (let i = 0; i < tagCount; i++) {
    const randomTag = possibleTags[Math.floor(Math.random() * possibleTags.length)];
    if (!tags.includes(randomTag)) {
      tags.push(randomTag);
    }
  }
  
  return {
    documentId: document.id,
    name: document.name,
    suggestedTags: tags,
    confidence: 0.85,
    timestamp: new Date().toISOString()
  };
};

// Compare multiple documents
const compareDocuments = (documents, options = {}) => {
  return {
    documentIds: documents.map(doc => doc.id),
    documentNames: documents.map(doc => doc.name),
    comparison: {
      similarityScore: 0.72,
      keyDifferences: [
        'Payment terms differ: Net 30 vs. Net 45',
        'Termination notice periods: 60 days vs. 90 days',
        'Liability cap: $1M vs. $2M',
        'Governing law: Delaware vs. New York'
      ],
      commonElements: [
        'Confidentiality provisions',
        'Force majeure clauses',
        'Intellectual property protections',
        'Indemnification requirements'
      ]
    },
    timestamp: new Date().toISOString(),
    processingTime: randomDelay() * documents.length
  };
};

// Extract clauses from a document
const extractClauses = (document, options = {}) => {
  const clauseTypes = options.clauseTypes || ['all'];
  
  const allClauses = [
    { type: 'confidentiality', title: 'Confidentiality', text: generateRandomText(30) },
    { type: 'termination', title: 'Termination', text: generateRandomText(40) },
    { type: 'indemnification', title: 'Indemnification', text: generateRandomText(35) },
    { type: 'payment', title: 'Payment Terms', text: generateRandomText(25) },
    { type: 'intellectual_property', title: 'Intellectual Property', text: generateRandomText(45) },
    { type: 'dispute_resolution', title: 'Dispute Resolution', text: generateRandomText(50) },
    { type: 'governing_law', title: 'Governing Law', text: generateRandomText(20) },
    { type: 'force_majeure', title: 'Force Majeure', text: generateRandomText(40) }
  ];
  
  let clauses;
  if (clauseTypes.includes('all')) {
    clauses = allClauses;
  } else {
    clauses = allClauses.filter(clause => clauseTypes.includes(clause.type));
  }
  
  return {
    documentId: document.id,
    name: document.name,
    clauses,
    timestamp: new Date().toISOString(),
    processingTime: randomDelay()
  };
};

module.exports = {
  analyzeDocument,
  summarizeDocument,
  extractMetadata,
  suggestTags,
  compareDocuments,
  extractClauses
}; 