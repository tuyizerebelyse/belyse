import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar({ setIsAuthenticated }) {
    const [scrolled, setScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('');
    
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    // Determine active tab based on current route
    useEffect(() => {
        setActiveTab(window.location.pathname.split('/')[1] || 'home');
    }, []);

    return (
        <>
            {/* Floating particles background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-white/10"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 8 + 2}px`,
                            height: `${Math.random() * 8 + 2}px`,
                            animation: `float ${Math.random() * 15 + 5}s infinite ease-in-out alternate`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-2 bg-white/5 backdrop-blur-xl shadow-2xl' : 'py-4 bg-gradient-to-r from-indigo-900/90 to-blue-900/90'}`}>
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        {/* Logo with glow effect */}
                        <Link 
                            to="/" 
                            className="relative group mb-4 md:mb-0"
                            onClick={() => setActiveTab('home')}
                        >
                            <span className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${scrolled ? 'from-cyan-400 to-blue-500' : 'from-white to-blue-200'} group-hover:from-pink-400 group-hover:to-purple-500 transition-all duration-300`}>
                                EPMS
                            </span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                            <span className="absolute -inset-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-md"></span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex flex-wrap justify-center gap-1 md:gap-3 lg:gap-6">
                            <NavLink 
                                to="/employees" 
                                active={activeTab === 'employees'}
                                onClick={() => setActiveTab('employees')}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Employees
                            </NavLink>

                            <NavLink 
                                to="/departments" 
                                active={activeTab === 'departments'}
                                onClick={() => setActiveTab('departments')}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Departments
                            </NavLink>

                            <NavLink 
                                to="/salaries" 
                                active={activeTab === 'salaries'}
                                onClick={() => setActiveTab('salaries')}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Salaries
                            </NavLink>

                            <NavLink 
                                to="/report" 
                                active={activeTab === 'report'}
                                onClick={() => setActiveTab('report')}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Reports
                            </NavLink>

                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/90 to-rose-500/90 text-white font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 transform hover:scale-105"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* NavLink Component */}
            <style jsx global>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </>
    );
}

// Reusable NavLink component
function NavLink({ to, children, active, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`relative flex items-center px-3 py-2 rounded-full transition-all duration-300 group ${active ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'}`}
        >
            {children}
            {active && (
                <span className="absolute inset-x-1 -bottom-1 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></span>
            )}
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-white/5 transition-opacity duration-300"></span>
        </Link>
    );
}