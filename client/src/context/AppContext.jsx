import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080'

export const AppContext = createContext()

export const AppProvider = ({ children })=>{

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

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
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    // Register function
    const register = async (name, email, password, onSuccess) => {
        try {
            console.log('Attempting to register user:', { name, email });
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            console.log('Registration response:', data);
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
            console.error('Error response:', error.response);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    // Logout function
    const logout = () => {
        removeToken();
        navigate('/');
    };

    const fetchIsAdmin = async ()=>{
        try {
            const token = getToken();
            if (!token) return;

            // Check if user is admin based on their role
            if (user && user.role === 'admin') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
                // Add a small delay to allow navigation to complete first
                setTimeout(() => {``
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

    const fetchShows = async ()=>{
        try {
            const { data } = await axios.get('/api/show/all')
            if(data.success){
                setShows(data.shows || [])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            // console.error(error)
        }
    }

    const refreshAdminData = async () => {
        console.log('=== REFRESH ADMIN DATA START ===');
        // Refresh shows data for the main app
        console.log('Calling fetchShows...');
        await fetchShows()
        console.log('fetchShows completed');
        // You can add more refresh functions here if needed
        console.log('=== REFRESH ADMIN DATA COMPLETED ===');
    }

    const fetchFavoriteMovies = async ()=>{
        try {
            const token = getToken();
            if (!token) return;

            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if(data.success){
                setFavoriteMovies(data.movies)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
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
                    removeToken();
                }
            }
            setLoading(false);
        };
        
        checkAuth();
    }, []);

    useEffect(()=>{
        fetchShows()
    },[])

    useEffect(()=>{
        if(user){
            // Delay fetchIsAdmin to avoid interfering with navigation
            setTimeout(() => {
                fetchIsAdmin();
                fetchFavoriteMovies();
            }, 200);
        }
    },[user])

    const value = {
        axios,
        fetchIsAdmin,
        user, getToken, navigate, isAdmin, shows, 
        favoriteMovies, fetchFavoriteMovies, fetchShows, refreshAdminData, image_base_url,
        login, register, logout, loading
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)