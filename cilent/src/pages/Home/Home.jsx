import React from 'react'
import './Home.css'
import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer'
import HeroSection from '../../components/HeroSection/HeroSection'
import FeaturedSection from '../../components/FeaturedSection/FeaturedSection'
import Trailer from '../../components/Trailer/Trailer';

const Home = ({ onCityClick, onSignInClick }) => {
  return (
    <div className='home'>
        <NavBar onCityClick={onCityClick} onSignInClick={onSignInClick}/>
        <HeroSection/>
        <FeaturedSection/>
        <Trailer/>
        <Footer/>
    </div>
  )
}

export default Home