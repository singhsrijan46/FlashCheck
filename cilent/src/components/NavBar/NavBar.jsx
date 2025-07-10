import React from 'react'
import './NavBar.css'
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
  const navigate = useNavigate();
  
  return (
    <div className='navbar'>
        <div className='navbar-left'>
          <img onClick={()=>navigate('/')} src={logo} alt="" />
          <p onClick={()=>navigate('/')}>FlashCheck</p>
        </div>
        <div className='navbar-right'>
          <ul>
            <li onClick={()=>navigate('/')}>Home</li>
            <li onClick={()=>navigate('/search')}>Search</li>
            <li onClick={()=>navigate('/movies')}>Movies</li>
            <li onClick={()=>navigate('/city')}>City</li>
            <button onClick={()=>navigate('/signin')} >Sign In</button>
          </ul>
        </div>
    </div>
  )
}

export default NavBar