import React from 'react'
import './FeaturedSection.css'
import { ArrowRight } from 'lucide-react';
const FeaturedSection = () => {
  return (
    <div className='featuredsection'>
        <div className='heading'>
            <p>Now Showing</p>
            <button>
                View All
                <ArrowRight/>
            </button>
        </div>
    </div>
  )
}

export default FeaturedSection