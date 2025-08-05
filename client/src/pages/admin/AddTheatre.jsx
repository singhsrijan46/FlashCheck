import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from '../../components/admin/AdminSidebar';
import toast from 'react-hot-toast';
import './AddTheatre.css';

const AddTheatre = () => {
  const navigate = useNavigate();
  const { user, axios, getToken } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    city: '',
    address: '',
    numberOfScreens: 1
  });

  // States and cities data
  const statesAndCities = {
    'Madhya Pradesh': ['Gwalior', 'Bhopal', 'Indore', 'Jabalpur', 'Ujjain', 'Sagar', 'Rewa', 'Satna'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
    'Delhi': ['New Delhi', 'Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
    'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset city when state changes
    if (name === 'state') {
      setFormData(prev => ({
        ...prev,
        state: value,
        city: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Submitting theatre data:', formData);
      
      const token = await getToken();
      const { data } = await axios.post('/api/theatre/add', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Theatre API response:', data);

      if (data.success) {
        toast.success('Theatre added successfully!');
        setFormData({
          name: '',
          state: '',
          city: '',
          address: '',
          numberOfScreens: 1
        });
        setMessage('Theatre added successfully!');
      } else {
        toast.error(data.message || 'Failed to add theatre');
        setMessage(data.message || 'Failed to add theatre');
      }
    } catch (error) {
      console.error('Error adding theatre:', error);
      
      let errorMessage = 'Error adding theatre. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || 'Invalid theatre data';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to server. Please check if the server is running.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCitiesForState = (state) => {
    return statesAndCities[state] || [];
  };

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-content">
        <div className="admin-main">
          <div className="add-theatre-container">
            <div className="add-theatre-header">
              <h1 className="add-theatre-header-title">Add Theatre</h1>
              <p className="add-theatre-header-subtitle">Add a new theatre to the database</p>
            </div>

            <div className="add-theatre-main">
              <form onSubmit={handleSubmit} className="add-theatre-form">
                <div className="add-theatre-section">
                  <h2 className="add-theatre-section-title">Theatre Information</h2>
                  
                  <div className="add-theatre-form-group">
                    <label htmlFor="name">Theatre Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter theatre name"
                      className="add-theatre-input"
                      required
                    />
                  </div>

                  <div className="add-theatre-form-row">
                    <div className="add-theatre-form-group">
                      <label htmlFor="state">State *</label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="add-theatre-select"
                        required
                      >
                        <option value="">Select State</option>
                        {Object.keys(statesAndCities).map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div className="add-theatre-form-group">
                      <label htmlFor="city">City *</label>
                      <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="add-theatre-select"
                        required
                        disabled={!formData.state}
                      >
                        <option value="">Select City</option>
                        {formData.state && getCitiesForState(formData.state).map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="add-theatre-form-group">
                    <label htmlFor="address">Full Address *</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter complete address of the theatre"
                      rows="3"
                      className="add-theatre-textarea"
                      required
                    />
                  </div>

                  <div className="add-theatre-form-group">
                    <label htmlFor="numberOfScreens">Number of Screens *</label>
                    <input
                      type="number"
                      id="numberOfScreens"
                      name="numberOfScreens"
                      value={formData.numberOfScreens}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      className="add-theatre-input"
                      required
                    />
                    <small className="add-theatre-help-text">Screens will be automatically named as Screen 1, Screen 2, etc.</small>
                  </div>

                  {formData.numberOfScreens > 0 && (
                    <div className="add-theatre-screens-preview">
                      <label>Screens Preview:</label>
                      <div className="add-theatre-screens-list">
                        {Array.from({ length: formData.numberOfScreens }, (_, i) => (
                          <span key={i} className="add-theatre-screen-item">Screen {i + 1}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {message && (
                  <div className={`add-theatre-message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <div className="add-theatre-form-actions">
                  <button
                    type="submit"
                    className="add-theatre-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Adding Theatre...' : 'Add Theatre'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTheatre; 