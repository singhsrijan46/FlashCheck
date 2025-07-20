import React from 'react'
import './SignIn.css'
import { useParams } from 'react-router-dom'

const SignIn = ({ onClose, onSwitchSignUp }) => {
  const { city } = useParams();
  const currentCity = city || 'new-delhi';


  return (
    <div className="modal-overlay">
      <div className="signin-container">
        <button className="close-button" onClick={() => onClose ? onClose() : null}>✖</button>

        <h2 className="signin-heading">Sign In</h2>

        <form className="signin-form">
          <input 
            type="email" 
            placeholder="Email" 
            className="signin-input" 
            name='email'
            autoFocus
            required />
          <input 
            type="password" 
            placeholder="Password" 
            className="signin-input" 
            name='password'
            required />
          <button type="submit" className="signin-button">Sign In</button>
        </form>

        <button className="google-login-button" >
          <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
          Sign in with Google
        </button>

        <p className="switch-text">
          New user?{' '}
          <button onClick={onSwitchSignUp} className="switch-button">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignIn
