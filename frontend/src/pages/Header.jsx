import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import {  FaSignInAlt, FaSignOutAlt,  FaUser, FaBars, FaTimes } from 'react-icons/fa';
import axios from "axios";

const Header = ({ cart = [], showCart, setShowCart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Program', path: '/myprograms' },
    { name: 'Schedule', path: '/schedule' },

  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/user', { withCredentials: true });
        if (res.data.user) setUserData(res.data.user);
      } catch (err) {
        console.error("User fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const initials = userData
    ? `${userData.name?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`
    : '';

  const handleProfileClick = () => {
    if (userData) {
      navigate("/profile");
    } else {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate("/login");
    }
  };



  const handleLogout = async () => {
    try {
      const res = await axios.post('http://localhost:5001/logout', {}, { withCredentials: true });
      if (res.status === 200) {
        localStorage.removeItem('redirectAfterLogin');
        navigate('/login');
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed w-full z-50 px-4 md:px-8 transition-all duration-300 ${
        scrolled 
          ? 'bg-teal-600 shadow-lg shadow-emerald-800/30 backdrop-blur-sm'
          : 'bg-gradient-to-br from-teal-700 to-teal-500'
      }`}
    >
      <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
        {/* Left: Logo + Text */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            <img 
              src="/images/logo.PNG"
              alt="HealthCenter Logo"
              className="h-12 w-auto mr-3 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-3xl font-light text-emerald-100 tracking-tight font-serif">
             Health<span className="font-medium">Center</span>
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 text-emerald-100 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Center: Navigation Items (Desktop) */}
        <div className="hidden md:flex space-x-10 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-lg font-normal transition-all duration-300 relative group font-sans ${
                location.pathname === item.path
                  ? 'text-emerald-300'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-1 left-0 w-0 h-px bg-emerald-300 transition-all duration-500 group-hover:w-full ${
                location.pathname === item.path ? 'w-full' : ''
              }`}></span>
            </Link>
          ))}
        </div>

        {/* Right: Icons */}
        <div className="hidden md:flex space-x-5 items-center">
     
      

          {/* Profile */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProfileClick}
            className="cursor-pointer ml-4"
          >
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : userData ? (
              userData.profileImage ? (
                <img
                  src={`data:image/jpeg;base64,${userData.profileImage}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 hover:border-blue-600 transition-colors"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 font-bold">
                    {initials}
                  </span>
                </div>
              )
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <FaUser className="text-gray-600" />
              </div>
            )}
          </motion.div>

          {userData ? (
              (["Owner", "Fizioterapeut", "Nutricionist", "Trajner", "Psikolog"].includes(userData.role) || 
              (userData.role === "Client" && ["Owner", "Admin", "Manager"].includes(userData.dashboardRole))) ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-4"
                >
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-4 py-2 rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-300 ${
                      scrolled ? '' : 'shadow-lg'
                    }`}
                  >
                    <FaUser className="mr-2" />
                    Dashboard
                  </Link>
                </motion.div>
              ) : null
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4"
              >
               
              </motion.div>
            )}

          {/* Login/Logout */}
          {userData ? (
            <button   data-testid="logout-button"
              onClick={handleLogout} 
              className="p-2.5 rounded-full bg-rose-800/40 hover:bg-rose-700/50 text-rose-100 hover:text-white transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-rose-300/50"
            >
              <FaSignOutAlt />
            </button>
          ) : (
            <Link 
              to="/login" 
              className="p-2.5 rounded-full bg-emerald-700/40 hover:bg-emerald-600/50 text-emerald-100 hover:text-white transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-emerald-300/50"
            >
              <FaSignInAlt />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-emerald-800 shadow-lg"
        >
          <div className="px-4 py-2 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-lg font-medium ${
                  location.pathname === item.path
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-emerald-700 flex flex-col space-y-4">
       

         
              <button
                onClick={() => {
                  handleProfileClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-lg font-medium text-emerald-100 hover:bg-emerald-700 hover:text-white"
              >
                <FaUser className="mr-3" />
                Profile
              </button>

              {userData && (["Owner", "Fizioterapeut", "Nutricionist", "Trajner", "Psikolog"].includes(userData.role) || 
                (userData.role === "Client" && ["Owner", "Admin", "Manager"].includes(userData.dashboardRole)) && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-lg font-medium text-emerald-100 hover:bg-emerald-700 hover:text-white"
                >
                  <FaUser className="mr-3" />
                  Dashboard
                </Link>
))}


              {userData ? (
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center px-3 py-2 rounded-md text-lg font-medium text-rose-100 hover:bg-rose-700 hover:text-white"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-lg font-medium text-emerald-100 hover:bg-emerald-700 hover:text-white"
                >
                  <FaSignInAlt className="mr-3" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;