import React from 'react'
import './FeaturedSection.css'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react';
import poster from '../../assets/demon-slayer_poster.webp'

const FeaturedSection = () => {
  const navigate = useNavigate();

  return (
    <div className='featuredsection'>
        <div className='heading'>
            <p>Now Showing</p>
            <button onClick={() => navigate('/moives')}>
                View All
                <ArrowRight/>
            </button>
        </div>
        <div className='cards-row'>
          <div className='moviecard'><img src={poster} alt="Poster 1" /></div>
          <div className='moviecard'><img src={poster} alt="Poster 2" /></div>
          <div className='moviecard'><img src={poster} alt="Poster 3" /></div>
          <div className='moviecard'><img src={poster} alt="Poster 4" /></div>
          <div className='moviecard'><img src={poster} alt="Poster 5" /></div>
          <div className='moviecard'><img src={poster} alt="Poster 6" /></div>
        </div>
    </div>
  )
}

export default FeaturedSection