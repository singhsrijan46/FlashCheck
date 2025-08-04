import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'
import './FeaturedSection.css'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const {shows } = useAppContext()

  return (
    <div className='featured-section'>

      <div className='featured-header'>
        <p className='featured-title'>Now Showing</p>
        <button onClick={()=> navigate('/movies')} className='featured-view-all'>
            View All 
            <ArrowRight className='featured-view-all-icon'/>
          </button>
      </div>

      <div className='featured-movies'>
        {shows.length > 0 ? (
          shows.slice(0, 4).map((show)=>(
            <MovieCard key={show._id} movie={show.movie || show}/>
          ))
        ) : (
          <div className='featured-no-movies'>
            <p>No movies available at the moment.</p>
            <p>Please check back later or contact an administrator to add shows.</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default FeaturedSection
