import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        movie: {type: String, required: true, ref: 'Movie'},
        theatre: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Theatre'},
        state: {type: String, required: true},
        city: {type: String, required: true},
        screen: {type: String, required: true}, // Add screen field
        format: {type: String, required: true, default: '2D'}, // Add format field
        language: {type: String, required: true, default: 'English'}, // Add language field
        showDateTime: { type: Date, required: true },
        silverPrice: { type: Number, required: true },
        goldPrice: { type: Number, required: true },
        diamondPrice: { type: Number, required: true },
        occupiedSeats: { type: Object, default:{} } 
    }, { minimize: false}
)

const Show = mongoose.model("Show", showSchema);

export default Show;