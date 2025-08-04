import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'
import './MovieCard.css'

const MovieCard = ({movie}) => {
    const navigate = useNavigate()
    const {image_base_url} = useAppContext()

    // Add null checks to prevent crashes
    if (!movie) {
        return null;
    }

    // Handle both movie and show.movie structures
    const movieData = movie.movie || movie;
    
    if (!movieData) {
        return null;
    }

    return (
      <div className='movie-card'>
        <div className='movie-card-image-container'>
          <img
            onClick={()=> {navigate(`/movies/${movieData._id}`); scrollTo(0, 0)}}
            src={image_base_url + (movieData.backdrop_path || movieData.poster_path || '/default-backdrop.jpg')}
            alt=""
            className='movie-card-image'
          />
          <div className='movie-card-overlay-bottom'>
            <div className='movie-card-rating-block'>
              <StarIcon className="movie-card-rating-icon"/>
              <span className='movie-card-rating-value'>{(movieData.vote_average || 0).toFixed(1)}</span>
            </div>
            <div className='movie-card-genres'>
              <span className='movie-card-genre-badge'>{movieData.original_language?.toUpperCase() || 'EN'}</span>
            </div>
          </div>
          <div className='movie-card-hover-overlay'>
            <button 
              onClick={()=> {navigate(`/movies/${movieData._id}`); scrollTo(0, 0)}}
              className='movie-card-book-ticket-btn'
            >
              Book Ticket
            </button>
          </div>
        </div>
        <div className='movie-card-details'>
          <p className='movie-card-title'>{movieData.title || 'Unknown Movie'}</p>
          <div className='movie-card-meta-row'>
            <span className='movie-card-year'>{movieData.release_date ? new Date(movieData.release_date).getFullYear() : 'N/A'}</span>
            <span className='movie-card-dot'>&bull;</span>
            <span className='movie-card-duration'>{movieData.original_language?.toUpperCase() || 'EN'}</span>
          </div>
        </div>
      </div>
    )
}

export default MovieCard
