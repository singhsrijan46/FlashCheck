import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        _id: {type: String, required: true},
        tmdbId: {type: String, default: null}, // Add this field to match the database index
        title: {type: String, required: true},
        overview: {type: String, required: true},
        poster_path: {type: String, default: "/default-poster.jpg"},
        backdrop_path: {type: String, default: "/default-backdrop.jpg"},
        release_date: {type: String, required: true},
        original_language: {type: String},
        tagline: {type: String},
        genres: {type: Array, default: []}, // Array of genre objects with id and name
        genre_ids: {type: Array, default: []}, // Array of genre IDs from TMDB
        casts: {type: Array, default: []},
        vote_average: {type: Number, default: 0},
        runtime: {type: Number, default: null}, // Changed from 120 to null
        trailer: {
            key: {type: String, default: null},
            name: {type: String, default: null},
            site: {type: String, default: null},
            type: {type: String, default: null}
        }
    }, {timestamps: true }
)

// Pre-save hook to ensure required fields are always set
movieSchema.pre('save', function(next) {
    try {
        // Set default values for required fields
        if (!this.poster_path) this.poster_path = "/default-poster.jpg";
        if (!this.backdrop_path) this.backdrop_path = "/default-backdrop.jpg";
        if (!this.runtime) this.runtime = null; // Don't set default runtime
        if (!this.genres) this.genres = [];
        if (!this.genre_ids) this.genre_ids = [];
        if (!this.casts) this.casts = [];
        if (!this.vote_average) this.vote_average = 0;
        
        // Ensure tmdbId is set to prevent duplicate key errors
        if (!this.tmdbId) {
            this.tmdbId = this._id;
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
