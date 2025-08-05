import React, { useState, useEffect, useRef } from 'react';
import { MapPinIcon, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './CitySelector.css';

const CitySelector = () => {
    const { selectedCity, setSelectedCity } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedState, setSelectedState] = useState('');
    const dropdownRef = useRef(null);

    const statesAndCities = {
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
        'Delhi': ['New Delhi', 'Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
        'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
        'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad'],
        'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore'],
        'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
        'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
        'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj'],
        'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
        'Madhya Pradesh': ['Gwalior', 'Bhopal', 'Indore', 'Jabalpur', 'Ujjain']
    };

    // Find the state for the current selected city
    const findStateForCity = (city) => {
        for (const [state, cities] of Object.entries(statesAndCities)) {
            if (cities.includes(city)) {
                return state;
            }
        }
        return '';
    };

    // Set initial state based on current city
    useEffect(() => {
        const state = findStateForCity(selectedCity);
        setSelectedState(state);
    }, [selectedCity]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleStateChange = (state) => {
        setSelectedState(state);
        // Set the first city of the selected state as default
        if (statesAndCities[state] && statesAndCities[state].length > 0) {
            setSelectedCity(statesAndCities[state][0]);
        }
    };

    const handleCityChange = (city) => {
        setSelectedCity(city);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="city-selector" ref={dropdownRef}>
            <div className="city-selector-container" onClick={toggleDropdown}>
                <MapPinIcon className="city-selector-icon" />
                <span className="city-selector-text">{selectedCity}</span>
                <ChevronDown className={`city-selector-chevron ${isOpen ? 'rotated' : ''}`} />
            </div>
            
            {isOpen && (
                <div className="city-selector-dropdown">
                    <div className="city-selector-section">
                        <label className="city-selector-label">State</label>
                        <select 
                            value={selectedState} 
                            onChange={(e) => handleStateChange(e.target.value)}
                            className="city-selector-state-dropdown"
                        >
                            <option value="">Select State</option>
                            {Object.keys(statesAndCities).map((state) => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>
                    
                    {selectedState && (
                        <div className="city-selector-section">
                            <label className="city-selector-label">City</label>
                            <select 
                                value={selectedCity} 
                                onChange={(e) => handleCityChange(e.target.value)}
                                className="city-selector-city-dropdown"
                            >
                                <option value="">Select City</option>
                                {statesAndCities[selectedState].map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CitySelector; 