import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { MenuIcon, XIcon, LogOut, User, ChevronDown } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import './AdminNavbar.css'

const AdminNavbar = () => {
  const { logout, user } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()

  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.navbar-profile-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Smooth scroll to top handler
  const handleNavLinkClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const adminNavlinks = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Add Shows', path: '/admin/add-shows' },
    { name: 'List Shows', path: '/admin/list-shows' },
    { name: 'List Bookings', path: '/admin/list-bookings' },
  ]

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      {/* Left side - Profile */}
      <div className='navbar-profile'>
        <div className="navbar-profile-container">
          <button 
            onClick={toggleUserMenu}
            className="navbar-profile-btn"
            type="button"
          >
            <div className="navbar-profile-avatar">
              <User width={16} />
            </div>
            <ChevronDown width={12} className="navbar-dropdown-icon" />
          </button>
          
          {showUserMenu && (
            <div className="navbar-profile-menu">
              <div className="navbar-profile-greeting">
                Hi, {user?.name}
              </div>
        <button
          onClick={handleLogout}
                className="navbar-profile-menu-item"
                type="button"
        >
                <LogOut width={15}/>
          Logout
        </button>
            </div>
          )}
        </div>
      </div>

      {/* Center - Navigation */}
      <div className='navbar-center'>
        <div className='navbar-nav-links'>
          <div className='navbar-nav-indicator'></div>
          {adminNavlinks.map((link, index) => (
            <Link 
              key={index}
              to={link.path} 
              className={`navbar-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={e => handleNavLinkClick(e, link.path)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Right side - Logo */}
      <Link to='/' className='navbar-logo' onClick={e => handleNavLinkClick(e, '/') }>
        <img src={assets.logoPng} alt="FlashCheck Logo" />
      </Link>

      {/* Mobile menu button */}
      <MenuIcon className='navbar-mobile-menu' onClick={()=> setIsOpen(!isOpen)}/>

      {/* Mobile menu */}
      <div className={`navbar-mobile-menu-container ${isOpen ? 'open' : ''}`}>
        <XIcon className='navbar-close' onClick={()=> setIsOpen(!isOpen)}/>
        <div className='navbar-mobile-nav'>
          {adminNavlinks.map((link, index) => (
            <Link 
              key={index}
              onClick={e => { handleNavLinkClick(e, link.path); setIsOpen(false); }} 
              to={link.path}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminNavbar
