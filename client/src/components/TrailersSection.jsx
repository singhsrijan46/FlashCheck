import { ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import './TrailersSection.css'

const TrailersSection = () => {
    const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0)

    // Sample YouTube trailer IDs for demonstration
    // In a real app, these would come from your movie database
    const trailerIds = [
        'VQGCKyvzIM4', // Demon Slayer: Hashira Training Arc (latest season)
        'T6DJcgm3wNY'  // Superman: Legacy
    ]

    // Simple navigation functions
    const nextTrailer = () => {
        setCurrentTrailerIndex((prev) => (prev + 1) % trailerIds.length)
    }

    const prevTrailer = () => {
        setCurrentTrailerIndex((prev) => (prev - 1 + trailerIds.length) % trailerIds.length)
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
                        src={`https://www.youtube.com/embed/${trailerIds[(currentTrailerIndex - 1 + trailerIds.length) % trailerIds.length]}?controls=0&autoplay=0&mute=1&modestbranding=1&rel=0`}
                        title="Trailer Preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                
                <div className='trailer-card'>
                    <iframe
                        src={`https://www.youtube.com/embed/${trailerIds[currentTrailerIndex]}?controls=1&autoplay=0&mute=0`}
                        title="Main Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                
                <div className='trailer-preview trailer-preview-right' onClick={(e) => handlePreviewClick(e, 'next')}>
                    <iframe
                        src={`https://www.youtube.com/embed/${trailerIds[(currentTrailerIndex + 1) % trailerIds.length]}?controls=0&autoplay=0&mute=1&modestbranding=1&rel=0`}
                        title="Trailer Preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

                        <div className='trailer-indicators'>
              {trailerIds.map((_, index) => (
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
