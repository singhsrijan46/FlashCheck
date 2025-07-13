import React from 'react'
import './FeaturedSection.css'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react';
import MovieCard from '../MovieCard/MovieCard';
import poster from '../../assets/demon-slayer_poster.webp'

const FeaturedSection = ({ heading = 'Now Showing', onMovieClick }) => {
  const navigate = useNavigate();
  const { city } = useParams();
  const currentCity = city || 'new-delhi';

  // Sample movie data with ratings and genres
  const movies = [
    { id: 1, poster, rating: 8.5, votes: 1250, genres: ['Action', 'Adventure'] },
    { id: 2, poster, rating: 7.8, votes: 890, genres: ['Comedy', 'Romance'] },
    { id: 3, poster, rating: 9.2, votes: 2100, genres: ['Thriller', 'Drama'] },
    { id: 4, poster, rating: 8.1, votes: 1560, genres: ['Sci-Fi', 'Action'] },
    { id: 5, poster, rating: 7.5, votes: 720, genres: ['Horror', 'Mystery'] },
    { id: 6, poster, rating: 8.9, votes: 1890, genres: ['Animation', 'Fantasy'] }
  ];

  const handleMovieClick = (movieId) => {
    if (onMovieClick) {
      onMovieClick(movieId);
    } else {
      navigate(`/${currentCity}/movies/${movieId}`);
    }
  };

  return (
    <div className='featuredsection'>
        <div className='heading'>
            <p>{heading}</p>
            <button onClick={() => navigate(`/${currentCity}/movies`)}>
                View All
                <ArrowRight/>
            </button>
        </div>
        <div className='cards-row'>
          {movies.map((movie) => (
            <div key={movie.id} onClick={() => handleMovieClick(movie.id)}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
    </div>
  )
}

export default FeaturedSection