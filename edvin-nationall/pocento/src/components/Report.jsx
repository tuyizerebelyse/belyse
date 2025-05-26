import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaBoxes, FaUsers, FaShoppingCart,FaChartLine, FaSignOutAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { BsBoxSeam } from 'react-icons/bs';
import { MdDashboard } from 'react-icons/md';
import '../styles/beauty-warehouse.css';

const Report = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
  
      let productsData = [];
      let customersData = [];
      let ordersData = [];
  
      if (activeTab === 'products' || activeTab === 'dashboard') {
        const productsRes = await axios.get('http://localhost:3001/products');
        productsData = productsRes.data;
        setProducts(productsData);
      }
  
      if (activeTab === 'customers' || activeTab === 'dashboard') {
        const customersRes = await axios.get('http://localhost:3001/customers');
        customersData = customersRes.data;
        setCustomers(customersData);
      }
  
      if (activeTab === 'orders' || activeTab === 'dashboard') {
        const ordersRes = await axios.get('http://localhost:3001/orders');
        ordersData = ordersRes.data;
        setOrders(ordersData);
      }
  
      if (activeTab === 'dashboard') {
        setStats({
          totalProducts: productsData.length,
          totalCustomers: customersData.length,
          totalOrders: ordersData.length,
          totalRevenue: ordersData.reduce(
            (sum, order) => sum + (order.productquantity * order.unitprice),
            0
          )
          
        });
      }
  
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        await axios.delete(`http://localhost:3001/${type}/${id}`);
        fetchData();
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('users');
    navigate('/login');
  };

  return (
    <div className="flex-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="nav-brand">
          <BsBoxSeam className="nav-icon" />
          <span>Beauty Warehouse</span>
        </div>
        
        <nav className="nav-menu">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <MdDashboard className="nav-icon" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
          >
            <FaBoxes className="nav-icon" />
            <span>Products</span>
          </button>
          
          <button
            onClick={() => setActiveTab('customers')}
            className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
          >
            <FaUsers className="nav-icon" />
            <span>Customers</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          >
            <FaShoppingCart className="nav-icon" />
            <span>Orders</span>
          </button>
        </nav>
        
        <button onClick={handleLogout} className="nav-item">
          <FaSignOutAlt className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="fade-in">
            {activeTab === 'dashboard' && (
              <DashboardView stats={stats} products={products} customers={customers} orders={orders} />
            )}
            
            {activeTab === 'products' && (
              <ProductsView 
                products={products} 
                onDelete={handleDelete} 
                refreshData={fetchData} 
              />
            )}
            
            {activeTab === 'customers' && (
              <CustomersView 
                customers={customers} 
                onDelete={handleDelete} 
                refreshData={fetchData} 
              />
            )}
            
            {activeTab === 'orders' && (
              <OrdersView 
                orders={orders} 
                products={products} 
                customers={customers} 
                onDelete={handleDelete} 
                refreshData={fetchData} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard View Component
const DashboardView = ({ stats, products, customers, orders }) => {
  return (
    <div>
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="card">
          <div className="stat-card">
            <div className="stat-icon primary">
              <FaBoxes />
            </div>
            <div className="stat-content">
              <h3>Total Products</h3>
              <p>{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="stat-card">
            <div className="stat-icon primary">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>Total Customers</h3>
              <p>{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="stat-card">
            <div className="stat-icon primary">
              <FaShoppingCart />
            </div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="stat-card">
            <div className="stat-icon primary">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p>{stats.totalRevenue.toFixed(2)}Rwf</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid-2-col">
        <div className="card">
          <h3>Recent Products</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((product) => (
                <tr key={product.productcode}>
                  <td>{product.productname}</td>
                  <td>{product.productquantity}Kg</td>
                  <td>{product.unitprice}Rwf</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="card">
          <h3>Recent Orders</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Customer</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.ordernumber}>
                  <td>{order.ordernumber}</td>
                  <td>{new Date(order.orderdate).toLocaleDateString()}</td>
                  <td>
                    {customers.find(c => c.customerid === order.customerid)?.cust_lname || 'Unknown'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Products View Component
const ProductsView = ({ products, onDelete, refreshData }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productname: '',
    productquantity: '',
    unitprice: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:3001/products/${editingProduct.productcode}`, formData);
      } else {
        await axios.post('http://localhost:3001/products', formData);
      }
      setEditingProduct(null);
      setFormData({ productname: '', productquantity: '', unitprice: '' });
      refreshData();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      productname: product.productname,
      productquantity: product.productquantity,
      unitprice: product.unitprice
    });
  };

  return (
    <div>
      <div className="flex-between mb-4">
        <h1>Products Management</h1>
        <Link to="/add-product" className="btn btn-primary">
          <FaPlus /> Add Product
        </Link>
      </div>

      {editingProduct && (
        <div className="card mb-4">
          <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="productname"
                  value={formData.productname}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity(Kg)</label>
                <input
                  type="number"
                  name="productquantity"
                  value={formData.productquantity}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unit Price (Rwf)</label>
                <input
                  type="number"
                  name="unitprice"
                  value={formData.unitprice}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="button-group">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productcode}>
                <td>{product.productcode}</td>
                <td>{product.productname}</td>
                <td>{product.productquantity}Kg</td>
                <td>{product.unitprice}Rwf</td>
                <td>{(product.productquantity * product.unitprice).toFixed(2)}Rwf</td>
                <td>
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn btn-secondary mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete('products', product.productcode)}
                    className="btn btn-danger"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Customers View Component
const CustomersView = ({ customers, onDelete, refreshData }) => {
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    cust_fname: '',
    cust_lname: '',
    location: '',
    telephone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await axios.put(`http://localhost:3001/customers/${editingCustomer.customerid}`, formData);
      } else {
        await axios.post('http://localhost:3001/customers', formData);
      }
      setEditingCustomer(null);
      setFormData({ cust_fname: '', cust_lname: '', location: '', telephone: '' });
      refreshData();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      cust_fname: customer.cust_fname,
      cust_lname: customer.cust_lname,
      location: customer.location,
      telephone: customer.telephone
    });
  };

  return (
    <div>
      <div className="flex-between mb-4">
        <h1>Customers Management</h1>
        <Link to="/add-customer" className="btn btn-primary">
          <FaPlus /> Add Customer
        </Link>
      </div>

      {editingCustomer && (
        <div className="card mb-4">
          <h2>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="cust_fname"
                  value={formData.cust_fname}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="cust_lname"
                  value={formData.cust_lname}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telephone</label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="button-group">
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingCustomer ? 'Update' : 'Add'} Customer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Telephone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customerid}>
                <td>{customer.customerid}</td>
                <td>{customer.cust_fname} {customer.cust_lname}</td>
                <td>{customer.location}</td>
                <td>{customer.telephone}</td>
                <td>
                  <button
                    onClick={() => handleEdit(customer)}
                    className="btn btn-secondary mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete('customers', customer.customerid)}
                    className="btn btn-danger"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Orders View Component
const OrdersView = ({ orders, products, customers, onDelete, refreshData }) => {
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    orderdate: '',
    productcode: '',
    customerid: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        await axios.put(`http://localhost:3001/orders/${editingOrder.ordernumber}`, formData);
      } else {
        await axios.post('http://localhost:3001/orders', formData);
      }
      setEditingOrder(null);
      setFormData({ orderdate: '', productcode: '', customerid: '' });
      refreshData();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      orderdate: order.orderdate,
      productcode: order.productcode,
      customerid: order.customerid
    });
  };

  const getProductName = (productCode) => {
    const product = products.find(p => p.productcode === productCode);
    return product ? product.productname : 'Unknown';
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customerid === customerId);
    return customer ? `${customer.cust_fname} ${customer.cust_lname}` : 'Unknown';
  };

  return (
    <div>
      <div className="flex-between mb-4">
        <h1>Orders Management</h1>
        <Link to="/add-order" className="btn btn-primary">
          <FaPlus /> Add Order
        </Link>
      </div>

      {editingOrder && (
        <div className="card mb-4">
          <h2>{editingOrder ? 'Edit Order' : 'Add Order'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Order Date</label>
                <input
                  type="date"
                  name="orderdate"
                  value={formData.orderdate}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Product</label>
                <select
                  name="productcode"
                  value={formData.productcode}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.productcode} value={product.productcode}>
                      {product.productname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Customer</label>
                <select
                  name="customerid"
                  value={formData.customerid}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.customerid} value={customer.customerid}>
                      {customer.cust_fname} {customer.cust_lname}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="button-group">
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingOrder ? 'Update' : 'Add'} Order
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.ordernumber}>
                <td>{order.ordernumber}</td>
                <td>{new Date(order.orderdate).toLocaleDateString()}</td>
                <td>{getProductName(order.productcode)}</td>
                <td>{getCustomerName(order.customerid)}</td>
                <td>
                  <button
                    onClick={() => handleEdit(order)}
                    className="btn btn-secondary mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete('orders', order.ordernumber)}
                    className="btn btn-danger"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;