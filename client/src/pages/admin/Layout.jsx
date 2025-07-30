import React, { useEffect } from 'react'
import AdminNavbar from '../../components/admin/AdminNavbar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import Loading from '../../components/Loading'
import './Layout.css'

const Layout = () => {

  const {isAdmin, fetchIsAdmin} = useAppContext()

  useEffect(()=>{
    fetchIsAdmin()
  },[])

  return isAdmin ? (
    <>
      <AdminNavbar />
      <div className='admin-layout'>
        <div className='admin-layout-content'>
            <Outlet />
        </div>
      </div>
    </>
  ) : <Loading/>
}

export default Layout
