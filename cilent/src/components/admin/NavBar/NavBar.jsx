import React, { useState } from 'react';
import './NavBar.css';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, User } from 'lucide-react';
import logo from '../../../assets/logo.png';

const AdminNavBar = () => {
  const location = useLocation();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { key: 'addShows', label: 'Add Shows', path: '/admin/add-shows' },
    { key: 'listShows', label: 'List Shows', path: '/admin/list-shows' },
    { key: 'listBookings', label: 'List Bookings', path: '/admin/list-bookings' },
  ];

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="admin-navbar">
      {/* Left Section - Profile Icon with Dropdown */}
      <div className="navbar-left">
        <div className="profile-section">
          <div 
            className="profile-icon"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <User size={20} />
          </div>
          <ChevronDown 
            size={16} 
            className={`dropdown-arrow ${showProfileDropdown ? 'rotated' : ''}`}
          />
          
          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item">Profile Settings</div>
              <div className="dropdown-item">Account</div>
              <div className="dropdown-item">Logout</div>
            </div>
          )}
        </div>
      </div>

      {/* Center Section - Navigation Items */}
      <div className="navbar-center">
        <div className="nav-items">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Section - Logo Only */}
      <div className="navbar-right">
        <div className="logo-section">
          <img src={logo} alt="FlashCheck" className="logo-img" />
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBar;
