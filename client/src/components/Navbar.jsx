import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon, LogOut, User, ChevronDown } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import './Navbar.css'

const Navbar = () => {

 const [isOpen, setIsOpen] = useState(false)
 const [showUserMenu, setShowUserMenu] = useState(false)
 const [isScrolled, setIsScrolled] = useState(false)

 const navigate = useNavigate()
 const location = useLocation()

 const { user, logout, favoriteMovies } = useAppContext()

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

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      {/* Left side - Logo */}
      <Link to='/' className='navbar-logo' onClick={e => handleNavLinkClick(e, '/') }>
        <img src={assets.logoPng} alt="FlashCheck Logo" />
        <span className='navbar-logo-text'>FlashCheck</span>
      </Link>

      {/* Center - Search and Navigation */}
      <div className='navbar-center'>
        <div className='navbar-search-container'>
          <SearchIcon className='navbar-search-icon'/>
        </div>
        
        <div className='navbar-nav-links'>
          <div className='navbar-nav-indicator'></div>
          <Link 
            to='/' 
            className={`navbar-nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={e => handleNavLinkClick(e, '/')}
          >
            Home
          </Link>
          <Link 
            to='/movies' 
            className={`navbar-nav-link ${isActive('/movies') ? 'active' : ''}`}
            onClick={e => handleNavLinkClick(e, '/movies')}
          >
            Movies
          </Link>
          <Link 
            to='/search' 
            className={`navbar-nav-link ${isActive('/search') ? 'active' : ''}`}
            onClick={e => handleNavLinkClick(e, '/search')}
          >
            Search
          </Link>
          <Link 
            to='/favorite' 
            className={`navbar-nav-link ${isActive('/favorite') ? 'active' : ''}`}
            onClick={e => handleNavLinkClick(e, '/favorite')}
          >
            Favorites
          </Link>
        </div>
      </div>

      {/* Right side - Profile */}
      <div className='navbar-profile'>
        {
            !user ? (
                <button onClick={() => navigate('/login')} className='navbar-login-btn'>Login</button>
            ) : (
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
                                onClick={() => { 
                                    navigate('/my-bookings'); 
                                    setShowUserMenu(false); 
                                }}
                                className="navbar-profile-menu-item"
                                type="button"
                            >
                                <TicketPlus width={15}/>
                                My Bookings
                            </button>
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
            )
        }
      </div>

      {/* Mobile menu button */}
      <MenuIcon className='navbar-mobile-menu' onClick={()=> setIsOpen(!isOpen)}/>

      {/* Mobile menu */}
      <div className={`navbar-mobile-menu-container ${isOpen ? 'open' : ''}`}>
        <XIcon className='navbar-close' onClick={()=> setIsOpen(!isOpen)}/>
        <div className='navbar-mobile-nav'>
          <Link 
            onClick={e => { handleNavLinkClick(e, '/'); setIsOpen(false); }} 
            to='/'
          >
            Home
          </Link>
          <Link 
            onClick={e => { handleNavLinkClick(e, '/movies'); setIsOpen(false); }} 
            to='/movies'
          >
            Movies
          </Link>
          <Link 
            onClick={e => { handleNavLinkClick(e, '/favorite'); setIsOpen(false); }} 
            to='/favorite'
          >
            Favorites
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar
