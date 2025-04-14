import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaBoxOpen, 
  FaChevronLeft, 
  FaChevronRight, 
  FaList, 
  FaQrcode, 
  FaDownload, 
  FaExchangeAlt 
} from "react-icons/fa";

const Sidebar = () => {
  const userId = localStorage.getItem("userId");
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`bg-gray-800 text-white h-screen pt-4 transition-all duration-300 ${
        isOpen ? "w-56" : "w-12"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between px-2 items-center">
          {isOpen && <span className="text-2xl font-bold">Menu</span>}
          <button
            onClick={handleToggle}
            className={`focus:outline-none ${!isOpen && "mx-auto"} cursor-pointer hover:text-blue-500 duration-300`}
          >
            {isOpen ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
          </button>
        </div>
        <nav className="mt-4 flex flex-col text-nowrap overflow-hidden gap-4">
          <NavLink
            to="/home/add-product"
            className={`flex ${!isOpen && "mx-auto"} items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition duration-300`}
          >
            <FaBoxOpen size={18} />
            {isOpen && <span>Add Product</span>}
          </NavLink>

          <NavLink
            to="/home/view-products"
            className={`flex ${!isOpen && "mx-auto"} items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition duration-300`}
          >
            <FaList size={18} />
            {isOpen && <span>View Products</span>}
          </NavLink>
          
          <NavLink
            to="/home/generate-qr"
            className={`flex ${!isOpen && "mx-auto"} items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition duration-300`}
          >
            <FaQrcode size={18} />
            {isOpen && <span>Generate QR</span>}
          </NavLink>

          <NavLink
            to="/home/download-qr"
            className={`flex ${!isOpen && "mx-auto"} items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition duration-300`}
          >
            <FaDownload size={18} />
            {isOpen && <span>Download QR</span>}
          </NavLink>

          {/* <NavLink
            to="/home/convert-qr"
            className={`flex ${!isOpen && "mx-auto"} items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition duration-300`}
          >
            <FaExchangeAlt size={18} />
            {isOpen && <span>Convert QR</span>}
          </NavLink> */}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
