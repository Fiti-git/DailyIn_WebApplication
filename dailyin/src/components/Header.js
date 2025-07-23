import React from 'react';
import { AppBar, Toolbar, Typography, Link, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar 
      position="fixed" 
      sx={{
        ...styles.header, 
        top: '20px', // Gap from the top (floating effect)
        width: '98%', // Set width to 95% of the viewport
        left: '50%', // Center the AppBar horizontally
        transform: 'translateX(-50%)', // Adjust for exact centering
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Floating shadow effect
      }}
    >
      <Toolbar sx={styles.toolbar}>
        <Box sx={styles.leftBox}>
          <Typography variant="h6" sx={styles.leftText}>
            DailyInventory
          </Typography>
        </Box>

        <Box sx={styles.nav}>
          <Link href="/product" sx={styles.navLink}>
            Product
          </Link>
          <Link href="/transaction" sx={styles.navLink}>
            Transaction
          </Link>
          <Link href="/barcode" sx={styles.navLink}>
            Barcode
          </Link>
          <Link href="/employee" sx={styles.navLink}>
            Employee
          </Link>
          <Link href="/outlet" sx={styles.navLink}>
            Outlet
          </Link>
          <Link href="/logout" sx={styles.navLink}>
            Logout
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const styles = {
  header: {
    backgroundColor: 'primary',
    color: 'white',
    borderRadius: '10px',
    zIndex: 9999,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
  },
  leftBox: {
    display: 'flex',
    alignItems: 'center',
  },
  leftText: {
    fontWeight: 'bold',
    fontSize: '20px',
    textTransform: 'uppercase', // Make text uppercase
  },
  nav: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    fontWeight: '200',
    textTransform: 'uppercase', // Make text uppercase
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

export default Header;
