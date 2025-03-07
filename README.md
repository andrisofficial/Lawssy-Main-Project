# Legal Document Management System

A comprehensive document management system for legal professionals, featuring AI-powered document analysis, organization, and collaboration tools.

## Features

- **Document Repository**: Securely store, organize, and manage all your legal documents in one place
- **AI Document Analysis**: Leverage AI to analyze, extract information, and gain insights from legal documents
- **Document Templates**: Create, manage, and use templates for common legal documents
- **Document Analytics**: Track document usage, activity, and generate reports
- **Time Tracking**: Monitor time spent on document-related tasks
- **Collaboration Tools**: Share documents, track versions, and collaborate with team members

## AI Features

- **Document Summarization**: Generate concise summaries of lengthy legal documents
- **Risk Analysis**: Identify potential risks and issues in legal documents
- **Clause Extraction**: Automatically extract and categorize important clauses
- **Document Comparison**: Compare two documents and highlight differences
- **Metadata Extraction**: Extract key metadata from documents
- **Tag Suggestion**: Get AI-suggested tags for better document organization

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/legal-document-management.git
   cd legal-document-management
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   This will start both the React frontend and the Express backend server.

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Running in Production

1. Build the React application:
   ```
   npm run build
   ```

2. Start the server:
   ```
   npm run server
   ```

## Project Structure

- `/src` - React frontend code
  - `/components` - UI components
  - `/contexts` - React context providers
  - `/services` - API service functions
  - `/pages` - Page components
  - `/utils` - Utility functions
- `/server.js` - Express backend server
- `/mockAIService.js` - Mock AI service for development

## Backend API

The backend API is built with Express and provides the following endpoints:

### Document Management

- `GET /api/documents` - Get all documents
- `GET /api/folders` - Get all folders
- `POST /api/folders` - Create a new folder
- `POST /api/documents/upload` - Upload a new document
- `DELETE /api/documents/:id` - Delete a document

### AI Endpoints

- `POST /api/ai/analyze/:documentId` - Analyze a document
- `POST /api/ai/summarize/:documentId` - Summarize a document
- `GET /api/ai/metadata/:documentId` - Extract metadata from a document
- `GET /api/ai/tags/:documentId` - Suggest tags for a document
- `POST /api/ai/compare` - Compare two documents
- `POST /api/ai/clauses/:documentId` - Extract clauses from a document
- `GET /api/ai/classify/:documentId` - Classify a document
- `POST /api/ai/entities/:documentId` - Extract entities from a document

## Integration with Real AI Services

The current implementation uses mock AI services for development purposes. To integrate with real AI services:

1. Create an account with an AI provider (e.g., OpenAI, Azure AI, etc.)
2. Obtain API keys
3. Replace the mock AI service calls in the backend with actual API calls

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the UI components
- React for the frontend framework
- Express for the backend server
