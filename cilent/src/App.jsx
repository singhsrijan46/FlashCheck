import React, { useState, useEffect } from 'react'
import Home from './pages/Home/Home'
import SignIn from './pages/SignIn/SignIn'
import SignUp from './pages/SignUp/SignUp'
import Movies from './pages/Movies/Movies'
import MovieDetails from './pages/MovieDetails/MovieDetails'
import Search from './pages/Search/Search'
import City from './pages/City/City'
import Dashboard from './pages/admin/Dashboard/Dashboard';
import AddShows from './pages/admin/AddShows/AddShows';
import ListShows from './pages/admin/ListShows/ListShows';
import ListBookings from './pages/admin/ListBookings/ListBookings';
import AdminHome from './pages/admin/Home/Home';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

// Wrapper to run fetchIsAdmin on /admin access
const AdminAccessWrapper = ({ children, setShowSignInModal }) => {
  const { fetchIsAdmin, isAdmin, user } = useAppContext();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      setLoading(true);
      await fetchIsAdmin();
      setLoading(false);
    };
    check();
    // eslint-disable-next-line
  }, [user]);

  if (loading) return null;
  if (!user) {
    setShowSignInModal(true);
    return null;
  }
  if (!isAdmin) {
    toast.error('You are not authorized to access admin dashboardr');
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

const App = () => {
  const [showCityModal, setShowCityModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Modal handlers
  const handleOpenCityModal = () => setShowCityModal(true);
  const handleCloseCityModal = () => setShowCityModal(false);
  const handleOpenSignInModal = () => setShowSignInModal(true);
  const handleCloseSignInModal = () => setShowSignInModal(false);
  const handleOpenSignUpModal = () => setShowSignUpModal(true);
  const handleCloseSignUpModal = () => setShowSignUpModal(false);

  return (
    <>
      {showCityModal && <City onClose={handleCloseCityModal} />}
      {showSignInModal && <SignIn onClose={handleCloseSignInModal} onSwitchSignUp={() => { handleCloseSignInModal(); handleOpenSignUpModal(); }} />}
      {showSignUpModal && <SignUp onClose={handleCloseSignUpModal} onSwitchSignIn={() => { handleCloseSignUpModal(); handleOpenSignInModal(); }} />}
      <Routes>
        <Route path='/' element={<Home onCityClick={handleOpenCityModal} onSignInClick={handleOpenSignInModal} onSignUpClick={handleOpenSignUpModal} />} />
        <Route path='/movies' element={<Movies onCityClick={handleOpenCityModal} onSignInClick={handleOpenSignInModal} onSignUpClick={handleOpenSignUpModal} />} />
        <Route path='/movies/:movieId' element={<MovieDetails onCityClick={handleOpenCityModal} onSignInClick={handleOpenSignInModal} onSignUpClick={handleOpenSignUpModal} />} />
        <Route path='/search' element={<Search onCityClick={handleOpenCityModal} onSignInClick={handleOpenSignInModal} onSignUpClick={handleOpenSignUpModal} />} />
        <Route path='/admin/*' element={
          //<AdminAccessWrapper setShowSignInModal={setShowSignInModal}>
            <AdminHome />
          //</AdminAccessWrapper>
        } />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App