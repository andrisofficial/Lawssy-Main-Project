import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  Receipt as ReceiptIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Sample expense categories
const expenseCategories = [
  { id: 'filing_fee', name: 'Filing Fee' },
  { id: 'travel', name: 'Travel' },
  { id: 'photocopies', name: 'Photocopies' },
  { id: 'postage', name: 'Postage' },
  { id: 'expert_fee', name: 'Expert Fee' },
  { id: 'court_costs', name: 'Court Costs' },
  { id: 'research', name: 'Research' },
  { id: 'service_process', name: 'Service of Process' },
  { id: 'other', name: 'Other' }
];

const ExpenseTracking = () => {
  const [expenses, setExpenses] = useState([]);
  const [matters, setMatters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentExpense, setCurrentExpense] = useState(null);
  
  const [expenseFormData, setExpenseFormData] = useState({
    matterId: '',
    date: new Date(),
    description: '',
    category: '',
    amount: '',
    isBillable: true,
    receiptUrl: null
  });

  // Mock data for demonstration
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch expenses
        const expensesResponse = await fetch('/api/expenses');
        if (!expensesResponse.ok) {
          throw new Error('Failed to fetch expenses');
        }
        
        const expensesData = await expensesResponse.json();
        setExpenses(expensesData.length > 0 ? expensesData : [
          {
            id: 'exp1',
            matterId: 'matter1',
            date: new Date('2023-03-15').toISOString(),
            description: 'Court filing fee for Smith case',
            category: 'filing_fee',
            amount: 350,
            isBillable: true,
            receiptUrl: null,
            status: 'unbilled'
          },
          {
            id: 'exp2',
            matterId: 'matter2',
            date: new Date('2023-03-17').toISOString(),
            description: 'Travel to client meeting',
            category: 'travel',
            amount: 125.50,
            isBillable: true,
            receiptUrl: null,
            status: 'unbilled'
          },
          {
            id: 'exp3',
            matterId: 'matter1',
            date: new Date('2023-03-20').toISOString(),
            description: 'Expert witness fee - Dr. Johnson',
            category: 'expert_fee',
            amount: 1200,
            isBillable: true,
            receiptUrl: null,
            status: 'unbilled'
          }
        ]);
        
        // Fetch matters
        // In a real app, this would come from your API
        setMatters([
          { id: 'matter1', name: 'Smith v. Johnson', clientId: 'client1', clientName: 'Acme Corporation' },
          { id: 'matter2', name: 'Estate Planning', clientId: 'client2', clientName: 'Wayne Enterprises' },
          { id: 'matter3', name: 'Patent Application', clientId: 'client3', clientName: 'Stark Industries' }
        ]);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleOpenAddExpenseDialog = (expense = null) => {
    if (expense) {
      // Edit mode
      setCurrentExpense(expense);
      setExpenseFormData({
        matterId: expense.matterId,
        date: new Date(expense.date),
        description: expense.description,
        category: expense.category,
        amount: expense.amount,
        isBillable: expense.isBillable,
        receiptUrl: expense.receiptUrl
      });
    } else {
      // Add mode
      setCurrentExpense(null);
      setExpenseFormData({
        matterId: '',
        date: new Date(),
        description: '',
        category: '',
        amount: '',
        isBillable: true,
        receiptUrl: null
      });
    }
    
    setAddExpenseDialogOpen(true);
  };
  
  const handleCloseAddExpenseDialog = () => {
    setAddExpenseDialogOpen(false);
  };
  
  const handleExpenseFormChange = (field, value) => {
    setExpenseFormData({
      ...expenseFormData,
      [field]: value
    });
  };
  
  const handleSaveExpense = async () => {
    try {
      // Validate form
      if (!expenseFormData.matterId || !expenseFormData.description || !expenseFormData.category || !expenseFormData.amount) {
        setError('Please fill out all required fields.');
        return;
      }
      
      // In a real app, this would be an API call
      // const response = await fetch('/api/expenses', {
      //   method: currentExpense ? 'PUT' : 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     id: currentExpense?.id,
      //     ...expenseFormData,
      //     date: expenseFormData.date.toISOString(),
      //     amount: parseFloat(expenseFormData.amount)
      //   })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to save expense');
      // }
      
      // const savedExpense = await response.json();
      
      // For demo purposes
      const savedExpense = {
        id: currentExpense ? currentExpense.id : `exp${expenses.length + 1}`,
        ...expenseFormData,
        date: expenseFormData.date.toISOString(),
        amount: parseFloat(expenseFormData.amount),
        status: 'unbilled'
      };
      
      if (currentExpense) {
        // Update existing expense
        setExpenses(expenses.map(exp => 
          exp.id === currentExpense.id ? savedExpense : exp
        ));
        setSuccessMessage('Expense updated successfully.');
      } else {
        // Add new expense
        setExpenses([...expenses, savedExpense]);
        setSuccessMessage('Expense added successfully.');
      }
      
      handleCloseAddExpenseDialog();
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDeleteExpense = (expense) => {
    if (window.confirm(`Are you sure you want to delete this expense?`)) {
      // In a real app, this would be an API call
      // await fetch(`/api/expenses/${expense.id}`, {
      //   method: 'DELETE'
      // });
      
      // For demo purposes
      setExpenses(expenses.filter(exp => exp.id !== expense.id));
      setSuccessMessage('Expense deleted successfully.');
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matters.find(m => m.id === expense.matterId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  // Get matter name from matter ID
  const getMatterName = (matterId) => {
    const matter = matters.find(m => m.id === matterId);
    return matter ? matter.name : 'Unknown Matter';
  };
  
  // Get client name from matter ID
  const getClientName = (matterId) => {
    const matter = matters.find(m => m.id === matterId);
    return matter ? matter.clientName : 'Unknown Client';
  };
  
  // Get category name from category ID
  const getCategoryName = (categoryId) => {
    const category = expenseCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Other';
  };
  
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Expense Tracking</Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Expenses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="unbilled">Unbilled</MenuItem>
              <MenuItem value="billed">Billed</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {expenseCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => handleOpenAddExpenseDialog()}
            >
              Add New Expense
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Matter</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Billable</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>{getMatterName(expense.matterId)}</TableCell>
                    <TableCell>{getClientName(expense.matterId)}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{getCategoryName(expense.category)}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      {expense.isBillable ? (
                        <Chip size="small" color="primary" label="Billable" />
                      ) : (
                        <Chip size="small" label="Non-Billable" />
                      )}
                    </TableCell>
                    <TableCell>
                      {expense.status === 'billed' ? (
                        <Chip size="small" color="success" label="Billed" />
                      ) : (
                        <Chip size="small" color="warning" label="Unbilled" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Edit Expense">
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenAddExpenseDialog(expense)}
                            disabled={expense.status === 'billed'}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="View Receipt">
                          <IconButton 
                            size="small"
                            disabled={!expense.receiptUrl}
                          >
                            <ReceiptIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete Expense">
                          <IconButton 
                            size="small"
                            onClick={() => handleDeleteExpense(expense)}
                            disabled={expense.status === 'billed'}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No expenses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Add/Edit Expense Dialog */}
      <Dialog
        open={addExpenseDialogOpen}
        onClose={handleCloseAddExpenseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentExpense ? 'Edit Expense' : 'Add New Expense'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Matter *"
                value={expenseFormData.matterId}
                onChange={(e) => handleExpenseFormChange('matterId', e.target.value)}
                sx={{ mb: 2 }}
                required
              >
                {matters.map((matter) => (
                  <MenuItem key={matter.id} value={matter.id}>
                    {matter.name} - {matter.clientName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date *"
                  value={expenseFormData.date}
                  onChange={(date) => handleExpenseFormChange('date', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { mb: 2 },
                      required: true
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Category *"
                value={expenseFormData.category}
                onChange={(e) => handleExpenseFormChange('category', e.target.value)}
                sx={{ mb: 2 }}
                required
              >
                {expenseCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                value={expenseFormData.description}
                onChange={(e) => handleExpenseFormChange('description', e.target.value)}
                sx={{ mb: 2 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount *"
                type="number"
                value={expenseFormData.amount}
                onChange={(e) => handleExpenseFormChange('amount', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ mb: 2 }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={expenseFormData.isBillable}
                    onChange={(e) => handleExpenseFormChange('isBillable', e.target.checked)}
                    color="primary"
                  />
                }
                label="Billable to Client"
                sx={{ mt: 1 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AttachFileIcon />}
                sx={{ mb: 1 }}
              >
                Attach Receipt
                <input
                  type="file"
                  hidden
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      // In a real app, this would upload the file to your server
                      // For now, just set a placeholder URL
                      handleExpenseFormChange('receiptUrl', 'receipt.pdf');
                    }
                  }}
                />
              </Button>
              {expenseFormData.receiptUrl && (
                <Typography variant="caption" display="block">
                  Receipt attached: {expenseFormData.receiptUrl}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddExpenseDialog}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSaveExpense}
          >
            {currentExpense ? 'Update' : 'Save'} Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpenseTracking; 