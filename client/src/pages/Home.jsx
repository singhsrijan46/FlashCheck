import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'
import './Home.css'

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <FeaturedSection />
      <TrailersSection />
    </div>
  )
}

export default Home
