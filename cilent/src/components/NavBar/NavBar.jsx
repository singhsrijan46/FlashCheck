import React from 'react'
import './NavBar.css'
import logo from '../../assets/logo.png'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react';

const cityDisplayName = (cityParam) => {
  if (!cityParam) return 'New Delhi';
  return cityParam
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const NavBar = ({ onCityClick, onSignInClick }) => {
  const navigate = useNavigate();
  const { city } = useParams();
  const currentCity = city || 'new-delhi';
  const displayCity = cityDisplayName(currentCity);
  
  return (
    <div className='navbar'>
        <div className='navbar-left'>
          <img onClick={()=>navigate(`/${currentCity}`)} src={logo} alt="" />
          <p onClick={()=>navigate(`/${currentCity}`)}>FlashCheck</p>
        </div>
        <div className='navbar-right'>
          <ul>
            <li>
              <button className="navbar-city-btn" onClick={onCityClick}>
                {displayCity} <ChevronDown size={18} style={{marginLeft: 4, verticalAlign: 'middle'}} />
              </button>
            </li>
            <li onClick={()=>navigate(`/${currentCity}`)}>Home</li>
            <li onClick={()=>navigate(`/${currentCity}/search`)}>Search</li>
            <li onClick={()=>navigate(`/${currentCity}/movies`)}>Movies</li>
            <button onClick={onSignInClick}>Sign In</button>
          </ul>
        </div>
    </div>
  )
}

export default NavBar