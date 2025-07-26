import React, { useState , useEffect } from 'react';
import './AddShows.css';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, Currency, DeleteIcon, StarIcon } from 'lucide-react';
import Title from '../../../components/admin/Title/Title';
import Loading from '../../../components/Loading/Loading';

const AddShows = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");

  // Dummy data for nowPlayingMovies to prevent blank screen
  const fetchNowPlayingMovies = async () => {
    // Replace this with your actual API call
    setNowPlayingMovies([
      {
        id: 1,
        poster: 'https://via.placeholder.com/100x140?text=Movie+1',
        vote_average: 8.2,
        vote_count: 1200,
        title: 'Sample Movie 1',
        release_date: '2025-07-01',
      },
      {
        id: 2,
        poster: 'https://via.placeholder.com/100x140?text=Movie+2',
        vote_average: 7.5,
        vote_count: 900,
        title: 'Sample Movie 2',
        release_date: '2025-06-15',
      },
    ]);
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split('T');
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filterTimes = prev[date].filter((t) => t !== time);
      if (!filterTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest; 
      }
      return { ...prev, [date]: filterTimes };
    });
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return nowPlayingMovies.length > 0 ? (
    <div className="addshows-container">
      <Title text1="Add" text2="Shows" />
      <p className="addshows-nowplaying-label">Now Playing Movies</p>
      <div className="addshows-movie-list">
        {nowPlayingMovies.map((movie) => (
          <div
            key={movie.id}
            className={`addshows-movie-card${selectedMovie === movie.id ? ' selected' : ''}`}
            onClick={() => setSelectedMovie(movie.id)}
          >
            <img src={movie.poster} alt="" className="addshows-movie-poster" />
            <div>
              <p className="addshows-movie-rating">
                <StarIcon className="addshows-movie-rating-icon" />
                {movie.vote_average.toFixed(1)}
              </p>
              <p className="addshows-movie-votes">
                {movie.vote_count} Votes
              </p>
            </div>
            {selectedMovie === movie.id && (
              <div className="addshows-checkicon">
                <CheckIcon />
              </div>
            )}
            <p className="addshows-movie-title">{movie.title}</p>
            <p className="addshows-movie-release">{movie.release_date}</p>
          </div>
        ))}
      </div>

      {/* Show Price Input */}
      <div className="addshows-price-section">
        <label className="addshows-price-label">Show Price:</label>
        <div className="addshows-price-input-wrap">
          <span className="addshows-price-currency">₹</span>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter show price"
            className="addshows-price-input"
          />
        </div>
      </div>

      {/* Date and Time Input */}
      <div className="addshows-datetime-section">
        <label className="addshows-datetime-label">Select Date and Time:</label>
        <input
          type="datetime-local"
          value={dateTimeInput}
          onChange={(e) => setDateTimeInput(e.target.value)}
          className="addshows-datetime-input"
        />
        <button onClick={handleDateTimeAdd} className="addshows-datetime-addbtn">
          Add Time
        </button>
      </div>

      {/* Display Selected Date and Times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="addshows-datetimes-list">
          <h2 className="addshows-datetimes-title">Selected Date-Times</h2>
          <ul className="addshows-datetimes-ul">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date} className="addshows-datetimes-li">
                <div className="addshows-datetimes-date">{date}</div>
                <div className="addshows-datetimes-times">
                  {times.map((time) => (
                    <div key={time} className="addshows-datetimes-time">
                      <span>{time}</span>
                      <DeleteIcon onClick={() => handleRemoveTime(date, time)} width={15} className="addshows-datetimes-deleteicon" />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button className="addshows-submit-btn">
        Add Show
      </button>
    </div>
  ) : <Loading />
}

export default AddShows; 