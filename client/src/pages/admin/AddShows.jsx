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


     const fetchNowPlayingMovies = async () => {
        try {
            const { data } = await axios.get('/api/show/now-playing', {
                headers: { Authorization: `Bearer ${await getToken()}` }})
                if(data.success){
                    setNowPlayingMovies(data.movies)
                }
        } catch (error) {
            console.error('Error fetching movies:', error)
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

  return nowPlayingMovies.length > 0 ? (
    <>
      <p className="add-shows-title">Now Playing Movies</p>
      <div className="add-shows-movies-container">
        <div className="add-shows-movies-grid">
            {nowPlayingMovies.map((movie) =>(
                <div key={movie.id} className="add-shows-movie-card" onClick={()=> setSelectedMovie(movie.id)}>
                    <div className="add-shows-movie-image-container">
                        <img src={image_base_url + movie.poster_path} alt="" className="add-shows-movie-image" />
                        {selectedMovie === movie.id && (
                            <div className="add-shows-movie-selected">
                                <CheckIcon className="add-shows-movie-selected-icon" />
                            </div>
                        )}
                    </div>
                    <div className="add-shows-movie-info">
                        <p className="add-shows-movie-title">{movie.title}</p>
                        <p className="add-shows-movie-date">{movie.release_date}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

       {/* Show Price Input */}
       <div className="add-shows-price-section">
            <label className="add-shows-price-label">Show Price</label>
            <div className="add-shows-price-input">
                <p className="add-shows-price-currency">{currency}</p>
                <input min={0} type="number" value={showPrice} onChange={(e) => setShowPrice(e.target.value)} placeholder="Enter show price" className="add-shows-price-field" />
            </div>
        </div>

        {/* Date & Time Selection */}
        <div className="add-shows-datetime-section">
            <label className="add-shows-datetime-label">Select Date and Time</label>
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
            <h2>Selected Date-Time</h2>
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
    </>
  ) : <Loading />
}

export default AddShows
