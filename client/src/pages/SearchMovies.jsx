import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ChromaMovieCard from '../components/ChromaMovieCard';
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

// Language mapping function
const getLanguageCode = (language) => {
  const languageMap = {
    'English': 'en',
    'Hindi': 'hi',
    'Tamil': 'ta',
    'Telugu': 'te',
    'Kannada': 'kn',
    'Malayalam': 'ml',
    'Bengali': 'bn',
    'Marathi': 'mr',
    'Gujarati': 'gu',
    'Punjabi': 'pa',
    'Odia': 'or',
    'Assamese': 'as',
    'Sanskrit': 'sa',
    'Urdu': 'ur'
  };
  return languageMap[language] || language.toLowerCase();
};

const SearchMovies = () => {
  const { selectedCity } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cityMovies, setCityMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedFilters, setSelectedFilters] = useState({
    language: [],
    genre: [],
    format: [],
    rating: []
  });

  // Fetch movies for the selected city (same as FeaturedSection)
  useEffect(() => {
    const fetchCityMovies = async () => {
      try {
        setLoading(true);
        const url = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${url}/api/show/city/${selectedCity}`);
        const data = await response.json();
        
        if (data.success) {
          setCityMovies(data.movies || []);
        } else {
          setCityMovies([]);
        }
      } catch (error) {
        console.error('Error fetching city movies:', error);
        setCityMovies([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCity) {
      fetchCityMovies();
    }
  }, [selectedCity]);

  const genres = useMemo(() => getUniqueGenres(cityMovies), [cityMovies]);
  const languages = useMemo(() => getUniqueLanguages(cityMovies), [cityMovies]);

  // Static data for filters
  const formats = ['2D', '3D', '4DX', 'IMAX', 'Dolby Atmos', 'DTS:X'];
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
    return cityMovies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = selectedFilters.genre.length === 0 || 
        (movie.genres && movie.genres.some(g => selectedFilters.genre.includes(g.name)));
      const matchesLang = selectedFilters.language.length === 0 || 
        selectedFilters.language.some(lang => {
          // Check if any show for this movie has the selected language
          // For now, we'll use the movie's original language as fallback
          const langCode = getLanguageCode(lang);
          return movie.original_language === langCode;
        });
      const matchesFormat = selectedFilters.format.length === 0 || 
        // For now, we'll assume all movies support all formats
        // In a real implementation, this would check the actual show formats
        true;
      const matchesRating = selectedFilters.rating.length === 0 || 
        selectedFilters.rating.some(rating => {
          const minRating = parseInt(rating);
          return movie.vote_average >= minRating;
        });
      return matchesSearch && matchesGenre && matchesLang && matchesFormat && matchesRating;
    });
  }, [cityMovies, search, selectedFilters]);

  if (loading) {
    return (
      <div className="search-page-container">
        <div className="search-page">
          <div className="search-body">
            <div className="loading-message">
              <p>Loading movies for {selectedCity}...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page-container">
      <div className="search-page">
        <div className="search-body">
          {/* Left Filter Panel */}
          <div className="filters-panel">
            <h3>Advanced Filters</h3>
            <p className="filter-subtitle">Filtering movies in {selectedCity}</p>

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
                <button 
                  className={`filter-option ${isSelected('language', 'Kannada') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('language', 'Kannada')}
                >
                  Kannada
                </button>
                <button 
                  className={`filter-option ${isSelected('language', 'Malayalam') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('language', 'Malayalam')}
                >
                  Malayalam
                </button>
                <button 
                  className={`filter-option ${isSelected('language', 'Bengali') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('language', 'Bengali')}
                >
                  Bengali
                </button>
                <button 
                  className={`filter-option ${isSelected('language', 'Marathi') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('language', 'Marathi')}
                >
                  Marathi
                </button>
                <button 
                  className={`filter-option ${isSelected('language', 'Gujarati') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('language', 'Gujarati')}
                >
                  Gujarati
                </button>
                <button 
                  className={`filter-option ${isSelected('language', 'Punjabi') ? 'selected' : ''}`}
                  onClick={() => handleFilterChange('language', 'Punjabi')}
                >
                  Punjabi
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
                {cityMovies.length === 0 ? (
                  <div className="no-results">
                    <p>No movies available in {selectedCity} at the moment.</p>
                    <p>Please try another city or check back later for new releases.</p>
                  </div>
                ) : filteredMovies.length === 0 ? (
                  <div className="no-results">
                    <p>No movies found matching your criteria.</p>
                    <p>Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  filteredMovies.map((movie) => (
                    <div key={movie._id || movie.id} onClick={() => handleMovieClick(movie._id || movie.id)}>
                      <ChromaMovieCard movie={movie} />
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