import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import axios from 'axios'; // Added axios import

export const isAdmin = async (req, res) =>{
    try {
        res.json({success: true, message: "Admin verified"})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

export const getDashboardData = async (req, res) =>{
    try {
        const totalShows = await Show.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalMovies = await Movie.countDocuments();
        
        // Get active shows (shows in the next 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const activeShows = await Show.find({
            showDateTime: { 
                $gte: new Date(),
                $lte: thirtyDaysFromNow
            }
        }).populate('movie').sort({ showDateTime: 1 }).limit(6);
        
        // Calculate total revenue from bookings
        const bookings = await Booking.find({});
        const totalRevenue = bookings.reduce((total, booking) => total + (booking.amount || 0), 0);
        
        // Get total users (you might need to add User model import if not already present)
        const totalUser = await User.countDocuments();
        
        const dashboardData = {
            totalShows,
            totalBookings,
            totalMovies,
            totalRevenue,
            totalUser,
            activeShows
        };
        
        res.json({success: true, dashboardData})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all shows
export const getAllShows = async (req, res) =>{
    try {
        const currentDate = new Date();
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const shows = await Show.find({
            showDateTime: { 
                $gte: thirtyDaysAgo,
                $lte: thirtyDaysFromNow
            }
        }).populate('movie').sort({ showDateTime: 1 });
        
        res.json({success: true, shows})
    } catch (error) {
        console.error('Error fetching admin shows:', error);
        res.json({success: false, message: error.message})
    }
}

export const getAllBookings = async (req, res) =>{
    try {
        const bookings = await Booking.find({}).populate('user').populate('show').sort({ createdAt: -1 });
        res.json({success: true, bookings})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// Function to update all existing movies with complete data
export const updateAllMoviesWithCompleteData = async (req, res) => {
    try {
        if (!process.env.TMDB_API_KEY) {
            return res.json({ success: false, message: 'TMDB API Key is not configured' });
        }

        const movies = await Movie.find({});
        let updatedCount = 0;
        let errorCount = 0;

        for (const movie of movies) {
            try {
                const movieId = movie._id;
                
                const fetchWithRetry = async (url, retries = 3) => {
                    for (let i = 0; i < retries; i++) {
                        try {
                            const response = await axios.get(url, {
                                headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                                timeout: 15000
                            });
                            return response;
                        } catch (error) {
                            if (i === retries - 1) throw error;
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                };

                const response = await fetchWithRetry(`https://api.themoviedb.org/3/movie/${movieId}`);
                const apiData = response.data;
                
                const updatedMovieData = {
                    title: apiData.title,
                    overview: apiData.overview,
                    poster_path: apiData.poster_path,
                    backdrop_path: apiData.backdrop_path,
                    release_date: apiData.release_date,
                    vote_average: apiData.vote_average,
                    original_language: apiData.original_language,
                    genre_ids: apiData.genre_ids,
                    runtime: apiData.runtime,
                    status: apiData.status,
                    tagline: apiData.tagline,
                    vote_count: apiData.vote_count,
                    popularity: apiData.popularity,
                    adult: apiData.adult,
                    video: apiData.video,
                    original_title: apiData.original_title
                };
                
                await Movie.findByIdAndUpdate(movieId, updatedMovieData, { new: true });
                updatedCount++;
                
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`Error updating movie ${movie._id}:`, error.message);
                errorCount++;
            }
        }
        
        res.json({ 
            success: true, 
            message: `Updated ${updatedCount} movies successfully. ${errorCount} errors occurred.`,
            updatedCount,
            errorCount
        });
        
    } catch (error) {
        console.error('Error updating movies:', error);
        res.json({ success: false, message: error.message });
    }
};