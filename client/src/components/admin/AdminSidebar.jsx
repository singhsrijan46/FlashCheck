import React from 'react'
import { assets } from '../../assets/assets'
import './AdminSidebar.css'

const AdminSidebar = () => {

    const user = {
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: assets.profile,
    }

  return (
    <div className='admin-sidebar'>
      <img className='admin-sidebar-profile' src={user.imageUrl} alt="sidebar" />
      <p className='admin-sidebar-name'>{user.firstName} {user.lastName}</p>
    </div>
  )
}

export default AdminSidebar
