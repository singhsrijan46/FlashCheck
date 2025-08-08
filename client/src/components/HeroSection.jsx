import React, { useState, useEffect, useRef } from 'react'
import { ArrowRight, CalendarIcon, ClockIcon, StarIcon, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import './HeroSection.css'

const HeroSection = () => {
    const navigate = useNavigate()
  const { shows, image_base_url, selectedCity } = useAppContext()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [cityMovies, setCityMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredSlide, setHoveredSlide] = useState(null)
  const [trailers, setTrailers] = useState({})
  const videoRefs = useRef({})

  // Debug logging
  console.log('HeroSection - shows:', shows)
  console.log('HeroSection - image_base_url:', image_base_url)
  console.log('HeroSection - selectedCity:', selectedCity)

  // Fetch movies for the selected city
  useEffect(() => {
    const fetchCityMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/show/city/${selectedCity}`);
        const data = await response.json();
        
        if (data.success) {
          console.log(`HeroSection - Found ${data.movies.length} movies for ${selectedCity}`);
          setCityMovies(data.movies);
        } else {
          console.error('HeroSection - Failed to fetch city movies:', data.message);
          setCityMovies([]);
        }
      } catch (error) {
        console.error('HeroSection - Error fetching city movies:', error);
        setCityMovies([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCity) {
      fetchCityMovies();
    }
  }, [selectedCity]);

  // Fetch trailers for movies
  useEffect(() => {
    const fetchTrailers = async () => {
      const trailerPromises = cityMovies.map(async (movie) => {
        try {
          const response = await fetch(`http://localhost:8080/api/show/${movie._id}/trailer`);
          const data = await response.json();
          return { movieId: movie._id, trailer: data.success ? data.trailer : null };
        } catch (error) {
          console.error(`Error fetching trailer for movie ${movie._id}:`, error);
          return { movieId: movie._id, trailer: null };
        }
      });

      const trailerResults = await Promise.all(trailerPromises);
      const trailerMap = {};
      trailerResults.forEach(({ movieId, trailer }) => {
        trailerMap[movieId] = trailer;
      });
      setTrailers(trailerMap);
    };

    if (cityMovies.length > 0) {
      fetchTrailers();
    }
  }, [cityMovies]);

  // Get first 5 movies for slideshow
  const slideshowMovies = cityMovies.slice(0, 5)

  useEffect(() => {
    if (slideshowMovies.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === slideshowMovies.length - 1 ? 0 : prev + 1
      )
    }, 30000) // Change slide every 30 seconds

    return () => clearInterval(interval)
  }, [slideshowMovies.length])

  const handleSlideChange = (index) => {
    setCurrentSlide(index)
    setHoveredSlide(null) // Stop any playing video when changing slides
  }

  const handleSlideHover = (index) => {
    setHoveredSlide(index)
    const currentMovie = slideshowMovies[index]
    const trailer = trailers[currentMovie._id]
    
    if (trailer && videoRefs.current[index]) {
      // Start playing the video
      const videoElement = videoRefs.current[index]
      videoElement.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&version=3&playerapiid=ytplayer`
    }
  }

  const handleSlideLeave = () => {
    setHoveredSlide(null)
    // Reset video sources to stop playback
    Object.keys(videoRefs.current).forEach(key => {
      if (videoRefs.current[key]) {
        videoRefs.current[key].src = ''
      }
    })
  }

  const handleExploreClick = () => {
    navigate('/movies')
  }

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`)
  }

  // Show fallback when no shows are available
  if (loading) {
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
            <h1 className='hero-title'>Loading Movies...</h1>
            <p className='hero-description'>
              Finding the best movies in {selectedCity} for you.
            </p>
          </div>
        </div>
      </div>
    )
  }

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
            <h1 className='hero-title'>No Movies Available</h1>
            <div className='hero-meta'>
              <span>EN</span>
              <div className='hero-meta-item'>
                <CalendarIcon className='hero-meta-icon'/> 
                2024
              </div>
              <div className='hero-meta-item'>
                <StarIcon className='hero-meta-icon'/> 
                -
              </div>
            </div>
            <p className='hero-description'>
              No movies are currently available in {selectedCity}. Please try another city or check back later for new releases.
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
  const currentTrailer = trailers[currentMovie._id]
  const isHovering = hoveredSlide === currentSlide
  const hasTrailer = currentTrailer && currentTrailer.key

  return (
    <div className='hero-section'>
      {/* Background Image (always visible) */}
      <div 
        className='hero-background'
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%), url(${image_base_url + currentMovie.backdrop_path})`
        }}
      />

      {/* Video Overlay (only on hover) */}
      {hasTrailer && isHovering && (
        <div className='hero-video-container'>
          <iframe
            ref={(el) => videoRefs.current[currentSlide] = el}
            className='hero-video'
            src={`https://www.youtube.com/embed/${currentTrailer.key}?autoplay=1&mute=1&loop=1&playlist=${currentTrailer.key}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&version=3&playerapiid=ytplayer`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className='hero-video-overlay' />
        </div>
      )}

      {/* Play Button Overlay */}
      {hasTrailer && !isHovering && (
        <div className='hero-play-overlay'>
          <div className='hero-play-button'>
            <Play className='hero-play-icon' />
            <span>Watch Trailer</span>
          </div>
        </div>
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

      {/* Hover Area for Video Trigger */}
      <div 
        className='hero-hover-area'
        onMouseEnter={() => handleSlideHover(currentSlide)}
        onMouseLeave={handleSlideLeave}
      />
    </div>
  )
}

export default HeroSection
