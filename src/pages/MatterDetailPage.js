import React, { useState, useEffect } from 'react';
import { 
  Container,
  Paper,
  Box,
  useTheme
} from '@mui/material';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import MatterDetailHeader from '../components/matters/MatterDetailHeader';
import MatterTabs from '../components/matters/MatterTabs';

const MatterDetailPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [matter, setMatter] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated API call to fetch matter details
  useEffect(() => {
    // This would normally be an API call like:
    // fetch(`/api/matters/${id}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setMatter(data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     setLoading(false);
    //   });

    // For now, we'll simulate the API call with setTimeout
    setTimeout(() => {
      // Sample data for display
      setMatter({
        id: id,
        name: 'Johnson v. Smith',
        client: 'Acme Corporation',
        status: 'Active',
        practiceArea: 'Litigation',
        responsibleAttorney: 'Sarah Johnson',
        openDate: '2023-06-15'
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <MainLayout title="Matter Details">
        <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper 
              sx={{ 
                p: 4, 
                borderRadius: '6px', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              Loading matter details...
            </Paper>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Matter: ${matter.name}`}>
      <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <MatterDetailHeader matter={matter} />
        <MatterTabs matter={matter} />
      </Container>
    </MainLayout>
  );
};

export default MatterDetailPage; 