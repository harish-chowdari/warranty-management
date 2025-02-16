import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("userId")
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-xl">
      <div className="mx-auto px-4 py-2 flex justify-between items-center">
        <div 
          // to="/home"
          className="flex items-center text-gray-800 font-semibold text-xl transition duration-300"
        >
          <FaShieldAlt className="mr-2" />
          Warranty Management
        </div>
        
        <div className="flex items-center gap-4">
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
  )
}

export default Navbar
