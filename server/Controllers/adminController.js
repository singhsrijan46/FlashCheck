import bookingModel from "../Models/Booking.js"
import showModel from "../Models/Show.js";

//API to check if the user is admin
export const isAdmin = async (req, res) => {
    res.json({success: true, isAdmin: true})
}

//API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const bookings = await bookingModel({isPaid: true});
        const activeShows = await showModel.find({showTime: {$gte: new Date()}}).populate('movie');

        const totalUser = await userModel.countDocuments();

        const dashboardData = {
            totalBooking: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        }

        res.json({success: true, dashboardData})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

//API to get all shows
export const getAllShows = async (req, res) => {
    try {
        const shows = await showModel.find({showTime: {$gte: new Date()}}).populate('movie').sort({showDateTime: 1});

        res.json({success: true, shows})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

//API to get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({}).populate('user').populate({
            path: "show",
            popular: {path: "movie"}
        }).sort({createdAt: -1})

        res.json({success: true, bookings})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}