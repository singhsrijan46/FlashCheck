import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        movie: {type: String, required: true, ref: 'Movie'},
        showDateTime: { type: Date, required: true },
        silverPrice: { type: Number, required: true },
        goldPrice: { type: Number, required: true },
        diamondPrice: { type: Number, required: true },
        occupiedSeats: { type: Object, default:{} } 
    }, { minimize: false}
)

const Show = mongoose.model("Show", showSchema);

export default Show;