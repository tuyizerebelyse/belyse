import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AddProduct from './components/AddProduct';
import AddCustomer from './components/AddCustomer';
import AddOrder from './components/AddOrder';
import Report from './components/Report';
import './styles/beauty-warehouse.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Report />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/add-order" element={<AddOrder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;