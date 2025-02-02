import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div className='flex'>
        <div>
            <Sidebar />
        </div>
        <div className='w-full'>
            <Navbar />
            <Outlet />
        </div>
    </div>
  )
}

export default Layout