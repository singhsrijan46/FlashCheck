import React, { useState } from 'react'
import Home from './pages/Home/Home'
import SignIn from './pages/SignIn/SignIn'
import SignUp from './pages/SignUp/SignUp'
import Movies from './pages/Movies/Movies'
import Search from './pages/Search/Search'
import City from './pages/City/City'
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
        <Route path='/:city/search' element={<Search onCityClick={handleOpenCityModal} onSignInClick={handleOpenSignInModal} onSignUpClick={handleOpenSignUpModal} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App