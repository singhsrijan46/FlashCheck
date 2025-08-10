import React from 'react';
import ChromaMovieCard from './ChromaMovieCard';
import './ChromaMovieGrid.css';

const ChromaMovieGrid = ({ 
  movies = [], 
  className = "",
  columns = 3,
  gap = "1.5rem"
}) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="chroma-movie-grid-container">
        <p className="no-movies-message">No movies available</p>
      </div>
    );
  }

  return (
    <div 
      className={`chroma-movie-grid-container ${className}`}
      style={{
        '--grid-columns': columns,
        '--grid-gap': gap
      }}
    >
      <div className="chroma-movie-grid-layout">
        {movies.map((movie, index) => (
          <ChromaMovieCard
            key={movie._id || movie.id || index}
            movie={movie}
          />
        ))}
      </div>
    </div>
  );
};

export default ChromaMovieGrid;
