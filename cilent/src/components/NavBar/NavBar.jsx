import React from 'react'
import './NavBar.css'
import logo from '../../assets/logo.png'

const NavBar = () => {
  return (
    <div className='navbar'>
        <div className='navbar-left'>
          <img src={logo} alt="" />
          <p>FlashCheck</p>
        </div>
        <div className='navbar-right'>
          <ul>
            <li>Home</li>
            <li>Search</li>
            <li>Movie</li>
            <li>City</li>
            <button>Sign In</button>
          </ul>
        </div>
    </div>
  )
}

export default NavBar