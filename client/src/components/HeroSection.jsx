import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Aurora from './Aurora'
import './HeroSection.css'

const HeroSection = () => {
  const navigate = useNavigate()

  const handleBookNowClick = () => {
    navigate('/movies')
  }

    return (
    <>
      <div className='hero-section'>
        {/* Aurora Background */}
        <div className='hero-background'>
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>
        
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
            {/* First set of 16 movies */}
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg" alt="Top Gun: Maverick" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg" alt="Black Panther: Wakanda Forever" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg" alt="Avatar: The Way of Water" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg" alt="Thor: Love and Thunder" />
              </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg" alt="Spider-Man: No Way Home" />
              </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg" alt="Avengers: Endgame" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg" alt="No Time to Die" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg" alt="The Batman" />
          </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/5hoS3nEkGGXUfmnu39yw1k52JX5.jpg" alt="Fast X" />
        </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg" alt="Dune" />
      </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg" alt="Bullet Train" />
        </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" alt="The Matrix Resurrections" />
          </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/5P8SmMzSNYikXpxil6BYzJ16611.jpg" alt="Eternals" />
        </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg" alt="Interstellar" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg" alt="Encanto" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/cvsXj3I9Q2iyyIo95AecSd1tad7.jpg" alt="Oppenheimer" />
          </div>
          
            {/* Duplicate set for seamless loop */}
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg" alt="Top Gun: Maverick" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg" alt="Black Panther: Wakanda Forever" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg" alt="Avatar: The Way of Water" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg" alt="Thor: Love and Thunder" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg" alt="Spider-Man: No Way Home" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg" alt="Avengers: Endgame" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg" alt="No Time to Die" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg" alt="The Batman" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/5hoS3nEkGGXUfmnu39yw1k52JX5.jpg" alt="Fast X" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg" alt="Dune" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg" alt="Bullet Train" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" alt="The Matrix Resurrections" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/5P8SmMzSNYikXpxil6BYzJ16611.jpg" alt="Eternals" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg" alt="Interstellar" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg" alt="Encanto" />
            </div>
            <div className='movie-card'>
              <img src="https://image.tmdb.org/t/p/w500/cvsXj3I9Q2iyyIo95AecSd1tad7.jpg" alt="Oppenheimer" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeroSection
