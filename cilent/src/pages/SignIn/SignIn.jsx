import React from 'react'
import './SignIn.css'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
  const navigate = useNavigate();

  return (
    <div className="signin-container">
      <button className="close-button" onClick={() => navigate(-1)}>✖</button>

      <h2 className="signin-heading">Sign In</h2>

      <form className="signin-form">
        <input type="email" placeholder="Email" className="signin-input" required />
        <input type="password" placeholder="Password" className="signin-input" required />
        <button type="submit" className="signin-button">Sign In</button>
      </form>

      <button className="google-login-button" >
        <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
        Sign in with Google
      </button>

      <p className="switch-text">
        New user?{' '}
        <button onClick={() => navigate('/signup')} className="switch-button">
          Sign Up
        </button>
      </p>
    </div>
  )
}

export default SignIn
