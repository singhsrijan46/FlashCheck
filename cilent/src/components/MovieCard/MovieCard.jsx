import React from 'react';
import './MovieCard.css';
import { Star } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const { poster, rating, genres } = movie;

  return (
    <div className='moviecard'>
      <img src={poster} alt="Movie Poster" />
      <div className='rating-overlay'>
        <div className='rating-info'>
          <div className='rating'>
            <Star className='star-icon' />
            <span className='rating-value'>{rating}</span>
          </div>
        </div>
        <div className='genres'>
          {genres.map((genre, index) => (
            <span key={index} className='genre-tag'>{genre}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard; 