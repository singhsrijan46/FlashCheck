import React, { useEffect } from 'react'
import AdminNavbar from '../../components/admin/AdminNavbar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import Loading from '../../components/Loading'
import './Layout.css'

const Layout = () => {

  const { user, loading } = useAppContext()

  // Show loading while checking authentication
  if (loading) {
    return <Loading />
  }

  // If no user or user is not admin, show loading (will redirect via App.jsx)
  if (!user || user.role !== 'admin') {
    return <Loading />
  }

  return (
    <>
      <AdminNavbar />
      <div className='admin-layout'>
        <div className='admin-layout-content'>
            <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout
