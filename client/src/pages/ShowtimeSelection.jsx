import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './ShowtimeSelection.css';

const ShowtimeSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, image_base_url } = useAppContext();
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/show/${id}`);
        if (data.success) {
          setCurrentMovie(data.show.movie);
          // Get all shows for this movie to display showtimes
          const showsResponse = await axios.get(`/api/show/all`);
          if (showsResponse.data.success) {
            console.log('All shows:', showsResponse.data.shows);
            console.log('Looking for movie ID:', id);
            
            // Try different ways to match the movie ID
            const movieShows = showsResponse.data.shows.filter(show => {
              const showMovieId = show.movie;
              const requestedId = id;
              
              console.log('Comparing:', { 
                showMovieId, 
                requestedId, 
                showMovieIdType: typeof showMovieId,
                requestedIdType: typeof requestedId,
                isObject: typeof showMovieId === 'object'
              });
              
              // If show.movie is an object (populated), check its _id
              if (typeof showMovieId === 'object' && showMovieId._id) {
                return showMovieId._id === requestedId || 
                       showMovieId._id === requestedId.toString() ||
                       showMovieId._id.toString() === requestedId ||
                       showMovieId._id.toString() === requestedId.toString();
              }
              
              // If show.movie is a string (movie ID), compare directly
              return showMovieId === requestedId || 
                     showMovieId === requestedId.toString() ||
                     showMovieId.toString() === requestedId ||
                     showMovieId.toString() === requestedId.toString();
            });
            
            console.log('Filtered shows for movie:', movieShows);
            setShowData(movieShows);
          }
        }
      } catch (error) {
        console.error('Error fetching show data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowData();
  }, [id, axios]);

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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (timeSlot) => {
    setSelectedTime(timeSlot);
  };

  const handleBookSeats = () => {
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      navigate(`/movies/${id}/${dateStr}`);
    }
  };

  // Helper function to check if a date has shows
  const hasShowsForDate = (date) => {
    if (!showData || !Array.isArray(showData)) return false;
    const dateStr = date.toISOString().split('T')[0];
    return showData.some(show => {
      const showDate = new Date(show.showDateTime).toISOString().split('T')[0];
      return showDate === dateStr;
    });
  };

  // Helper function to get shows for a specific date
  const getShowsForDate = (date) => {
    if (!showData || !Array.isArray(showData)) return [];
    const dateStr = date.toISOString().split('T')[0];
    return showData.filter(show => {
      const showDate = new Date(show.showDateTime).toISOString().split('T')[0];
      return showDate === dateStr;
    });
  };

  if (loading) {
    return <div className="showtime-loading">Loading...</div>;
  }

  if (!currentMovie || !showData) {
    return <div className="showtime-error">No shows available for this movie.</div>;
  }

  return (
    <div className="showtime-selection-page">
      {/* Header with movie info */}
      <div className="showtime-header">
        <div className="showtime-movie-info">
          <img 
            src={image_base_url + currentMovie.backdrop_path} 
            alt={currentMovie.title}
            className="showtime-movie-poster"
          />
          <div className="showtime-movie-details">
            <h1 className="showtime-movie-title">{currentMovie.title}</h1>
            <p className="showtime-movie-meta">
              {currentMovie.runtime} min • {currentMovie.genres.map(genre => genre.name).join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="showtime-date-section">
        <div className="showtime-date-picker">
          {dates.map((date, index) => {
            const formatted = formatDate(date);
            const dateStr = date.toISOString().split('T')[0];
            const hasShows = hasShowsForDate(date);
            const isSelected = selectedDate && 
              selectedDate.getDate() === date.getDate() && 
              selectedDate.getMonth() === date.getMonth();
            
            return (
              <button
                key={index}
                className={`showtime-date-btn ${isSelected ? 'selected' : ''} ${!hasShows ? 'disabled' : ''}`}
                onClick={() => hasShows && handleDateSelect(date)}
                disabled={!hasShows}
              >
                <span className="showtime-date-day">{formatted.day}</span>
                <span className="showtime-date-number">{formatted.dateNum}</span>
                <span className="showtime-date-month">{formatted.month}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="showtime-time-section">
          <div className="showtime-time-container">
            <h2 className="showtime-time-title">Select Showtime</h2>
            <div className="showtime-time-grid">
              {(() => {
                const dateStr = selectedDate.toISOString().split('T')[0];
                const timeSlots = getShowsForDate(selectedDate);
                
                return timeSlots.map((slot, index) => {
                  const isSelected = selectedTime && selectedTime._id === slot._id;
                  return (
                    <button
                      key={index}
                      className={`showtime-time-btn ${isSelected ? 'selected' : ''} available`}
                      onClick={() => handleTimeSelect(slot)}
                    >
                      <span className="showtime-time">{formatTime(slot.showDateTime)}</span>
                      <span className="showtime-format">2D</span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Book Seats Button */}
      {selectedDate && selectedTime && (
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
  );
};

export default ShowtimeSelection; 