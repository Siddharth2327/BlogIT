import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, PlusCircle, FileText, Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { GetCurrentUser } from '../Apicalls/users';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);

  const currentUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize user on component mount
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      
      // // Always clear the user state first
      // dispatch(setUser(null));
      
      if (token) {
        try {
          const response = await GetCurrentUser();
          if (response.success) {
            dispatch(setUser(response.data));
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("token");
            dispatch(setUser(null));
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          // Token is invalid, remove it
          localStorage.removeItem("token");
          dispatch(setUser(null));
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, [dispatch]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear token first
    localStorage.removeItem('token');
    // Clear user state
    dispatch(setUser(null));
    // Close dropdowns
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    // Navigate to home
    navigate('/');
  };

  const handleNavigation = (page) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/${page}`);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">BlogIT</h1>
            </div>
            <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={() => handleNavigation('')}
          >
            <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              BlogIT
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleNavigation('')}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </button>

            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <User size={18} />
                  <span>My Profile</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p>
                    </div>
                    
                    <button
                      onClick={() => handleNavigation('my-blogs')}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FileText size={16} />
                      <span>My Blogs</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation('create')}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <PlusCircle size={16} />
                      <span>Create New Blog</span>
                    </button>
                    
                    <hr className="my-1" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation('')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
              >
                Home
              </button>

              {currentUser ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900">{currentUser.email}</p>
                  </div>
                  
                  <button
                    onClick={() => handleNavigation('my-blogs')}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  >
                    <FileText size={16} />
                    <span>My Blogs</span>
                  </button>
                  
                  <button
                    onClick={() => handleNavigation('create')}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  >
                    <PlusCircle size={16} />
                    <span>Create New Blog</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigation('login')}
                  className="block w-full text-left px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;