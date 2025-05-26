import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingBag, 
  Menu, 
  PieChart, 
  Package, 
  DollarSign, 
  Users, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Calendar,
  Truck,
  Bell
} from "lucide-react";

function Pout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [pcode, setPcode] = useState('');
  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/fetch")
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    await axios.post('http://localhost:4000/sell', {pcode, date, quantity, price});
    alert('Product sold');
    
    // Reset form
    setPcode('');
    setDate('');
    setQuantity('');
    setPrice('');
  };

  // Toggle sidebar menu for mobile view
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            transition: all 0.2s ease;
          }

          :root {
            --primary: #4361ee;
            --primary-dark: #3a56d4;
            --primary-light: #e6ecff;
            --accent: #ffdd57;
            --text: #333;
            --text-light: #666;
            --text-lighter: #888;
            --bg: #f8f9fd;
            --bg-dark: #121212;
            --sidebar: #1e293b;
            --white: #fff;
            --border: #e2e8f0;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }

          body {
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            color: var(--text);
            overflow-x: hidden;
            line-height: 1.6;
          }

          a {
            text-decoration: none;
            color: inherit;
          }

          /* Layout */
          .admin-container {
            display: flex;
            min-height: 100vh;
          }

          /* Sidebar Styles */
          .sidebar {
            width: 260px;
            background: var(--sidebar);
            color: #fff;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 1000;
            transition: all 0.3s ease;
          }

          .sidebar-logo {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 25px 25px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .sidebar-logo-text {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .sidebar-logo-text span {
            color: var(--accent);
          }

          .sidebar-nav {
            padding: 20px 0;
          }

          .nav-section {
            margin-bottom: 15px;
            padding: 0 15px;
          }

          .nav-section-title {
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
            color: rgba(255, 255, 255, 0.5);
            margin: 15px 10px 10px;
            padding-bottom: 5px;
          }

          .nav-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            border-radius: 6px;
            margin-bottom: 5px;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 500;
          }

          .nav-item:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
          }

          .nav-item.active {
            background: rgba(255, 255, 255, 0.15);
            color: #fff;
            font-weight: 600;
          }

          .nav-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
          }

          /* Main Content Area */
          .main-content {
            flex: 1;
            margin-left: 260px;
            padding: 0;
            transition: all 0.3s ease;
          }

          /* Header Bar */
          .header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 30px;
            background: var(--white);
            border-bottom: 1px solid var(--border);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
            height: 70px;
          }

          .page-title {
            font-size: 20px;
            font-weight: 600;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .notification-icon {
            position: relative;
            cursor: pointer;
          }

          .notification-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: var(--danger);
            color: white;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 600;
          }

          .admin-profile {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
          }

          .admin-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: var(--text);
            background: #e2e8f0;
          }

          .admin-name {
            font-size: 14px;
            font-weight: 500;
          }

          .admin-role {
            font-size: 12px;
            color: var(--text-lighter);
          }

          /* Mobile Menu Button */
          .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: var(--text);
            cursor: pointer;
            padding: 5px;
          }

          /* Content Wrapper */
          .content-wrapper {
            padding: 30px;
          }

          /* Form Section */
          .form-container {
            background: var(--white);
            border-radius: 10px;
            padding: 30px;
            box-shadow: var(--card-shadow);
            margin-bottom: 30px;
            max-width: 800px;
            margin: 0 auto;
          }

          .form-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--text);
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border);
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text);
          }

          .form-control {
            width: 100%;
            padding: 12px 15px;
            font-size: 15px;
            border: 1px solid var(--border);
            border-radius: 8px;
            background-color: var(--bg);
            transition: all 0.3s ease;
          }

          .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
            outline: none;
          }

          .btn-primary {
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-block;
            text-align: center;
          }

          .btn-primary:hover {
            background-color: var(--primary-dark);
            transform: translateY(-2px);
          }

          /* Media Queries */
          @media (max-width: 1024px) {
            .form-container {
              max-width: 100%;
            }
          }

          @media (max-width: 768px) {
            .sidebar {
              transform: translateX(-100%);
            }
            
            .sidebar.open {
              transform: translateX(0);
            }
            
            .main-content {
              margin-left: 0;
            }
            
            .mobile-menu-btn {
              display: block;
            }
            
            .header-bar {
              padding: 15px 20px;
            }
          }

          @media (max-width: 576px) {
            .content-wrapper {
              padding: 20px 15px;
            }
            
            .admin-name {
              display: none;
            }
            
            .form-container {
              padding: 20px;
            }
          }
        `}
      </style>

      <div className="admin-container">
        {/* Sidebar Navigation */}
        <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-logo">
            <ShoppingBag size={24} color="#ffdd57" />
            <div className="sidebar-logo-text">BERWA<span>SHOP</span></div>
          </div>
          
          <nav className="sidebar-nav">
            <div className="nav-section">
              <div className="nav-section-title">Main</div>
              <Link to="/Dashboard" className="nav-item">
                <div className="nav-icon"><PieChart size={18} /></div>
                Dashboard
              </Link>
              <Link to="/Product" className="nav-item">
                <div className="nav-icon"><Package size={18} /></div>
                Products
              </Link>
              <Link to="/Pin" className="nav-item">
                <div className="nav-icon"><Truck size={18} /></div>
                Inventory
              </Link>
              <Link to="/Pout" className="nav-item active">
                <div className="nav-icon"><DollarSign size={18} /></div>
                Sales
              </Link>
              <Link to="/Report" className="nav-item">
                <div className="nav-icon"><TrendingUp size={18} /></div>
                Reports
              </Link>
            </div>
            
            <div className="nav-section">
              <div className="nav-section-title">Account</div>
               <Link to="/logout" className="nav-item">
              <div className="nav-icon"><LogOut size={18} /></div>
              Log Out
            </Link>             
            </div>
          </nav>
          
        </aside>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Header Bar */}
          <header className="header-bar">
            <div className="page-left">
              <button className="mobile-menu-btn" onClick={toggleMenu}>
                <Menu size={24} />
              </button>
              <h1 className="page-title">Inventory Management</h1>
            </div>
            
            <div className="header-actions">
              <div className="notification-icon">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="notification-badge">{notifications}</span>
                )}
              </div>
              
              <div className="admin-profile">
                <div className="admin-avatar">BS</div>
                <div>
                  <div className="admin-name">Admin User</div>
                  <div className="admin-role">Store Manager</div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="content-wrapper">
            <div className="form-container">
              <h2 className="form-title">Sell a Product</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Product</label>
                  <select 
                    className="form-control" 
                    value={pcode} 
                    onChange={(e) => setPcode(e.target.value)}
                    required
                  >
                    <option value="">--Choose a product--</option>
                    {product.map((p) => (
                      <option key={p.pcode} value={p.pcode}>
                        {p.pname}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Date Received</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity" 
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Unit Price</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price" 
                    required
                  />
                </div>
                
                <button type="submit" className="btn-primary">
                  Sell Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pout;