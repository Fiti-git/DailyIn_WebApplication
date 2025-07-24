import { useState } from 'preact/hooks';
import Router from 'preact-router';

import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Barcode from './pages/Barcode.jsx';
import Employee from './pages/Employee.jsx';
import Transaction from './pages/Transaction.jsx';
import Outlet from './pages/Outlet.jsx';
import Logout from './pages/Logout.jsx';

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
