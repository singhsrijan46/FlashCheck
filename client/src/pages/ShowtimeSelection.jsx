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
          setCurrentMovie(data.movie);
          setShowData(data.dateTime);
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
            const hasShows = showData[dateStr] && showData[dateStr].length > 0;
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
                const timeSlots = showData[dateStr] || [];
                
                return timeSlots.map((slot, index) => {
                  const isSelected = selectedTime && selectedTime.showId === slot.showId;
                  return (
                    <button
                      key={index}
                      className={`showtime-time-btn ${isSelected ? 'selected' : ''} available`}
                      onClick={() => handleTimeSelect(slot)}
                    >
                      <span className="showtime-time">{formatTime(slot.time)}</span>
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