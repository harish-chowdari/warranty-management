import React, { useState } from "react";
import { NavLink } from "react-router-dom";


const Sidebar = () => {
    const userId = localStorage.getItem("userId");
    const [isActive, setIsActive] = useState(false); 

    const handleToggle = () => {
        setIsActive(!isActive);
    };

    return (
        <div className="flex flex-col gap-4 pt-2">
            <NavLink
            to={`/home/view-products`}
            className='px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
            >
            View Products
            </NavLink>
        </div>
    );
};

export default Sidebar;