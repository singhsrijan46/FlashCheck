import React from 'react'
import './Home.css'
import NavBar from '../../components/NavBar/NavBar'
import Footer from '../../components/Footer/Footer'
import HeroSection from '../../components/HeroSection/HeroSection'
import FeaturedSection from '../../components/FeaturedSection/FeaturedSection'

const Home = () => {
  return (
    <div className='home'>
        <NavBar/>
        <HeroSection/>
        <FeaturedSection/>
    </div>
  )
}

export default Home