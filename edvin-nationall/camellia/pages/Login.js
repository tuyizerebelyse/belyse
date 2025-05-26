import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { FaUser, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient">
      {/* Animated background bubbles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              opacity: 0.1,
              animation: `float ${Math.random() * 20 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md px-8 py-12 bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 transform transition-all duration-500 hover:scale-[1.02]">
        {/* Decorative elements */}
        <div className="absolute -top-5 -left-5 w-20 h-20 bg-purple-400/30 rounded-full filter blur-xl"></div>
        <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-pink-400/30 rounded-full filter blur-xl"></div>
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white drop-shadow-md mb-2">Welcome Back</h2>
          <p className="text-white/80">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/70 group-focus-within:text-purple-300 transition-colors">
              <FaUser />
            </div>
            <input
              type="text"
              name="username"
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/70 group-focus-within:text-purple-300 transition-colors">
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 bg-white/10 border-white/20 rounded focus:ring-purple-300"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-white/80">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-white/80 hover:text-purple-200 transition-colors">
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="p-3 bg-red-400/20 border border-red-400/40 rounded-lg text-red-100 text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/80">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-semibold text-white hover:text-purple-200 underline underline-offset-4 decoration-white/30 hover:decoration-purple-200 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Add the animation keyframes in your global CSS */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, 20px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Login;