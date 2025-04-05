import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Tooltip,
  Divider,
  Alert,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';
import { Document, Page, pdfjs } from 'react-pdf';
import * as documentService from '../../services/documentService';

// Set up worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentPreview = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Document loader function
  const loadDocument = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch document metadata
      const documentData = await documentService.fetchDocuments(null, { documentId });
      if (documentData && documentData.length > 0) {
        setDocument(documentData[0]);
        setFileType(documentData[0].type);
      } else {
        throw new Error('Document not found');
      }

      // Fetch document preview data as blob
      const previewBlob = await documentService.previewDocument(documentId);
      
      // Create a URL for the blob
      const url = URL.createObjectURL(previewBlob);
      setPreviewUrl(url);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading document:', err);
      setError(err.message || 'Failed to load document preview');
      setLoading(false);
    }
  }, [documentId]);

  // Cleanup function for URL object
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Load document on mount
  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  // PDF document handlers
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handlePreviousPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  const handleRotateClockwise = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  };

  const handleRotateCounterClockwise = () => {
    setRotation(prevRotation => (prevRotation - 90 + 360) % 360);
  };

  const handleDownload = async () => {
    try {
      // Create a new anchor element
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = document?.name || `document-${documentId}.${fileType}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading document:', err);
      setError('Failed to download document');
    }
  };

  const handlePrint = () => {
    if (!previewUrl) return;
    
    const printWindow = window.open(previewUrl, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Render appropriate preview based on file type
  const renderPreview = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      );
    }

    // Determine file type (from extension or MIME type)
    const fileExtension = fileType?.toLowerCase();

    // PDF preview
    if (fileExtension === 'pdf') {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <IconButton onClick={handleZoomOut} disabled={scale <= 0.5}>
              <ZoomOutIcon />
            </IconButton>
            <Typography sx={{ mx: 2, lineHeight: '40px' }}>
              {Math.round(scale * 100)}%
            </Typography>
            <IconButton onClick={handleZoomIn} disabled={scale >= 3}>
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={handleRotateCounterClockwise}>
              <RotateLeftIcon />
            </IconButton>
            <IconButton onClick={handleRotateClockwise}>
              <RotateRightIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <IconButton onClick={handlePreviousPage} disabled={pageNumber <= 1}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography sx={{ mx: 2, lineHeight: '40px' }}>
              Page {pageNumber} of {numPages}
            </Typography>
            <IconButton onClick={handleNextPage} disabled={pageNumber >= numPages}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Paper elevation={2} sx={{ p: 2, overflow: 'auto', maxHeight: '600px' }}>
            <Document
              file={previewUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => setError('Error loading PDF: ' + error.message)}
              loading={<CircularProgress />}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </Paper>
        </Box>
      );
    }

    // Image preview
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <IconButton onClick={handleZoomOut} disabled={scale <= 0.5}>
              <ZoomOutIcon />
            </IconButton>
            <Typography sx={{ mx: 2, lineHeight: '40px' }}>
              {Math.round(scale * 100)}%
            </Typography>
            <IconButton onClick={handleZoomIn} disabled={scale >= 3}>
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={handleRotateCounterClockwise}>
              <RotateLeftIcon />
            </IconButton>
            <IconButton onClick={handleRotateClockwise}>
              <RotateRightIcon />
            </IconButton>
          </Box>
          <Paper elevation={2} sx={{ p: 2, overflow: 'hidden' }}>
            <img
              src={previewUrl}
              alt={document?.name || 'Document preview'}
              style={{
                maxWidth: '100%',
                maxHeight: '600px',
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease'
              }}
            />
          </Paper>
        </Box>
      );
    }

    // Text preview (simple approach)
    if (['txt', 'csv', 'json', 'xml', 'html', 'md'].includes(fileExtension)) {
      return (
        <Paper elevation={2} sx={{ p: 2, overflowX: 'auto', maxHeight: '600px' }}>
          <iframe
            src={previewUrl}
            title={document?.name || 'Text document'}
            style={{ width: '100%', height: '600px', border: 'none' }}
          />
        </Paper>
      );
    }

    // Unsupported file type
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Preview is not available for this file type. Please download the file to view it.
      </Alert>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link 
              sx={{ cursor: 'pointer' }} 
              color="inherit" 
              onClick={handleBack}
            >
              Documents
            </Link>
            <Typography color="text.primary">
              {document?.name || 'Document Preview'}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" sx={{ mt: 1 }}>
            {document?.name || 'Document Preview'}
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={!previewUrl}
          sx={{ mr: 1 }}
        >
          Download
        </Button>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          disabled={!previewUrl || fileType !== 'pdf'}
          sx={{ mr: 1 }}
        >
          Print
        </Button>
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          disabled={!document}
          sx={{ mr: 1 }}
        >
          Share
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Preview Area */}
        <Grid item xs={12} md={9}>
          {renderPreview()}
        </Grid>

        {/* Document Metadata */}
        <Grid item xs={12} md={3}>
          <Card elevation={1} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {document ? (
                <>
                  <Typography variant="body2" gutterBottom>
                    <strong>Type:</strong> {document.type.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Size:</strong> {document.size}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Created by:</strong> {document.createdBy}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Modified:</strong> {document.modified}
                  </Typography>

                  {document.tags && document.tags.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Tags:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {document.tags.map((tag, index) => (
                          <Typography 
                            key={index} 
                            variant="body2" 
                            component="span" 
                            sx={{ 
                              bgcolor: 'rgba(0, 0, 0, 0.04)', 
                              px: 1, 
                              py: 0.5, 
                              borderRadius: 1 
                            }}
                          >
                            {tag}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                </>
              ) : loading ? (
                <CircularProgress size={24} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No document information available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentPreview; 