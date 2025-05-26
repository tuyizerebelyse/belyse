import React, { useState } from "react";
import {
  ShoppingBag,
  User,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

 const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const endpoint = activeTab === "login" ? "http://localhost:4000/login" : "http://localhost:4000/user";
  
    try {
      const { data } = await axios.post(endpoint, formData);
      console.log(data);

      if (activeTab === "signup") {
        alert("Account created successfully!");
      } else {
        // You can store session/token here if needed
        navigate("/dashboard"); // Redirect to dashboard after login
      }
      // You can handle redirect/session setup here
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.message;

      if(activeTab === "signup" && errorMsg.toLowerCase().includes("username")) {
        alert("Username is already taken. Please choose another one.");
      } else {
      }

      if (error.response?.status === 409) {
        alert("Username already taken. Please choose another.");
      } else if (error.response?.status === 401) {
        alert("Invalid credentials.");
      } else {
        alert("An error occurred: " + (error.response?.data || error.message));
      }

    }
  };

  return (
    <div className="welcome-page">
      <style>{`
        .welcome-page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: sans-serif;
          overflow: hidden;
        }

        header {
          background-color: white;
          padding: 1rem 1.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .header-content {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .brand span {
          color: #facc15;
        }

        main {
          display: flex;
          flex: 1;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          main {
            flex-direction: row;
          }
        }

        .welcome-section {
          flex: 1;
          background-color: #2563eb;
          color: white;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .welcome-content {
          max-width: 32rem;
        }

        .welcome-content h1 {
          font-size: 2.25rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }

        .welcome-content p {
          color: #bfdbfe;
          margin-bottom: 2rem;
          font-size: 1.125rem;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .feature-icon {
          background-color: #3b82f6;
          padding: 0.5rem;
          border-radius: 9999px;
        }

        .auth-section {
          flex: 1;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow-y: auto;
        }

        .auth-container {
          width: 100%;
          max-width: 28rem;
        }

        .tab-selector {
          display: flex;
          margin-bottom: 2rem;
          background-color: #f3f4f6;
          border-radius: 0.5rem;
          padding: 0.25rem;
        }

        .tab-button {
          flex: 1;
          padding: 0.75rem 0;
          font-weight: 500;
          font-size: 0.875rem;
          border-radius: 0.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .tab-button.active {
          background-color: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .auth-form {
          background-color: white;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .auth-form h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
        }

        .form-input-wrapper {
          position: relative;
        }

        .form-input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
        }

        .toggle-password {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
        }

        .form-button {
          width: 100%;
          background-color: #2563eb;
          color: white;
          font-weight: 500;
          padding: 0.75rem;
          border-radius: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          border: none;
          cursor: pointer;
        }

        footer {
          background-color: white;
          padding: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>

      <header>
        <div className="header-content">
          <div className="brand">
            <ShoppingBag size={32} className="text-yellow-400" />
            BERWA<span>SHOP</span>
          </div>
        </div>
      </header>

      <main>
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome to BERWA Shop Admin</h1>
            <p>
              Manage your inventory, track sales, and grow your business with our comprehensive admin dashboard.
            </p>
            <div className="features">
              <div className="feature">
                <div className="feature-icon"><ShoppingBag size={20} /></div>
                <div>Complete inventory management</div>
              </div>
              <div className="feature">
                <div className="feature-icon"><ArrowRight size={20} /></div>
                <div>Real-time sales tracking</div>
              </div>
              <div className="feature">
                <div className="feature-icon"><ArrowRight size={20} /></div>
                <div>Comprehensive analytics and reporting</div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-section">
          <div className="auth-container">
            <div className="tab-selector">
              <button
                className={`tab-button ${activeTab === "login" ? "active" : ""}`}
                onClick={() => setActiveTab("login")}
              >
                Sign In
              </button>
              <button
                className={`tab-button ${activeTab === "signup" ? "active" : ""}`}
                onClick={() => setActiveTab("signup")}
              >
                Create Account
              </button>
            </div>

            <div className="auth-form">
              <h2>{activeTab === "login" ? "Sign in" : "Create account"}</h2>

              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="form-input-wrapper">
                  <User size={18} className="form-input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="yourname"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-wrapper">
                  <Lock size={18} className="form-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button className="form-button" onClick={handleSubmit}>
                {activeTab === "login" ? "Sign In" : "Create Account"} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer>© 2025 BERWA Shop. All rights reserved.</footer>
    </div>
  );
};

export default Home;
