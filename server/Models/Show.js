import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        movie: { type: String, require: true, ref: 'movieModel'},
        showDateTime: { type: Date, required: true },
        showPrice: { type: Number, required: true },
        occupiedSeats: { type: Object, default:{} }
    }, { minimize: false }
)

const showModel = mongoose.model("Show", showSchema);

export default showModel;