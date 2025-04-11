import React from 'react';  
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation  

const Sidebar = ({ userRole }) => {  
  return (  
    <aside className="bg-[#007BFF] text-white w-64 h-screen p-4 fixed">  
      <h2 className="text-lg font-bold mb-6">Inventory Management</h2>  
      <nav>  
        <ul className="space-y-4">  
          <li>  
            <Link className="hover:text-[#FFD700]" to="/dashboard">Dashboard</Link>  
          </li>  
          <li>  
            <Link className="hover:text-[#FFD700]" to="/inventory">Inventory Management</Link>  
          </li>  
          <li>  
            <Link className="hover:text-[#FFD700]" to="/stock-levels">Stock Level Monitoring</Link>  
          </li>  
          <li>  
            <Link className="hover:text-[#FFD700]" to="/orders">Order Management</Link>  
          </li>  
          <li>  
            <Link className="hover:text-[#FFD700]" to="/delivery">Delivery & Reconciliation</Link>  
          </li>  
          <li>  
            <Link className="hover:text-[#FFD700]" to="/usage-tracking">Inventory Usage Tracking</Link>  
          </li>  
          <li>  
            <Link className="hover:text-[#FFD700]" to="/wastage-loss">Wastage & Loss Management</Link>  
          </li>  
          <li>  
            <Link className="hover:text-[#FFD700]" to="/reports">Reports & Analytics</Link>  
          </li>  
          {userRole === 'Admin' && (  
            <li>  
              <Link className="hover:text-[#FFD700]" to="/user-management">User Management</Link>  
            </li>  
          )}  
        </ul>  
      </nav>  
    </aside>  
  );  
};  

export default Sidebar;  