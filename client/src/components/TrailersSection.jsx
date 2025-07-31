import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import { PlayCircleIcon, Share2 } from 'lucide-react'
import './TrailersSection.css'

const TrailersSection = () => {

    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextTrailer = () => {
        const nextIndex = (currentIndex + 1) % dummyTrailers.length
        setCurrentTrailer(dummyTrailers[nextIndex])
        setCurrentIndex(nextIndex)
    }

    const prevTrailer = () => {
        const prevIndex = currentIndex === 0 ? dummyTrailers.length - 1 : currentIndex - 1
        setCurrentTrailer(dummyTrailers[prevIndex])
        setCurrentIndex(prevIndex)
    }

    const selectTrailer = (trailer, index) => {
        setCurrentTrailer(trailer)
        setCurrentIndex(index)
    }

  return (
    <div className='trailers-section'>
      <p className='trailers-title'>Trailers</p>

      <div className='trailers-main-container'>
        {/* Main Video Player */}
        <div className='trailers-main-player'>
          <div className='trailers-video-container'>
            <div className='trailers-video-overlay'>
              <div className='trailers-video-top-bar'>
                <div className='trailers-video-info'>
                  <span className='trailers-video-brand'>MARVEL</span>
                  <span className='trailers-video-title'>Marvel Animation's What If...? Season 3 | Official Trailer | Disney+</span>
                </div>
                <button className='trailers-share-btn'>
                  <Share2 />
                </button>
              </div>
            </div>
            
            <div className='trailers-video-content'>
              <img 
                src={currentTrailer.image} 
                alt="Trailer thumbnail" 
                className='trailers-video-thumbnail'
              />
              <div className='trailers-play-button'>
                <PlayCircleIcon />
              </div>
            </div>
            
            <div className='trailers-video-bottom'>
              <div className='trailers-video-logo'>
                <div className='trailers-logo-text'>
                  <span className='trailers-logo-brand'>MARVEL ANIMATION</span>
                  <span className='trailers-logo-title'>WHAT IF...?</span>
                  <span className='trailers-logo-season'>SEASON 3</span>
                </div>
                <div className='trailers-official-text'>OFFICIAL TRAILER</div>
              </div>
              <div className='trailers-youtube-info'>
                <div className='trailers-youtube-logo'>YouTube</div>
                <div className='trailers-copyright'>© 2024 MARVEL</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Grid */}
      <div className='trailers-grid-container'>
        <div className='trailers-grid'>
          {dummyTrailers.map((trailer, index) => (
            <div 
              key={trailer.image} 
              className={`trailers-grid-item ${index === currentIndex ? 'active' : ''}`} 
              onClick={() => selectTrailer(trailer, index)}
            >
              <div className='trailers-grid-thumbnail'>
                <img src={trailer.image} alt="trailer" className='trailers-grid-image'/>
                <div className='trailers-grid-play-icon'>
                  <PlayCircleIcon />
                </div>
              </div>
              <div className='trailers-grid-info'>
                <div className='trailers-grid-brand'>MARVEL TELEVISION</div>
                <div className='trailers-grid-title'>{trailer.title || 'OFFICIAL TRAILER'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrailersSection
