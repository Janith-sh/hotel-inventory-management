import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MdInventory,
  MdStackedLineChart,
  MdShoppingCart,
  MdLocalShipping,
  MdTrendingUp,
  MdWarning,
  MdAnalytics,
  MdPeople,
  MdLogout 
} from 'react-icons/md';

const Header = ({ userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-[#1a237e] to-[#283593] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <MdInventory className="text-white text-3xl" />
          <div className="text-white font-bold leading-tight">
            <div className="text-sm">Inventory</div>
            <div className="text-sm">Management</div>
            <div className="text-sm">System</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-8">
          <ul className="flex items-center justify-center space-x-6">
            {[
              { to: '/inventory-management', icon: <MdInventory />, text: 'Inventory' },
              { to: '/stock-level', icon: <MdStackedLineChart />, text: 'Stock Level' },
              { to: '/orders', icon: <MdShoppingCart />, text: 'Orders' },
              { to: '/delivery', icon: <MdLocalShipping />, text: 'Delivery' },
              { to: '/usage-tracking', icon: <MdTrendingUp />, text: 'Usage' },
              { to: '/wastage-loss', icon: <MdWarning />, text: 'Wastage' },
              { to: '/reports', icon: <MdAnalytics />, text: 'Reports' },
            ].map(({ to, icon, text }) => (
              <li key={to}>
                <Link 
                  to={to}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200
                    ${location.pathname === to 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  {icon}
                  <span className="text-sm font-medium">{text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {userRole === 'Admin' && (
            <Link 
              to="/user-management"
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <MdPeople />
              <span className="text-sm font-medium">Users</span>
            </Link>
          )}
          {user ? (
            <>
              <span className="text-white text-sm font-medium">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                <MdLogout />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                <span className="text-sm font-medium">Sign Up</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                <MdLogout />
                <span className="text-sm font-medium">Login</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;