import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Bell,
  Truck
} from "lucide-react";
import { Link } from "react-router-dom";

function Report() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [pin, setPin] = useState([]);
  const [pout, setPout] = useState([]);
  const [stock, setStock] = useState([]);
  const [product, setProduct] = useState([]);
  const [activeTab, setActiveTab] = useState('stockin');

  
  useEffect(() => {
    axios.get('http://localhost:4000/report1')
      .then((res) => setPin(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4000/report2')
      .then((res) => setPout(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4000/report3')
      .then((res) => setStock(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:4000/report4')
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handledelete = async (rid) => {
    
    try {
      if(window.confirm("Are you sure you want to delete this record?")){
        await axios.delete(`http://localhost:4000/delete/${rid}`);
        alert("Deleted!");
        setPout(prevPout => prevPout.filter(p => p.rid !== rid));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handledelete1 = async (rid) => {
    
    try {
      if(window.confirm("Are you sure you want to delete this record?")){
        await axios.delete(`http://localhost:4000/delete1/${rid}`);
        alert("Deleted!");
        setPin(prevPin => prevPin.filter(p => p.rid !== rid));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const productmap = {};
  product.forEach(item => {
    productmap[item.pcode] = item.pname;
  });

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

          /* Report Section */
          .report-container {
            background: var(--white);
            border-radius: 10px;
            padding: 30px;
            box-shadow: var(--card-shadow);
            margin-bottom: 30px;
          }

          .report-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            color: var(--text);
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border);
          }

          .stock-summary {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 30px;
          }

          .stock-item {
            background: var(--primary-light);
            padding: 10px 15px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            font-weight: 500;
          }

          .tabs-container {
            margin-top: 20px;
          }

          .tabs-header {
            display: flex;
            border-bottom: 1px solid var(--border);
            margin-bottom: 20px;
          }

          .tab-button {
            padding: 12px 24px;
            background: none;
            border: none;
            font-size: 16px;
            font-weight: 500;
            color: var(--text-light);
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
          }

          .tab-button:hover {
            color: var(--primary);
          }

          .tab-button.active {
            color: var(--primary);
            font-weight: 600;
          }

          .tab-button.active:after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: var(--primary);
          }

          .tab-content {
            min-height: 300px;
          }

          .table-container {
            width: 100%;
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background: var(--white);
            box-shadow: var(--card-shadow);
            border-radius: 6px;
            overflow: hidden;
          }

          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid var(--border);
          }

          th {
            background-color: var(--primary);
            color: white;
            font-weight: 500;
          }

          tr:hover {
            background-color: var(--primary-light);
          }

          .action-buttons {
            display: flex;
            gap: 8px;
          }

          .btn-edit {
            background: var(--primary);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
          }

          .btn-delete {
            background: var(--danger);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
          }

          /* Media Queries */
          @media (max-width: 1024px) {
            .tab-button {
              padding: 12px 16px;
              font-size: 14px;
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
            
            .report-container {
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
              <Link to="/Pout" className="nav-item">
                <div className="nav-icon"><DollarSign size={18} /></div>
                Sales
              </Link>
              <Link to="/Report" className="nav-item active">
                <div className="nav-icon"><TrendingUp size={18} /></div>
                Reports
              </Link>
            </div>
            
            <div className="nav-section">
              <div className="nav-section-title">Management</div>
              <Link to="/users" className="nav-item">
                <div className="nav-icon"><Users size={18} /></div>
                Staff
              </Link>
              <Link to="/settings" className="nav-item">
                <div className="nav-icon"><Settings size={18} /></div>
                Settings
              </Link>
            </div>
          </nav>
          
          <div style={{ marginTop: 'auto', padding: '20px' }}>
            <Link to="/logout" className="nav-item">
              <div className="nav-icon"><LogOut size={18} /></div>
              Log Out
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Header Bar */}
          <header className="header-bar">
            <div className="page-left">
              <button className="mobile-menu-btn" onClick={toggleMenu}>
                <Menu size={24} />
              </button>
              <h1 className="page-title">Reports & Analytics</h1>
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
            <div className="report-container">
              <h2 className="report-title">Inventory Summary</h2>
              
              <div className="stock-summary">
                {stock.map((p) => (
                  <div key={p.pcode} className="stock-item">
                    {productmap[p.pcode] || 'unknown'}: {p.quantity} units
                  </div>
                ))}
              </div>
              
              <div className="tabs-container">
                <div className="tabs-header">
                  <button 
                    className={`tab-button ${activeTab === 'stockin' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stockin')}
                  >
                    Stock In Records
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'stockout' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stockout')}
                  >
                    Stock Out Records
                  </button>
                </div>
                
                <div className="tab-content">
                  {activeTab === 'stockin' && (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pin.map((p) => (
                            <tr key={p.pcode}>
                              <td>{productmap[p.pcode] || 'unknown'}</td>
                              <td>{p.quantity}</td>
                              <td>{new Date(p.date).toLocaleDateString()}</td>
                              <td>{p.price}</td>
                              <td>{p.total}</td>
                              <td className="action-buttons">
                                <Link to={`/update/${p.rid}`} className="btn-edit">EDIT</Link>
                                <button className="btn-delete" onClick={()=> handledelete1(p.rid)}>DELETE</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {activeTab === 'stockout' && (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pout.map((p) => (
                            <tr key={p.rid}>
                              <td>{productmap[p.pcode] || 'unknown'}</td>
                              <td>{p.quantity}</td>
                              <td>{new Date(p.date).toLocaleDateString()}</td>
                              <td>{p.price}</td>
                              <td>{p.total}</td>
                              <td className="action-buttons">
                                <Link to={`/update1/${p.rid}`} className="btn-edit">EDIT</Link>
                                <button className="btn-delete" onClick={()=> handledelete(p.rid)}>DELETE</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;