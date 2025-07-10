import React from 'react'
import './FeaturedSection.css'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react';

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
    </div>
  )
}

export default FeaturedSection