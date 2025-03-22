import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  Grid,
  TextField,
  Button,
  Alert,
  Stack,
  Paper,
  Switch,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Info as InfoIcon,
  Save as SaveIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const TimeRoundingSettings = ({
  globalRoundingIncrement = 0.1, // Default to 6-minute increments (0.1 hour)
  setGlobalRoundingIncrement,
  roundingMethod = 'nearest', // 'nearest', 'up', or 'down'
  setRoundingMethod,
  matterSpecificRounding = false,
  setMatterSpecificRounding,
  matterRoundingRules = [],
  setMatterRoundingRules,
  clients = [],
  matters = []
}) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [matterRoundingIncrement, setMatterRoundingIncrement] = useState(0.1);
  const [matterRoundingMethod, setMatterRoundingMethod] = useState('nearest');

  // Example clients data if not provided
  const defaultClients = clients.length > 0 ? clients : [
    { id: 1, name: 'Acme Corporation' },
    { id: 2, name: 'Wayne Enterprises' },
    { id: 3, name: 'Stark Industries' },
  ];

  // Example matters data if not provided
  const defaultMatters = matters.length > 0 ? matters : [
    { id: 1, name: 'Corporate Restructuring', clientId: 1, caseNumber: 'ACM-2023-001' },
    { id: 2, name: 'Patent Infringement', clientId: 1, caseNumber: 'ACM-2023-002' },
    { id: 3, name: 'Merger Review', clientId: 2, caseNumber: 'WE-2023-001' },
    { id: 4, name: 'Intellectual Property', clientId: 3, caseNumber: 'SI-2023-001' },
  ];

  // Default matter rounding rules if not provided
  const defaultMatterRoundingRules = matterRoundingRules.length > 0 ? matterRoundingRules : [
    { 
      id: 1, 
      matterId: 1, 
      matterName: 'Corporate Restructuring',
      clientId: 1,
      clientName: 'Acme Corporation',
      roundingIncrement: 0.25, // 15-minute increments
      roundingMethod: 'up'
    },
    { 
      id: 2, 
      matterId: 3, 
      matterName: 'Merger Review',
      clientId: 2,
      clientName: 'Wayne Enterprises',
      roundingIncrement: 0.1, // 6-minute increments
      roundingMethod: 'nearest'
    }
  ];

  // Filter matters based on selected client
  const filteredMatters = selectedClient
    ? defaultMatters.filter(matter => matter.clientId === selectedClient.id)
    : [];

  const handleSaveGlobalSettings = () => {
    if (setGlobalRoundingIncrement) {
      setGlobalRoundingIncrement(globalRoundingIncrement);
    }
    
    if (setRoundingMethod) {
      setRoundingMethod(roundingMethod);
    }
  };

  const handleAddMatterRule = () => {
    if (!selectedMatter) return;
    
    const matter = defaultMatters.find(m => m.id === selectedMatter.id);
    const client = defaultClients.find(c => c.id === matter.clientId);
    
    const newRule = {
      id: Date.now(),
      matterId: matter.id,
      matterName: matter.name,
      clientId: client.id,
      clientName: client.name,
      roundingIncrement: matterRoundingIncrement,
      roundingMethod: matterRoundingMethod
    };
    
    // Check if rule already exists for this matter
    const existingRuleIndex = defaultMatterRoundingRules.findIndex(rule => rule.matterId === matter.id);
    
    if (existingRuleIndex >= 0) {
      // Update existing rule
      const updatedRules = [...defaultMatterRoundingRules];
      updatedRules[existingRuleIndex] = newRule;
      setMatterRoundingRules(updatedRules);
    } else {
      // Add new rule
      setMatterRoundingRules([...defaultMatterRoundingRules, newRule]);
    }
    
    // Reset form
    setSelectedClient(null);
    setSelectedMatter(null);
    setMatterRoundingIncrement(0.1);
    setMatterRoundingMethod('nearest');
  };

  const handleDeleteMatterRule = (id) => {
    setMatterRoundingRules(defaultMatterRoundingRules.filter(rule => rule.id !== id));
  };

  const getRoundingMethodLabel = (method) => {
    switch (method) {
      case 'nearest':
        return 'Round to Nearest';
      case 'up':
        return 'Round Up';
      case 'down':
        return 'Round Down';
      default:
        return method;
    }
  };

  const getIncrementLabel = (increment) => {
    switch (increment) {
      case 0.1:
        return '6-minute increments (0.1 hour)';
      case 0.25:
        return '15-minute increments (0.25 hour)';
      case 0.5:
        return '30-minute increments (0.5 hour)';
      case 1:
        return 'Full hour increments (1.0 hour)';
      default:
        return `${increment} hour increments`;
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
        Time Rounding Rules
      </Typography>
      
      <Grid container spacing={3}>
        {/* Global Rounding Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  Firm-Wide Rounding Settings
                </Typography>
                <Tooltip title="These settings apply to all time entries unless overridden by matter-specific rules">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Rounding Increment</InputLabel>
                  <Select
                    value={globalRoundingIncrement}
                    label="Rounding Increment"
                    onChange={(e) => setGlobalRoundingIncrement(e.target.value)}
                  >
                    <MenuItem value={0.1}>6-minute increments (0.1 hour)</MenuItem>
                    <MenuItem value={0.25}>15-minute increments (0.25 hour)</MenuItem>
                    <MenuItem value={0.5}>30-minute increments (0.5 hour)</MenuItem>
                    <MenuItem value={1}>Full hour increments (1.0 hour)</MenuItem>
                  </Select>
                </FormControl>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Rounding Method
                  </Typography>
                  <RadioGroup
                    value={roundingMethod}
                    onChange={(e) => setRoundingMethod(e.target.value)}
                  >
                    <FormControlLabel 
                      value="nearest" 
                      control={<Radio />} 
                      label="Round to nearest increment" 
                    />
                    <FormControlLabel 
                      value="up" 
                      control={<Radio />} 
                      label="Always round up to next increment" 
                    />
                    <FormControlLabel 
                      value="down" 
                      control={<Radio />} 
                      label="Always round down to previous increment" 
                    />
                  </RadioGroup>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={matterSpecificRounding}
                        onChange={(e) => setMatterSpecificRounding(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Enable matter-specific rounding rules"
                  />
                  
                  <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    onClick={handleSaveGlobalSettings}
                  >
                    Save Settings
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Example: With 6-minute increments and "round to nearest", 1 hour and 3 minutes would be rounded to 1.0 hour, while 1 hour and 4 minutes would be rounded to 1.1 hours.
            </Typography>
          </Alert>
        </Grid>
        
        {/* Matter-Specific Rounding Rules */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                Matter-Specific Rounding Rules
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              {matterSpecificRounding ? (
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Client</InputLabel>
                    <Select
                      value={selectedClient?.id || ''}
                      label="Client"
                      onChange={(e) => {
                        const client = defaultClients.find(c => c.id === e.target.value);
                        setSelectedClient(client);
                        setSelectedMatter(null);
                      }}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select a client</em>
                      </MenuItem>
                      {defaultClients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth disabled={!selectedClient}>
                    <InputLabel>Matter</InputLabel>
                    <Select
                      value={selectedMatter?.id || ''}
                      label="Matter"
                      onChange={(e) => {
                        const matter = filteredMatters.find(m => m.id === e.target.value);
                        setSelectedMatter(matter);
                        
                        // Check if there's an existing rule for this matter
                        const existingRule = defaultMatterRoundingRules.find(rule => rule.matterId === matter.id);
                        if (existingRule) {
                          setMatterRoundingIncrement(existingRule.roundingIncrement);
                          setMatterRoundingMethod(existingRule.roundingMethod);
                        }
                      }}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select a matter</em>
                      </MenuItem>
                      {filteredMatters.map((matter) => (
                        <MenuItem key={matter.id} value={matter.id}>
                          {matter.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth disabled={!selectedMatter}>
                    <InputLabel>Rounding Increment</InputLabel>
                    <Select
                      value={matterRoundingIncrement}
                      label="Rounding Increment"
                      onChange={(e) => setMatterRoundingIncrement(e.target.value)}
                    >
                      <MenuItem value={0.1}>6-minute increments (0.1 hour)</MenuItem>
                      <MenuItem value={0.25}>15-minute increments (0.25 hour)</MenuItem>
                      <MenuItem value={0.5}>30-minute increments (0.5 hour)</MenuItem>
                      <MenuItem value={1}>Full hour increments (1.0 hour)</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth disabled={!selectedMatter}>
                    <InputLabel>Rounding Method</InputLabel>
                    <Select
                      value={matterRoundingMethod}
                      label="Rounding Method"
                      onChange={(e) => setMatterRoundingMethod(e.target.value)}
                    >
                      <MenuItem value="nearest">Round to nearest increment</MenuItem>
                      <MenuItem value="up">Always round up to next increment</MenuItem>
                      <MenuItem value="down">Always round down to previous increment</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button 
                    variant="contained" 
                    onClick={handleAddMatterRule}
                    disabled={!selectedMatter}
                  >
                    {defaultMatterRoundingRules.some(rule => rule.matterId === selectedMatter?.id)
                      ? 'Update Rule'
                      : 'Add Rule'
                    }
                  </Button>
                </Stack>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    Matter-specific rounding rules are disabled. Enable them in the firm-wide settings.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          
          {matterSpecificRounding && defaultMatterRoundingRules.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Current Matter Rules
                </Typography>
                
                <Stack spacing={1}>
                  {defaultMatterRoundingRules.map((rule) => (
                    <Paper 
                      key={rule.id} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            {rule.matterName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {rule.clientName}
                          </Typography>
                          <Typography variant="body2">
                            {getIncrementLabel(rule.roundingIncrement)} • {getRoundingMethodLabel(rule.roundingMethod)}
                          </Typography>
                        </Box>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDeleteMatterRule(rule.id)}
                        >
                          <SettingsIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeRoundingSettings; 