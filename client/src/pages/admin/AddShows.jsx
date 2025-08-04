import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import './AddShows.css';

const AddShows = () => {
    const { axios, getToken, user, image_base_url, refreshAdminData, refreshShows } = useAppContext()

    const currency = import.meta.env.VITE_CURRENCY || '$'
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState([]);
    const [silverPrice, setSilverPrice] = useState("");
    const [goldPrice, setGoldPrice] = useState("");
    const [diamondPrice, setDiamondPrice] = useState("");
    const [dateTimeInput, setDateTimeInput] = useState("");
    const [addingShow, setAddingShow] = useState(false);
    const [loadingMovies, setLoadingMovies] = useState(true);

    const fetchNowPlayingMovies = async () => {
        try {
            setLoadingMovies(true);
            const { data } = await axios.get('/api/show/now-playing-public');
            
            if (data.success) {
                setNowPlayingMovies(data.movies || []);
            } else {
                console.error('Failed to fetch movies:', data.message);
                toast.error('Failed to fetch movies');
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
            toast.error('Error fetching movies');
        } finally {
            setLoadingMovies(false);
        }
    };

    useEffect(() => {
        fetchNowPlayingMovies();
    }, [user]);

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

    const handleSubmit = async () => {
        try {
            setAddingShow(true)

            // Better validation with specific error messages
            if (!selectedMovie) {
                toast.error('Please select a movie');
                setAddingShow(false);
                return;
            }
            
            if (dateTimeSelection.length === 0) {
                toast.error('Please add at least one show time');
                setAddingShow(false);
                return;
            }
            
            if (!silverPrice || silverPrice.trim() === '') {
                toast.error('Please enter silver price');
                setAddingShow(false);
                return;
            }
            
            if (!goldPrice || goldPrice.trim() === '') {
                toast.error('Please enter gold price');
                setAddingShow(false);
                return;
            }
            
            if (!diamondPrice || diamondPrice.trim() === '') {
                toast.error('Please enter diamond price');
                setAddingShow(false);
                return;
            }

            // Validate that prices are numbers
            if (isNaN(Number(silverPrice)) || isNaN(Number(goldPrice)) || isNaN(Number(diamondPrice))) {
                toast.error('Please enter valid prices (numbers only)');
                setAddingShow(false);
                return;
            }

            const showsInput = [{ date: "combined", time: dateTimeSelection }];
            const payload = {
                movieId: selectedMovie,
                showsInput,
                silverPrice: Number(silverPrice),
                goldPrice: Number(goldPrice),
                diamondPrice: Number(diamondPrice)
            }

            const token = await getToken();

            const { data } = await axios.post('/api/show/add', payload, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if(data.success){
                toast.success(data.message)
                setSelectedMovie(null)
                setDateTimeSelection([])
                setSilverPrice("")
                setGoldPrice("")
                setDiamondPrice("")
                setDateTimeInput("")
                // Refresh shows data after adding a new show
                await refreshAdminData()
                await refreshShows()
            }else{
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

    // Debug selectedMovie changes
    useEffect(() => {

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
                                setSelectedMovie(movieId);
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

          {/* Configuration Section */}
          <div className="add-shows-config-section">
            <h2 className="add-shows-section-title">Show Configuration</h2>
            
            {/* Seat Prices Input */}
            <div className="add-shows-price-section">
                <h3 className="add-shows-subsection-title">Seat Prices</h3>
                
                {/* Silver Price */}
                <div className="add-shows-price-input">
                    <label>Silver Price:</label>
                    <div className="add-shows-price-field-container">
                        <p className="add-shows-price-currency">{currency}</p>
                        <input 
                            min={0} 
                            type="number" 
                            value={silverPrice} 
                            onChange={(e) => setSilverPrice(e.target.value)} 
                            placeholder="Enter silver seat price" 
                            className="add-shows-price-field" 
                        />
                    </div>
                </div>

                {/* Gold Price */}
                <div className="add-shows-price-input">
                    <label>Gold Price:</label>
                    <div className="add-shows-price-field-container">
                        <p className="add-shows-price-currency">{currency}</p>
                        <input 
                            min={0} 
                            type="number" 
                            value={goldPrice} 
                            onChange={(e) => setGoldPrice(e.target.value)} 
                            placeholder="Enter gold seat price" 
                            className="add-shows-price-field" 
                        />
                    </div>
                </div>

                {/* Diamond Price */}
                <div className="add-shows-price-input">
                    <label>Diamond Price:</label>
                    <div className="add-shows-price-field-container">
                        <p className="add-shows-price-currency">{currency}</p>
                        <input 
                            min={0} 
                            type="number" 
                            value={diamondPrice} 
                            onChange={(e) => setDiamondPrice(e.target.value)} 
                            placeholder="Enter diamond seat price" 
                            className="add-shows-price-field" 
                        />
                    </div>
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
