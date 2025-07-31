import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';

const Login = ({ state }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const { login, register } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the page user was trying to access before being redirected to login
    const from = state?.from?.pathname || location.state?.from?.pathname || '/';

    const handleClose = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Form submitted with data:', formData);
            console.log('Current location:', location.pathname);
            console.log('Location state:', location.state);
            console.log('Component state:', state);
            console.log('From path:', from);
            
            let result;
            if (isLogin) {
                result = await login(formData.email, formData.password, () => {
                    console.log('Login successful, navigating to:', from);
                    toast.success('Login successful!');
                    navigate(from, { replace: true });
                });
            } else {
                result = await register(formData.name, formData.email, formData.password);
            }

            console.log('Auth result:', result);
            if (result.success) {
                if (!isLogin) {
                    // After successful registration, switch to login mode
                    toast.success('Registration successful! Please sign in.');
                    setIsLogin(true);
                    setFormData({ name: '', email: '', password: '' });
                }
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="login-container">
            <button 
                className="login-close-btn" 
                onClick={handleClose}
                type="button"
            >
                <XIcon size={24} />
            </button>
            
            <div className="login-card">
                <div className="login-header">
                    <h2 className="login-title">
                        {isLogin ? 'Sign in to your account' : 'Create new account'}
                    </h2>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div>
                        {!isLogin && (
                            <div className="login-form-group">
                                <label htmlFor="name" className="login-label">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required={!isLogin}
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="login-input"
                                />
                            </div>
                        )}
                        <div className="login-form-group">
                            <label htmlFor="email" className="login-label">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="login-input"
                            />
                        </div>
                        <div className="login-form-group">
                            <label htmlFor="password" className="login-label">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="login-input"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="login-button"
                        >
                            {loading ? 'Loading...' : (isLogin ? 'Sign in' : 'Sign up')}
                        </button>
                    </div>

                    <div className="login-switch">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setFormData({ name: '', email: '', password: '' });
                            }}
                        >
                            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login; 