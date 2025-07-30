import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import { PlayCircleIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import './TrailersSection.css'

const TrailersSection = () => {

    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextTrailer = () => {
        const nextIndex = (currentIndex + 1) % dummyTrailers.length
        setCurrentIndex(nextIndex)
        setCurrentTrailer(dummyTrailers[nextIndex])
    }

    const prevTrailer = () => {
        const prevIndex = currentIndex === 0 ? dummyTrailers.length - 1 : currentIndex - 1
        setCurrentIndex(prevIndex)
        setCurrentTrailer(dummyTrailers[prevIndex])
    }

    const selectTrailer = (trailer, index) => {
        setCurrentTrailer(trailer)
        setCurrentIndex(index)
    }

  return (
    <div className='trailers-section'>
      <p className='trailers-title'>Trailers</p>

      <div className='trailers-video-container'>
        <ReactPlayer url={currentTrailer.videoUrl} controls={false} className="trailers-video" width="960px" height="540px"/>
      </div>

      <div className='trailers-carousel-container'>
        <button className='trailers-nav-button trailers-nav-left' onClick={prevTrailer}>
          <ChevronLeftIcon />
        </button>
        
        <div className='trailers-carousel'>
          <div className='trailers-carousel-track' style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {dummyTrailers.map((trailer, index) => (
              <div 
                key={trailer.image} 
                className={`trailers-carousel-item ${index === currentIndex ? 'active' : ''}`} 
                onClick={() => selectTrailer(trailer, index)}
              >
                <img src={trailer.image} alt="trailer" className='trailers-carousel-image'/>
                <PlayCircleIcon strokeWidth={1.6} className="trailers-play-icon"/>
              </div>
            ))}
          </div>
        </div>

        <button className='trailers-nav-button trailers-nav-right' onClick={nextTrailer}>
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  )
}

export default TrailersSection
