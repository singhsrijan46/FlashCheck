// VERSION: 3.0 - Aggressive Movie Validation Fix
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        _id: {type: String, required: true},
        title: {type: String, required: true},
        overview: {type: String, required: true},
        poster_path: {type: String, default: "/default-poster.jpg"},
        backdrop_path: {type: String, default: "/default-backdrop.jpg"},
        release_date: {type: String, required: true},
        original_language: {type: String},
        tagline: {type: String},
        genres: {type: Array, default: []},
        casts: {type: Array, default: []},
        vote_average: {type: Number, default: 0},
        runtime: {type: Number, default: 120},
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
    // Ensure required fields have default values
    if (!this.poster_path) this.poster_path = "/default-poster.jpg";
    if (!this.backdrop_path) this.backdrop_path = "/default-backdrop.jpg";
    if (!this.runtime) this.runtime = 120;
    if (!this.genres) this.genres = [];
    if (!this.casts) this.casts = [];
    if (!this.vote_average) this.vote_average = 0;
    
    next();
});

// Pre-validate hook to ensure fields exist
movieSchema.pre('validate', function(next) {
    // Set default values before validation
    if (!this.poster_path) this.poster_path = "/default-poster.jpg";
    if (!this.backdrop_path) this.backdrop_path = "/default-backdrop.jpg";
    if (!this.runtime) this.runtime = 120;
    if (!this.genres) this.genres = [];
    if (!this.casts) this.casts = [];
    if (!this.vote_average) this.vote_average = 0;
    
    next();
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
