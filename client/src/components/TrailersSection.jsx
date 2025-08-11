import { ArrowRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import './TrailersSection.css'

const TrailersSection = () => {
    const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0)
    const [moviesWithTrailers, setMoviesWithTrailers] = useState([])
    const [loading, setLoading] = useState(true)
    const { selectedCity } = useAppContext()
    const url = import.meta.env.VITE_BASE_URL || 'http://localhost:8080'

    // Fetch trailers for movies currently playing in the selected city
    useEffect(() => {
        const fetchTrailers = async () => {
            try {
                setLoading(true)
            
                const response = await fetch(`${url}/api/show/city/${selectedCity}/trailers`)
                const data = await response.json()
                

                
                if (data.success && data.moviesWithTrailers.length > 0) {

                    setMoviesWithTrailers(data.moviesWithTrailers)
                } else {

                    // Don't show sample data, just show empty state
                    setMoviesWithTrailers([])
                }
            } catch (error) {
        
                // Don't show sample data on error, just show empty state
                setMoviesWithTrailers([])
            } finally {
                setLoading(false)
            }
        }

        if (selectedCity) {
            fetchTrailers()
        }
    }, [selectedCity, url])

    // Simple navigation functions
    const nextTrailer = () => {
        setCurrentTrailerIndex((prev) => (prev + 1) % moviesWithTrailers.length)
    }

    const prevTrailer = () => {
        setCurrentTrailerIndex((prev) => (prev - 1 + moviesWithTrailers.length) % moviesWithTrailers.length)
    }

    // Handle click on preview videos to prevent immediate play
    const handlePreviewClick = (e, direction) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (direction === 'next') {
            nextTrailer()
        } else {
            prevTrailer()
        }
    }

    if (loading) {
        return (
            <div className='movie-trailers-section'>
                <div className='trailers-header'>
                    <h2 className='trailers-title'>
                        <span className='trailers-title-text'>Latest </span>
                        <span className='trailers-title-highlight'>Movie</span>
                        <span className='trailers-title-text'> Trailers</span>
                    </h2>
                </div>
                <div className='trailer-loading'>
                    <p>Loading trailers for {selectedCity}...</p>
                </div>
            </div>
        )
    }

    if (moviesWithTrailers.length === 0) {
        return (
            <div className='movie-trailers-section'>
                <div className='trailers-header'>
                    <h2 className='trailers-title'>
                        <span className='trailers-title-text'>Latest </span>
                        <span className='trailers-title-highlight'>Movie</span>
                        <span className='trailers-title-text'> Trailers</span>
                    </h2>
                </div>
                <div className='trailer-no-trailers'>
                    <p>No movie trailers available for {selectedCity} at the moment.</p>
                    <p>This could be because:</p>
                    <ul>
                        <li>No movies are currently playing in {selectedCity}</li>
                        <li>The movies don't have trailers available</li>
                        <li>Please check back later for new releases</li>
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <div className='movie-trailers-section'>
            <div className='trailers-header'>
                <h2 className='trailers-title'>
                    <span className='trailers-title-text'>Latest </span>
                    <span className='trailers-title-highlight'>Movie</span>
                    <span className='trailers-title-text'> Trailers</span>
                </h2>
            </div>
            
            <div className='trailer-carousel'>
                <div className='trailer-preview trailer-preview-left' onClick={(e) => handlePreviewClick(e, 'prev')}>
                    <iframe
                        src={`https://www.youtube.com/embed/${moviesWithTrailers[(currentTrailerIndex - 1 + moviesWithTrailers.length) % moviesWithTrailers.length].trailer.key}?controls=0&autoplay=0&mute=1&modestbranding=1&rel=0`}
                        title="Trailer Preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                
                <div className='trailer-card'>
                    <div className='trailer-movie-title'>
                        {moviesWithTrailers[currentTrailerIndex].movie.title}
                    </div>
                    <iframe
                        src={`https://www.youtube.com/embed/${moviesWithTrailers[currentTrailerIndex].trailer.key}?controls=1&autoplay=0&mute=0`}
                        title="Main Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                
                <div className='trailer-preview trailer-preview-right' onClick={(e) => handlePreviewClick(e, 'next')}>
                    <iframe
                        src={`https://www.youtube.com/embed/${moviesWithTrailers[(currentTrailerIndex + 1) % moviesWithTrailers.length].trailer.key}?controls=0&autoplay=0&mute=1&modestbranding=1&rel=0`}
                        title="Trailer Preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

                        <div className='trailer-indicators'>
              {moviesWithTrailers.map((_, index) => (
                <button
                  key={index}
                  className={`trailer-indicator ${index === currentTrailerIndex ? 'active' : ''}`}
                  onClick={() => setCurrentTrailerIndex(index)}
                />
              ))}
            </div>
        </div>
    )
}

export default TrailersSection
