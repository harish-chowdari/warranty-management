import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar: full width */}
      <header className="w-full h-[9vh] shadow">
        <Navbar />
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="">
          <Sidebar />
        </aside>

        {/* Outlet for main content */}
        <main className="flex-1 p-4 h-[91vh] overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
