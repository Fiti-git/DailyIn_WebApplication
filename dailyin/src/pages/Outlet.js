import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; // Adjust path if needed
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function OutletPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem('accessToken');

  // Fetch outlets from API on mount
  useEffect(() => {
    const fetchOutlets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/emp/outlets_api/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch outlets: ${response.statusText}`);
        }

        const data = await response.json();
        setOutlets(data);
      } catch (error) {
        console.error('Error fetching outlets:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOutlets();
  }, [accessToken]);

  const toggleModal = () => setShowModal(!showModal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit new outlet to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/emp/outlets_api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add outlet');
      }

      const newOutlet = await response.json();
      setOutlets(prev => [...prev, newOutlet]);
      setFormData({ name: '', address: '' });
      toggleModal();
    } catch (error) {
      console.error('Error adding outlet:', error);
      setError(error.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'address', headerName: 'Address', width: 500 },
  ];

  return (
    <>
      <Header />
      <Box sx={{ pt: 4, textAlign: 'center', position: 'relative' }}>
        <h4
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            fontSize: '2.3rem',
            fontWeight: 'bold',
            margin: 0,
            color: '#333',
            zIndex: 10,
          }}
        >
          OUTLET PAGE
        </h4>

        <Button
          onClick={toggleModal}
          variant="contained"
          color="primary"
          sx={{
            position: 'absolute',
            top: 60,
            right: 16,
            mb: 2,
          }}
        >
          Add Outlet
        </Button>

        <Dialog
          open={showModal}
          onClose={toggleModal}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '12px',
              padding: '20px',
              width: '500px',
              maxHeight: '70vh',
              overflow: 'auto',
              zIndex: 10000,
              position: 'absolute',
            },
          }}
        >
          <DialogTitle>Add Outlet</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Outlet Name"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Box>
              <DialogActions>
                <Button onClick={toggleModal} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Add Outlet
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <Box
          sx={{
            height: 400,
            width: '90vw',
            mt: 10,
            mx: 'auto',
            borderRadius: '5px',
            overflow: 'hidden',
            
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <DataGrid
            rows={outlets}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            loading={loading}
          />
        </Box>
      </Box>
    </>
  );
}
