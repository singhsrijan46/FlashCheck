import React, { useState, useRef, useEffect } from 'react'
import './NavBar.css'
import logo from '../../assets/logo.png'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, User } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const cityDisplayName = (cityParam) => {
  if (!cityParam) return 'New Delhi';
  return cityParam
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const NavBar = ({ onCityClick, onSignInClick }) => {
  const navigate = useNavigate();
  // Remove useParams
  // const { city } = useParams();
  // Use city from context or fallback
  const { city = 'new-delhi', user, setUser, setGetToken } = useAppContext();
  const currentCity = city || 'new-delhi';
  const displayCity = cityDisplayName(currentCity);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    setUser(null);
    setGetToken(null);
    localStorage.removeItem('token');
    setDropdownOpen(false);
    navigate(`/`); // No city in path
  };

  return (
    <div className='navbar'>
        <div className='navbar-left'>
          <img onClick={()=>navigate(`/`)} src={logo} alt="" />
          <p onClick={()=>navigate(`/`)}>FlashCheck</p>
        </div>
        <div className='navbar-right'>
          <ul>
            <li>
              <button className="navbar-city-btn" onClick={onCityClick}>
                {displayCity} <ChevronDown size={18} style={{marginLeft: 4, verticalAlign: 'middle'}} />
              </button>
            </li>
            <li onClick={()=>navigate(`/`)}>Home</li>
            <li onClick={()=>navigate(`/search`)}>Search</li>
            <li onClick={()=>navigate(`/movies`)}>Movies</li>
            {!user ? (
              <button onClick={onSignInClick}>Sign In</button>
            ) : (
              <li className="navbar-user-menu" ref={dropdownRef} style={{position: 'relative'}}>
                <button className="navbar-user-btn" onClick={() => setDropdownOpen(v => !v)}>
                  <User size={22} style={{verticalAlign: 'middle'}} />
                  <ChevronDown size={18} style={{marginLeft: 4, verticalAlign: 'middle'}} />
                </button>
                {dropdownOpen && (
                  <div className="navbar-dropdown">
                    <button className="navbar-dropdown-item" onClick={() => { setDropdownOpen(false); navigate(`/my-bookings`); }}>My Bookings</button>
                    <button className="navbar-dropdown-item" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
    </div>
  )
}

export default NavBar