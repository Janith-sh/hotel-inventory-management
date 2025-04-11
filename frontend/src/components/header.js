import React from 'react';  
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation  

const Header = ({ userRole, onLogout }) => {  
  return (  
    <header className="bg-[#007BFF] p-4 shadow-md">  
      <div className="container mx-auto flex justify-between items-center">  
        <h1 className="text-white text-2xl font-bold">Inventory Management System</h1>  
        <nav>  
          <ul className="flex space-x-6">  
            <li>  
              <Link className="text-white hover:text-[#FFD700]" to="/">Login</Link>  
            </li>  
            <li>  
              <Link className="text-white hover:text-[#FFD700]" to="/dashboard">Dashboard</Link>  
            </li>  
            <li>  
              <Link className="text-white hover:text-[#FFD700]" to="/inventory">Inventory Management</Link>  
            </li>  
            <li>  
              <Link className="text-white hover:text-[#FFD700]" to="/stock-levels">Stock Level Monitoring</Link>  
            </li>  
            <li>  
              <Link className="text-white hover:text-[#FFD700]" to="/orders">Order Management</Link>  
            </li>  
            <li>  
              <Link className="text-white hover:text-[#FFD700]" to="/delivery">Delivery & Reconciliation</Link>  
            </li>  
            <li>  
              <Link className="text-white hover:text-[#FFD700]" to="/usage-tracking">Inventory Usage Tracking</Link>  
            </li>  
            <li>  
              <Link className="text-white hover:text-[#FFD700]" to="/wastage-loss">Wastage & Loss Management</Link>  
            </li>  
            <li>  
              <Link className="text-white hover:text-[#FFD700]" to="/reports">Reports & Analytics</Link>  
            </li>  
            {userRole === 'Admin' && (  
              <li>  
                <Link className="text-white hover:text-[#FFD700]" to="/user-management">User Management</Link>  
              </li>  
            )}  
            <li>  
              <button   
                className="bg-[#28A745] text-white px-4 py-2 rounded hover:bg-[#218838]"   
                onClick={onLogout}  
              >  
                Logout  
              </button>  
            </li>  
          </ul>  
        </nav>  
      </div>  
    </header>  
  );  
};  

export default Header;  