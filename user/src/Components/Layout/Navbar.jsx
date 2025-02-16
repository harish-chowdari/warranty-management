import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import axios from '../../axios'; // Adjust the import path as needed

const Navbar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await axios.get(`/cart/${userId}`);
        const totalItems = response.data?.products?.reduce(
          (acc, item) =>
            acc + (typeof item.quantity === 'number' ? item.quantity : 1),
          0
        ) || 0;
        setCartCount(totalItems);
      } catch (err) {
        console.error("Error fetching cart count:", err);
      }
    };

    if (userId) fetchCartCount();
  }, [userId]);

  return (
    <nav className="bg-white shadow-xl">
      <div className="mx-auto px-4 py-2 flex justify-between items-center">
        <div 
          className="flex items-center text-gray-800 font-semibold text-xl transition duration-300"
        >
          <FaShieldAlt className="mr-2" />
          Warranty Management
        </div>
        
        <div className="flex items-center gap-4">
          <NavLink
            to="/home/view-cart"
            className="relative flex items-center px-4 py-2 rounded-md hover:text-blue-600 transition duration-300"
          >
            <FaShoppingCart size={20} />
            {(
              <span className="absolute top-[0px] right-[6px] bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {cartCount > 0 ? cartCount : '0'}
              </span>
            )}
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
