import React, { useEffect, useState } from 'react'

import Loading from '../../components/Loading';
import { CheckIcon, DeleteIcon, StarIcon, MapPinIcon, BuildingIcon, GlobeIcon, PlusIcon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './AddShows.css';

const AddShows = () => {
    const navigate = useNavigate();
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
    const [movieFormat, setMovieFormat] = useState("2D"); // Add movie format state
    const [movieLanguage, setMovieLanguage] = useState("English"); // Add movie language state

    // State-City-Theatre dropdown states
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedTheatre, setSelectedTheatre] = useState("");
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingTheatres, setLoadingTheatres] = useState(false);
    const [selectedScreen, setSelectedScreen] = useState(""); // Add screen state
    const [theatreScreens, setTheatreScreens] = useState([]); // Add theatre screens state

    const fetchNowPlayingMovies = async () => {
        try {
            setLoadingMovies(true);
            const { data } = await axios.get('/api/show/now-playing-public');
            
            if (data.success) {
                setNowPlayingMovies(data.movies || []);
            } else {

                toast.error('Failed to fetch movies');
            }
        } catch (error) {

            toast.error('Error fetching movies');
        } finally {
            setLoadingMovies(false);
        }
    };

    // Fetch all states
    const fetchStates = async () => {
        try {
            setLoadingStates(true);

            
            const { data } = await axios.get('/api/theatre/states', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            

            
            if (data.success) {
                setStates(data.states || []);

            } else {

                toast.error('Failed to fetch states');
            }
        } catch (error) {

            toast.error('Error fetching states');
        } finally {
            setLoadingStates(false);
        }
    };

    // Fetch cities by state
    const fetchCitiesByState = async (state) => {
        try {
            setLoadingCities(true);
            setCities([]);
            setTheatres([]);
            setSelectedCity("");
            setSelectedTheatre("");
            

            
            const { data } = await axios.get(`/api/theatre/cities/${state}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            

            
            if (data.success) {
                setCities(data.cities || []);

            } else {

                toast.error('Failed to fetch cities');
            }
        } catch (error) {

            toast.error('Error fetching cities');
        } finally {
            setLoadingCities(false);
        }
    };

    // Fetch theatres by city
    const fetchTheatresByCity = async (city) => {
        try {
            setLoadingTheatres(true);
            setTheatres([]);
            setSelectedTheatre("");
            setSelectedScreen("");
            setTheatreScreens([]);
            

            
            const { data } = await axios.get(`/api/theatre/city/${city}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            

            
            if (data.success) {

                setTheatres(data.theatres || []);
            } else {

                toast.error('Failed to fetch theatres');
            }
        } catch (error) {

            toast.error('Error fetching theatres');
        } finally {
            setLoadingTheatres(false);
        }
    };

    // Handle state selection
    const handleStateChange = (state) => {
        setSelectedState(state);
        if (state) {
            fetchCitiesByState(state);
        }
    };

    // Handle city selection
    const handleCityChange = (city) => {
        setSelectedCity(city);
        if (city) {
            fetchTheatresByCity(city);
        }
    };

    // Handle theatre selection
    const handleTheatreChange = (theatreId) => {

        setSelectedTheatre(theatreId);
        setSelectedScreen(""); // Reset screen selection
        
        // Find the selected theatre and get its screens
        const selectedTheatreData = theatres.find(theatre => theatre._id === theatreId);

        
        if (selectedTheatreData && selectedTheatreData.screens && selectedTheatreData.screens.length > 0) {

            setTheatreScreens(selectedTheatreData.screens);
            toast.success(`Found ${selectedTheatreData.screens.length} screens for this theatre`);
        } else {

            setTheatreScreens([]);
            toast.error('This theatre has no screens. Please add screens to the theatre first.');
        }
    };

    useEffect(() => {
        fetchNowPlayingMovies();
        fetchStates();
    }, [user]);

    const handleDateTimeAdd = () => {
        if (!dateTimeInput) {
            toast.error('Please select a date and time');
            return;
        }
        
        if (!selectedTheatre) {
            toast.error('Please select a theatre first');
            return;
        }
        
        // Check if theatre has screens
        if (theatreScreens.length === 0) {
            toast.error('No screens available for this theatre. Please add screens to the theatre first.');
            return;
        }
        
        if (!selectedScreen) {
            toast.error('Please select a screen');
            return;
        }

        setDateTimeSelection((prev) => {
            // Check if this exact combination already exists
            const exists = prev.some(item => 
                item.dateTime === dateTimeInput && 
                item.screen === selectedScreen &&
                item.language === movieLanguage
            );
            
            if (!exists) {
                return [...prev, {
                    dateTime: dateTimeInput,
                    screen: selectedScreen,
                    language: movieLanguage
                }];
            } else {
                toast.error('This combination of date-time, screen, and language already exists');
                return prev;
            }
        });
        
        // Reset inputs after adding
        setDateTimeInput("");
        setSelectedScreen("");
        setMovieLanguage("English"); // Reset language to default
    };

    const handleRemoveTime = (dateTimeObj) => {
        setDateTimeSelection((prev) => {
            return prev.filter((item) => 
                !(item.dateTime === dateTimeObj.dateTime && 
                  item.screen === dateTimeObj.screen &&
                  item.language === dateTimeObj.language)
            );
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
            
            if (!selectedState) {
                toast.error('Please select a state');
                setAddingShow(false);
                return;
            }
            
            if (!selectedCity) {
                toast.error('Please select a city');
                setAddingShow(false);
                return;
            }
            
            if (!selectedTheatre) {
                toast.error('Please select a theatre');
                setAddingShow(false);
                return;
            }
            
            if (dateTimeSelection.length === 0) {
                toast.error('Please add at least one show time');
                setAddingShow(false);
                return;
            }
            
            // Validate that each time slot has screen
            const invalidSlots = dateTimeSelection.filter(slot => !slot.screen);
            if (invalidSlots.length > 0) {
                toast.error('Each show time must have a screen selected');
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
            
            if (!movieFormat || movieFormat.trim() === '') {
                toast.error('Please select a movie format');
                setAddingShow(false);
                return;
            }
            
            if (!movieLanguage || movieLanguage.trim() === '') {
                toast.error('Please select a movie language');
                setAddingShow(false);
                return;
            }

            // Validate that prices are numbers
            if (isNaN(Number(silverPrice)) || isNaN(Number(goldPrice)) || isNaN(Number(diamondPrice))) {
                toast.error('Please enter valid prices (numbers only)');
                setAddingShow(false);
                return;
            }

            // Group dateTimeSelection by screen to create proper showsInput structure
            const showsByScreen = {};
            
            dateTimeSelection.forEach(slot => {
                if (!showsByScreen[slot.screen]) {
                    showsByScreen[slot.screen] = [];
                }
                showsByScreen[slot.screen].push({
                    dateTime: slot.dateTime,
                    language: slot.language
                });
            });
            
            const showsInput = Object.entries(showsByScreen).map(([screen, slots]) => ({
                date: "combined",
                time: slots.map(slot => slot.dateTime),
                screen: screen,
                language: slots[0].language // Use the language from the first slot (all should be same for same screen)
            }));
            
            const payload = {
                movieId: selectedMovie,
                theatreId: selectedTheatre,
                state: selectedState,
                city: selectedCity,
                format: movieFormat, // Add global format
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
                setSelectedState("")
                setSelectedCity("")
                setSelectedTheatre("")
                setCities([])
                setTheatres([])
                setSelectedScreen("") // Reset screen selection
                setTheatreScreens([]) // Reset theatre screens
                setDateTimeSelection([])
                setSilverPrice("")
                setGoldPrice("")
                setDiamondPrice("")
                setDateTimeInput("")
                setMovieFormat("2D") // Reset movie format to default
                setMovieLanguage("English") // Reset movie language to default
                // Refresh shows data after adding a new show
                await refreshAdminData()
                await refreshShows()
            }else{
                toast.error(data.message)
            }
        } catch (error) {

            
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
            
            {/* Global Movie Format Selection */}
            <div className="add-shows-format-section">
                <h3 className="add-shows-subsection-title">Movie Format</h3>
                <div className="add-shows-format-input">
                    <label>Format:</label>
                    <select 
                        value={movieFormat} 
                        onChange={(e) => setMovieFormat(e.target.value)}
                        className="add-shows-format-dropdown"
                    >
                        <option value="2D">2D</option>
                        <option value="3D">3D</option>
                        <option value="IMAX">IMAX</option>
                        <option value="4DX">4DX</option>
                        <option value="Dolby Atmos">Dolby Atmos</option>
                        <option value="Premium">Premium</option>
                    </select>
                </div>
            </div>
            
            {/* Theatre Selection */}
            <div className="add-shows-theatre-section">
                <h3 className="add-shows-subsection-title">Select Theatre</h3>
                
                {/* State Selection */}
                <div className="add-shows-dropdown-group">
                    <label className="add-shows-dropdown-label">
                        <MapPinIcon className="add-shows-dropdown-icon" />
                        State
                    </label>
                    <select 
                        value={selectedState} 
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="add-shows-dropdown"
                        disabled={loadingStates}
                    >
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    {loadingStates && <div className="add-shows-loading">Loading states...</div>}
                </div>

                {/* City Selection */}
                <div className="add-shows-dropdown-group">
                    <label className="add-shows-dropdown-label">
                        <GlobeIcon className="add-shows-dropdown-icon" />
                        City
                    </label>
                    <select 
                        value={selectedCity} 
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="add-shows-dropdown"
                        disabled={!selectedState || loadingCities}
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    {loadingCities && <div className="add-shows-loading">Loading cities...</div>}
                </div>

                {/* Theatre Selection */}
                <div className="add-shows-dropdown-group">
                    <label className="add-shows-dropdown-label">
                        <BuildingIcon className="add-shows-dropdown-icon" />
                        Theatre
                    </label>
                    <select 
                        value={selectedTheatre} 
                        onChange={(e) => handleTheatreChange(e.target.value)}
                        className="add-shows-dropdown"
                        disabled={!selectedCity || loadingTheatres}
                    >
                        <option value="">Select Theatre</option>
                        {theatres.map((theatre) => (
                            <option key={theatre._id} value={theatre._id}>
                                {theatre.name} - {theatre.address}
                            </option>
                        ))}
                    </select>
                    {loadingTheatres && <div className="add-shows-loading">Loading theatres...</div>}
                </div>
            </div>
            
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
                <h3 className="add-shows-subsection-title">Add Show Time</h3>
                <div className="add-shows-datetime-inputs">
                    {/* Date-Time Input */}
                    <div className="add-shows-datetime-group">
                        <label>Date & Time:</label>
                        <input 
                            type="datetime-local" 
                            value={dateTimeInput} 
                            onChange={(e) => setDateTimeInput(e.target.value)} 
                            className="add-shows-datetime-field" 
                        />
                    </div>
                    
                    {/* Language Selection */}
                    <div className="add-shows-datetime-group">
                        <label>Language:</label>
                        <select 
                            value={movieLanguage} 
                            onChange={(e) => setMovieLanguage(e.target.value)}
                            className="add-shows-language-dropdown"
                        >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Telugu">Telugu</option>
                            <option value="Malayalam">Malayalam</option>
                            <option value="Kannada">Kannada</option>
                            <option value="Bengali">Bengali</option>
                            <option value="Marathi">Marathi</option>
                            <option value="Gujarati">Gujarati</option>
                            <option value="Punjabi">Punjabi</option>
                            <option value="Urdu">Urdu</option>
                            <option value="Odia">Odia</option>
                            <option value="Assamese">Assamese</option>
                            <option value="Manipuri">Manipuri</option>
                            <option value="Konkani">Konkani</option>
                            <option value="Sanskrit">Sanskrit</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Spanish">Spanish</option>
                            <option value="Italian">Italian</option>
                            <option value="Portuguese">Portuguese</option>
                            <option value="Russian">Russian</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Korean">Korean</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Arabic">Arabic</option>
                            <option value="Turkish">Turkish</option>
                            <option value="Dutch">Dutch</option>
                            <option value="Swedish">Swedish</option>
                            <option value="Norwegian">Norwegian</option>
                            <option value="Danish">Danish</option>
                            <option value="Finnish">Finnish</option>
                            <option value="Polish">Polish</option>
                            <option value="Czech">Czech</option>
                            <option value="Slovak">Slovak</option>
                            <option value="Hungarian">Hungarian</option>
                            <option value="Romanian">Romanian</option>
                            <option value="Bulgarian">Bulgarian</option>
                            <option value="Croatian">Croatian</option>
                            <option value="Serbian">Serbian</option>
                            <option value="Slovenian">Slovenian</option>
                            <option value="Estonian">Estonian</option>
                            <option value="Latvian">Latvian</option>
                            <option value="Lithuanian">Lithuanian</option>
                            <option value="Greek">Greek</option>
                            <option value="Hebrew">Hebrew</option>
                            <option value="Persian">Persian</option>
                            <option value="Thai">Thai</option>
                            <option value="Vietnamese">Vietnamese</option>
                            <option value="Indonesian">Indonesian</option>
                            <option value="Malay">Malay</option>
                            <option value="Filipino">Filipino</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    {/* Screen Selection */}
                    {selectedTheatre && theatreScreens.length > 0 && (
                        <div className="add-shows-datetime-group">
                            <label>Screen:</label>
                            <select 
                                value={selectedScreen} 
                                onChange={(e) => setSelectedScreen(e.target.value)}
                                className="add-shows-screen-dropdown"
                            >
                                <option value="">Select Screen</option>
                                {theatreScreens.map((screen) => (
                                    <option key={screen} value={screen}>{screen}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    {/* Error Message for No Screens */}
                    {selectedTheatre && theatreScreens.length === 0 && (
                        <div className="add-shows-datetime-group">
                            <label style={{color: 'red'}}>Screen:</label>
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#ffebee',
                                border: '1px solid #f44336',
                                borderRadius: '4px',
                                color: '#d32f2f',
                                fontSize: '12px'
                            }}>
                                ⚠️ No screens available for this theatre. 
                                <br />
                                Please add screens to this theatre first.
                                <br />
                                <button 
                                    onClick={() => navigate('/admin/add-theatre')}
                                    style={{
                                        marginTop: '8px',
                                        padding: '4px 8px',
                                        backgroundColor: '#1976d2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '11px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <PlusIcon size={12} />
                                    Go to Add Theatre
                                </button>
                            </div>
                        </div>
                    )}
                    

                    
                    {/* Add Button */}
                    <button onClick={handleDateTimeAdd} className="add-shows-datetime-button">
                        Add Show Time
                    </button>
                </div>
            </div>
            
            {/* Display Selected Times */}
            {dateTimeSelection.length > 0 && (
            <div className="add-shows-selected-times">
                <h3 className="add-shows-subsection-title">Selected Shows</h3>
                <div className="add-shows-selected-times-grid">
                    {dateTimeSelection.map((slot, index) => (
                        <div key={`${slot.dateTime}-${slot.screen}-${slot.language}`} className="add-shows-time-item" >
                            <div className="add-shows-time-details">
                                <span className="add-shows-time-datetime">{new Date(slot.dateTime).toLocaleString()}</span>
                                <span className="add-shows-time-screen">Screen: {slot.screen}</span>
                                <span className="add-shows-time-language">Language: {slot.language}</span>
                            </div>
                            <DeleteIcon onClick={() => handleRemoveTime(slot)} width={15} className="add-shows-time-delete" />
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
