import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from '../components/Header';

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace this with how you actually store/access your JWT token in your app
  const token = localStorage.getItem('accessToken'); 

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('http://206.189.134.117:8000/api/transaction/transactions_api/', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'X-CSRFTOKEN': 'thRuLarClaRzO0JPXXvf3Q9OlEjfax4c',  // if needed by your backend (usually not for JWT)
          },
        });

        // Flatten nested data to match DataGrid format
        const flattenedData = response.data.map(txn => ({
          id: txn.id,
          product: `${txn.product.Itcode} - ${txn.product.ItDesc}`,
          employee: `${txn.employee.first_name} ${txn.employee.last_name} (${txn.employee.emp_code})`,
          quantity: txn.quantity,
          transaction_type: txn.transaction_type,
          timestamp: new Date(txn.timestamp).toLocaleString(),
          remarks: txn.remarks,
        }));

        setTransactions(flattenedData);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };
    console.log ('Access token:', token);
    if (token) {
      fetchTransactions();
    } else {
      setError('No access token found. Please log in.');
      setLoading(false);
    }
  }, [token]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'product', headerName: 'Product', width: 200 },
    { field: 'employee', headerName: 'Employee', width: 250 },
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { field: 'transaction_type', headerName: 'Transaction Type', width: 150 },
    { field: 'timestamp', headerName: 'Timestamp', width: 200 },
    { field: 'remarks', headerName: 'Remarks', width: 250 },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Header />
      <Typography variant="h4" gutterBottom sx={{ marginTop: 3, textAlign: 'left', fontWeight: 'bold' }}>
        Transaction Page
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ height: '65vh', width: '90vw', margin: '0 auto' }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          pagination
          disableSelectionOnClick
          loading={loading}
          
          getRowId={(row) => row.id}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 2,borderRadius: '5px',
            },
          }}
        />
      </Box>
    </Box>
  );
}
