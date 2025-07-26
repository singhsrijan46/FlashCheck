import bookingModel from "../Models/Booking.js";

//API Controller Function to get User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth().userId;

        const bookings = await bookingModel.find({user}).populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({createdAt: -1})
        res.json({success: true, bookings})
    } catch (error) {
        console.error(error.message);
        res.json({success: false,message: error.message});
    }
} 