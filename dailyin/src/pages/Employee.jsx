import Header from '../components/Header';  
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';

export default function EmployeePage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: 'dailyinemp@fathitech.com.lk',  // Default value
    first_name: '',
    last_name: '',
    emp_code: '',
    contact_number: '',
    outlet: '',  
  });

  const [outlets, setOutlets] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await fetch('http://206.189.134.117:8000/api/emp/outlets_api/', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch outlets');
        const data = await response.json();
        setOutlets(data);
      } catch (error) {
        console.error('Error fetching outlets:', error);
      }
    };

    if (accessToken) {
      fetchOutlets();
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch('http://206.189.134.117:8000/api/emp/employee-readonly/', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch employees');
        const data = await response.json();
        setEmployees(data);  // Assuming response is an array
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [accessToken]);

  // Handle modal open/close
  const toggleModal = () => setShowModal(!showModal);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      alert("No access token found. Please login.");
      return;
    }

    const payload = {
      user: {
        username: formData.username,
        password: formData.password,
        email: formData.email,
      },
      first_name: formData.first_name,
      last_name: formData.last_name,
      emp_code: formData.emp_code,
      contact_number: formData.contact_number,
      outlet: Number(formData.outlet), 
    };

    try {
      const response = await fetch('http://206.189.134.117:8000/api/emp/employee-profiles_api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add employee: ${JSON.stringify(errorData)}`);
      }

      const newEmployee = await response.json();

      setEmployees((prev) => [...prev, newEmployee]);

      setFormData({
        username: '',
        password: '',
        email: 'dailyinemp@fathitech.com.lk', 
        first_name: '',
        last_name: '',
        emp_code: '',
        contact_number: '',
        outlet: ''
      });

      toggleModal();

    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee. Check console for details.');
    }
  };

  // Prepare columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Username', width: 180 },
    { field: 'first_name', headerName: 'First Name', width: 180 },
    { field: 'last_name', headerName: 'Last Name', width: 180 },
    { field: 'emp_code', headerName: 'Emp Code', width: 180 },
    { field: 'contact_number', headerName: 'Contact Number', width: 250 },
    {
      field: 'outlet',
      headerName: 'Outlet',
      width: 150,
      
    }
  ];

  // Prepare rows for DataGrid
  const rows = employees.map(emp => ({
    id: emp.id,
    username: emp.user,  // Mapping "user" to username
    first_name: emp.first_name,
    last_name: emp.last_name,
    emp_code: emp.emp_code,
    contact_number: emp.contact_number,
    outlet: emp.outlet,  // Mapping "outlet" directly
  }));

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
          margin: 5,
          marginTop: 20,
          color: '#333',
          zIndex: 10,
        }}>
          EMPLOYEE PAGE
        </h4>

        <Button
          onClick={toggleModal}
          variant="contained"
          color="primary"
          sx={{
            position: 'absolute',
            top: '60px',
            right: '16px',
            mb: 2
          }}
        >
          Add Employee
        </Button>

        {/* Modal for adding employee */}
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
          <DialogTitle>Add Employee</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Employee Code"
                  variant="outlined"
                  fullWidth
                  name="emp_code"
                  value={formData.emp_code}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Contact Number"
                  variant="outlined"
                  fullWidth
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Outlet"
                  variant="outlined"
                  fullWidth
                  name="outlet"
                  value={formData.outlet}
                  onChange={handleChange}
                  required
                  select
                  sx={{ mb: 2 }}
                >
                  {outlets.map((outlet) => (
                    <MenuItem key={outlet.id} value={outlet.id}>
                      {outlet.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <DialogActions>
                <Button onClick={toggleModal} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Add Employee
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* DataGrid to display employees */}
        <Box sx={{ height: 500, width: '90vw', mt: 10,borderRadius: '5px', }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
          />
        </Box>
      </Box>
    </>
  );
}
