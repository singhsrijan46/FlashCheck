import React from 'react'
import './SignUp.css'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const navigate = useNavigate();
  
  return (
    <div className="signup-container">
      <button className="close-button" onClick={() => navigate(-1)}>✖</button>

      <h2 className="signup-heading">Sign Up</h2>
      
      <form className="signup-form">
        <input type="text" placeholder="Full Name" className="signup-input" required />
        <input type="email" placeholder="Email" className="signup-input" required />
        <input type="password" placeholder="Password" className="signup-input" required />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <p className="switch-text">
        Already have an account?{' '}
        <button onClick={() => navigate('/signin')} className="switch-button">
          Sign In
        </button>
      </p>
    </div>
  )
}

export default SignUp