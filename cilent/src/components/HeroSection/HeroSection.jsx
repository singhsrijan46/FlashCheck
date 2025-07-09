import React from 'react'
import './HeroSection.css'
import banner from '../../assets/demon-slayer.jpg'

const HeroSection = () => {
  return (
    <div className='herosection'>
        <img src={banner} alt="" />
    </div>
  )
}

export default HeroSection