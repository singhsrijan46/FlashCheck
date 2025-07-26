import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import MovieCard from '../../components/MovieCard/MovieCard';
import './Movies.css';
import poster from '../../assets/demon-slayer_poster.webp';
import { useAppContext } from '../../context/AppContext';

const Movies = ({ onCityClick, onSignInClick }) => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const navigate = useNavigate();
  // Remove useParams
  // const { city } = useParams();
  const { city = 'new-delhi' } = useAppContext();

  // Sample movie data with different languages
  const movies = [
    { id: 1, poster, rating: 8.5, votes: 1250, genres: ['Action', 'Adventure'], language: 'Hindi' },
    { id: 2, poster, rating: 7.8, votes: 890, genres: ['Comedy', 'Romance'], language: 'English' },
    { id: 3, poster, rating: 9.2, votes: 2100, genres: ['Thriller', 'Drama'], language: 'Tamil' },
    { id: 4, poster, rating: 8.1, votes: 1560, genres: ['Sci-Fi', 'Action'], language: 'Telugu' },
    { id: 5, poster, rating: 7.5, votes: 720, genres: ['Horror', 'Mystery'], language: 'Hindi' },
    { id: 6, poster, rating: 8.9, votes: 1890, genres: ['Animation', 'Fantasy'], language: 'English' },
    { id: 7, poster, rating: 8.3, votes: 1450, genres: ['Action', 'Drama'], language: 'Tamil' },
    { id: 8, poster, rating: 7.9, votes: 980, genres: ['Comedy', 'Family'], language: 'Telugu' },
    { id: 9, poster, rating: 8.7, votes: 1670, genres: ['Thriller', 'Action'], language: 'Hindi' },
    { id: 10, poster, rating: 7.6, votes: 820, genres: ['Romance', 'Drama'], language: 'English' },
    { id: 11, poster, rating: 8.4, votes: 1320, genres: ['Sci-Fi', 'Thriller'], language: 'Tamil' },
    { id: 12, poster, rating: 8.0, votes: 1100, genres: ['Action', 'Comedy'], language: 'Telugu' },
    { id: 13, poster, rating: 8.8, votes: 1950, genres: ['Fantasy', 'Adventure'], language: 'Hindi' },
    { id: 14, poster, rating: 7.7, votes: 750, genres: ['Horror', 'Thriller'], language: 'English' },
    { id: 15, poster, rating: 8.2, votes: 1280, genres: ['Drama', 'Romance'], language: 'Tamil' },
    { id: 16, poster, rating: 8.6, votes: 1780, genres: ['Action', 'Sci-Fi'], language: 'Telugu' },
    { id: 17, poster, rating: 7.4, votes: 680, genres: ['Comedy', 'Romance'], language: 'Hindi' },
    { id: 18, poster, rating: 8.1, votes: 1420, genres: ['Thriller', 'Mystery'], language: 'English' },
    { id: 19, poster, rating: 8.9, votes: 2100, genres: ['Animation', 'Fantasy'], language: 'Tamil' },
    { id: 20, poster, rating: 7.8, votes: 920, genres: ['Action', 'Drama'], language: 'Telugu' },
  ];

  const languages = ['Hindi', 'English', 'Tamil', 'Telugu'];

  const handleLanguageClick = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  const filteredMovies =
    selectedLanguages.length === 0
      ? movies
      : movies.filter((movie) => selectedLanguages.includes(movie.language));

  return (
    <div className="movies-page-container">
      <NavBar onCityClick={onCityClick} onSignInClick={onSignInClick} />
      {/* Language Filter */}
      <div className="language-filter">
        <h2>Movies</h2>
        <div className="filter-buttons">
          {languages.map((language) => (
            <button
              key={language}
              className={`filter-btn ${selectedLanguages.includes(language) ? 'active' : ''}`}
              onClick={() => handleLanguageClick(language)}
            >
              {language}
            </button>
          ))}
        </div>
      </div>
      {/* Movies Grid */}
      <div className="movies-grid">
        {filteredMovies.map((movie) => (
          <div key={movie.id} onClick={() => handleMovieClick(movie.id)}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Movies;
