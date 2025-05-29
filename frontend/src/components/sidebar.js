import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdInventory, 
  MdStackedLineChart,
  MdShoppingCart,
  MdLocalShipping,
  MdTrendingUp,
  MdWarning,
  MdAnalytics,
  MdPeople
} from 'react-icons/md';

const Sidebar = ({ userRole }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <MdDashboard className="text-xl" /> },
    { path: '/inventory-management', name: 'Inventory Management', icon: <MdInventory className="text-xl" /> },
    { path: '/stock-level', name: 'Stock Level Monitoring', icon: <MdStackedLineChart className="text-xl" /> },
    { path: '/orders', name: 'Order Management', icon: <MdShoppingCart className="text-xl" /> },
    { path: '/delivery', name: 'Delivery & Reconciliation', icon: <MdLocalShipping className="text-xl" /> },
    { path: '/usage-tracking', name: 'Inventory Usage Tracking', icon: <MdTrendingUp className="text-xl" /> },
    { path: '/wastage-loss', name: 'Wastage & Loss Management', icon: <MdWarning className="text-xl" /> },
    { path: '/reports', name: 'Reports & Analytics', icon: <MdAnalytics className="text-xl" /> }
  ];

  return (
    <aside className="bg-[#1a237e] text-white w-64 h-screen p-4 fixed shadow-lg">
      <div className="flex items-center gap-2 mb-8 px-2">
        <MdInventory className="text-2xl" />
        <h2 className="text-lg font-bold">IMS</h2>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
                  ${location.pathname === item.path 
                    ? 'bg-white/10 text-white' 
                    : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
          
          {userRole === 'Admin' && (
            <li>
              <Link
                to="/user-management"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
                  ${location.pathname === '/user-management' 
                    ? 'bg-white/10 text-white' 
                    : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
              >
                <MdPeople className="text-xl" />
                <span>User Management</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;