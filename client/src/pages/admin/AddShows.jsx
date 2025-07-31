import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import './AddShows.css';

const AddShows = () => {

    const {axios, getToken, user, image_base_url, refreshAdminData} = useAppContext()

    const currency = import.meta.env.VITE_CURRENCY || '$'
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState([]);
    const [dateTimeInput, setDateTimeInput] = useState("");
    const [showPrice, setShowPrice] = useState("");
    const [addingShow, setAddingShow] = useState(false)
    const [loadingMovies, setLoadingMovies] = useState(true)


     const fetchNowPlayingMovies = async () => {
        try {
            setLoadingMovies(true);
            const { data } = await axios.get('/api/show/now-playing', {
                headers: { Authorization: `Bearer ${await getToken()}` }})
                if(data.success){
                    console.log('Fetched movies:', data.movies);
                    console.log('First movie structure:', data.movies[0]);
                    
                    // Check for duplicate IDs
                    const movieIds = data.movies.map(movie => movie._id || movie.id);
                    console.log('All movie IDs:', movieIds);
                    const uniqueIds = new Set(movieIds);
                    console.log('Unique movie IDs:', Array.from(uniqueIds));
                    console.log('Duplicate IDs found:', movieIds.length !== uniqueIds.size);
                    
                    setNowPlayingMovies(data.movies)
                }
        } catch (error) {
            console.error('Error fetching movies:', error)
        } finally {
            setLoadingMovies(false);
        }
    };

    const handleDateTimeAdd = () => {
        if (!dateTimeInput) return;

        setDateTimeSelection((prev) => {
            if (!prev.includes(dateTimeInput)) {
                return [...prev, dateTimeInput];
            }
            return prev;
        });
    };

    const handleRemoveTime = (dateTime) => {
        setDateTimeSelection((prev) => {
            return prev.filter((dt) => dt !== dateTime);
        });
    };

    const handleSubmit = async ()=>{
        try {
            setAddingShow(true)
            console.log("=== ADD SHOW DEBUG ===");
            console.log("Submit clicked");
            console.log("selectedMovie:", selectedMovie);
            console.log("dateTimeSelection:", dateTimeSelection);
            console.log("showPrice:", showPrice);

            if(!selectedMovie || dateTimeSelection.length === 0 || !showPrice){
                console.log("Missing fields detected");
                toast.error('Missing required fields');
                setAddingShow(false);
                return;
            }

            const showsInput = [{ date: "combined", time: dateTimeSelection }];
            const payload = {
                movieId: selectedMovie,
                showsInput,
                showPrice: Number(showPrice)
            }
            console.log("Payload being sent:", payload);

            const token = await getToken();
            console.log("Token available:", !!token);
            console.log("Token length:", token?.length);

            console.log("Making API call to /api/show/add...");
            const { data } = await axios.post('/api/show/add', payload, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            console.log("API response received:", data);

            if(data.success){
                console.log("API call successful");
                toast.success(data.message)
                setSelectedMovie(null)
                setDateTimeSelection([])
                setShowPrice("")
                setDateTimeInput("")
                // Refresh shows data after adding a new show
                console.log('Show added successfully, refreshing data...');
                await refreshAdminData()
                console.log('Data refresh completed');
                console.log("=== ADD SHOW COMPLETED ===");
            }else{
                console.log("API call failed:", data.message);
                toast.error(data.message)
            }
        } catch (error) {
            console.error("=== ADD SHOW ERROR ===");
            console.error("Submission error:", error);
            console.error("Error status:", error.response?.status);
            console.error("Error response:", error.response?.data);
            console.error("Error message:", error.message);
            
            if (error.response?.status === 401) {
                toast.error('Authentication failed. Please login again.');
            } else if (error.response?.status === 400) {
                toast.error(error.response?.data?.message || 'Invalid request data');
            } else if (error.response?.status === 500) {
                toast.error('Server error. Please try again later.');
            } else {
                toast.error(error.response?.data?.message || 'An error occurred. Please try again.')
            }
        }
        setAddingShow(false)
    }

    useEffect(() => {
        if(user){
            fetchNowPlayingMovies();
        }   
    }, [user]);

    // Debug selectedMovie changes
    useEffect(() => {
        console.log('selectedMovie changed to:', selectedMovie);
    }, [selectedMovie]);

  return (
    <>
      <div className="add-shows-container">
        {/* Main Content */}
        <div className="add-shows-main">
          {/* Latest Movies Section */}
          <div className="add-shows-latest-section">
            <h2 className="add-shows-section-title">Latest Movies</h2>
            
            {loadingMovies ? (
              <Loading />
            ) : nowPlayingMovies.length > 0 ? (
              <div className="add-shows-movies-container">
                <div className="add-shows-movies-grid">
                    {nowPlayingMovies.map((movie) =>{
                        const movieId = movie._id || movie.id;
                        const isSelected = selectedMovie === movieId;
                        
                        return (
                            <div key={movieId} className="add-shows-movie-card" onClick={()=> {
                                console.log('Movie clicked:', movie.title, 'ID:', movieId);
                                console.log('Current selectedMovie:', selectedMovie);
                                console.log('Is currently selected:', isSelected);
                                setSelectedMovie(movieId);
                                console.log('Setting selectedMovie to:', movieId);
                            }}>
                                <div className="add-shows-movie-image-container">
                                    <img src={image_base_url + movie.poster_path} alt="" className="add-shows-movie-image" />
                                    {isSelected && (
                                        <div className="add-shows-movie-selected">
                                            <CheckIcon className="add-shows-movie-selected-icon" />
                                        </div>
                                    )}
                                </div>
                                <div className="add-shows-movie-info">
                                    <p className="add-shows-movie-title">{movie.title}</p>
                                    <p className="add-shows-movie-date">{movie.release_date}</p>
                                    <p className="add-shows-movie-id">ID: {movieId}</p>
                                    <p className={`add-shows-movie-status ${isSelected ? 'selected' : ''}`}>
                                        {isSelected ? 'SELECTED' : 'Click to select'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {nowPlayingMovies.length > 0 && nowPlayingMovies[0]._id === "550" && (
                  <div className="add-shows-offline-notice">
                    <p>⚠️ Using sample data - TMDB API may be unavailable</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="add-shows-no-movies">
                <p>No movies found from TMDB API.</p>
              </div>
            )}
          </div>

          {/* OR Divider */}
          <div className="add-shows-or-divider">
            <div className="add-shows-or-line"></div>
            <span className="add-shows-or-text">OR</span>
            <div className="add-shows-or-line"></div>
          </div>

          {/* Manual Movie Input */}
          <div className="add-shows-manual-section">
            <h3 className="add-shows-subsection-title">Add Other Movies</h3>
            <div className="add-shows-manual-input">
              <label>Movie ID (TMDB):</label>
              <input 
                type="text" 
                placeholder="Enter TMDB Movie ID (e.g., 550)" 
                className="add-shows-manual-field"
                onChange={(e) => setSelectedMovie(e.target.value)}
              />
              <p className="add-shows-manual-help">
                You can find TMDB Movie IDs by searching on <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">themoviedb.org</a>
              </p>
            </div>
          </div>

          {/* Configuration Section */}
          <div className="add-shows-config-section">
            <h2 className="add-shows-section-title">Show Configuration</h2>
            
            {/* Show Price Input */}
            <div className="add-shows-price-section">
                <h3 className="add-shows-subsection-title">Show Price</h3>
                <div className="add-shows-price-input">
                    <p className="add-shows-price-currency">{currency}</p>
                    <input min={0} type="number" value={showPrice} onChange={(e) => setShowPrice(e.target.value)} placeholder="Enter show price" className="add-shows-price-field" />
                </div>
            </div>

            {/* Date & Time Selection */}
            <div className="add-shows-datetime-section">
                <h3 className="add-shows-subsection-title">Select Date and Time</h3>
                <div className="add-shows-datetime-input">
                    <input type="datetime-local" value={dateTimeInput} onChange={(e) => setDateTimeInput(e.target.value)} className="add-shows-datetime-field" />
                    <button onClick={handleDateTimeAdd} className="add-shows-datetime-button" >
                        Add Time
                    </button>
                </div>
            </div>

            {/* Display Selected Times */}
            {dateTimeSelection.length > 0 && (
            <div className="add-shows-selected-times">
                <h3 className="add-shows-subsection-title">Selected Date-Time</h3>
                <div className="add-shows-selected-times-grid">
                    {dateTimeSelection.map((dateTime) => (
                        <div key={dateTime} className="add-shows-time-item" >
                            <span>{new Date(dateTime).toLocaleString()}</span>
                            <DeleteIcon onClick={() => handleRemoveTime(dateTime)} width={15} className="add-shows-time-delete" />
                        </div>
                    ))}
                </div>
            </div>
            )}
            
            <button onClick={handleSubmit} disabled={addingShow} className="add-shows-submit-button" >
                Add Show
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddShows
