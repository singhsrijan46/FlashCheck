import React, { useState } from 'react'
import './SignUp.css'
import { useNavigate, useParams } from 'react-router-dom'
import { handleError } from '../../utils';
import { ToastContainer } from 'react-toastify'

const SignUp = ({ onClose, onSwitchSignIn }) => {
  const { city } = useParams();
  const currentCity = city || 'new-delhi';
  
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value} = e.target;
    console.log( name, value);
    const copySignupInfo = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if(!name || !email || !password) {
      return handleError('Name, email, password fields required')
    }
    try{
        const url = "http://localhost:8080/auth/signup";
        const response = await fetch (url, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signupInfo)
        });
        const result = await response.json();
        const { success, message } = result;
        if(success){
          handleSuccess(message);
          setTimeout(onSwitchSignIn, 1000)
        }
        console.log(result);
    } catch(err) {
        handleError(err);
        setTimeout(onSwitchSignIn, 1000)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="signup-container">
        <button className="close-button" onClick={() => onClose ? onClose() : null}>✖</button>

        <h2 className="signup-heading">Sign Up</h2>
        
        <form onSubmit={handleSignup} className="signup-form">
          <input 
            onChange={handleChange}
            type="text"
            name='name'
            placeholder="Full Name" 
            className="signup-input" 
            value={signupInfo.name}
            autoFocus
            required />
          <input 
            onChange={handleChange}
            type="email"
            name='email'
            placeholder="Email" 
            className="signup-input" 
            value={signupInfo.email}
            required />
          <input 
            onChange={handleChange}
            type="password" 
            name='password'
            placeholder="Password" 
            className="signup-input" 
            value={signupInfo.password}
            required />
          <button type='submit' className="signup-button">Sign Up</button>
        </form>
        <p className="switch-text">
          Already have an account?{' '}
          <button onClick={onSwitchSignIn} className="switch-button">
            Sign In
          </button>
          <ToastContainer/>
        </p>
      </div>
    </div>
  )
}

export default SignUp