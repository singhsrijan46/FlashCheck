import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'
import './MovieCard.css'

const MovieCard = ({movie}) => {
    const navigate = useNavigate()
    const {image_base_url} = useAppContext()

    return (
      <div className='movie-card'>
        <div className='movie-card-image-container'>
          <img
            onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0, 0)}}
            src={image_base_url + movie.backdrop_path}
            alt=""
            className='movie-card-image'
          />
          <div className='movie-card-overlay-bottom'>
            <div className='movie-card-rating-block'>
              <StarIcon className="movie-card-rating-icon"/>
              <span className='movie-card-rating-value'>{movie.vote_average.toFixed(1)}</span>
            </div>
            <div className='movie-card-genres'>
              {movie.genres.slice(0,2).map(genre => (
                <span className='movie-card-genre-badge' key={genre.id}>{genre.name}</span>
              ))}
            </div>
          </div>
          <div className='movie-card-hover-overlay'>
            <button 
              onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0, 0)}}
              className='movie-card-book-ticket-btn'
            >
              Book Ticket
            </button>
          </div>
        </div>
        <div className='movie-card-details'>
          <p className='movie-card-title'>{movie.title}</p>
          <div className='movie-card-meta-row'>
            <span className='movie-card-year'>{new Date(movie.release_date).getFullYear()}</span>
            <span className='movie-card-dot'>&bull;</span>
            <span className='movie-card-duration'>{timeFormat(movie.runtime)}</span>
          </div>
        </div>
      </div>
    )
}

export default MovieCard
