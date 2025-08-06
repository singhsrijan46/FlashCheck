import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, required: true, ref: 'User'},
    show: {type: String, required: true, ref: 'Show'},
    amount: {type: Number, required: true},
    bookedSeats: {type: Array, required: true},
    isPaid: {type: Boolean, default: false}, // Changed to false by default
    paymentIntentId: {type: String}, // Stripe payment intent ID
    paymentStatus: {type: String, enum: ['pending', 'succeeded', 'failed', 'canceled'], default: 'pending'},
    paymentMethod: {type: String, default: 'stripe'},
    refunded: {type: Boolean, default: false},
    refundAmount: {type: Number, default: 0}
},{timestamps: true })

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;