import React from 'react';
import Header from './header';
import Sidebar from './sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen ">
      <div className="fixed z-10 w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="flex-1 overflow-auto bg-[#F8F9FA]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
