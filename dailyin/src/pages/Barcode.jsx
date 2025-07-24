import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Checkbox, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';  // Import DataGrid
import Header from '../components/Header';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode'; // Import JsBarcode


export default function BarcodePage() {
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('http://206.189.134.117:8000/api/product/products_api/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one product to print.');
      return;
    }

    const selectedProducts = products.filter((p) => selectedIds.includes(p.id));

    const doc = new jsPDF();

    selectedProducts.forEach((product, index) => {
      const y = 20 + (index % 9) * 30;

      if (index !== 0 && index % 9 === 0) {
        doc.addPage();
      }

      // Generate Barcode image using JsBarcode
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, product.barcode, {
        format: "CODE128",  // Adjust the barcode format as needed
        displayValue: false,
      });

      // Add barcode image to the PDF
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 20, y, 50, 10); // Position and size of barcode image

      // Add product description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(product.ItDesc, 20, y + 15);
    });

    doc.save('selected_barcodes.pdf');
  };

  const columns = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        <Checkbox
          checked={selectedIds.includes(params.row.id)}
          onChange={() => handleSelect(params.row.id)}
        />
      ),
    },
    { field: 'Itcode', headerName: 'Item Code', width: 150 },
    { field: 'ItDesc', headerName: 'Description', width: 250 },
    { field: 'RackNo', headerName: 'Rack No', width: 150 },
    { field: 'barcode', headerName: 'Barcode', width: 180 },
  ];

  const rows = products.map((product) => ({
    id: product.id,
    Itcode: product.Itcode,
    ItDesc: product.ItDesc,
    RackNo: product.RackNo,
    barcode: product.barcode,
  }));

  return (
    <Box sx={{ padding: 3 }}>
      <Header />
      <Typography variant="h4" gutterBottom sx={{ marginTop: 3, textAlign: 'left', fontWeight: 'bold' }}>
        BARCODE PAGE
      </Typography>

      <Paper sx={{ marginTop: 2 }}>
        <div style={{ height: 400, width: '90vw' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            //checkboxSelection
            //disableSelectionOnClick
          />
        </div>
      </Paper>

      <Box sx={{ marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print Selected Barcodes
        </Button>
      </Box>
    </Box>
  );
}
