import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayoutPages = ['/', '/dashboard', '/login', '/signup'];
  const showSidebar = !hideLayoutPages.includes(location.pathname);
  const isRootPath = location.pathname === '/';

  return (
    <div className="min-h-screen">
      {/* Header */}
      {isRootPath && (
        <div className="fixed top-0 w-full h-15 z-50">
          <Header />
        </div>
      )}

      {/* Main Container */}
      <div className="flex">
        {/* Sidebar - conditionally rendered */}
        {showSidebar && (
          <div className="fixed top-0 h-[calc(100vh-64px)] w-64">
            <Sidebar />
          </div>
        )}

        {/* Main Content - dynamic margin based on sidebar visibility */}
        <div className={`flex-1 p-4 mt-16 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
          <main className="h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;