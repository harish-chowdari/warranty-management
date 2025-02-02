import React, { useState } from "react";
import { NavLink } from "react-router-dom";


const Sidebar = () => {
  const userId = localStorage.getItem("userId");
  const [isActive, setIsActive] = useState(false); 

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="flex flex-col w-[30vh] gap-4">
        <p className="text-2xl font-bold text-center">Logo</p>
        
        <div className="flex flex-col gap-2">

            <NavLink
            to={`/home/add-product`}
            className='px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
            >
            Add Products
            </NavLink>

            <NavLink
            to={`/home/view-warranties`}
            className='px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
            >
            View Warranties
            </NavLink>
        </div>
    </div>
  );
};

export default Sidebar;