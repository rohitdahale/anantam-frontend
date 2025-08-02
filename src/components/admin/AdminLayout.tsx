import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  BookOpen, 
  ShoppingCart, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Briefcase,
  Handshake 
} from 'lucide-react';

// Admin user interface
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Package size={20} />, label: 'Products', path: '/admin/products' },
    { icon: <BookOpen size={20} />, label: 'Workshops', path: '/admin/workshops' },
    { icon: <Users size={20} />, label: 'Registrations', path: '/admin/registrations' },
    { icon: <ShoppingCart size={20} />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
    { icon: <BookOpen size={20} />, label: 'About Page', path: '/admin/about' },
    { icon: <Briefcase size={20} />, label: 'Services Page', path: '/admin/services' },
    { icon: <Handshake size={20} />, label: 'Collaborations', path: '/admin/collaborators' }

  ];

  // Function to check and update admin authentication status
  const checkAdminAuthStatus = (): void => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const userData = localStorage.getItem('adminUser') || localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setAdminUser({
          id: parsedUser._id || parsedUser.id,
          name: parsedUser.name || 'Admin User',
          email: parsedUser.email || '',
          role: parsedUser.role || 'admin'
        });
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        setAdminUser({
          id: 'admin',
          name: 'Admin User',
          email: '',
          role: 'admin'
        });
      }
    } else {
      // If no authentication data, redirect to login
      navigate('/auth');
    }
  };

  // Check authentication status on component mount and route changes
  useEffect(() => {
    checkAdminAuthStatus();
  }, [location, navigate]);

  // Listen for storage changes (in case admin data is updated in another tab)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent): void => {
      if (event.key === 'adminUser' || event.key === 'adminToken' || 
          event.key === 'user' || event.key === 'token') {
        checkAdminAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = (): void => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Clear admin user state
    setAdminUser(null);
    setIsProfileOpen(false);
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('adminLogout'));
    
    // Redirect to auth page
    navigate('/auth', { replace: true });
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfile = (): void => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (isProfileOpen && !target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <div className="min-h-screen bg-dark-800">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-dark-900 w-64">
          <div className="flex items-center justify-between mb-6 px-2">
            <span className="text-xl font-bold text-white">Admin Panel</span>
            <button 
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'md:ml-64' : ''}`}>
        {/* Header */}
        <header className="bg-dark-900 border-b border-dark-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              className="text-gray-300 hover:text-white md:hidden"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>

            <div className="relative ml-auto profile-dropdown">
              <button
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                onClick={toggleProfile}
                aria-label="Open profile menu"
              >
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                  alt="Admin Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                />
                <div className="text-left">
                  <div className="text-sm font-medium">
                    {adminUser?.name || 'Admin User'}
                  </div>
                  {adminUser?.email && (
                    <div className="text-xs text-gray-400">
                      {adminUser.email}
                    </div>
                  )}
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-dark-800 rounded-lg shadow-lg py-2 z-50 border border-dark-600">
                  <div className="px-4 py-2 border-b border-dark-600">
                    <p className="text-sm font-medium text-white">
                      {adminUser?.name || 'Admin User'}
                    </p>
                    {adminUser?.email && (
                      <p className="text-xs text-gray-400">
                        {adminUser.email}
                      </p>
                    )}
                    <p className="text-xs text-primary-400">
                      {adminUser?.role || 'Administrator'}
                    </p>
                  </div>
                  
                  <button
                    className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-dark-700 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;