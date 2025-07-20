import React, { useState } from 'react';
import './AddShows.css';

const OMDB_API_KEY = 'demo'; // Replace with your OMDb API key

const cities = [
  'New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur'
];

const AddShows = () => {
  const [movieName, setMovieName] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDate, setShowDate] = useState('');
  const [showTime, setShowTime] = useState('');
  const [shows, setShows] = useState([]);
  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMovieSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowDetails(false);
    setMovieData(null);
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(movieName)}`);
      const data = await res.json();
      if (data && data.Response !== 'False') {
        setMovieData(data);
        setShowDetails(true);
      } else {
        setError('Movie not found.');
      }
    } catch (err) {
      setError('Error fetching movie data.');
    }
    setLoading(false);
  };

  const handleAddShow = () => {
    if (!showDate || !showTime) return;
    setShows([...shows, { date: showDate, time: showTime }]);
    setShowDate('');
    setShowTime('');
  };

  return (
    <div className="addshows-container">
      <h2 className="addshows-heading">Add Shows</h2>
      <form className="addshows-form" onSubmit={handleMovieSearch}>
        <input
          type="text"
          placeholder="Enter Movie Name"
          value={movieName}
          onChange={e => setMovieName(e.target.value)}
          className="addshows-input"
          required
        />
        <button type="submit" className="addshows-search-btn" disabled={loading}>
          {loading ? 'Searching...' : 'Fetch Movie'}
        </button>
      </form>
      {error && <div className="addshows-error">{error}</div>}
      {showDetails && movieData && (
        <div className="addshows-movie-details slide-down">
          <img src={movieData.Poster} alt={movieData.Title} className="addshows-movie-poster" />
          <div className="addshows-movie-info">
            <h3>{movieData.Title} ({movieData.Year})</h3>
            <p><b>Genre:</b> {movieData.Genre}</p>
            <p><b>Director:</b> {movieData.Director}</p>
            <p><b>Actors:</b> {movieData.Actors}</p>
            <p><b>Plot:</b> {movieData.Plot}</p>
            <p><b>IMDB Rating:</b> {movieData.imdbRating}</p>
          </div>
        </div>
      )}
      {showDetails && movieData && (
        <div className="addshows-showtime-section">
          <h4>Add Show Time</h4>
          <div className="addshows-showtime-row">
            <input
              type="date"
              value={showDate}
              onChange={e => setShowDate(e.target.value)}
              className="addshows-date-input"
            />
            <input
              type="time"
              value={showTime}
              onChange={e => setShowTime(e.target.value)}
              className="addshows-time-input"
            />
            <button type="button" className="addshows-add-btn" onClick={handleAddShow}>
              Add
            </button>
          </div>
          <div className="addshows-shows-list">
            {shows.map((show, idx) => (
              <div key={idx} className="addshows-show-item">
                {show.date} at {show.time}
              </div>
            ))}
          </div>
          <div className="addshows-city-section">
            <label htmlFor="city-select">Select City:</label>
            <select
              id="city-select"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="addshows-city-select"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddShows; 