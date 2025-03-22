import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Chip,
  Card,
  CardContent,
  CardActions,
  TextField,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  SummarizeOutlined, 
  AnalyticsOutlined, 
  TagOutlined, 
  CompareOutlined, 
  ExtensionOutlined,
  DescriptionOutlined,
  ContentPasteSearchOutlined,
  AutoAwesomeOutlined,
  ExpandMore,
  ContentCopyOutlined,
  CheckCircleOutline,
  ErrorOutline
} from '@mui/icons-material';
import { useDocuments } from '../../contexts/DocumentContext';

const DocumentAI = () => {
  const { 
    documents, 
    aiAnalysis, 
    suggestedTags, 
    documentSummary,
    isLoading, 
    error,
    analyzeDocumentWithAI,
    extractMetadataWithAI,
    getSuggestedTagsWithAI,
    summarizeDocumentWithAI,
    compareDocumentsWithAI,
    extractClausesWithAI
  } = useDocuments();

  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [secondDocumentId, setSecondDocumentId] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [metadata, setMetadata] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [clauses, setClauses] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDocumentSelect = (event) => {
    setSelectedDocumentId(event.target.value);
  };

  const handleSecondDocumentSelect = (event) => {
    setSecondDocumentId(event.target.value);
  };

  const handleAnalyze = async () => {
    if (!selectedDocumentId) return;
    try {
      await analyzeDocumentWithAI(selectedDocumentId);
    } catch (err) {
      console.error('Error analyzing document:', err);
    }
  };

  const handleExtractMetadata = async () => {
    if (!selectedDocumentId) return;
    try {
      const result = await extractMetadataWithAI(selectedDocumentId);
      setMetadata(result);
    } catch (err) {
      console.error('Error extracting metadata:', err);
    }
  };

  const handleGetSuggestedTags = async () => {
    if (!selectedDocumentId) return;
    try {
      await getSuggestedTagsWithAI(selectedDocumentId);
    } catch (err) {
      console.error('Error getting suggested tags:', err);
    }
  };

  const handleSummarize = async () => {
    if (!selectedDocumentId) return;
    try {
      await summarizeDocumentWithAI(selectedDocumentId);
    } catch (err) {
      console.error('Error summarizing document:', err);
    }
  };

  const handleCompare = async () => {
    if (!selectedDocumentId || !secondDocumentId) return;
    try {
      const result = await compareDocumentsWithAI([selectedDocumentId, secondDocumentId]);
      setComparison(result);
    } catch (err) {
      console.error('Error comparing documents:', err);
    }
  };

  const handleExtractClauses = async () => {
    if (!selectedDocumentId) return;
    try {
      const result = await extractClausesWithAI(selectedDocumentId);
      setClauses(result);
    } catch (err) {
      console.error('Error extracting clauses:', err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderDocumentSelector = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>Select a document to analyze</Typography>
      <TextField
        select
        fullWidth
        label="Document"
        value={selectedDocumentId}
        onChange={handleDocumentSelect}
        SelectProps={{
          native: true,
        }}
        variant="outlined"
      >
        <option value="">Select a document</option>
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name}
          </option>
        ))}
      </TextField>
    </Box>
  );

  const renderSummaryTab = () => (
    <Box>
      {renderDocumentSelector()}
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<SummarizeOutlined />}
        onClick={handleSummarize}
        disabled={!selectedDocumentId || isLoading}
        sx={{ mb: 3 }}
      >
        Generate Summary
      </Button>
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {documentSummary && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Document Summary</Typography>
              <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                <IconButton onClick={() => copyToClipboard(documentSummary)}>
                  {copied ? <CheckCircleOutline color="success" /> : <ContentCopyOutlined />}
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">
              {documentSummary}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderAnalysisTab = () => (
    <Box>
      {renderDocumentSelector()}
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AnalyticsOutlined />}
        onClick={handleAnalyze}
        disabled={!selectedDocumentId || isLoading}
        sx={{ mb: 3 }}
      >
        Analyze Document
      </Button>
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {aiAnalysis && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>AI Analysis Results</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">Key Insights</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {aiAnalysis.insights.map((insight, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <AutoAwesomeOutlined color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={insight} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">Document Structure</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {aiAnalysis.structure.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <DescriptionOutlined />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.title} 
                        secondary={`Page ${item.page}, ${item.paragraphs} paragraphs`} 
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">Risk Assessment</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {aiAnalysis.risks.map((risk, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          borderLeft: '4px solid', 
                          borderLeftColor: 
                            risk.level === 'high' ? 'error.main' : 
                            risk.level === 'medium' ? 'warning.main' : 'success.main'
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {risk.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {risk.description}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip 
                            size="small" 
                            label={risk.level.toUpperCase()} 
                            color={
                              risk.level === 'high' ? 'error' : 
                              risk.level === 'medium' ? 'warning' : 'success'
                            }
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderTagsTab = () => (
    <Box>
      {renderDocumentSelector()}
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<TagOutlined />}
        onClick={handleGetSuggestedTags}
        disabled={!selectedDocumentId || isLoading}
        sx={{ mb: 3 }}
      >
        Suggest Tags
      </Button>
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {suggestedTags && suggestedTags.length > 0 && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Suggested Tags</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestedTags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  color="primary" 
                  variant="outlined" 
                  sx={{ m: 0.5 }} 
                />
              ))}
            </Box>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Apply All Tags
            </Button>
            <Button size="small">
              Clear
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );

  const renderMetadataTab = () => (
    <Box>
      {renderDocumentSelector()}
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<ContentPasteSearchOutlined />}
        onClick={handleExtractMetadata}
        disabled={!selectedDocumentId || isLoading}
        sx={{ mb: 3 }}
      >
        Extract Metadata
      </Button>
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {metadata && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Extracted Metadata</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {Object.entries(metadata).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {typeof value === 'string' ? value : JSON.stringify(value)}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderCompareTab = () => (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" gutterBottom>First Document</Typography>
          <TextField
            select
            fullWidth
            label="Document 1"
            value={selectedDocumentId}
            onChange={handleDocumentSelect}
            SelectProps={{
              native: true,
            }}
            variant="outlined"
          >
            <option value="">Select a document</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" gutterBottom>Second Document</Typography>
          <TextField
            select
            fullWidth
            label="Document 2"
            value={secondDocumentId}
            onChange={handleSecondDocumentSelect}
            SelectProps={{
              native: true,
            }}
            variant="outlined"
          >
            <option value="">Select a document</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </TextField>
        </Grid>
      </Grid>
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<CompareOutlined />}
        onClick={handleCompare}
        disabled={!selectedDocumentId || !secondDocumentId || isLoading}
        sx={{ mb: 3 }}
      >
        Compare Documents
      </Button>
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {comparison && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Comparison Results</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Similarity Score</Typography>
              <Box sx={{ 
                height: 10, 
                width: '100%', 
                bgcolor: 'grey.200', 
                borderRadius: 5,
                mb: 1
              }}>
                <Box 
                  sx={{ 
                    height: '100%', 
                    width: `${comparison.similarityScore}%`, 
                    bgcolor: 'primary.main', 
                    borderRadius: 5 
                  }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {comparison.similarityScore}% similar
              </Typography>
            </Box>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">Key Differences</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {comparison.differences.map((diff, index) => (
                    <ListItem key={index} divider={index < comparison.differences.length - 1}>
                      <ListItemText 
                        primary={diff.section} 
                        secondary={diff.description} 
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">Common Elements</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {comparison.commonElements.map((element, index) => (
                    <ListItem key={index} divider={index < comparison.commonElements.length - 1}>
                      <ListItemText 
                        primary={element.section} 
                        secondary={element.description} 
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderClausesTab = () => (
    <Box>
      {renderDocumentSelector()}
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<ExtensionOutlined />}
        onClick={handleExtractClauses}
        disabled={!selectedDocumentId || isLoading}
        sx={{ mb: 3 }}
      >
        Extract Clauses
      </Button>
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {clauses && clauses.length > 0 && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Extracted Clauses</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {clauses.map((clause, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1">{clause.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" gutterBottom color="text.secondary">
                    Type: {clause.type} | Page: {clause.page} | Risk Level: {clause.riskLevel}
                  </Typography>
                  <Typography variant="body1">
                    {clause.text}
                  </Typography>
                  {clause.notes && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>AI Notes:</Typography>
                      <Typography variant="body2">
                        {clause.notes}
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderSummaryTab();
      case 1:
        return renderAnalysisTab();
      case 2:
        return renderTagsTab();
      case 3:
        return renderMetadataTab();
      case 4:
        return renderCompareTab();
      case 5:
        return renderClausesTab();
      default:
        return renderSummaryTab();
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>AI Document Assistant</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Leverage AI to analyze, extract information, and gain insights from your legal documents.
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Summary" icon={<SummarizeOutlined />} iconPosition="start" />
          <Tab label="Analysis" icon={<AnalyticsOutlined />} iconPosition="start" />
          <Tab label="Tags" icon={<TagOutlined />} iconPosition="start" />
          <Tab label="Metadata" icon={<ContentPasteSearchOutlined />} iconPosition="start" />
          <Tab label="Compare" icon={<CompareOutlined />} iconPosition="start" />
          <Tab label="Clauses" icon={<ExtensionOutlined />} iconPosition="start" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {renderTabContent()}
        </Box>
      </Paper>
    </Box>
  );
};

export default DocumentAI; 