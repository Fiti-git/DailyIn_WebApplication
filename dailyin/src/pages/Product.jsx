import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function ProductPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    Itcode: '',
    ItDesc: '',
    RackNo: '',
    barcode: ''
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem('accessToken'); // Your saved token here

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://206.189.134.117:8000/api/product/products_api/', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [accessToken]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit new product to API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://206.189.134.117:8000/api/product/products_api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 201) {
        const newProduct = await response.json();
        setProducts(prev => [...prev, newProduct]);
        setFormData({ Itcode: '', ItDesc: '', RackNo: '', barcode: '' });
        toggleModal();
      } else {
        const errorData = await response.json();
        console.error('Failed to add product:', errorData);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'Itcode', headerName: 'Product Code', width: 150 },
    { field: 'ItDesc', headerName: 'Description', width: 250 },
    { field: 'RackNo', headerName: 'Rack No', width: 150 },
    { field: 'barcode', headerName: 'Barcode', width: 150 },
    { field: 'created_at', headerName: 'Created at', width: 180 },
    { field: 'updated_at', headerName: 'Updated at', width: 180 }
  ];

  return (
    <>
      <Header />
      <Box sx={{ pt: 4, textAlign: 'center', position: 'relative' }}>
        <h4 style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          fontSize: '2.3rem',
          fontWeight: 'bold',
          margin: 0,
          color: '#333',
          zIndex: 10,
        }}>
          PRODUCT PAGE
        </h4>

        <Button
          onClick={toggleModal}
          variant="contained"
          color="primary"
          sx={{ position: 'absolute', top: '60px', right: '16px', mb: 2 }}
        >
          Add Product
        </Button>

        <Dialog open={showModal} onClose={toggleModal}>
          <DialogTitle>Add Product</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Product Code"
                variant="outlined"
                fullWidth
                name="Itcode"
                value={formData.Itcode}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                name="ItDesc"
                value={formData.ItDesc}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Rack No"
                variant="outlined"
                fullWidth
                name="RackNo"
                value={formData.RackNo}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Barcode"
                variant="outlined"
                fullWidth
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <DialogActions>
                <Button onClick={toggleModal} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Add Product
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <Box sx={{
          height: 400,
          width: '90vw',
          mt: 10,
          mx: 'auto',
          borderRadius: '5px',
          overflow: 'hidden',
        
          boxSizing: 'border-box'
        }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            loading={loading}
            getRowId={(row) => row.id}
          />
        </Box>
      </Box>
    </>
  );
}
