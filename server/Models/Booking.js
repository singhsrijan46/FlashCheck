import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, required: true, ref: 'User'},
    show: {type: String, required: true, ref: 'Show'},
    amount: {type: Number, required: true},
    bookedSeats: {type: Array, required: true},
    isPaid: {type: Boolean, default: true}, // Always true since no payment gateway
},{timestamps: true })

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;