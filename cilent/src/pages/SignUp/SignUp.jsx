import React from 'react'
import './SignUp.css'
import { useParams } from 'react-router-dom'

const SignUp = ({ onClose, onSwitchSignIn }) => {
  const { city } = useParams();
  const currentCity = city || 'new-delhi';
  
  return (
    <div className="signup-container">
      <button className="close-button" onClick={() => onClose ? onClose() : null}>✖</button>

      <h2 className="signup-heading">Sign Up</h2>
      
      <form className="signup-form">
        <input type="text" placeholder="Full Name" className="signup-input" required />
        <input type="email" placeholder="Email" className="signup-input" required />
        <input type="password" placeholder="Password" className="signup-input" required />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <p className="switch-text">
        Already have an account?{' '}
        <button onClick={onSwitchSignIn} className="switch-button">
          Sign In
        </button>
      </p>
    </div>
  )
}

export default SignUp