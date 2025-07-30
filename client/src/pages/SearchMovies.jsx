import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
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
const getUniqueYears = (movies) => getUnique(movies, 'release_date').map(d => d?.split('-')[0]).filter(Boolean).sort((a, b) => b - a);

const SearchMovies = () => {
  const { shows = [] } = useAppContext();
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  const genres = useMemo(() => getUniqueGenres(shows), [shows]);
  const languages = useMemo(() => getUniqueLanguages(shows), [shows]);
  const years = useMemo(() => getUniqueYears(shows), [shows]);

  const handleMultiSelect = (value, selected, setSelected) => {
    setSelected(selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value]);
  };

  const filteredMovies = useMemo(() => {
    return shows.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = selectedGenres.length === 0 || (movie.genres && movie.genres.some(g => selectedGenres.includes(g.name)));
      const matchesLang = selectedLanguages.length === 0 || selectedLanguages.includes(movie.original_language);
      const year = movie.release_date?.split('-')[0];
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(year);
      return matchesSearch && matchesGenre && matchesLang && matchesYear;
    });
  }, [shows, search, selectedGenres, selectedLanguages, selectedYears]);

  return (
    <div className="search-movies-page">
      <div className="search-movies-sidebar glassy">
        <h2 className="search-movies-filter-title">Filters</h2>
        <div className="search-movies-filter-group">
          <div className="search-movies-filter-label">Genres</div>
          <div className="search-movies-filter-options">
            {genres.map(genre => (
              <label key={genre} className="search-movies-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleMultiSelect(genre, selectedGenres, setSelectedGenres)}
                />
                {genre}
              </label>
            ))}
          </div>
        </div>
        <div className="search-movies-filter-group">
          <div className="search-movies-filter-label">Languages</div>
          <div className="search-movies-filter-options">
            {languages.map(lang => (
              <label key={lang} className="search-movies-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(lang)}
                  onChange={() => handleMultiSelect(lang, selectedLanguages, setSelectedLanguages)}
                />
                {lang.toUpperCase()}
              </label>
            ))}
          </div>
        </div>
        <div className="search-movies-filter-group">
          <div className="search-movies-filter-label">Years</div>
          <div className="search-movies-filter-options">
            {years.map(year => (
              <label key={year} className="search-movies-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedYears.includes(year)}
                  onChange={() => handleMultiSelect(year, selectedYears, setSelectedYears)}
                />
                {year}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="search-movies-main">
        <div className="search-movies-searchbar glassy">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-movies-input"
          />
        </div>
        <div className="search-movies-results-grid">
          {filteredMovies.length === 0 ? (
            <div className="search-movies-no-results">No movies found.</div>
          ) : (
            filteredMovies.map(movie => (
              <div key={movie._id || movie.id} className="search-movies-card glassy">
                <div className="search-movies-card-img-container">
                  <img src={movie.poster_path} alt={movie.title} className="search-movies-card-img" />
                </div>
                <div className="search-movies-card-info">
                  <div className="search-movies-card-title">{movie.title}</div>
                  <div className="search-movies-card-meta">
                    <span>{movie.release_date?.split('-')[0]}</span>
                    <span className="search-movies-card-lang">{movie.original_language?.toUpperCase()}</span>
                  </div>
                  <div className="search-movies-card-genres">
                    {movie.genres?.map(g => g.name).join(', ')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchMovies; 