/**
 * Mock AI Service
 * 
 * This service simulates AI functionality for testing purposes.
 * In a production environment, this would be replaced with calls to actual AI services
 * like OpenAI, Azure AI, or other NLP/ML services.
 */

// Mock document analysis
const analyzeDocument = (document, options = {}) => {
  // Simulate processing time
  const processingDelay = options.quick ? 500 : 2000;
  
  // Return mock analysis data
  return {
    documentId: document.id,
    documentName: document.name,
    analysisTimestamp: new Date().toISOString(),
    insights: [
      "This document appears to be a legal contract with standard indemnification clauses.",
      "Several sections contain potentially ambiguous language that may require clarification.",
      "The termination clause has non-standard conditions that may pose risks.",
      "Multiple references to third-party agreements that are not defined within this document."
    ],
    structure: [
      { title: "Introduction", page: 1, paragraphs: 3 },
      { title: "Definitions", page: 1, paragraphs: 8 },
      { title: "Terms and Conditions", page: 2, paragraphs: 12 },
      { title: "Payment Terms", page: 4, paragraphs: 5 },
      { title: "Termination", page: 5, paragraphs: 7 },
      { title: "Indemnification", page: 6, paragraphs: 4 },
      { title: "Miscellaneous", page: 7, paragraphs: 9 }
    ],
    risks: [
      {
        title: "Ambiguous Termination Conditions",
        description: "Section 5.3 contains language that could be interpreted in multiple ways regarding the notice period for termination.",
        level: "high"
      },
      {
        title: "Missing Liability Cap",
        description: "The indemnification clause does not specify a maximum liability amount, which could expose parties to unlimited risk.",
        level: "high"
      },
      {
        title: "Undefined Third-Party References",
        description: "The document references external agreements without providing definitions or specific terms.",
        level: "medium"
      },
      {
        title: "Inconsistent Naming Conventions",
        description: "The document uses different terms to refer to the same parties throughout the text.",
        level: "low"
      }
    ],
    confidence: 0.87
  };
};

// Mock document summarization
const summarizeDocument = (document, options = {}) => {
  // Return mock summary
  return `This legal agreement, dated ${new Date().toLocaleDateString()}, establishes a business relationship between the parties for the provision of professional services. 

The document outlines the terms and conditions governing the engagement, including payment terms (net 30 days), confidentiality obligations, and intellectual property rights. Key provisions include a termination clause allowing either party to terminate with 30 days' written notice, mutual indemnification for third-party claims, and a governing law provision specifying jurisdiction in the state of Delaware.

Notable aspects include: (1) a non-solicitation clause with a 12-month duration, (2) absence of a specific liability cap in the indemnification provisions, and (3) requirements for written consent for any assignment of rights or obligations under the agreement.

The agreement appears to be a standard service contract with some potential areas for clarification, particularly regarding the scope of indemnification and the specific definition of confidential information.`;
};

// Mock metadata extraction
const extractMetadata = (document) => {
  return {
    title: document.name.replace(/\.[^/.]+$/, ""),
    author: "John Smith",
    organization: "Acme Corporation",
    createdDate: "2023-05-15T10:30:00Z",
    lastModifiedDate: "2023-06-02T14:45:00Z",
    documentType: "Legal Contract",
    pageCount: 12,
    wordCount: 4328,
    language: "English",
    parties: ["Acme Corporation", "XYZ Enterprises"],
    effectiveDate: "2023-07-01T00:00:00Z",
    expirationDate: "2025-06-30T23:59:59Z",
    status: "Draft",
    version: "2.1",
    keywords: ["service agreement", "professional services", "consulting", "confidentiality"]
  };
};

// Mock tag suggestion
const suggestTags = (document) => {
  // Return mock tags based on document type
  const documentType = document.type || '';
  
  if (documentType.includes('pdf')) {
    return ["contract", "legal", "agreement", "confidential", "business", "services", "professional", "draft", "2023", "corporate"];
  } else if (documentType.includes('doc') || documentType.includes('word')) {
    return ["memo", "internal", "policy", "corporate", "guidelines", "procedures", "compliance", "department", "review"];
  } else if (documentType.includes('ppt') || documentType.includes('presentation')) {
    return ["presentation", "slides", "meeting", "quarterly", "review", "strategy", "business", "proposal"];
  } else {
    return ["document", "important", "review", "business", "reference", "archive"];
  }
};

// Mock document comparison
const compareDocuments = (documents, options = {}) => {
  // Ensure we have exactly 2 documents
  if (documents.length !== 2) {
    throw new Error('Document comparison requires exactly 2 documents');
  }
  
  // Generate a random similarity score between 60% and 95%
  const similarityScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
  
  return {
    documentIds: documents.map(doc => doc.id),
    documentNames: documents.map(doc => doc.name),
    comparisonTimestamp: new Date().toISOString(),
    similarityScore: similarityScore,
    differences: [
      {
        section: "Payment Terms",
        description: "Document 1 specifies Net 30 payment terms, while Document 2 requires Net 45."
      },
      {
        section: "Termination Clause",
        description: "Document 1 requires 30 days notice for termination, Document 2 requires 60 days."
      },
      {
        section: "Indemnification",
        description: "Document 1 includes mutual indemnification, Document 2 has one-sided indemnification favoring the client."
      },
      {
        section: "Intellectual Property",
        description: "Document 1 assigns all IP to the client, Document 2 includes a license but not full assignment."
      }
    ],
    commonElements: [
      {
        section: "Confidentiality",
        description: "Both documents contain identical confidentiality provisions with 5-year duration."
      },
      {
        section: "Governing Law",
        description: "Both documents specify Delaware as the governing jurisdiction."
      },
      {
        section: "Force Majeure",
        description: "Both documents include substantially similar force majeure clauses."
      }
    ]
  };
};

// Mock clause extraction
const extractClauses = (document, options = {}) => {
  return [
    {
      title: "Confidentiality Clause",
      type: "Confidentiality",
      text: "Each party agrees to maintain the confidentiality of any proprietary information received from the other party for a period of five (5) years from the date of disclosure.",
      page: 3,
      riskLevel: "low",
      notes: "Standard confidentiality clause with typical 5-year duration."
    },
    {
      title: "Termination Clause",
      type: "Termination",
      text: "Either party may terminate this Agreement upon thirty (30) days written notice to the other party. In the event of termination, Client shall pay Service Provider for all services performed up to the date of termination.",
      page: 5,
      riskLevel: "medium",
      notes: "The termination notice period is shorter than industry standard. Consider extending to 60 days."
    },
    {
      title: "Indemnification Clause",
      type: "Indemnification",
      text: "Each party shall indemnify, defend and hold harmless the other party from and against any and all claims, damages, liabilities, costs and expenses, including reasonable attorneys' fees, arising out of or related to the indemnifying party's breach of this Agreement.",
      page: 6,
      riskLevel: "high",
      notes: "This indemnification clause lacks a liability cap, which creates unlimited risk exposure."
    },
    {
      title: "Intellectual Property Clause",
      type: "Intellectual Property",
      text: "All intellectual property created by Service Provider in the course of providing services under this Agreement shall be the sole and exclusive property of Client. Service Provider hereby assigns all rights, title and interest in such intellectual property to Client.",
      page: 4,
      riskLevel: "medium",
      notes: "This is a full IP assignment clause without any carve-outs for Service Provider's pre-existing IP."
    },
    {
      title: "Governing Law Clause",
      type: "Governing Law",
      text: "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without giving effect to any choice of law or conflict of law provisions.",
      page: 7,
      riskLevel: "low",
      notes: "Standard governing law provision."
    }
  ];
};

// Mock document classification
const classifyDocument = (document) => {
  return {
    documentId: document.id,
    documentName: document.name,
    primaryType: "Service Agreement",
    confidence: 0.92,
    secondaryTypes: [
      { type: "Consulting Agreement", confidence: 0.78 },
      { type: "Non-Disclosure Agreement", confidence: 0.45 }
    ],
    legalCategory: "Commercial Contracts",
    industry: "Professional Services",
    complexity: "Medium",
    riskLevel: "Moderate"
  };
};

// Mock entity extraction
const extractEntities = (document, entityTypes = []) => {
  // Default entity types if none provided
  const types = entityTypes.length > 0 ? entityTypes : ['person', 'organization', 'date', 'money', 'location'];
  
  const allEntities = {
    person: [
      { text: "John Smith", position: { page: 1, paragraph: 1 }, role: "Signatory" },
      { text: "Jane Doe", position: { page: 1, paragraph: 1 }, role: "Signatory" },
      { text: "Robert Johnson", position: { page: 8, paragraph: 2 }, role: "Witness" }
    ],
    organization: [
      { text: "Acme Corporation", position: { page: 1, paragraph: 1 }, role: "Party" },
      { text: "XYZ Enterprises", position: { page: 1, paragraph: 1 }, role: "Party" },
      { text: "First National Bank", position: { page: 4, paragraph: 3 }, role: "Third Party" }
    ],
    date: [
      { text: "January 15, 2023", position: { page: 1, paragraph: 1 }, description: "Effective Date" },
      { text: "December 31, 2025", position: { page: 2, paragraph: 4 }, description: "Termination Date" },
      { text: "Net 30 days", position: { page: 4, paragraph: 2 }, description: "Payment Terms" }
    ],
    money: [
      { text: "$50,000", position: { page: 3, paragraph: 2 }, description: "Contract Value" },
      { text: "$5,000 per month", position: { page: 3, paragraph: 3 }, description: "Retainer Fee" },
      { text: "$250 per hour", position: { page: 3, paragraph: 4 }, description: "Hourly Rate" }
    ],
    location: [
      { text: "State of Delaware", position: { page: 7, paragraph: 1 }, description: "Governing Law" },
      { text: "City of Wilmington", position: { page: 7, paragraph: 1 }, description: "Jurisdiction" },
      { text: "123 Main Street, Suite 400", position: { page: 1, paragraph: 2 }, description: "Business Address" }
    ]
  };
  
  // Filter entities based on requested types
  const result = {};
  types.forEach(type => {
    if (allEntities[type]) {
      result[type] = allEntities[type];
    }
  });
  
  return result;
};

module.exports = {
  analyzeDocument,
  summarizeDocument,
  extractMetadata,
  suggestTags,
  compareDocuments,
  extractClauses,
  classifyDocument,
  extractEntities
}; 