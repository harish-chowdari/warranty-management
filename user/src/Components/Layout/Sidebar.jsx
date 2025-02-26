import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBoxOpen, FaChevronLeft, FaChevronRight, FaList, } from "react-icons/fa";
import { MdSecurity, MdQrCodeScanner  } from "react-icons/md";

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
                    <NavLink to="/home/view-products"
                    className={`flex ${!isOpen && "mx-auto"} items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition duration-300`}
                    >
                        <FaList size={18} />
                        {isOpen && <span>View Products</span>}
                    </NavLink>

                    {/* view purchases */}
                    <NavLink to="/home/view-purchases"
                    className={`flex ${!isOpen && "mx-auto"} items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition duration-300`}
                    >
                        <FaBoxOpen size={18} />
                        {isOpen && <span>View Purchases</span>}
                    </NavLink>

                    {/* Scanner */}
                    <NavLink to="/home/scanner"
                    className={`flex ${!isOpen && "mx-auto"} items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition duration-300`}
                    >
                        <MdQrCodeScanner  size={18} />
                        {isOpen && <span>Scanner</span>}
                    </NavLink>

                    {/* claim warranty */}
                    <NavLink to="/home/claim-warranty"
                    className={`flex ${!isOpen && "mx-auto"} items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition duration-300`}
                    >
                        <FaBoxOpen size={18} />
                        {isOpen && <span>Claim Warranty</span>}
                    </NavLink>

                    <NavLink to="/home/view-warranties"
                    className={`flex ${!isOpen && "mx-auto"} items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition duration-300`}
                    >
                        <MdSecurity size={18} />
                        {isOpen && <span>View Warranties</span>}
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
