import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronRight, 
  PieChart, 
  Package, 
  DollarSign, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  TrendingUp, 
  ShoppingCart, 
  Bell, 
  Search,
  Filter,
  Calendar,
  Truck,
  AlertCircle
} from "lucide-react";

function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for report data
  const [pin, setPin] = useState([]);
  const [pout, setPout] = useState([]);
  const [stock, setStock] = useState([]);
  const [product, setProduct] = useState([]);

  // Fetch report data
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

  // Create product name mapping
  const productMap = {};
  product.forEach(item => {
    productMap[item.pcode] = item.pname;
  });

  // Calculate total sales from pout data
  const calculateTotalSales = () => {
    return pout.reduce((total, item) => total + Number(item.total), 0).toFixed(2);
  };

  // Calculate total purchases from pin data
  const calculateTotalPurchases = () => {
    return pin.reduce((total, item) => total + Number(item.total), 0).toFixed(2);
  };

  // Get low stock items (for example, less than 10 in quantity)
  const getLowStockItems = () => {
    return stock.filter(item => item.quantity < 10);
  };

  // Get recent sales transactions
  const getRecentTransactions = () => {
    // Sort pout by date (assuming date is a proper date string)
    const sortedTransactions = [...pout].sort((a, b) => new Date(b.date) - new Date(a.date));
    // Return only the first 4 transactions
    return sortedTransactions.slice(0, 4);
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

          .search-bar {
            display: flex;
            align-items: center;
            background: #f1f5f9;
            border-radius: 20px;
            padding: 6px 15px;
            width: 260px;
          }

          .search-bar input {
            background: transparent;
            border: none;
            outline: none;
            padding: 5px 10px;
            width: 100%;
            font-size: 14px;
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

          /* Dashboard Stats Section */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }

          .stat-card {
            background: var(--white);
            border-radius: 10px;
            padding: 20px;
            box-shadow: var(--card-shadow);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .stat-info h3 {
            font-size: 14px;
            color: var(--text-light);
            margin-bottom: 5px;
          }

          .stat-info p {
            font-size: 24px;
            font-weight: 600;
            color: var(--text);
          }

          .stat-info span {
            font-size: 13px;
            color: var(--success);
            display: flex;
            align-items: center;
            gap: 3px;
          }

          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .bg-blue-light {
            background: rgba(67, 97, 238, 0.1);
            color: var(--primary);
          }

          .bg-green-light {
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
          }

          .bg-yellow-light {
            background: rgba(245, 158, 11, 0.1);
            color: var(--warning);
          }

          .bg-purple-light {
            background: rgba(139, 92, 246, 0.1);
            color: #8b5cf6;
          }

          /* Dashboard Content Sections */
          .dashboard-section {
            background: var(--white);
            border-radius: 10px;
            padding: 20px;
            box-shadow: var(--card-shadow);
            margin-bottom: 30px;
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 15px;
            margin-bottom: 15px;
            border-bottom: 1px solid var(--border);
          }

          .section-title {
            font-size: 16px;
            font-weight: 600;
          }

          .view-all {
            font-size: 14px;
            color: var(--primary);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 5px;
          }

          /* Dashboard Grid Layout */
          .dashboard-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
          }

          /* Recent Sales Table */
          .recent-sales table {
            width: 100%;
            border-collapse: collapse;
          }

          .recent-sales th {
            text-align: left;
            padding: 12px 15px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-light);
            border-bottom: 1px solid var(--border);
          }

          .recent-sales td {
            padding: 15px;
            font-size: 14px;
            border-bottom: 1px solid var(--border);
          }

          .recent-sales tr:last-child td {
            border-bottom: none;
          }

          .order-id {
            font-weight: 600;
            color: var(--primary);
          }

          .order-date {
            color: var(--text-lighter);
            font-size: 13px;
          }

          .status-badge {
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            display: inline-block;
          }

          .status-completed {
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
          }

          .status-processing {
            background: rgba(245, 158, 11, 0.1);
            color: var(--warning);
          }

          .status-cancelled {
            background: rgba(239, 68, 68, 0.1);
            color: var(--danger);
          }

          /* Stock List */
          .stock-list {
            list-style: none;
          }

          .stock-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid var(--border);
          }

          .stock-item:last-child {
            border-bottom: none;
          }

          .stock-info {
            display: flex;
            flex-direction: column;
          }

          .stock-name {
            font-weight: 500;
            margin-bottom: 3px;
          }

          .stock-id {
            font-size: 13px;
            color: var(--text-lighter);
          }

          .stock-count {
            font-weight: 600;
            color: var(--danger);
          }

          /* Quick Actions Section */
          .quick-actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }

          .action-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--primary-light);
            border-radius: 10px;
            padding: 20px 15px;
            color: var(--primary);
            cursor: pointer;
            text-align: center;
          }

          .action-button:hover {
            background: var(--primary);
            color: white;
          }

          .action-icon {
            margin-bottom: 10px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .action-button:hover .action-icon {
            background: rgba(255, 255, 255, 0.2);
          }

          .action-text {
            font-size: 14px;
            font-weight: 500;
          }

          /* Current Stock Styles */
          .current-stock {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }

          .stock-tag {
            background: var(--primary-light);
            color: var(--primary);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
          }

          /* Media Queries */
          @media (max-width: 1024px) {
            .dashboard-grid {
              grid-template-columns: 1fr;
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
            
            .search-bar {
              display: none;
            }
            
            .stats-grid {
              grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            }
          }

          @media (max-width: 576px) {
            .stats-grid {
              grid-template-columns: 1fr;
            }
            
            .content-wrapper {
              padding: 20px 15px;
            }
            
            .admin-name {
              display: none;
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
              <Link to="/" className="nav-item active">
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
              <Link to="/Report" className="nav-item">
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
              <h1 className="page-title">Dashboard</h1>
            </div>
            
            <div className="header-actions">
              <div className="search-bar">
                <Search size={18} color="#666" />
                <input type="text" placeholder="Search..." />
              </div>
              
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
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Total Sales</h3>
                  <p>${calculateTotalSales()}</p>
                  <span><TrendingUp size={14} /> From {pout.length} transactions</span>
                </div>
                <div className="stat-icon bg-blue-light">
                  <DollarSign size={22} />
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Total Purchases</h3>
                  <p>${calculateTotalPurchases()}</p>
                  <span><TrendingUp size={14} /> From {pin.length} orders</span>
                </div>
                <div className="stat-icon bg-green-light">
                  <ShoppingCart size={22} />
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Low Stock Items</h3>
                  <p>{getLowStockItems().length}</p>
                  <span><AlertCircle size={14} color="#ef4444" /> Needs attention</span>
                </div>
                <div className="stat-icon bg-yellow-light">
                  <Package size={22} />
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Total Products</h3>
                  <p>{product.length}</p>
                  <span>In inventory</span>
                </div>
                <div className="stat-icon bg-purple-light">
                  <ShoppingBag size={22} />
                </div>
              </div>
            </div>

            {/* Dashboard Main Content Grid */}
            <div className="dashboard-grid">
              {/* Recent Sales Section */}
              <div className="dashboard-section recent-sales">
                <div className="section-header">
                  <h2 className="section-title">Recent Transactions</h2>
                  <Link to="/Report" className="view-all">
                    View All <ChevronRight size={16} />
                  </Link>
                </div>
                
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Date</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRecentTransactions().map((sale, index) => (
                      <tr key={index}>
                        <td>
                          <span className="order-id">{productMap[sale.pcode] || 'Unknown'}</span>
                          <div className="order-date">Code: {sale.pcode}</div>
                        </td>
                        <td>{sale.quantity}</td>
                        <td>{sale.date}</td>
                        <td>${sale.price}</td>
                        <td>
                          <span className="status-badge status-completed">
                            ${sale.total}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right Column */}
              <div>
                {/* Current Stock Section */}
                <div className="dashboard-section">
                  <div className="section-header">
                    <h2 className="section-title">Current Stock</h2>
                    <Link to="/Report" className="view-all">
                      View All <ChevronRight size={16} />
                    </Link>
                  </div>
                  
                  <div className="current-stock">
                    {stock.map((item, index) => (
                      <div className="stock-tag" key={index}>
                        {productMap[item.pcode] || 'Unknown'}: {item.quantity}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Low Stock Alert */}
                <div className="dashboard-section">
                  <div className="section-header">
                    <h2 className="section-title">Low Stock Alert</h2>
                    <Link to="/inventory" className="view-all">
                      View All <ChevronRight size={16} />
                    </Link>
                  </div>
                  
                  <ul className="stock-list">
                    {getLowStockItems().map((item, index) => (
                      <li className="stock-item" key={index}>
                        <div className="stock-info">
                          <span className="stock-name">{productMap[item.pcode] || 'Unknown'}</span>
                          <span className="stock-id">ID: {item.pcode}</span>
                        </div>
                        <div className="stock-count">
                          {item.quantity} left
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-section">
                  <div className="section-header">
                    <h2 className="section-title">Quick Actions</h2>
                  </div>
                  
                  <div className="quick-actions">
                    <Link to="/Product" className="action-button">
                      <div className="action-icon">
                        <Plus size={20} />
                      </div>
                      <span className="action-text">Add Product</span>
                    </Link>
                    <Link to="/Pin" className="action-button">
                      <div className="action-icon">
                        <Package size={20} />
                      </div>
                      <span className="action-text">Record Stock</span>
                    </Link>
                    <Link to="/Pout" className="action-button">
                      <div className="action-icon">
                        <ShoppingCart size={20} />
                      </div>
                      <span className="action-text">Record Sale</span>
                    </Link>
                    <Link to="/Report" className="action-button">
                      <div className="action-icon">
                        <TrendingUp size={20} />
                      </div>
                      <span className="action-text">View Reports</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;