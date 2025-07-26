import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './SignIn.css';
import { useAppContext } from '../../context/AppContext';

const SignIn = ({ onClose, onSwitchSignUp }) => {
  const { city } = useParams();
  const currentCity = city || 'new-delhi';
  // const navigate = useNavigate(); // No longer needed
  const { setUser, setGetToken } = useAppContext();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyCredentials = { ...credentials };
    copyCredentials[name] = value;
    setCredentials(copyCredentials);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;
    if (!email || !password) {
      return toast.error('Email and password are required');
    }
    try {
      const response = await axios.post('/auth/signin', { email, password });
      const { success, message, token, user, error } = response.data;
      if(success){
        toast.success(message);
        setUser(user);
        setGetToken(token); // Store token in context (and localStorage via AppContext)
        if (onClose) onClose();
      } else if (error) {
        const details = error?.details?.[0]?.message || 'Sign in error';
        toast.error(details);
      } else if (!success) {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error.message || 'Sign in failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="signin-container">
        <button className="close-button" onClick={() => onClose ? onClose() : null}>✖</button>

        <h2 className="signin-heading">Sign In</h2>

        <form onSubmit={handleSubmit} className="signin-form">
          <input 
            id="email"
            value={credentials.email}
            onChange={handleChange}
            type="email" 
            placeholder="Email" 
            className="signin-input" 
            name='email'
            autoFocus
            required />
          <input 
            id="password"
            value={credentials.password}
            onChange={handleChange}
            type="password" 
            placeholder="Password" 
            className="signin-input" 
            name='password'
            required />
          <button type="submit" className="signin-button">Sign In</button>
        </form>

        <p className="switch-text">
          New user?{' '}
          <button onClick={onSwitchSignUp} className="switch-button">
            Sign Up
          </button>
        </p>

        <ToastContainer />
      </div>
    </div>
  )
}

export default SignIn
