import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: { type: String, required: true, ref: 'userModel'},
        show: { type: String, required: true, ref: 'showModel'},
        amount: { type: Number, required: true},
        bookedSeats: { type: Array, required: true},
        isPaid: { type: Boolean, default: false},
        paymentLink: {type: String}
    },{timestamps: true}
)

const bookingModel = mongoose.model('booking', bookingSchema)

export default bookingModel;