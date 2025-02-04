import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navbar />
      </div>

      <div className="flex h-screen pt-[9vh]">
        <div className="fixed left-0 top-[9vh] bg-white h-[calc(100vh-9vh)] w-[30vh] shadow-md">
          <Sidebar />
        </div>

        <div className="ml-[30vh] flex-1 w-full bg-gray-100 h-[calc(100vh-9vh)] overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
