import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert
} from '@mui/material';
import MainLayout from '../../components/layout/MainLayout';
import CaseForm from '../../components/cases/CaseForm';
import caseService from '../../services/caseService/caseService';

const EditCasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch case data on component mount
  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        const data = await caseService.getCaseById(id);
        setCaseData(data);
      } catch (error) {
        console.error('Error fetching case:', error);
        setError('Failed to load case details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCase();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      const updatedCase = await caseService.updateCase(id, formData);
      console.log('Case updated:', updatedCase);
      navigate(`/cases/${id}`);
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  };

  // Helper function to get case name for breadcrumbs
  const getCaseName = () => {
    if (!caseData) return '';
    return caseData.title || caseData.case_number || 'Untitled Case';
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink component={Link} to="/dashboard" underline="hover" color="inherit">
              Dashboard
            </MuiLink>
            <MuiLink component={Link} to="/cases" underline="hover" color="inherit">
              Cases
            </MuiLink>
            <MuiLink 
              component={Link} 
              to={`/cases/${id}`} 
              underline="hover" 
              color="inherit"
            >
              {loading ? 'Loading...' : getCaseName()}
            </MuiLink>
            <Typography color="text.primary">Edit</Typography>
          </Breadcrumbs>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Page Title */}
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            Edit Case: {loading ? '...' : getCaseName()}
          </Typography>

          {/* Case Form or Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : caseData ? (
            <CaseForm 
              caseData={caseData} 
              onSubmit={handleSubmit} 
              mode="edit" 
            />
          ) : (
            <Alert severity="warning">
              Case not found. The case may have been deleted or you don't have permission to edit it.
            </Alert>
          )}
        </Box>
      </Container>
    </MainLayout>
  );
};

export default EditCasePage; 