import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

// API Controller Function to Get User Bookings
export const getUserBookings = async (req, res)=>{
    try {
        const userId = req.user._id;

        const bookings = await Booking.find({user: userId}).populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to get user favorites
export const getUserFavorites = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('favorites');
        
        res.json({ success: true, movies: user.favorites || [] });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update user favorites
export const updateUserFavorites = async (req, res) => {
    try {
        const userId = req.user._id;
        const { movieId } = req.body;
        
        const user = await User.findById(userId);
        const movieIndex = user.favorites.indexOf(movieId);
        
        if (movieIndex > -1) {
            // Remove from favorites
            user.favorites.splice(movieIndex, 1);
            await user.save();
            res.json({ success: true, message: "Removed from favorites" });
        } else {
            // Add to favorites
            user.favorites.push(movieId);
            await user.save();
            res.json({ success: true, message: "Added to favorites" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};