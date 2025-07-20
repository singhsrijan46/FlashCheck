import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Search.css';
import MovieCard from '../../components/MovieCard/MovieCard';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import poster from '../../assets/demon-slayer_poster.webp';

const Search = ({ onCityClick, onSignInClick }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    theatre: [],
    language: [],
    genre: [],
    format: [],
    rating: []
  });
  const navigate = useNavigate();
  const { city } = useParams();

  // Sample movie data for search results
  const searchResults = [
    { id: 1, poster, rating: 8.5, votes: 1250, genres: ['Action', 'Adventure'] },
    { id: 2, poster, rating: 7.8, votes: 890, genres: ['Comedy', 'Romance'] },
    { id: 3, poster, rating: 9.2, votes: 2100, genres: ['Thriller', 'Drama'] },
    { id: 4, poster, rating: 8.1, votes: 1560, genres: ['Sci-Fi', 'Action'] },
    { id: 5, poster, rating: 7.5, votes: 720, genres: ['Horror', 'Mystery'] },
    { id: 6, poster, rating: 8.9, votes: 1890, genres: ['Animation', 'Fantasy'] }
  ];

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const isSelected = (filterType, value) => {
    return selectedFilters[filterType].includes(value);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/${city || 'new-delhi'}/movies/${movieId}`);
  };

  return (
    <div className="search-page-container">
      <NavBar onCityClick={onCityClick} onSignInClick={onSignInClick}/>
    <div className="search-page">
      <div className="search-body">
        {/* Left Filter Panel */}
        <div className="filters-panel">
          <h3>Advanced Filters</h3>

          <div className="filter-group">
              <label>Theatre</label>
              <div className="filter-options">
                <button 
                  className={`filter-option ${isSelected('theatre', 'PVR') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('theatre', 'PVR')}
                >
                  PVR
                </button>
                <button 
                  className={`filter-option ${isSelected('theatre', 'INOX') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('theatre', 'INOX')}
                >
                  INOX
                </button>
                <button 
                  className={`filter-option ${isSelected('theatre', 'Cinepolis') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('theatre', 'Cinepolis')}
                >
                  Cinepolis
                </button>
          </div>
          </div>

          <div className="filter-group">
            <label>Language</label>
              <div className="filter-options">
                <button 
                  className={`filter-option ${isSelected('language', 'Hindi') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('language', 'Hindi')}
                >
                  Hindi
                </button>
                <button 
                  className={`filter-option ${isSelected('language', 'English') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('language', 'English')}
                >
                  English
                </button>
                <button 
                  className={`filter-option ${isSelected('language', 'Tamil') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('language', 'Tamil')}
                >
                  Tamil
                </button>
                <button 
                  className={`filter-option ${isSelected('language', 'Telugu') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('language', 'Telugu')}
                >
                  Telugu
                </button>
              </div>
          </div>

          <div className="filter-group">
            <label>Genre</label>
              <div className="filter-options">
                <button 
                  className={`filter-option ${isSelected('genre', 'Action') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('genre', 'Action')}
                >
                  Action
                </button>
                <button 
                  className={`filter-option ${isSelected('genre', 'Comedy') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('genre', 'Comedy')}
                >
                  Comedy
                </button>
                <button 
                  className={`filter-option ${isSelected('genre', 'Horror') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('genre', 'Horror')}
                >
                  Horror
                </button>
                <button 
                  className={`filter-option ${isSelected('genre', 'Romance') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('genre', 'Romance')}
                >
                  Romance
                </button>
                <button 
                  className={`filter-option ${isSelected('genre', 'Thriller') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('genre', 'Thriller')}
                >
                  Thriller
                </button>
              </div>
          </div>

          <div className="filter-group">
            <label>Format</label>
              <div className="filter-options">
                <button 
                  className={`filter-option ${isSelected('format', '2D') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('format', '2D')}
                >
                  2D
                </button>
                <button 
                  className={`filter-option ${isSelected('format', '3D') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('format', '3D')}
                >
                  3D
                </button>
                <button 
                  className={`filter-option ${isSelected('format', '4DX') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('format', '4DX')}
                >
                  4DX
                </button>
              </div>
          </div>

          <div className="filter-group">
            <label>Rating</label>
              <div className="filter-options">
                <button 
                  className={`filter-option ${isSelected('rating', '7+') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('rating', '7+')}
                >
                  7+
                </button>
                <button 
                  className={`filter-option ${isSelected('rating', '8+') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('rating', '8+')}
                >
                  8+
                </button>
                <button 
                  className={`filter-option ${isSelected('rating', '9+') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('rating', '9+')}
                >
                  9+
                </button>
              </div>
            </div>
          </div>
          {/* Right Content Panel */}
          <div className="content-panel">
            {/* Search Bar */}
            <div className="search-bar">
              <input type="text" placeholder="Search movies..." />
              <button>Search</button>
        </div>
            {/* Movie Results */}
        <div className="results-panel">
              <div className="search-results-grid">
                {searchResults.map((movie) => (
                  <div key={movie.id} onClick={() => handleMovieClick(movie.id)}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;