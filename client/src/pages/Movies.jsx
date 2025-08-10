import React from 'react'
import { useEffect, useState } from 'react'
import ChromaMovieCard from '../components/ChromaMovieCard'
import { useAppContext } from '../context/AppContext'
import './Movies.css'

const Movies = () => {
  const { selectedCity } = useAppContext();
  const [cityMovies, setCityMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

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
  }, [selectedCity, url]);

  if (loading) {
    return (
      <div className='movies-page'>
        <div className='movies-header'>
          <p className='movies-title'>
            <span className='movies-title-text'>Now Showing in </span>
            <span className='movies-city-name'>{selectedCity}</span>
          </p>
        </div>
        <div className='movies-loading'>
          <p>Loading movies for {selectedCity}...</p>
        </div>
      </div>
    );
  }

  return cityMovies.length > 0 ? (
    <div className='movies-page'>
      <div className='movies-header'>
        <p className='movies-title'>
          <span className='movies-title-text'>Now Showing in </span>
          <span className='movies-city-name'>{selectedCity}</span>
        </p>
      </div>
      <div className='movies-grid'>
        {cityMovies.map((movie)=> (
          <ChromaMovieCard movie={movie} key={movie._id || movie.id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='movies-empty'>
      <h1 className='movies-empty-title'>No movies available in {selectedCity}</h1>
      <p className='movies-empty-subtitle'>Please try another city or check back later for new releases.</p>
    </div>
  )
}

export default Movies
