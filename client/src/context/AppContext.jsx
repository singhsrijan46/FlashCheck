import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fetchingShows, setFetchingShows] = useState(false)

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

    const location = useLocation()
    const navigate = useNavigate()

    // Get token from localStorage
    const getToken = () => {
        return localStorage.getItem('token');
    };

    // Set token to localStorage
    const setToken = (token) => {
        localStorage.setItem('token', token);
    };

    // Remove token from localStorage
    const removeToken = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAdmin(false);
    };

    // Login function
    const login = async (email, password, onSuccess) => {
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                setIsAdmin(data.user.role === 'admin');
                if (onSuccess) {
                    onSuccess();
                }
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Provide more specific error messages
            let errorMessage = 'Login failed';
            
            if (error.response?.status === 401) {
                errorMessage = 'Invalid email or password';
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data.message || 'Invalid login data';
            } else if (error.response?.status === 500) {
                errorMessage = 'Server error during login';
            } else if (error.code === 'ECONNREFUSED') {
                errorMessage = 'Cannot connect to server. Please check if the server is running.';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            return { success: false, message: errorMessage };
        }
    };

    // Register function
    const register = async (name, email, password, onSuccess) => {
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            if (data.success) {
                setToken(data.token);
                setUser(data.user);
                setIsAdmin(data.user.role === 'admin');
                if (onSuccess) {
                    onSuccess();
                }
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            
            // Provide more specific error messages
            let errorMessage = 'Registration failed';
            
            if (error.response?.status === 400) {
                errorMessage = error.response.data.message || 'Invalid registration data';
            } else if (error.response?.status === 409) {
                errorMessage = 'User already exists with this email';
            } else if (error.response?.status === 500) {
                errorMessage = 'Server error during registration';
            } else if (error.code === 'ECONNREFUSED') {
                errorMessage = 'Cannot connect to server. Please check if the server is running.';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            return { success: false, message: errorMessage };
        }
    };

    // Logout function
    const logout = () => {
        removeToken();
        navigate('/');
    };

    const fetchIsAdmin = async () => {
        try {
            const token = getToken();
            if (!token) return;

            // Check if user is admin based on their role
            if (user && user.role === 'admin') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
                // Add a small delay to allow navigation to complete first
                setTimeout(() => {
                    if (location.pathname.startsWith('/admin')){
                        navigate('/')
                        toast.error('You are not authorized to access admin dashboard')
                    }
                }, 100);
            }
        } catch (error) {
            console.error(error)
            if (error.response?.status === 401) {
                removeToken();
            }
        }
    }

    const fetchShows = async () => {
        // Prevent multiple simultaneous calls
        if (fetchingShows) {
            console.log('fetchShows already in progress, skipping...');
            return;
        }
        
        try {
            setFetchingShows(true);
            console.log('Fetching shows from:', axios.defaults.baseURL + '/api/show/all');
            const { data } = await axios.get('/api/show/all')
            console.log('Shows API response:', data);
            
            if(data.success){
                console.log('Shows data received:', data.shows);
                setShows(data.shows || [])
            } else {
                console.error('Shows API returned success: false:', data.message);
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching shows:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            // Provide more specific error messages
            let errorMessage = 'Failed to fetch shows';
            
            if (error.response?.status === 404) {
                errorMessage = 'Shows endpoint not found';
            } else if (error.response?.status === 500) {
                errorMessage = 'Server error while fetching shows';
            } else if (error.code === 'ECONNREFUSED') {
                errorMessage = 'Cannot connect to server. Please check if the server is running.';
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast.error(errorMessage);
            // Set empty shows array to prevent app from breaking
            setShows([]);
        } finally {
            setFetchingShows(false);
        }
    }

    const refreshAdminData = async () => {
        await fetchShows()
    }

    const refreshShows = async () => {
        console.log('refreshShows called - refreshing main shows data');
        await fetchShows()
    }

    const fetchFavoriteMovies = async () => {
        try {
            const token = getToken();
            if (!token) return;

            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if(data.success){
                setFavoriteMovies(data.movies)
            } else {
                toast.error(data.message || 'Failed to fetch favorites');
            }
        } catch (error) {
            console.error('Error fetching favorite movies:', error);
            
            // Provide more specific error messages
            let errorMessage = 'Failed to fetch favorite movies';
            
            if (error.response?.status === 401) {
                errorMessage = 'Please login to view favorites';
            } else if (error.response?.status === 404) {
                errorMessage = 'Favorites endpoint not found';
            } else if (error.response?.status === 500) {
                errorMessage = 'Server error while fetching favorites';
            } else if (error.code === 'ECONNREFUSED') {
                errorMessage = 'Cannot connect to server. Please check if the server is running.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast.error(errorMessage);
        }
    };

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = getToken();
                if (token) {
                    try {
                        const { data } = await axios.get('/api/auth/me', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (data.success) {
                            setUser(data.user);
                            setIsAdmin(data.user.role === 'admin');
                        } else {
                            removeToken();
                        }
                    } catch (error) {
                        console.error('Auth check error:', error);
                        removeToken();
                    }
                }
            } catch (error) {
                console.error('Error in checkAuth:', error);
            } finally {
                setLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    useEffect(() => {
        // Add error handling for fetchShows
        const loadShows = async () => {
            try {
                await fetchShows();
            } catch (error) {
                console.error('Error loading shows:', error);
                // Don't let this break the app
            }
        };
        loadShows();
    }, [])

    useEffect(() => {
        if(user){
            // Delay fetchIsAdmin to avoid interfering with navigation
            setTimeout(() => {
                fetchIsAdmin();
                fetchFavoriteMovies();
            }, 200);
        }
    }, [user])

    const value = {
        axios,
        fetchIsAdmin,
        user, getToken, navigate, isAdmin, shows, 
        favoriteMovies, fetchFavoriteMovies, fetchShows, refreshAdminData, refreshShows, image_base_url,
        login, register, logout, loading
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)