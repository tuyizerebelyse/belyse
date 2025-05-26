import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Table, Button, Modal, Form, Card, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Set axios to send credentials with requests
axios.defaults.withCredentials = true;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/check-auth');
        setIsAuthenticated(response.data.authenticated);
        setUser(response.data.user || null);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" className="smartpark-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="smartpark-navbar-brand">SmartPark CRPMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isAuthenticated && (
                <>
                  <Nav.Link as={Link} to="/cars" className="smartpark-nav-link">Cars</Nav.Link>
                  <Nav.Link as={Link} to="/services" className="smartpark-nav-link">Services</Nav.Link>
                  <Nav.Link as={Link} to="/service-records" className="smartpark-nav-link">Service Records</Nav.Link>
                  <Nav.Link as={Link} to="/payments" className="smartpark-nav-link">Payments</Nav.Link>
                  <Nav.Link as={Link} to="/reports" className="smartpark-nav-link">Reports</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <>
                  <Navbar.Text className="me-3">
                    Welcome, {user?.username}
                  </Navbar.Text>
                  <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="smartpark-nav-link">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register" className="smartpark-nav-link">Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route path="/cars" element={isAuthenticated ? <Cars /> : <Navigate to="/login" />} />
          <Route path="/services" element={isAuthenticated ? <Services /> : <Navigate to="/login" />} />
          <Route path="/service-records" element={isAuthenticated ? <ServiceRecords /> : <Navigate to="/login" />} />
          <Route path="/payments" element={isAuthenticated ? <Payments /> : <Navigate to="/login" />} />
          <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />
        </Routes>
      </Container>
    </Router>
  );
}

// Login Component
function Login({ setIsAuthenticated, setUser }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      setIsAuthenticated(true);
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <Card.Title className="text-center mb-4">Login</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 smartpark-btn">
              Login
            </Button>
          </Form>
          <div className="mt-3 text-center">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/register', {
        username: formData.username,
        password: formData.password
      });
      setSuccess('Registration successful! You will be redirected to login...');
      setFormData({
        username: '',
        password: '',
        confirmPassword: ''
      });
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <Card.Title className="text-center mb-4">Register</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 smartpark-btn">
              Register
            </Button>
          </Form>
          <div className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
// Add this to your existing styles
const additionalStyles = `
  /* Auth Styles */
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
  }
  
  .auth-card {
    width: 100%;
    max-width: 400px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: none;
  }
  
  .auth-card .card-body {
    padding: 2rem;
  }
  
  .auth-card .card-title {
    font-size: 1.8rem;
    color: #2c3e50;
  }
`;

// Inject additional styles
const additionalStyleElement = document.createElement('style');
additionalStyleElement.innerHTML = additionalStyles;
document.head.appendChild(additionalStyleElement);

// Dashboard Component (unchanged)
function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalCars: 0,
    totalServices: 0,
    pendingPayments: 0,
    totalRevenueToday: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [carsRes, servicesRes, paymentsRes, serviceRecordsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/cars'),
          axios.get('http://localhost:5000/api/services'),
          axios.get('http://localhost:5000/api/payments'),
          axios.get('http://localhost:5000/api/service-records'),
        ]);

        const totalCars = carsRes.data.length;
        const totalServices = servicesRes.data.length;

        // Calculate pending payments
        const pendingPayments = serviceRecordsRes.data.filter(record => {
          const paidAmount = paymentsRes.data
            .filter(payment => payment.RecordNumber === record.RecordNumber)
            .reduce((sum, payment) => sum + payment.AmountPaid, 0);
          return paidAmount < record.ServicePrice;
        }).length;

        // Calculate total revenue today
        const today = new Date().toISOString().split('T')[0];
        const totalRevenueToday = paymentsRes.data
          .filter(payment => new Date(payment.PaymentDate).toISOString().split('T')[0] === today)
          .reduce((sum, payment) => sum + payment.AmountPaid, 0);

        setDashboardData({
          totalCars,
          totalServices,
          pendingPayments,
          totalRevenueToday,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <p className="dashboard-welcome-text">Welcome to SmartPark Car Repair Payment Management System</p>

      <Row className="mt-4 dashboard-cards-row">
        <Col md={3}>
          <Card className="dashboard-card car-card">
            <Card.Body>
              <Card.Title className="dashboard-card-title">Total Cars</Card.Title>
              <Card.Text className="dashboard-card-text">{dashboardData.totalCars}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card service-card">
            <Card.Body>
              <Card.Title className="dashboard-card-title">Total Services Offered</Card.Title>
              <Card.Text className="dashboard-card-text">{dashboardData.totalServices}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card pending-card">
            <Card.Body>
              <Card.Title className="dashboard-card-title">Pending Payments</Card.Title>
              <Card.Text className="dashboard-card-text">{dashboardData.pendingPayments}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
    
      </Row>
    </div>
  );
}

// Cars Component (unchanged)
function Cars() {
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    PlateNumber: '',
    Type: '',
    Model: '',
    ManufacturingYear: '',
    DriverPhone: '',
    MechanicName: ''
  });

  useEffect(() => {
    const fetchCars = async () => {
      const response = await axios.get('http://localhost:5000/api/cars');
      setCars(response.data);
    };
    fetchCars();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/cars', formData);
    setShowModal(false);
    const response = await axios.get('http://localhost:5000/api/cars');
    setCars(response.data);
    setFormData({
      PlateNumber: '',
      Type: '',
      Model: '',
      ManufacturingYear: '',
      DriverPhone: '',
      MechanicName: ''
    });
  };

  return (
    <div>
      <h2>Cars</h2>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3 smartpark-btn">
        Add New Car
      </Button>

      <Table striped bordered hover className="smartpark-table">
        <thead>
          <tr>
            <th>Plate Number</th>
            <th>Type</th>
            <th>Model</th>
            <th>Year</th>
            <th>Driver Phone</th>
            <th>Mechanic</th>
          </tr>
        </thead>
        <tbody>
          {cars.map(car => (
            <tr key={car.PlateNumber}>
              <td>{car.PlateNumber}</td>
              <td>{car.Type}</td>
              <td>{car.Model}</td>
              <td>{car.ManufacturingYear}</td>
              <td>{car.DriverPhone}</td>
              <td>{car.MechanicName}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Plate Number</Form.Label>
              <Form.Control type="text" name="PlateNumber" value={formData.PlateNumber} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" name="Type" value={formData.Type} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Model</Form.Label>
              <Form.Control type="text" name="Model" value={formData.Model} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Manufacturing Year</Form.Label>
              <Form.Control type="number" name="ManufacturingYear" value={formData.ManufacturingYear} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Driver Phone</Form.Label>
              <Form.Control type="text" name="DriverPhone" value={formData.DriverPhone} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mechanic Name</Form.Label>
              <Form.Control type="text" name="MechanicName" value={formData.MechanicName} onChange={handleInputChange} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="smartpark-btn">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

// Services Component (unchanged)
function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data);
    };
    fetchServices();
  }, []);

  return (
    <div>
      <h2>Services</h2>
      <Table striped bordered hover className="smartpark-table">
        <thead>
          <tr>
            <th>Service Code</th>
            <th>Service Name</th>
            <th>Price (RWF)</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.ServiceCode}>
              <td>{service.ServiceCode}</td>
              <td>{service.ServiceName}</td>
              <td>{service.ServicePrice.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

// ServiceRecords Component (unchanged)
function ServiceRecords() {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    PlateNumber: '',
    ServiceCode: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const [recordsRes, carsRes, servicesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/service-records'),
        axios.get('http://localhost:5000/api/cars'),
        axios.get('http://localhost:5000/api/services')
      ]);
      setRecords(recordsRes.data);
      setCars(carsRes.data);
      setServices(servicesRes.data);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/service-records', formData);
    setShowModal(false);
    const response = await axios.get('http://localhost:5000/api/service-records');
    setRecords(response.data);
    setFormData({
      PlateNumber: '',
      ServiceCode: ''
    });
  };

  return (
    <div>
      <h2>Service Records</h2>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3 smartpark-btn">
        Add New Service Record
      </Button>

      <Table striped bordered hover className="smartpark-table">
        <thead>
          <tr>
            <th>Record #</th>
            <th>Plate Number</th>
            <th>Car Type</th>
            <th>Car Model</th>
            <th>Service</th>
            <th>Price (RWF)</th>
            <th>Service Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.RecordNumber}>
              <td>{record.RecordNumber}</td>
              <td>{record.PlateNumber}</td>
              <td>{record.Type}</td>
              <td>{record.Model}</td>
              <td>{record.ServiceName}</td>
              <td>{record.ServicePrice.toLocaleString()}</td>
              <td>{new Date(record.ServiceDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Service Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Car</Form.Label>
              <Form.Select name="PlateNumber" value={formData.PlateNumber} onChange={handleInputChange} required>
                <option value="">Select a car</option>
                {cars.map(car => (
                  <option key={car.PlateNumber} value={car.PlateNumber}>
                    {car.PlateNumber} - {car.Type} {car.Model}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Service</Form.Label>
              <Form.Select name="ServiceCode" value={formData.ServiceCode} onChange={handleInputChange} required>
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.ServiceCode} value={service.ServiceCode}>
                    {service.ServiceName} - {service.ServicePrice.toLocaleString()} RWF
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="smartpark-btn">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

// Payments Component (unchanged)
function Payments() {
  const [payments, setPayments] = useState([]);
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    RecordNumber: '',
    AmountPaid: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const [paymentsRes, recordsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/payments'),
        axios.get('http://localhost:5000/api/service-records')
      ]);
      setPayments(paymentsRes.data);
      setRecords(recordsRes.data);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/payments', {
      RecordNumber: formData.RecordNumber,
      AmountPaid: formData.AmountPaid
    });
    setShowModal(false);
    const response = await axios.get('http://localhost:5000/api/payments');
    setPayments(response.data);
    setFormData({
      RecordNumber: '',
      AmountPaid: ''
    });
  };

  return (
    <div>
      <h2>Payments</h2>
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3 smartpark-btn">
        Add New Payment
      </Button>

      <Table striped bordered hover className="smartpark-table">
        <thead>
          <tr>
            <th>Payment #</th>
            <th>Record #</th>
            <th>Plate Number</th>
            <th>Car Type</th>
            <th>Car Model</th>
            <th>Service</th>
            <th>Service Price (RWF)</th>
            <th>Amount Paid (RWF)</th>
            <th>Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.PaymentNumber}>
              <td>{payment.PaymentNumber}</td>
              <td>{payment.RecordNumber}</td>
              <td>{payment.PlateNumber}</td>
              <td>{payment.Type}</td>
              <td>{payment.Model}</td>
              <td>{payment.ServiceName}</td>
              <td>{payment.ServicePrice.toLocaleString()}</td>
              <td>{payment.AmountPaid.toLocaleString()}</td>
              <td>{new Date(payment.PaymentDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Service Record</Form.Label>
              <Form.Select name="RecordNumber" value={formData.RecordNumber} onChange={handleInputChange} required>
                <option value="">Select a service record</option>
                {records.map(record => (
                  <option key={record.RecordNumber} value={record.RecordNumber}>
                    #{record.RecordNumber} - {record.PlateNumber} ({record.ServiceName})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount Paid (RWF)</Form.Label>
              <Form.Control type="number" name="AmountPaid" value={formData.AmountPaid} onChange={handleInputChange} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="smartpark-btn">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

// Reports Component (unchanged)
function Reports() {
  const [dailyReport, setDailyReport] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDailyReport = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reports/daily?date=${date}`);
      setDailyReport(response.data);
    } catch (error) {
      console.error('Error fetching daily report:', error);
    }
  }, [date]);

  useEffect(() => {
    fetchDailyReport();
  }, [fetchDailyReport]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  return (
    <div>
      <h2>Daily Reports</h2>
      <Form.Group className="mb-3" style={{ maxWidth: '300px' }}>
        <Form.Label>Select Date</Form.Label>
        <Form.Control type="date" value={date} onChange={handleDateChange} />
      </Form.Group>

      <Table striped bordered hover className="smartpark-table">
        <thead>
          <tr>
            <th>Payment Date</th>
            <th>Plate Number</th>
            <th>Car Type</th>
            <th>Car Model</th>
            <th>Service</th>
            <th>Service Price (RWF)</th>
            <th>Amount Paid (RWF)</th>
          </tr>
        </thead>
        <tbody>
          {dailyReport.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.PaymentDate).toLocaleString()}</td>
              <td>{item.PlateNumber}</td>
              <td>{item.Type}</td>
              <td>{item.Model}</td>
              <td>{item.ServiceName}</td>
              <td>{item.ServicePrice.toLocaleString()}</td>
              <td>{item.AmountPaid.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {dailyReport.length > 0 && (
        <div className="mt-3 report-total-section">
          <h5>Total for {date}: {dailyReport.reduce((sum, item) => sum + item.AmountPaid, 0).toLocaleString()} RWF</h5>
        </div>
      )}
    </div>
  );
}

// Modern CSS Styling - Added without removing any original code
const styles = `
  /* Modern App Styling */
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f0f2f5; /* Lighter background */
    color: #333;
    line-height: 1.6;
  }

  /* --- Navbar Styling --- */
  .smartpark-navbar {
    background-color: #2c3e50 !important; /* Darker, more professional blue */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    padding: 1rem 0;
    transition: all 0.4s ease-in-out;
  }

  .smartpark-navbar:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  .smartpark-navbar-brand {
    font-weight: 800;
    font-size: 1.6rem;
    color: #ecf0f1 !important; /* Lighter text for brand */
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  }

  .smartpark-navbar-brand:hover {
    color: #3498db !important; /* Subtle hover effect */
    transform: scale(1.02);
  }

  .smartpark-nav-link {
    font-weight: 600;
    padding: 0.6rem 1.2rem;
    margin: 0 0.3rem;
    border-radius: 0.6rem;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    color: #bdc3c7 !important; /* Muted white */
    position: relative;
    overflow: hidden;
  }

  .smartpark-nav-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .smartpark-nav-link:hover::before {
    left: 100%;
  }

  .smartpark-nav-link:hover {
    background-color: rgba(52, 152, 219, 0.15) !important; /* Blue tint on hover */
    color: #3498db !important; /* Brighter blue */
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  /* --- Dashboard Styling --- */
  .dashboard-container {
    padding: 30px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    animation: fadeIn 1s ease-out;
  }

  .dashboard-title {
    color: #2c3e50;
    margin-bottom: 25px;
    font-weight: 700;
    font-size: 2.5rem;
    text-align: center;
    position: relative;
  }

  .dashboard-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: #3498db;
    border-radius: 2px;
  }

  .dashboard-welcome-text {
    text-align: center;
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 40px;
  }

  .dashboard-cards-row {
    display: flex;
    justify-content: space-around;
    gap: 20px;
  }

  .dashboard-card {
    border: none;
    border-radius: 15px;
    text-align: center;
    padding: 25px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: pointer;
    overflow: hidden;
    position: relative;
    height:200px;
    width:200px;
  }

  .dashboard-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: transparent;
    transition: background-color 0.3s ease-out;
  }

  .dashboard-card:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .dashboard-card:hover::before {
    background-color: var(--card-hover-color);
  }

  .car-card { background-color: #e8f5e9; --card-hover-color: #4CAF50; } /* Light Green */
  .service-card { background-color: #e3f2fd; --card-hover-color: #2196F3; } /* Light Blue */
  .pending-card { background-color: #ffebee; --card-hover-color: #F44336; } /* Light Red */
  .revenue-card { background-color: #fffde7; --card-hover-color: #FFC107; } /* Light Amber */

  .dashboard-card-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #34495e;
  }

  .dashboard-card-text {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
  }

  .car-card .dashboard-card-text { color: #4CAF50; }
  .service-card .dashboard-card-text { color: #2196F3; }
  .pending-card .dashboard-card-text { color: #F44336; }
  .revenue-card .dashboard-card-text { color: #FFC107; }

  /* --- Table Styling --- */
  .smartpark-table {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    border-collapse: separate; /* Required for border-radius to work on table */
    border-spacing: 0; /* Required with separate */
  }

  .smartpark-table thead th {
    background-color: #3498db; /* A vibrant blue */
    color: white;
    border-color: #3498db;
    padding: 15px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .smartpark-table tbody tr {
    transition: all 0.3s ease;
  }

  .smartpark-table tbody tr:hover {
    background-color: #eaf6fd; /* Light blue on hover */
    transform: scale(1.005);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .smartpark-table tbody td {
    padding: 12px 15px;
    vertical-align: middle;
    border-color: #f0f0f0;
    color: #444;
  }

  /* --- Button Styling --- */
  .smartpark-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.6rem;
    font-weight: 600;
    transition: all 0.3s ease-in-out;
    background-image: linear-gradient(to right, #3498db 0%, #2980b9 100%);
    border: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    color: white;
  }

  .smartpark-btn:hover {
    background-image: linear-gradient(to right, #2980b9 0%, #3498db 100%);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  /* --- Modal Styling --- */
  .modal-content {
    border-radius: 1rem;
    border: none;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .modal-header {
    background-color: #3498db;
    color: white;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    padding: 20px;
    border-bottom: none;
  }

  .modal-title {
    font-weight: 700;
    font-size: 1.7rem;
  }

  .modal-body {
    padding: 30px;
  }

  .modal-footer {
    border-top: none;
    padding: 20px 30px;
  }

  /* --- Form Styling --- */
  .form-group label {
    font-weight: 600;
    color: #555;
    margin-bottom: 8px;
    display: block;
  }

  .form-control, .form-select {
    padding: 0.8rem 1rem;
    border-radius: 0.6rem;
    border: 1px solid #ced4da;
    transition: all 0.3s ease;
    background-color: #fdfdfd;
  }

  .form-control:focus, .form-select:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
    background-color: #ffffff;
  }

  /* --- Reports Specific Styling --- */
  .report-total-section {
    background-color: #e6f7ff;
    border: 1px solid #b3e0ff;
    padding: 15px 20px;
    border-radius: 10px;
    margin-top: 30px;
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  /* --- Animations --- */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  /* --- Responsive Adjustments --- */
  @media (max-width: 992px) {
    .dashboard-cards-row {
      flex-wrap: wrap;
    }
    .dashboard-card {
      width: 48%; /* Two cards per row */
      margin-bottom: 20px;
    }
  }

  @media (max-width: 768px) {
    .navbar-brand {
      font-size: 1.2rem;
    }
    .smartpark-nav-link {
      padding: 0.4rem 0.8rem;
    }
    .table {
      font-size: 0.85rem;
    }
    .dashboard-card {
      width: 100%; /* Single card per row */
    }
  }

  @media (max-width: 576px) {
    .dashboard-title {
      font-size: 2rem;
    }
    .dashboard-card-text {
      font-size: 1.8rem;
    }
    .smartpark-btn {
      width: 100%;
      margin-bottom: 15px;
    }
    .modal-body {
      padding: 20px;
    }
  }
`;

// Inject styles into the document head
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default App;