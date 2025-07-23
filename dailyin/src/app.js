import { useState } from 'preact/hooks';
import Router from 'preact-router';

import Login from './pages/Login.js';
import Home from './pages/Home.js';
import Product from './pages/Product.js';
import Barcode from './pages/Barcode.js';
import Employee from './pages/Employee.js';
import Transaction from './pages/Transaction.js';
import Outlet from './pages/Outlet.js';
import Logout from './pages/Logout.js';

function App() {
  return (
    <div>

      <Router>
        <Login path="/" />
        <Home path="/home" />
        <Product path="/product" />
        <Barcode path="/barcode" />
        <Employee path="/employee" />
        <Transaction path="/transaction" />
        <Outlet path="/outlet" />
        <Logout path="/logout" />
      </Router>
    </div>
  );
}

export default App;
