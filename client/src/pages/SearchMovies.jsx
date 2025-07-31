import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import './SearchMovies.css';

const getUnique = (arr, key) => [...new Set(arr.map(item => item[key]))].filter(Boolean);

const getUniqueGenres = (movies) => {
  const genres = [];
  movies.forEach(movie => {
    if (movie.genres) {
      movie.genres.forEach(g => genres.push(g.name));
    }
  });
  return [...new Set(genres)].sort();
};

const getUniqueLanguages = (movies) => getUnique(movies, 'original_language').sort();

const SearchMovies = () => {
  const { shows = [] } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  const [selectedFilters, setSelectedFilters] = useState({
    theatre: [],
    language: [],
    genre: [],
    format: [],
    rating: []
  });

  const genres = useMemo(() => getUniqueGenres(shows), [shows]);
  const languages = useMemo(() => getUniqueLanguages(shows), [shows]);

  // Static data for filters
  const theatres = ['PVR', 'INOX', 'Cinepolis'];
  const formats = ['2D', '3D', '4DX'];
  const ratings = ['7+', '8+', '9+'];

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
    navigate(`/movies/${movieId}`);
  };

  const filteredMovies = useMemo(() => {
    return shows.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = selectedFilters.genre.length === 0 || 
        (movie.genres && movie.genres.some(g => selectedFilters.genre.includes(g.name)));
      const matchesLang = selectedFilters.language.length === 0 || 
        selectedFilters.language.some(lang => {
          const langCode = lang === 'English' ? 'en' : lang === 'Hindi' ? 'hi' : 
                          lang === 'Tamil' ? 'ta' : lang === 'Telugu' ? 'te' : lang.toLowerCase();
          return movie.original_language === langCode;
        });
      const matchesRating = selectedFilters.rating.length === 0 || 
        selectedFilters.rating.some(rating => {
          const minRating = parseInt(rating);
          return movie.vote_average >= minRating;
        });
      return matchesSearch && matchesGenre && matchesLang && matchesRating;
    });
  }, [shows, search, selectedFilters]);

  return (
    <div className="search-page-container">
      <div className="search-page">
        <div className="search-body">
          {/* Left Filter Panel */}
          <div className="filters-panel">
            <h3>Advanced Filters</h3>

            <div className="filter-group">
              <label>Theatre</label>
              <div className="filter-options">
                {theatres.map(theatre => (
                  <button 
                    key={theatre}
                    className={`filter-option ${isSelected('theatre', theatre) ? 'selected' : ''}`}
                    onClick={() => handleFilterChange('theatre', theatre)}
                  >
                    {theatre}
                  </button>
                ))}
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
                {genres.slice(0, 5).map(genre => (
                  <button 
                    key={genre}
                    className={`filter-option ${isSelected('genre', genre) ? 'selected' : ''}`}
                    onClick={() => handleFilterChange('genre', genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Format</label>
              <div className="filter-options">
                {formats.map(format => (
                  <button 
                    key={format}
                    className={`filter-option ${isSelected('format', format) ? 'selected' : ''}`}
                    onClick={() => handleFilterChange('format', format)}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Rating</label>
              <div className="filter-options">
                {ratings.map(rating => (
                  <button 
                    key={rating}
                    className={`filter-option ${isSelected('rating', rating) ? 'selected' : ''}`}
                    onClick={() => handleFilterChange('rating', rating)}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content Panel */}
          <div className="content-panel">
            {/* Search Bar */}
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search movies..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button>Search</button>
            </div>

            {/* Movie Results */}
            <div className="results-panel">
              <div className="search-results-grid">
                {filteredMovies.length === 0 ? (
                  <div className="no-results">
                    <p>No movies found matching your criteria.</p>
                    <p>Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  filteredMovies.map((movie) => (
                    <div key={movie._id || movie.id} onClick={() => handleMovieClick(movie._id || movie.id)}>
                      <MovieCard movie={movie} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchMovies; 