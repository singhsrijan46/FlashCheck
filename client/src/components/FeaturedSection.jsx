import { ArrowRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'
import './FeaturedSection.css'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const { shows, selectedCity } = useAppContext()
    const [cityMovies, setCityMovies] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch movies for the selected city
    useEffect(() => {
        const fetchCityMovies = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/show/city/${selectedCity}`);
                const data = await response.json();
                
                if (data.success) {
                    console.log(`FeaturedSection - Found ${data.movies.length} movies for ${selectedCity}`);
                    setCityMovies(data.movies);
                } else {
                    console.error('FeaturedSection - Failed to fetch city movies:', data.message);
                    setCityMovies([]);
                }
            } catch (error) {
                console.error('FeaturedSection - Error fetching city movies:', error);
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
        <p className='featured-title'>Now Showing in {selectedCity}</p>
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
          cityMovies.slice(0, 4).map((movie) => (
            <MovieCard key={movie._id} movie={movie}/>
          ))
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
