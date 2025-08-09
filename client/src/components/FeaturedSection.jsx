import { ArrowRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChromaMovieGrid from './ChromaMovieGrid'
import ShinyText from './ShinyText'
import { useAppContext } from '../context/AppContext'
import './FeaturedSection.css'

const FeaturedSection = () => {
    const url = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
    const navigate = useNavigate()
    const { selectedCity } = useAppContext()
    const [cityMovies, setCityMovies] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch movies for the selected city
    useEffect(() => {
        const fetchCityMovies = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${url}/api/show/city/${selectedCity}`);
                const data = await response.json();
                
                if (data.success) {
                    setCityMovies(data.movies);
                } else {
                    setCityMovies([]);
                }
            } catch (error) {
                setCityMovies([]);
            } finally {
                setLoading(false);
            }
        };

        if (selectedCity) {
            fetchCityMovies();
        }
    }, [selectedCity]);

  return (
    <div className='featured-section'>

      <div className='featured-header'>
        <p className='featured-title'>
          <ShinyText 
            text={`Now Showing in ${selectedCity}`} 
            disabled={false} 
            speed={3} 
            className='featured-shiny-title' 
          />
        </p>
        <button onClick={()=> navigate('/movies')} className='featured-view-all'>
            View All 
            <ArrowRight className='featured-view-all-icon'/>
          </button>
      </div>

      <div className='featured-movies'>
        {loading ? (
          <div className='featured-loading'>
            <p>Loading movies for {selectedCity}...</p>
          </div>
        ) : cityMovies.length > 0 ? (
          <ChromaMovieGrid 
            movies={cityMovies.slice(0, 4)}
            columns={4}
            gap="1.5rem"
            radius={250}
            damping={0.4}
            fadeOut={0.7}
            ease="power3.out"
            className="featured-chroma-grid"
          />
        ) : (
          <div className='featured-no-movies'>
            <p>No movies available in {selectedCity} at the moment.</p>
            <p>Please try another city or check back later for new releases.</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default FeaturedSection
