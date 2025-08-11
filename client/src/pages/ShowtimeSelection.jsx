import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './ShowtimeSelection.css';

const ShowtimeSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, image_base_url, selectedCity } = useAppContext();
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [showData, setShowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get movie details first
        const movieResponse = await axios.get(`/api/show/${id}`);
        
        if (movieResponse.data.success) {
          setCurrentMovie(movieResponse.data.show.movie);
        }
        
        // Get shows for this movie in the selected city
        const city = selectedCity || 'Varanasi';
        
        const showsResponse = await axios.get(`/api/show/${id}/city/${city}`);
        
        if (showsResponse.data.success) {
  
          showsResponse.data.shows.forEach((show, index) => {

          });
          setShowData(showsResponse.data.shows);
        } else {
          setShowData([]);
        }
      } catch (error) {
        let errorMessage = 'Failed to load showtimes. Please try again.';
        
        if (error.code === 'ECONNREFUSED') {
          errorMessage = 'Cannot connect to server. Please check if the server is running.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Movie not found.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        setError(errorMessage);
        setShowData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShowData();
  }, [id, selectedCity, axios]);

  // Generate dates for the next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const formatDate = (date) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    
    return { day, dateNum, month };
  };

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Check if a date has shows
  const hasShowsForDate = (date) => {
    if (!showData || !Array.isArray(showData)) return false;
    const dateStr = date.toISOString().split('T')[0];
    return showData.some(show => {
      const showDate = new Date(show.showDateTime).toISOString().split('T')[0];
      return showDate === dateStr;
    });
  };

  // Get shows for a specific date
  const getShowsForDate = (date) => {
    if (!showData || !Array.isArray(showData)) return [];
    const dateStr = date.toISOString().split('T')[0];
    return showData.filter(show => {
      const showDate = new Date(show.showDateTime).toISOString().split('T')[0];
      return showDate === dateStr;
    });
  };

  // Group shows by theatre for a specific date
  const getTheatresForDate = (date) => {
    const shows = getShowsForDate(date);
    const theatreMap = new Map();
    
    shows.forEach(show => {
      const theatreId = show.theatre?._id || show.theatre;
      const theatreName = show.theatre?.name || 'Unknown Theatre';
      
      if (!theatreMap.has(theatreId)) {
        theatreMap.set(theatreId, {
          theatreId: theatreId,
          theatreName: theatreName,
          shows: []
        });
      }
      
      theatreMap.get(theatreId).shows.push(show);
    });
    
    return Array.from(theatreMap.values());
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTheatre(null);
    setSelectedShowtime(null);
  };

  const handleTheatreSelect = (theatre) => {
    setSelectedTheatre(theatre);
    setSelectedShowtime(null);
  };

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
  };

  const handleBookSeats = () => {
    if (selectedDate && selectedShowtime) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      // Temporarily use date-based route for testing
      navigate(`/movies/${id}/${dateStr}`, {
        state: {
          showtimeData: selectedShowtime,
          movieId: id,
          date: dateStr
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="showtime-selection-page">
        <div className="showtime-loading">Loading showtimes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="showtime-selection-page">
        <div className="showtime-error">{error}</div>
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div className="showtime-selection-page">
        <div className="showtime-error">Movie not found.</div>
      </div>
    );
  }

  return (
    <div className="showtime-selection-page">
      <div className="showtime-container">
        {/* Left Column - Movie Poster */}
        <div className="showtime-poster-column">
          <div className="showtime-poster-container">
            <img 
              src={image_base_url + (currentMovie.poster_path || currentMovie.backdrop_path || '/default-poster.jpg')} 
            alt={currentMovie.title}
              className="showtime-movie-poster-large"
            />
            <div className="showtime-movie-info-overlay">
              <h1 className="showtime-movie-title-large">{currentMovie.title}</h1>
              <p className="showtime-movie-meta-large">
              {currentMovie.runtime ? `${currentMovie.runtime} min` : 'Runtime not available'} • {currentMovie.genres?.map(genre => genre.name).join(", ") || 'Genres not available'}
            </p>
              <div className="showtime-movie-rating">
                <span className="showtime-rating-label">Rating:</span>
                <span className="showtime-rating-value">{currentMovie.vote_average?.toFixed(1) || 'N/A'}/10</span>
              </div>
            </div>
        </div>
      </div>

        {/* Right Column - Selection Details */}
        <div className="showtime-details-column">
      {/* Date Selection */}
      <div className="showtime-date-section">
        <h2 className="showtime-section-title">Select Date</h2>
        <div className="showtime-date-picker">
          {dates.map((date, index) => {
            const formatted = formatDate(date);
            const hasShows = hasShowsForDate(date);
            const isSelected = selectedDate && 
              selectedDate.getDate() === date.getDate() && 
              selectedDate.getMonth() === date.getMonth();
            
            return (
              <button
                key={index}
                className={`showtime-date-btn ${isSelected ? 'selected' : ''} ${hasShows ? 'has-shows' : 'no-shows'}`}
                onClick={() => hasShows && handleDateSelect(date)}
                disabled={!hasShows}
              >
                <span className="showtime-date-day">{formatted.day}</span>
                <span className="showtime-date-number">{formatted.dateNum}</span>
                <span className="showtime-date-month">{formatted.month}</span>
                {hasShows && <span className="showtime-has-shows-indicator">●</span>}
              </button>
            );
          })}
        </div>
      </div>

          {/* Theatre and Showtime Selection */}
      {selectedDate && (
            <div className="showtime-theatre-showtime-section">
              <h2 className="showtime-section-title">Select Theatre & Showtime</h2>
              <div className="showtime-theatre-showtime-list">
            {(() => {
              const theatres = getTheatresForDate(selectedDate);
              
              if (theatres.length === 0) {
                return (
                  <div className="showtime-no-theatres">
                    No theatres available for the selected date.
                  </div>
                );
              }
              
              return theatres.map((theatre, index) => {
                return (
                      <div key={index} className="showtime-theatre-showtime-item">
                        {/* Theatre Name on Left */}
                        <div className="showtime-theatre-name-section">
                          <h3 className="showtime-theatre-name">{theatre.theatreName}</h3>
                        <span className="showtime-theatre-count">{theatre.shows.length} showtimes</span>
                      </div>
                        
                        {/* Showtimes on Right */}
                        <div className="showtime-showtimes-section">
                          <div className="showtime-showtimes-grid">
                            {theatre.shows.map((showtime, showIndex) => {
              const isSelected = selectedShowtime && selectedShowtime._id === showtime._id;
      
              return (
                <button
                                  key={showIndex}
                  className={`showtime-time-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleShowtimeSelect(showtime)}
                >
                  <div className="showtime-slot-info">
                    <span className="showtime-time">{formatTime(showtime.showDateTime)}</span>
                    <span className="showtime-format">{showtime.format || '2D'}</span>
                    <span className="showtime-screen">Screen {showtime.screen}</span>
                    <span className="showtime-language">{showtime.language || 'English'}</span>
                  </div>
                </button>
              );
            })}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
          </div>
        </div>
      )}

      {/* Book Seats Button */}
      {selectedDate && selectedShowtime && (
        <div className="showtime-book-section">
          <button 
            className="showtime-book-btn"
            onClick={handleBookSeats}
          >
            Book Seats
          </button>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default ShowtimeSelection; 