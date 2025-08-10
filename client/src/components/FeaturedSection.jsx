import { ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChromaMovieGrid from './ChromaMovieGrid'
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
          <span className='featured-title-text'>Now Showing in </span>
          <span className='featured-city-name'>{selectedCity}</span>
        </p>
      </div>

      <div className='featured-movies'>
        {loading ? (
          <div className='featured-loading'>
            <p>Loading movies for {selectedCity}...</p>
          </div>
        ) : cityMovies.length > 0 ? (
          <ChromaMovieGrid 
            movies={cityMovies.slice(0, 5)}
            columns={5}
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

      <div className='featured-show-more'>
        <button onClick={()=> navigate('/movies')} className='featured-show-more-btn'>
          Show All
          <ArrowRight className='featured-view-all-icon'/>
        </button>
      </div>

    </div>
  )
}

export default FeaturedSection
