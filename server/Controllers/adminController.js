import Booking from "../models/Booking.js"
import Show from "../models/Show.js";
import User from "../models/User.js";

// API to check if user is admin
export const isAdmin = async (req, res) =>{
    res.json({success: true, isAdmin: true})
}

// API to get dashboard data
export const getDashboardData = async (req, res) =>{
    try {
        const bookings = await Booking.find({isPaid: true});
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');

        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking)=> acc + booking.amount, 0),
            activeShows,
            totalUser
        }

        res.json({success: true, dashboardData})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all shows
export const getAllShows = async (req, res) =>{
    try {
        console.log('=== GET ALL SHOWS START ===');
        console.log('Fetching all shows for admin...');
        
        const currentDate = new Date();
        console.log('Current date:', currentDate);
        
        // First, let's check ALL shows without date filter
        const allShows = await Show.find({}).populate('movie').sort({ showDateTime: 1 });
        console.log('Total shows in database (no date filter):', allShows.length);
        
        const shows = await Show.find({showDateTime: { $gte: currentDate }}).populate('movie').sort({ showDateTime: 1 })
        console.log('Found shows (with date filter):', shows.length);
        console.log('Shows with movies:', shows.filter(s => s.movie).length);
        
        // Log each show for debugging
        shows.forEach((show, index) => {
            console.log(`Show ${index + 1}:`, {
                id: show._id,
                movieId: show.movie?._id,
                movieTitle: show.movie?.title,
                showDateTime: show.showDateTime,
                showPrice: show.showPrice
            });
        });
        
        console.log('=== GET ALL SHOWS COMPLETED ===');
        res.json({success: true, shows})
    } catch (error) {
        console.error('=== GET ALL SHOWS ERROR ===');
        console.error('Error fetching admin shows:', error);
        res.json({success: false, message: error.message})
    }
}

// DEBUG: Get all shows regardless of date
export const getAllShowsDebug = async (req, res) => {
  try {
    const shows = await Show.find({}).populate('movie').sort({ showDateTime: 1 });
    res.json({ success: true, shows });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all bookings
export const getAllBookings = async (req, res) =>{
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({ createdAt: -1 })
        res.json({success: true, bookings })
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}