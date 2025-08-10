import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import './HeroSection.css'

const HeroSection = () => {
  const navigate = useNavigate()
  const { image_base_url } = useAppContext()
  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch now playing movies from TMDB
  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      try {
        setLoading(true)
        const url = import.meta.env.VITE_BASE_URL || 'http://localhost:8080'
        const response = await fetch(`${url}/api/show/now-playing-public`)
        const data = await response.json()
        
        if (data.success && data.movies) {
          // Take first 16 movies for the carousel
          setNowPlayingMovies(data.movies.slice(0, 16))
        } else {
          setNowPlayingMovies([])
        }
      } catch (error) {
        console.error('Error fetching now playing movies:', error)
        setNowPlayingMovies([])
      } finally {
        setLoading(false)
      }
    }

    fetchNowPlayingMovies()
  }, [])

  const handleBookNowClick = () => {
    navigate('/movies')
  }

  // Fallback movies if API fails or no movies available
  const fallbackMovies = [
    { poster_path: "/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg", title: "Top Gun: Maverick" },
    { poster_path: "/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg", title: "Black Panther: Wakanda Forever" },
    { poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", title: "Avatar: The Way of Water" },
    { poster_path: "/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg", title: "Thor: Love and Thunder" },
    { poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", title: "Spider-Man: No Way Home" },
    { poster_path: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", title: "Avengers: Endgame" },
    { poster_path: "/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg", title: "No Time to Die" },
    { poster_path: "/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg", title: "The Batman" },
    { poster_path: "/5hoS3nEkGGXUfmnu39yw1k52JX5.jpg", title: "Fast X" },
    { poster_path: "/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg", title: "Dune" },
    { poster_path: "/1E5baAaEse26fej7uHcjOgEE2t2.jpg", title: "Bullet Train" },
    { poster_path: "/74xTEgt7R36Fpooo50r9T25onhq.jpg", title: "The Matrix Resurrections" },
    { poster_path: "/5P8SmMzSNYikXpxil6BYzJ16611.jpg", title: "Eternals" },
    { poster_path: "/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg", title: "Interstellar" },
    { poster_path: "/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg", title: "Encanto" },
    { poster_path: "/cvsXj3I9Q2iyyIo95AecSd1tad7.jpg", title: "Oppenheimer" }
  ]

  // Use now playing movies if available, otherwise use fallback
  const displayMovies = nowPlayingMovies.length > 0 ? nowPlayingMovies : fallbackMovies

  return (
    <>
      <div className='hero-section'>

        
        {/* Hero Content */}
        <div className='hero-content'>
          <div className='hero-text'>
            <h1 className='hero-title'>
              Beautiful movies,<br />
              that <span className='hero-title-highlight'>Fuel</span> your <span className='hero-title-underline'>growth.</span>
            </h1>
            
            <p className='hero-description'>
              A reliable ticket booking platform delivering stunning<br />
              movie experiences in record time.
            </p>
            
            <button onClick={handleBookNowClick} className='hero-cta-button'>
              Book a movie
              <ArrowRight className="hero-button-icon"/>
            </button>
          </div>
        </div>
      </div>

      {/* Movie Carousel Section */}
      <div className='movie-carousel-section'>
        <div className='movie-carousel-container'>
          <div className='movie-carousel-track'>
            {/* First set of movies */}
            {displayMovies.map((movie, index) => (
              <div key={`first-${index}`} className='movie-card'>
                <img 
                  src={image_base_url + (movie.poster_path || '/default-poster.jpg')} 
                  alt={movie.title || 'Movie Poster'} 
                />
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {displayMovies.map((movie, index) => (
              <div key={`second-${index}`} className='movie-card'>
                <img 
                  src={image_base_url + (movie.poster_path || '/default-poster.jpg')} 
                  alt={movie.title || 'Movie Poster'} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default HeroSection
