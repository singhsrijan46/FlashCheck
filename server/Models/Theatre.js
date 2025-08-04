import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        state: {type: String, required: true},
        city: {type: String, required: true},
        address: {type: String, required: true},
        screens: {type: [String], required: true}, // Array of screen names like ["Screen 1", "Screen 2", "Screen 3"]
        isActive: {type: Boolean, default: true}
    }, {timestamps: true }
)

const Theatre = mongoose.model('Theatre', theatreSchema);

export default Theatre; 