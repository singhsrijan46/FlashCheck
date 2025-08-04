import React, { useState, useEffect } from 'react'
import { ArrowRight, CalendarIcon, ClockIcon, StarIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import './HeroSection.css'

const HeroSection = () => {
    const navigate = useNavigate()
  const { shows, image_base_url } = useAppContext()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Debug logging
  console.log('HeroSection - shows:', shows)
  console.log('HeroSection - image_base_url:', image_base_url)

  // Get first 5 movies for slideshow
  const slideshowMovies = shows.slice(0, 5).map(show => show.movie || show)

  useEffect(() => {
    if (slideshowMovies.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === slideshowMovies.length - 1 ? 0 : prev + 1
      )
    }, 8000) // Change slide every 8 seconds for videos

    return () => clearInterval(interval)
  }, [slideshowMovies.length])

  const handleSlideChange = (index) => {
    setCurrentSlide(index)
  }

  const handleExploreClick = () => {
    navigate('/movies')
  }

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`)
  }

  // Show fallback when no shows are available
  if (slideshowMovies.length === 0) {
    return (
      <div className='hero-section'>
        <div 
          className='hero-background'
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%), url(https://image.tmdb.org/t/p/original/1E5baAaEse26fej7uHcjOgEE2t2.jpg)`
          }}
        />
        <div className='hero-content'>
          <div className='hero-movie-info'>
            <h1 className='hero-title'>Welcome to FlashCheck</h1>
            <div className='hero-meta'>
              <span>EN</span>
              <div className='hero-meta-item'>
                <CalendarIcon className='hero-meta-icon'/> 
                2024
              </div>
              <div className='hero-meta-item'>
                <StarIcon className='hero-meta-icon'/> 
                8.5
              </div>
            </div>
            <p className='hero-description'>
              Discover the latest movies and book your tickets with ease. Experience the best in entertainment with our premium movie booking platform.
            </p>
            <div className='hero-buttons'>
              <button onClick={handleExploreClick} className='hero-button'>
                Explore Movies
                <ArrowRight className="hero-button-icon"/>
              </button>
              <button onClick={() => navigate('/movies')} className='hero-button-secondary'>
                View All Movies
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentMovie = slideshowMovies[currentSlide]
  console.log('HeroSection - currentMovie:', currentMovie)
  const hasTrailer = currentMovie.trailer && currentMovie.trailer.key

  return (
    <div className='hero-section'>
      {/* Video Background */}
      {hasTrailer ? (
        <div className='hero-video-container'>
          <iframe
            className='hero-video'
            src={`https://www.youtube.com/embed/${currentMovie.trailer.key}?autoplay=1&mute=1&loop=1&playlist=${currentMovie.trailer.key}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&version=3&playerapiid=ytplayer`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className='hero-video-overlay' />
        </div>
      ) : (
        <div 
          className='hero-background'
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%), url(${image_base_url + currentMovie.backdrop_path})`
          }}
        />
      )}

      {/* Movie Content */}
      <div className='hero-content'>
        <div className='hero-movie-info'>
          <h1 className='hero-title'>{currentMovie.title}</h1>

          <div className='hero-meta'>
            <span>{currentMovie.original_language?.toUpperCase() || 'EN'}</span>
            <div className='hero-meta-item'>
              <CalendarIcon className='hero-meta-icon'/> 
              {new Date(currentMovie.release_date).getFullYear()}
            </div>
            <div className='hero-meta-item'>
              <StarIcon className='hero-meta-icon'/> 
              {currentMovie.vote_average?.toFixed(1) || '0.0'}
            </div>
          </div>
          
          <p className='hero-description'>
            {currentMovie.overview && currentMovie.overview.length > 200 
              ? currentMovie.overview.substring(0, 200) + '...' 
              : currentMovie.overview || 'No description available'
            }
          </p>
          
          <div className='hero-buttons'>
            <button 
              onClick={() => handleMovieClick(currentMovie._id)} 
              className='hero-button'
            >
              Book Tickets
              <ArrowRight className="hero-button-icon"/>
            </button>
            <button 
              onClick={handleExploreClick} 
              className='hero-button-secondary'
            >
              Explore Movies
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className='hero-indicators'>
        {slideshowMovies.map((_, index) => (
          <button
            key={index}
            className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleSlideChange(index)}
          />
        ))}
      </div>

      {/* Slide Navigation */}
      <div className='hero-navigation'>
        <button 
          className='hero-nav-btn prev'
          onClick={() => handleSlideChange(currentSlide === 0 ? slideshowMovies.length - 1 : currentSlide - 1)}
        >
          ‹
        </button>
        <button 
          className='hero-nav-btn next'
          onClick={() => handleSlideChange(currentSlide === slideshowMovies.length - 1 ? 0 : currentSlide + 1)}
        >
          ›
      </button>
      </div>
    </div>
  )
}

export default HeroSection
