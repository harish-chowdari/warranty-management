import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate()

  const handleLogout = () => {
    
    localStorage.removeItem("userId")
    navigate("/")
    window.location.reload()
    
  }

  return (
    <div className='flex gap-4 p-2 justify-end items-center '>
        <NavLink
            to={`/home/view-cart`}
            className='px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600'
            >
            View Cart
        </NavLink>

      <NavLink to="/" className='px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600'  onClick={handleLogout}>Logout</NavLink>
    </div>
  )
}

export default Navbar