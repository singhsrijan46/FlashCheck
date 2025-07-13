import React, { useState, useEffect } from 'react';
import './City.css';
import { MapPin, Landmark, Building2, Hotel, Castle, Tent, Mountain, TreePalm, Home, X } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const allCities = [
  { name: 'New Delhi', state: 'Delhi', icon: <Building2 /> },
  { name: 'Delhi', state: 'Delhi', icon: <Building2 /> },
  { name: 'Mumbai', state: 'Maharashtra', icon: <Landmark /> },
  { name: 'Pune', state: 'Maharashtra', icon: <Home /> },
  { name: 'Nagpur', state: 'Maharashtra', icon: <Landmark /> },
  { name: 'Bengaluru', state: 'Karnataka', icon: <Hotel /> },
  { name: 'Goramadagu', state: 'Karnataka', icon: <Landmark /> },
  { name: 'Hyderabad', state: 'Telangana', icon: <Castle /> },
  { name: 'Ahmedabad', state: 'Gujarat', icon: <Tent /> },
  { name: 'Surat', state: 'Gujarat', icon: <Landmark /> },
  { name: 'Chandigarh', state: 'Punjab', icon: <Mountain /> },
  { name: 'Ludhiana', state: 'Punjab', icon: <Landmark /> },
  { name: 'Chennai', state: 'Tamil Nadu', icon: <Landmark /> },
  { name: 'Coimbatore', state: 'Tamil Nadu', icon: <Landmark /> },
  { name: 'Kolkata', state: 'West Bengal', icon: <Landmark /> },
  { name: 'Howrah', state: 'West Bengal', icon: <Landmark /> },
  { name: 'Kochi', state: 'Kerala', icon: <TreePalm /> },
  { name: 'Thiruvananthapuram', state: 'Kerala', icon: <Landmark /> },
  { name: 'Lucknow', state: 'Uttar Pradesh', icon: <Landmark /> },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', icon: <Landmark /> },
  { name: 'Kanpur', state: 'Uttar Pradesh', icon: <Landmark /> },
  { name: 'Indore', state: 'Madhya Pradesh', icon: <Landmark /> },
  { name: 'Bhopal', state: 'Madhya Pradesh', icon: <Landmark /> },
  { name: 'Jaipur', state: 'Rajasthan', icon: <Landmark /> },
  { name: 'Jodhpur', state: 'Rajasthan', icon: <Landmark /> },
  { name: 'Gorantla', state: 'Andhra Pradesh', icon: <Landmark /> },
  { name: 'Vijayawada', state: 'Andhra Pradesh', icon: <Landmark /> },
];

const allStates = Array.from(new Set(allCities.map(city => city.state)));
const popularCities = allCities.slice(0, 10); // First 10 as popular

const City = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { city: cityParam } = useParams();

  // Always empty on open
  const [selectedState, setSelectedState] = useState('');
  const [stateInput, setStateInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Reset inputs to empty every time modal opens (cityParam changes)
  useEffect(() => {
    setSelectedState('');
    setStateInput('');
    setCityInput('');
  }, [cityParam]);

  // Always show all states as suggestions when state input is focused
  const stateSuggestions = showStateSuggestions
    ? allStates.filter(state =>
        stateInput.length === 0 || state.toLowerCase().startsWith(stateInput.toLowerCase())
      )
    : [];

  // Show all cities in selected state if city input is empty, else filter
  const citySuggestions =
    selectedState && showCitySuggestions
      ? allCities.filter(city =>
          city.state === selectedState &&
          (cityInput.length === 0 || city.name.toLowerCase().startsWith(cityInput.toLowerCase()))
        )
      : [];

  // Replace the city segment in the current path
  const updateCityInPath = (newCity) => {
    const cityUrl = newCity.toLowerCase().replace(/\s+/g, '-');
    const pathParts = location.pathname.split('/');
    // pathParts[0] is '', pathParts[1] is city
    if (pathParts.length > 1) {
      pathParts[1] = cityUrl;
    }
    const newPath = pathParts.join('/') || `/${cityUrl}`;
    navigate(newPath, { replace: true });
    if (onClose) onClose();
  };

  // Handlers
  const handleStateInput = (e) => {
    setStateInput(e.target.value);
    setShowStateSuggestions(true);
    setSelectedState('');
    setCityInput('');
  };
  const handleStateSelect = (state) => {
    setSelectedState(state);
    setStateInput(state);
    setShowStateSuggestions(false);
    setCityInput('');
  };
  const handleCityInput = (e) => {
    setCityInput(e.target.value);
    setShowCitySuggestions(true);
  };
  const handleCitySelect = (city) => {
    updateCityInPath(city.name);
  };
  const handlePopularCityClick = (city) => {
    updateCityInPath(city.name);
  };
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="city-modal-overlay">
      <div className="city-modal city-modal-narrow">
        <div className="modal-header">
          <h2>Select Your City</h2>
          <button className="close-button" onClick={handleClose}>
            <X />
          </button>
        </div>
        <div className="city-inputs-section">
          <div className="city-input-group">
            <input
              type="text"
              placeholder="Select State"
              value={stateInput}
              onChange={handleStateInput}
              onFocus={() => setShowStateSuggestions(true)}
              autoComplete="off"
            />
            {showStateSuggestions && stateSuggestions.length > 0 && (
              <ul className="suggestion-list">
                {stateSuggestions.map((state, idx) => (
                  <li key={idx} onClick={() => handleStateSelect(state)}>{state}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="city-input-group">
            <input
              type="text"
              placeholder={selectedState ? `Select City in ${selectedState}` : 'Select City'}
              value={cityInput}
              onChange={handleCityInput}
              onFocus={() => setShowCitySuggestions(true)}
              disabled={!selectedState}
              autoComplete="off"
            />
            {showCitySuggestions && citySuggestions.length > 0 && (
              <ul className="suggestion-list">
                {citySuggestions.map((city, idx) => (
                  <li key={idx} onClick={() => handleCitySelect(city)}>{city.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="popular-cities-row">
          <div className="popular-cities-label">Popular Cities</div>
          <div className="popular-cities-list">
            {popularCities.map((city, idx) => (
              <div
                key={city.name}
                className={`popular-city-card`}
                onClick={() => handlePopularCityClick(city)}
              >
                <div className="city-icon">{city.icon}</div>
                <div className="city-name">{city.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default City; 