import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Package, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import your custom logo
import logo from '../../assets/anantam-logo.png'; // Adjust the path according to your assets structure

// Add User interface
interface UserData {
  id: string;
  name: string;
  email: string;
}

interface NavbarProps {
  scrolled: boolean;
}

const Navbar = ({ scrolled }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to check and update authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token) {
      setIsAuthenticated(true);
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Check authentication status on component mount and route changes
  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  // Listen for user updates from other components
  useEffect(() => {
    const handleUserUpdate = (event: CustomEvent) => {
      const { user: updatedUser } = event.detail;
      setUser({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
      });
    };

    // Add event listener for user updates
    window.addEventListener('userUpdated', handleUserUpdate as EventListener);

    // Also listen for storage changes (in case user data is updated in another tab)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user' || event.key === 'token') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    if (isOpen) setIsOpen(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    // { name: 'Portfolio', path: '/portfolio' },
    { name: 'Workshops', path: '/workshops' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage ? 'bg-dark-800/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between h-20">
          <Link 
            to="/" 
            className="flex items-center space-x-2" 
            onClick={closeMenu}
          >
            <img 
              src={logo} 
              alt="Anantam Aerial Logo" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold tracking-tight">
              Anantam Aerials And Robotics
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-active' : 'nav-link'
                }
                end
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <User size={18} />
                  <span className="text-sm">
                    {user?.name || 'User'}
                  </span>
                </button>
                
                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-dark-700 rounded-lg shadow-lg py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package size={16} className="mr-2" />
                        Your Orders
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} className="mr-2" />
                        Settings
                      </Link>
                      <hr className="border-dark-600 my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-dark-600"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="btn-outline py-2 px-4 flex items-center space-x-2"
              >
                <User size={18} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-md p-2 text-gray-300 hover:text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark-800 shadow-lg overflow-hidden"
          >
            <div className="container-custom mx-auto py-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded-lg ${
                      isActive ? 'bg-dark-700 text-primary-400' : 'text-gray-300 hover:bg-dark-700'
                    }`
                  }
                  onClick={closeMenu}
                  end
                >
                  {link.name}
                </NavLink>
              ))}
              
              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="mt-4 pt-4 border-t border-dark-600">
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Welcome, {user?.name || 'User'}
                  </div>
                  <Link
                    to="/profile"
                    className="block py-2 px-4 text-gray-300 hover:bg-dark-700 rounded-lg"
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block py-2 px-4 text-gray-300 hover:bg-dark-700 rounded-lg"
                    onClick={closeMenu}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="block w-full text-left py-2 px-4 text-red-400 hover:bg-dark-700 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="block py-2 px-4 mt-4 bg-primary-600 text-white rounded-lg"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;