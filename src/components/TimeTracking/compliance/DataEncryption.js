import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Key as KeyIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const DataEncryption = () => {
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [encryptionKey, setEncryptionKey] = useState('••••••••••••••••••••••••••••••••');
  const [showKey, setShowKey] = useState(false);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [encryptedDataTypes, setEncryptedDataTypes] = useState({
    clientInformation: true,
    financialData: true,
    billingRates: true,
    timeEntries: true,
    invoices: true,
    trustAccounts: true,
    userCredentials: true,
  });

  const handleEncryptionToggle = () => {
    if (encryptionEnabled) {
      // Show confirmation dialog before disabling encryption
      if (window.confirm('Are you sure you want to disable encryption? This will make sensitive data vulnerable.')) {
        setEncryptionEnabled(false);
      }
    } else {
      setEncryptionEnabled(true);
    }
  };

  const handleDataTypeToggle = (dataType) => {
    setEncryptedDataTypes({
      ...encryptedDataTypes,
      [dataType]: !encryptedDataTypes[dataType],
    });
  };

  const handleRegenerateKey = () => {
    // In a real application, this would generate a new encryption key
    // and re-encrypt all data with the new key
    setKeyDialogOpen(true);
  };

  const confirmRegenerateKey = () => {
    // Simulate key regeneration
    setEncryptionKey('NEW-' + Math.random().toString(36).substring(2, 15));
    setKeyDialogOpen(false);
    alert('Encryption key has been regenerated and all data has been re-encrypted.');
  };

  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="600">
                  Data Encryption Settings
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ ml: 1 }}
                  onClick={() => setInfoDialogOpen(true)}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Box>

              <Alert 
                severity={encryptionEnabled ? "success" : "warning"} 
                sx={{ mb: 3 }}
              >
                <AlertTitle>
                  {encryptionEnabled ? "Encryption Enabled" : "Encryption Disabled"}
                </AlertTitle>
                {encryptionEnabled 
                  ? "End-to-end encryption is currently enabled, protecting sensitive data." 
                  : "Warning: Encryption is disabled. Sensitive data is not protected."}
              </Alert>

              <FormControlLabel
                control={
                  <Switch
                    checked={encryptionEnabled}
                    onChange={handleEncryptionToggle}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body1" fontWeight="500">
                    Enable End-to-End Encryption
                  </Typography>
                }
              />

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Encryption Key
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <TextField
                        fullWidth
                        value={showKey ? encryptionKey : '••••••••••••••••••••••••••••••••'}
                        InputProps={{
                          readOnly: true,
                          startAdornment: <KeyIcon color="action" sx={{ mr: 1 }} />,
                        }}
                        size="small"
                        disabled={!encryptionEnabled}
                      />
                    </Grid>
                    <Grid item>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={showKey ? <LockIcon /> : <LockOpenIcon />}
                          onClick={toggleShowKey}
                          disabled={!encryptionEnabled}
                        >
                          {showKey ? 'Hide' : 'Show'}
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<RefreshIcon />}
                          onClick={handleRegenerateKey}
                          disabled={!encryptionEnabled}
                        >
                          Regenerate
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Note: Regenerating the encryption key will require re-encrypting all data. This process may take some time.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Encrypted Data Types
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select which types of data should be encrypted. It is recommended to encrypt all sensitive information.
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    {encryptedDataTypes.clientInformation ? (
                      <CheckIcon color="success" />
                    ) : (
                      <WarningIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Client Information" />
                  <Switch
                    edge="end"
                    checked={encryptedDataTypes.clientInformation}
                    onChange={() => handleDataTypeToggle('clientInformation')}
                    disabled={!encryptionEnabled}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    {encryptedDataTypes.financialData ? (
                      <CheckIcon color="success" />
                    ) : (
                      <WarningIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Financial Data" />
                  <Switch
                    edge="end"
                    checked={encryptedDataTypes.financialData}
                    onChange={() => handleDataTypeToggle('financialData')}
                    disabled={!encryptionEnabled}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    {encryptedDataTypes.billingRates ? (
                      <CheckIcon color="success" />
                    ) : (
                      <WarningIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Billing Rates" />
                  <Switch
                    edge="end"
                    checked={encryptedDataTypes.billingRates}
                    onChange={() => handleDataTypeToggle('billingRates')}
                    disabled={!encryptionEnabled}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    {encryptedDataTypes.timeEntries ? (
                      <CheckIcon color="success" />
                    ) : (
                      <WarningIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Time Entries" />
                  <Switch
                    edge="end"
                    checked={encryptedDataTypes.timeEntries}
                    onChange={() => handleDataTypeToggle('timeEntries')}
                    disabled={!encryptionEnabled}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    {encryptedDataTypes.invoices ? (
                      <CheckIcon color="success" />
                    ) : (
                      <WarningIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Invoices" />
                  <Switch
                    edge="end"
                    checked={encryptedDataTypes.invoices}
                    onChange={() => handleDataTypeToggle('invoices')}
                    disabled={!encryptionEnabled}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    {encryptedDataTypes.trustAccounts ? (
                      <CheckIcon color="success" />
                    ) : (
                      <WarningIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Trust Accounts" />
                  <Switch
                    edge="end"
                    checked={encryptedDataTypes.trustAccounts}
                    onChange={() => handleDataTypeToggle('trustAccounts')}
                    disabled={!encryptionEnabled}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    {encryptedDataTypes.userCredentials ? (
                      <CheckIcon color="success" />
                    ) : (
                      <WarningIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="User Credentials" />
                  <Switch
                    edge="end"
                    checked={encryptedDataTypes.userCredentials}
                    onChange={() => handleDataTypeToggle('userCredentials')}
                    disabled={!encryptionEnabled}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Regenerate Key Confirmation Dialog */}
      <Dialog open={keyDialogOpen} onClose={() => setKeyDialogOpen(false)}>
        <DialogTitle>Regenerate Encryption Key</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Warning</AlertTitle>
            Regenerating the encryption key is a sensitive operation that will:
          </Alert>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText primary="Create a new encryption key" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText primary="Re-encrypt all data with the new key" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText primary="Invalidate the old encryption key" />
            </ListItem>
          </List>
          <Typography variant="body2" sx={{ mt: 2 }}>
            This process may take some time depending on the amount of data. Are you sure you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKeyDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmRegenerateKey} variant="contained" color="warning">
            Regenerate Key
          </Button>
        </DialogActions>
      </Dialog>

      {/* Information Dialog */}
      <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)}>
        <DialogTitle>About Data Encryption</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            End-to-end encryption provides the highest level of security for your sensitive data. When enabled:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <LockIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Data is encrypted before it leaves your device" 
                secondary="Using AES-256 encryption standard"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LockIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Data remains encrypted in transit and at rest" 
                secondary="Even system administrators cannot access unencrypted data"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LockIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Decryption only occurs on authorized devices" 
                secondary="When accessed by users with appropriate permissions"
              />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            This level of encryption helps ensure compliance with regulations such as GDPR, HIPAA, and other data protection laws.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataEncryption; 