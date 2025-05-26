import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import Signup from './components/registration'
import Product from './components/productreg';
import Pin from './components/productin';
import Pout from './components/productout';
import Report from './components/report';
import Home from './components/home';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Update from './components/update';
import Update1 from './components/update1';

function App() {
  return(

  <Router>
    <Routes>
    <Route path="/Signup" element={<Signup/>}/>
    <Route path="/Update/:rid" element={<Update/>}/>
    <Route path="/Update1/:rid" element={<Update1/>}/>
    <Route path="/Dashboard" element={<Dashboard/>}/>
    <Route path="/Pin" element={<Pin/>}/>
    <Route path="/Pout" element={<Pout/>}/>
    <Route path="/Product" element={<Product/>}/>
    <Route path="/Home" element={<Home/>}/>
    <Route path="/Report" element={<Report/>}/>
    <Route path="/Login" element={<Login/>}/>
    <Route path="/" element={<Home/>}/>
    </Routes>
  </Router>

  )

}

export default App
