import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.BACKEND_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    // Store user in state for live updates
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [getToken, setGetToken] = useState(() => localStorage.getItem('token'));
    // Add city state
    const [city, setCity] = useState('new-delhi');
    
    const location = useLocation();
    const navigate = useNavigate();

    const fetchIsAdmin = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Don't run if token is not set
            return;
        }
        try {
            console.log('fetchIsAdmin: token =', token);
            const {data} = await axios.get('/api/admin/is-admin', {headers:
                { Authorization: `Bearer ${token}` }
            });
            console.log('fetchIsAdmin: response =', data);
            setIsAdmin(data.isAdmin);

            if(!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/');
                toast.error('You are not authorized to access admin dashboard');
            }
        } catch (error) {
            console.error('fetchIsAdmin: error =', error);
        }
    }

    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/shows/all')
            if(data.success) {
                setShows(data.shows)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    useEffect(() => {
        fetchShows()
    }, [])

    useEffect(() => {
        if(user && getToken) {
            fetchIsAdmin();
        }
    }, [user, getToken])

    // Keep localStorage in sync with state
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);
    useEffect(() => {
        if (getToken) {
            localStorage.setItem('token', getToken);
        } else {
            localStorage.removeItem('token');
        }
    }, [getToken]);

    const value = {
        axios,
        fetchIsAdmin,
        user, setUser, getToken, setGetToken, navigate, isAdmin, shows,
        fetchShows,
        city, setCity
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)