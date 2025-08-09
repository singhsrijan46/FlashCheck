import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import sendEmail from "../configs/nodeMailer.js";

// Simple movie cache to reduce API calls
const movieCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Sample movie data as fallback when TMDB API is unavailable
const sampleMovies = [
    {
        _id: "550",
        title: "Fight Club",
        overview: "A depressed man meets a strange soapmaker whose outlook on life changes his own.",
        poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        backdrop_path: "/52AfXWuXCHn3UjD17rBruA9f5qb.jpg",
        release_date: "1999-10-15",
        vote_average: 8.8,
        original_language: "en",
        genre_ids: [18]
    },
    {
        _id: "13",
        title: "Forrest Gump",
        overview: "A man with a low IQ has accomplished great things in his life.",
        poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
        backdrop_path: "/yE5d3BUhDU8BGxSyfRmJPU9i8SV.jpg",
        release_date: "1994-07-06",
        vote_average: 8.8,
        original_language: "en",
        genre_ids: [35, 18]
    },
    {
        _id: "238",
        title: "The Godfather",
        overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
        poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
        release_date: "1972-03-14",
        vote_average: 9.2,
        original_language: "en",
        genre_ids: [18, 80]
    },
    {
        _id: "680",
        title: "Pulp Fiction",
        overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer.",
        poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        backdrop_path: "/suaEOtk1N1sgg2QM528GluxMcOr.jpg",
        release_date: "1994-10-14",
        vote_average: 8.9,
        original_language: "en",
        genre_ids: [53, 80]
    },
    {
        _id: "155",
        title: "The Dark Knight",
        overview: "Batman raises the stakes in his war on crime.",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        backdrop_path: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
        release_date: "2008-07-18",
        vote_average: 9.0,
        original_language: "en",
        genre_ids: [18, 28, 80]
    }
];

const getCachedMovieData = (movieId) => {
    const cached = movieCache.get(movieId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

const setCachedMovieData = (movieId, data) => {
    movieCache.set(movieId, {
        data,
        timestamp: Date.now()
    });
};

// Add global axios interceptor for better error handling
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
            return Promise.reject({
                message: `Network error: ${error.code}`,
                isNetworkError: true
            });
        }
        return Promise.reject(error);
    }
);

// Simple rate limiting for TMDB API calls
const recentCalls = [];
const MAX_CALLS_PER_MINUTE = 40;

const checkRateLimit = (endpoint) => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Remove calls older than 1 minute
    while (recentCalls.length > 0 && recentCalls[0] < oneMinuteAgo) {
        recentCalls.shift();
    }
    
    if (recentCalls.length >= MAX_CALLS_PER_MINUTE) {
        return false;
    }
    
    recentCalls.push(now);
    return true;
};

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res) => {
    try {
        if (!process.env.TMDB_API_KEY) {
            return res.json({success: true, movies: sampleMovies});
        }

        const fetchWithRetry = async (url, retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    if (!checkRateLimit('tmdb-api')) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    
                    const response = await axios.get(url, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                        timeout: 15000
                    });
                    return response;
                } catch (error) {
                    if (i === retries - 1) throw error;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        };

        const nowPlayingResponse = await fetchWithRetry('https://api.themoviedb.org/3/movie/now_playing');
        const nowPlayingMovies = nowPlayingResponse.data.results;

        const upcomingResponse = await fetchWithRetry('https://api.themoviedb.org/3/movie/upcoming');
        const upcomingMovies = upcomingResponse.data.results;

        const allMovies = [...nowPlayingMovies, ...upcomingMovies];
        const uniqueMovies = [];
        const seenIds = new Set();

        allMovies.forEach(movie => {
            if (!seenIds.has(movie.id.toString())) {
                seenIds.add(movie.id.toString());
                const movieData = {
                    _id: movie.id.toString(),
                    tmdbId: movie.id.toString(), // Add tmdbId field
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    original_language: movie.original_language,
                    genre_ids: movie.genre_ids
                };
                uniqueMovies.push(movieData);
                setCachedMovieData(movie.id.toString(), movieData);
            }
        });

        res.json({success: true, movies: uniqueMovies});
        
    } catch (error) {
        
        // Try to return cached movies if available
        const cachedMovies = [];
        for (const [movieId, cached] of movieCache.entries()) {
            if (Date.now() - cached.timestamp < CACHE_DURATION) {
                cachedMovies.push(cached.data);
            }
        }
        
        if (cachedMovies.length > 0) {
            res.json({success: true, movies: cachedMovies});
        } else {
            res.json({success: true, movies: sampleMovies});
        }
    }
};

// API to get movies available in a specific city
export const getMoviesByCity = async (req, res) => {
    try {
        const { city } = req.params;
        
        if (!city) {
            return res.status(400).json({ 
                success: false, 
                message: 'City parameter is required' 
            });
        }

        // Get all shows for the specified city (case-insensitive search)
        const cityShows = await Show.find({ 
            city: { $regex: new RegExp('^' + city + '$', 'i') } 
        }).populate('movie');
        
        // Extract unique movies from the shows
        const uniqueMovies = [];
        const seenMovieIds = new Set();

        cityShows.forEach(show => {
            if (show.movie && !seenMovieIds.has(show.movie._id)) {
                seenMovieIds.add(show.movie._id);
                uniqueMovies.push(show.movie);
            }
        });

        res.json({ 
            success: true, 
            movies: uniqueMovies,
            city: city
        });

    } catch (error) {
        
        // Provide more specific error messages
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid city format',
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch movies for city',
            error: error.message 
        });
    }
};

// API to add a new show to the database
export const addShow = async (req, res) => {
    try {
        const { movieId, theatreId, state, city, format, showsInput, silverPrice, goldPrice, diamondPrice } = req.body;

        // Validate required fields
        if (!movieId) {
            return res.status(400).json({ success: false, message: 'Movie ID is required' });
        }
        
        if (!theatreId) {
            return res.status(400).json({ success: false, message: 'Theatre ID is required' });
        }
        
        if (!state) {
            return res.status(400).json({ success: false, message: 'State is required' });
        }
        
        if (!city) {
            return res.status(400).json({ success: false, message: 'City is required' });
        }
        
        if (!showsInput || !Array.isArray(showsInput) || showsInput.length === 0) {
            return res.status(400).json({ success: false, message: 'Show times are required' });
        }
        
        if (!silverPrice || !goldPrice || !diamondPrice) {
            return res.status(400).json({ success: false, message: 'All price fields are required' });
        }

        // Validate that prices are numbers
        if (isNaN(Number(silverPrice)) || isNaN(Number(goldPrice)) || isNaN(Number(diamondPrice))) {
            return res.status(400).json({ success: false, message: 'Prices must be valid numbers' });
        }

        // Validate theatre exists
        const Theatre = (await import('../models/Theatre.js')).default;
        const theatre = await Theatre.findById(theatreId);
        if (!theatre) {
            return res.status(400).json({ success: false, message: 'Theatre not found' });
        }

        // Validate theatre location matches
        if (theatre.state !== state || theatre.city !== city) {
            return res.status(400).json({ success: false, message: 'Theatre location mismatch' });
        }

        // Process each show time
        for (const showInput of showsInput) {
            const { date, time, screen } = showInput;
            
            if (!time || !Array.isArray(time) || time.length === 0) {
                return res.status(400).json({ success: false, message: 'Show times are required' });
            }
            
            if (!screen) {
                return res.status(400).json({ success: false, message: 'Screen is required for each show' });
            }

            // Validate screen exists in theatre
            if (!theatre.screens.includes(screen)) {
                return res.status(400).json({ success: false, message: `Screen '${screen}' does not exist in this theatre` });
            }

            // Create shows for each time slot
            for (const timeSlot of time) {
                const showDateTime = new Date(timeSlot);
                
                if (isNaN(showDateTime.getTime())) {
                    return res.status(400).json({ success: false, message: 'Invalid date/time format' });
                }

                // Fetch movie data from TMDB API
            const fetchWithRetry = async (url, retries = 3) => {
                for (let i = 0; i < retries; i++) {
                    try {
                        if (!checkRateLimit('tmdb-api')) {
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            continue;
                        }
                        
                        const response = await axios.get(url, {
                            headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                            timeout: 15000
                        });
                        return response;
                    } catch (error) {
                        if (i === retries - 1) throw error;
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            };

                let movieData = null;
                
                // Check cache first
                const cachedData = getCachedMovieData(movieId);
                if (cachedData) {
                    movieData = cachedData;
                } else if (process.env.TMDB_API_KEY) {
                    try {
                        const response = await fetchWithRetry(`https://api.themoviedb.org/3/movie/${movieId}`);
                        const apiData = response.data;
                        
                        movieData = {
                            _id: apiData.id.toString(),
                            tmdbId: apiData.id.toString(), // Ensure tmdbId is set
                            title: apiData.title,
                            overview: apiData.overview,
                            poster_path: apiData.poster_path,
                            backdrop_path: apiData.backdrop_path,
                            release_date: apiData.release_date,
                            vote_average: apiData.vote_average,
                            original_language: apiData.original_language,
                            genre_ids: apiData.genre_ids,
                            runtime: apiData.runtime,
                            status: apiData.status,
                            tagline: apiData.tagline,
                            vote_count: apiData.vote_count,
                            popularity: apiData.popularity,
                            adult: apiData.adult,
                            video: apiData.video,
                            original_title: apiData.original_title
                        };
                        
                        setCachedMovieData(movieId, movieData);
                    } catch (error) {
                        // Continue with fallback movie creation
                    }
                }

                // Create or update movie in database
                let movie = await Movie.findOne({ _id: movieId });
                
                if (movieData && !movie) {
                    try {
                        movie = new Movie({
                            ...movieData,
                            tmdbId: movieId // Ensure tmdbId is set
                        });
                        await movie.save();
                    } catch (saveError) {
                        // Try fallback creation
                        try {
                            movie = new Movie({
                                _id: movieId,
                                tmdbId: movieId,
                                title: movieData.title || `Movie ${movieId}`,
                                overview: movieData.overview || 'Movie information not available',
                                poster_path: movieData.poster_path || '/default-poster.jpg',
                                backdrop_path: movieData.backdrop_path || '/default-backdrop.jpg',
                                release_date: movieData.release_date || new Date().toISOString().split('T')[0],
                                vote_average: movieData.vote_average || 0,
                                original_language: movieData.original_language || 'en',
                                genre_ids: movieData.genre_ids || []
                            });
                            await movie.save();
                        } catch (fallbackError) {
                            return res.status(500).json({ 
                                success: false, 
                                message: 'Failed to create movie record',
                                error: fallbackError.message 
                            });
                        }
                    }
                } else if (!movie) {
                    // Create basic movie as fallback
                    try {
                        movie = new Movie({
                            _id: movieId,
                            tmdbId: movieId, // Ensure tmdbId is set
                        title: `Movie ${movieId}`,
                            overview: 'Movie information not available',
                            poster_path: '/default-poster.jpg',
                            backdrop_path: '/default-backdrop.jpg',
                            release_date: new Date().toISOString().split('T')[0],
                        vote_average: 0,
                            original_language: 'en',
                            genre_ids: []
                        });
                        await movie.save();
                    } catch (fallbackError) {
                        return res.status(500).json({ 
                            success: false, 
                            message: 'Failed to create basic movie record',
                            error: fallbackError.message 
                        });
                    }
                }

                // Create the show
                try {
                    const show = new Show({
                        movie: movie._id, // Use the actual movie object ID
                        theatre: theatreId,
                        state: state,
                        city: city,
                        screen: screen, // Add screen field
                        showDateTime: showDateTime,
                        format: req.body.format, // Use global format from request body
                    silverPrice: Number(silverPrice),
                    goldPrice: Number(goldPrice),
                    diamondPrice: Number(diamondPrice),
                    occupiedSeats: {}
                    });

                    await show.save();
                } catch (showError) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Failed to create show',
                        error: showError.message 
                    });
                }
            }
        }

        res.json({ success: true, message: 'Shows added successfully' });

    } catch (error) {
        
        // Provide more specific error messages
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Duplicate movie or show detected. Please try again.',
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add show',
            error: error.message 
        });
    }
};

// API to get all shows
export const getShows = async (req, res) => {
    try {
        const shows = await Show.find().populate('movie').populate('theatre');
        
        const showsWithMovies = shows.map(show => {
            if (!show.movie) {
                return {
                        ...show.toObject(),
                    movie: {
                        _id: show.movie,
                        tmdbId: show.movie, // Add tmdbId for consistency
                        title: 'Movie not found',
                        overview: 'Movie information not available',
                        poster_path: '/default-poster.jpg',
                        backdrop_path: '/default-backdrop.jpg',
                        release_date: new Date().toISOString().split('T')[0],
                        vote_average: 0,
                        original_language: 'en',
                        genre_ids: []
                    }
                };
            }
            return show;
        });

        res.json({ success: true, shows: showsWithMovies });

    } catch (error) {
        
        // Provide more specific error messages
        if (error.name === 'CastError') {
            return res.status(400).json({ 
            success: false, 
                message: 'Invalid data format in shows',
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch shows',
            error: error.message 
        });
    }
};

// API to get shows by movie ID and city
export const getShowsByMovieAndCity = async (req, res) => {
    try {
        const { movieId, city } = req.params;
        
        if (!movieId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Movie ID is required' 
            });
        }
        
        if (!city) {
            return res.status(400).json({ 
                success: false, 
                message: 'City is required' 
            });
                }
        
        // Find all shows for this movie in the specified city
        const shows = await Show.find({ 
            movie: movieId,
            city: city 
        }).populate('movie').populate('theatre');
        
        if (shows.length === 0) {
            return res.json({ 
                success: true, 
                shows: [],
                message: 'No shows found for this movie in the specified city'
            });
        }
        
        // Process shows to include theatre and format information
        const processedShows = shows.map(show => ({
            _id: show._id,
            movie: show.movie,
            theatre: show.theatre,
            state: show.state,
            city: show.city,
            screen: show.screen,
            format: show.format,
            showDateTime: show.showDateTime,
            silverPrice: show.silverPrice,
            goldPrice: show.goldPrice,
            diamondPrice: show.diamondPrice,
            occupiedSeats: show.occupiedSeats
        }));
        
        res.json({
            success: true, 
            shows: processedShows,
            message: `Found ${processedShows.length} shows for this movie in ${city}`
        });
        
    } catch (error) {
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch shows',
            error: error.message 
        });
    }
};

// API to get a show by movie ID (legacy - keeping for backward compatibility)
export const getShowByMovieId = async (req, res) => {
    try {
        const { movieId } = req.params;
        
        if (!movieId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Movie ID is required' 
            });
        }
        
        // Try to find a show for this movie with different ID formats
        let show = await Show.findOne({ movie: movieId }).populate('movie');
        
        // If not found, try with string conversion
        if (!show) {
            show = await Show.findOne({ movie: movieId.toString() }).populate('movie');
        }
        
        // If still not found, try to find any show and check if movie ID matches
        if (!show) {
            const allShows = await Show.find().populate('movie');
            
            // Try to find by movie title or other properties
            show = allShows.find(s => s.movie && (
                s.movie._id === movieId || 
                s.movie._id === movieId.toString() ||
                s.movie.tmdbId === movieId ||
                s.movie.tmdbId === movieId.toString()
            ));
        }
        
        if (!show) {
            return res.status(404).json({ 
            success: false, 
                message: 'No shows found for this movie',
                debug: {
                    requestedMovieId: movieId,
                    availableShows: await Show.countDocuments()
                }
            });
        }

        // If movie exists but doesn't have cast/trailer data, try to fetch it from TMDB
        if (show.movie && (!show.movie.casts || show.movie.casts.length === 0)) {
            try {
        const fetchWithRetry = async (url, retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    if (!checkRateLimit('tmdb-api')) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    
                    const response = await axios.get(url, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                        timeout: 15000
                    });
                    return response;
                } catch (error) {
                    if (i === retries - 1) throw error;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        };

                // Fetch cast data
                const castResponse = await fetchWithRetry(`https://api.themoviedb.org/3/movie/${movieId}/credits`);
                const castData = castResponse.data.cast || [];
                
                // Update movie with cast data
                show.movie.casts = castData.slice(0, 12).map(cast => ({
            name: cast.name,
            profile_path: cast.profile_path,
                                                character: cast.character
                        }));
                        
                        // Save updated movie
                        await show.movie.save();
                        
                    } catch (error) {
                        // Continue without cast data
                    }
                }

        res.json({ success: true, show });

    } catch (error) {
        
        // Provide more specific error messages
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid movie ID format',
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch show',
            error: error.message 
        });
    }
};

// API to get a specific showtime by ID
export const getSpecificShow = async (req, res) => {
    try {
        const { showtimeId } = req.params;
        
        if (!showtimeId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Showtime ID is required' 
            });
        }
        
        // Find the specific showtime by ID
        const show = await Show.findById(showtimeId).populate('movie').populate('theatre');
        
        if (!show) {
            return res.status(404).json({ 
                success: false, 
                message: 'Showtime not found' 
            });
        }
        
        // Process show to include theatre and format information
        const processedShow = {
                    _id: show._id,
                    movie: show.movie,
            theatre: show.theatre,
            state: show.state,
            city: show.city,
            screen: show.screen,
            format: show.format,
                    showDateTime: show.showDateTime,
                    silverPrice: show.silverPrice,
                    goldPrice: show.goldPrice,
            diamondPrice: show.diamondPrice,
            occupiedSeats: show.occupiedSeats
        };
        
        res.json({
            success: true,
            show: processedShow,
            message: 'Showtime found'
        });
        
    } catch (error) {
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch showtime',
            error: error.message 
        });
    }
};

// API to get a specific show by show ID
export const getShow = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Show ID is required' 
            });
        }
        
        const show = await Show.findById(id).populate('movie');
        
        if (!show) {
            return res.status(404).json({ 
                success: false, 
                message: 'Show not found' 
            });
        }

        res.json({ success: true, show });

    } catch (error) {
        
        // Provide more specific error messages
        if (error.name === 'CastError') {
            return res.status(400).json({ 
            success: false, 
                message: 'Invalid show ID format',
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch show',
            error: error.message 
        });
    }
};

// API to get movie trailer
export const getMovieTrailer = async (req, res) => {
    try {
        const { movieId } = req.params;
        
        if (!movieId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Movie ID is required' 
            });
        }

        const fetchWithRetry = async (url, retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    if (!checkRateLimit('tmdb-api')) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    
                    const response = await axios.get(url, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                        timeout: 15000
                    });
                    return response;
                } catch (error) {
                    if (i === retries - 1) throw error;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        };

        const response = await fetchWithRetry(`https://api.themoviedb.org/3/movie/${movieId}/videos`);
        const videos = response.data.results;

        // Find trailer
        const trailer = videos.find(video => 
            (video.type === 'Trailer' || video.type === 'Teaser') && 
            video.site === 'YouTube' &&
            video.official === true
        ) || videos.find(video => 
            (video.type === 'Trailer' || video.type === 'Teaser') && 
            video.site === 'YouTube'
        );

        if (!trailer) {
            return res.status(404).json({ 
                success: false, 
                message: 'No trailer found for this movie' 
            });
        }

        res.json({ success: true, trailer });

    } catch (error) {
        
        // Provide more specific error messages
        if (error.response?.status === 404) {
            return res.status(404).json({ 
            success: false, 
                message: 'Movie not found',
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch movie trailer',
            error: error.message 
        });
    }
};

// API to search movies
export const searchMovies = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Search query is required' 
            });
        }

        if (!process.env.TMDB_API_KEY) {
            return res.status(400).json({ 
                success: false, 
                message: 'TMDB API key not configured' 
            });
        }

        const fetchWithRetry = async (url, retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    if (!checkRateLimit('tmdb-api')) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    
                    const response = await axios.get(url, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                        timeout: 15000
                    });
                    return response;
                    } catch (error) {
                    if (i === retries - 1) throw error;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        };

        const response = await fetchWithRetry(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`);
        const movies = response.data.results;

        res.json({ success: true, movies });

    } catch (error) {
        
        // Provide more specific error messages
        if (error.response?.status === 401) {
            return res.status(401).json({ 
                success: false, 
                message: 'TMDB API key is invalid',
                error: error.message 
            });
        }
        
        if (error.response?.status === 429) {
            return res.status(429).json({ 
                success: false, 
                message: 'TMDB API rate limit exceeded. Please try again later.',
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to search movies',
            error: error.message
        });
    }
};

// API to get popular movies
export const getPopularMovies = async (req, res) => {
    try {
        if (!process.env.TMDB_API_KEY) {
            return res.status(400).json({ 
            success: false, 
                message: 'TMDB API key not configured' 
            });
        }

        const fetchWithRetry = async (url, retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    if (!checkRateLimit('tmdb-api')) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    
                    const response = await axios.get(url, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                        timeout: 15000
                    });
                    return response;
                } catch (error) {
                    if (i === retries - 1) throw error;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        };

        const response = await fetchWithRetry('https://api.themoviedb.org/3/movie/popular');
        const movies = response.data.results;

        res.json({ success: true, movies });

    } catch (error) {
        
        // Provide more specific error messages
        if (error.response?.status === 401) {
            return res.status(401).json({ 
            success: false, 
                message: 'TMDB API key is invalid',
            error: error.message
        });
    }
        
        if (error.response?.status === 429) {
            return res.status(429).json({ 
                success: false, 
                message: 'TMDB API rate limit exceeded. Please try again later.',
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch popular movies',
            error: error.message
        });
    }
};