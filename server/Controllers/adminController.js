import Booking from "../models/Booking.js"
import Show from "../models/Show.js";
import User from "../models/User.js";
import Movie from "../models/Movie.js";

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
        
        // Get shows from 30 days ago to 30 days in the future
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        console.log('Date range:', { from: thirtyDaysAgo, to: thirtyDaysFromNow });
        
        // First, let's check ALL shows without date filter
        const allShows = await Show.find({}).populate('movie').sort({ showDateTime: 1 });
        console.log('Total shows in database (no date filter):', allShows.length);
        
        // Log all show dates for debugging
        console.log('=== ALL SHOW DATES ===');
        allShows.forEach((show, index) => {
            console.log(`Show ${index + 1}:`, {
                id: show._id,
                movieTitle: show.movie?.title,
                showDateTime: show.showDateTime,
                isFuture: show.showDateTime > currentDate,
                daysFromNow: Math.ceil((show.showDateTime - currentDate) / (1000 * 60 * 60 * 24))
            });
        });
        
        const shows = await Show.find({
            showDateTime: { 
                $gte: thirtyDaysAgo,
                $lte: thirtyDaysFromNow
            }
        }).populate('movie').sort({ showDateTime: 1 });
        
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

// DEBUG: Create test shows with future dates
export const createTestShows = async (req, res) => {
  try {
    console.log('=== CREATING TEST SHOWS ===');
    
    // Get existing movies
    const movies = await Movie.find({}).limit(3);
    console.log('Found movies:', movies.length);
    
    if (movies.length === 0) {
      return res.json({ success: false, message: 'No movies found in database' });
    }
    
    const testShows = [];
    const now = new Date();
    
    // Create shows for the next 7 days
    for (let i = 1; i <= 7; i++) {
      const showDate = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000)); // i days from now
      
      movies.forEach((movie, movieIndex) => {
        // Create multiple shows per day
        for (let j = 0; j < 3; j++) {
          const showTime = new Date(showDate);
          showTime.setHours(10 + (j * 4), 0, 0, 0); // 10 AM, 2 PM, 6 PM
          
          testShows.push({
            movie: movie._id,
            showDateTime: showTime,
            showPrice: 12.99,
            occupiedSeats: {}
          });
        }
      });
    }
    
    console.log('Creating', testShows.length, 'test shows...');
    
    // Clear existing shows first (optional)
    // await Show.deleteMany({});
    
    const createdShows = await Show.insertMany(testShows);
    console.log('Created', createdShows.length, 'test shows');
    
    res.json({ 
      success: true, 
      message: `Created ${createdShows.length} test shows`,
      showsCreated: createdShows.length
    });
  } catch (error) {
    console.error('Error creating test shows:', error);
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