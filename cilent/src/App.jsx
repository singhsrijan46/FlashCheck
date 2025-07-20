import React, { useState } from 'react'
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
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

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
    <BrowserRouter>
      {showCityModal && <City onClose={handleCloseCityModal} />}
      {showSignInModal && <SignIn onClose={handleCloseSignInModal} onSwitchSignUp={() => { handleCloseSignInModal(); handleOpenSignUpModal(); }} />}
      {showSignUpModal && <SignUp onClose={handleCloseSignUpModal} onSwitchSignIn={() => { handleCloseSignUpModal(); handleOpenSignInModal(); }} />}
      <Routes>
        <Route path='/' element={<Navigate to='/new-delhi' replace />} />
        <Route path='/:city' element={<Home onCityClick={handleOpenCityModal} onSignInClick={handleOpenSignInModal} onSignUpClick={handleOpenSignUpModal} />} />
        <Route path='/:city/movies' element={<Movies onCityClick={handleOpenCityModal} onSignInClick={handleOpenSignInModal} onSignUpClick={handleOpenSignUpModal} />} />
        <Route path='/:city/movies/:movieId' element={<MovieDetails onCityClick={handleOpenCityModal} onSignInClick={handleOpenSignInModal} onSignUpClick={handleOpenSignUpModal} />} />
        <Route path='/:city/search' element={<Search onCityClick={handleOpenCityModal} onSignInClick={handleOpenSignInModal} onSignUpClick={handleOpenSignUpModal} />} />
        <Route path='/admin' element={<AdminHome />}>
          <Route index element={<Navigate to='/admin/dashboard' replace />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='add-shows' element={<AddShows />} />
          <Route path='list-shows' element={<ListShows />} />
          <Route path='list-bookings' element={<ListBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App