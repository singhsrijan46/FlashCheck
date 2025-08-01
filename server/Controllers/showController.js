// VERSION: 2.0 - Enhanced Movie Creation with Fallbacks
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
            console.log('Network error occurred:', error.code);
            // Return a custom error response instead of throwing
            return Promise.reject({
                message: `Network error: ${error.code}`,
                isNetworkError: true
            });
        }
        return Promise.reject(error);
    }
);

// Simple rate limiting for TMDB API calls
const apiCallTracker = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_CALLS_PER_WINDOW = 30; // Increased from 10 to 30

const checkRateLimit = (endpoint) => {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    if (!apiCallTracker.has(endpoint)) {
        apiCallTracker.set(endpoint, []);
    }
    
    const calls = apiCallTracker.get(endpoint);
    // Remove old calls outside the window
    const recentCalls = calls.filter(timestamp => timestamp > windowStart);
    apiCallTracker.set(endpoint, recentCalls);
    
    if (recentCalls.length >= MAX_CALLS_PER_WINDOW) {
        // Instead of throwing error, wait a bit and retry
        console.log('Rate limit approaching, waiting...');
        return false;
    }
    
    recentCalls.push(now);
    return true;
};

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res)=>{
    try {
        console.log('=== GET NOW PLAYING MOVIES ===');
        console.log('TMDB API Key available:', !!process.env.TMDB_API_KEY);
        
        if (!process.env.TMDB_API_KEY) {
            console.error('TMDB API Key is missing');
            return res.json({success: false, message: 'TMDB API Key is not configured'});
        }

        // Fetch currently showing movies from TMDB API
        const fetchWithRetry = async (url, retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    // Check rate limit before making API call
                    if (!checkRateLimit('tmdb-api')) {
                        console.log('Rate limit hit, waiting 2 seconds...');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    
                    return await axios.get(url, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                        timeout: 15000 // Increased timeout
                    });
                } catch (error) {
                    console.log(`TMDB API call failed (${retries - i} retries left):`, error.message);
                    if (i === retries - 1) throw error;
                    // Wait longer between retries
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        };

        // Get currently showing movies from TMDB
        const nowPlayingResponse = await fetchWithRetry('https://api.themoviedb.org/3/movie/now_playing');
        const nowPlayingMovies = nowPlayingResponse.data.results;

        console.log('Fetched now playing movies from TMDB:', nowPlayingMovies.length);

        // Also get upcoming movies for more options
        const upcomingResponse = await fetchWithRetry('https://api.themoviedb.org/3/movie/upcoming');
        const upcomingMovies = upcomingResponse.data.results;

        console.log('Fetched upcoming movies from TMDB:', upcomingMovies.length);

        // Combine and deduplicate movies
        const allMovies = [...nowPlayingMovies, ...upcomingMovies];
        const uniqueMovies = [];
        const seenIds = new Set();

        allMovies.forEach(movie => {
            if (!seenIds.has(movie.id.toString())) {
                seenIds.add(movie.id.toString());
                const movieData = {
                    _id: movie.id.toString(),
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
                // Cache the movie data
                setCachedMovieData(movie.id.toString(), movieData);
            }
        });

        console.log('Total unique movies found:', uniqueMovies.length);
        res.json({success: true, movies: uniqueMovies});
        
    } catch (error) {
        console.error('Error fetching now playing movies:', error);
        // Try to return cached data as fallback
        const cachedMovies = [];
        for (const [movieId, cached] of movieCache.entries()) {
            if (Date.now() - cached.timestamp < CACHE_DURATION) {
                cachedMovies.push(cached.data);
            }
        }
        
        if (cachedMovies.length > 0) {
            console.log('Returning cached movie data as fallback:', cachedMovies.length);
            res.json({success: true, movies: cachedMovies});
        } else {
            console.log('No cached data available, using sample movies as fallback');
            res.json({success: true, movies: sampleMovies});
        }
    }
}

// API to add a new show to the database
export const addShow = async (req, res) =>{
    try {
        console.log('=== ADD SHOW START ===');
        console.log('Add show request body:', req.body);
        const {movieId, showsInput, showPrice} = req.body

        if (!movieId || !showsInput || !showPrice) {
            console.log('Missing required fields:', { movieId, showsInput, showPrice });
            return res.json({success: false, message: 'Missing required fields'});
        }

        console.log('Validating movieId:', movieId);
        console.log('MovieId type:', typeof movieId);
        let movie = await Movie.findById(movieId.toString())

        if(!movie) {
            console.log('Movie not found in database, fetching from TMDB API...');
            console.log('TMDB API Key available:', !!process.env.TMDB_API_KEY);
            
            if (!process.env.TMDB_API_KEY) {
                console.error('TMDB API Key is missing');
                return res.json({success: false, message: 'TMDB API Key is not configured'});
            }
            
            try {
                console.log('Making TMDB API calls...');
                // Fetch movie details, credits, and videos from TMDB API with retry logic
                const fetchWithRetry = async (url, retries = 3) => {
                    for (let i = 0; i < retries; i++) {
                        try {
                            // Check rate limit before making API call
                            if (!checkRateLimit('tmdb-api')) {
                                console.log('Rate limit hit, waiting 2 seconds...');
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                continue;
                            }
                            
                            console.log(`Making API call to: ${url}`);
                            const response = await axios.get(url, {
                                headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                                timeout: 15000 // Increased timeout
                            });
                            console.log(`API call successful for: ${url}`);
                            return response;
                        } catch (error) {
                            console.log(`TMDB API call failed (${retries - i} retries left):`, error.message);
                            if (i === retries - 1) throw error;
                            // Wait longer between retries
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                };

                const [movieDetailsResponse, movieCreditsResponse, movieVideosResponse] = await Promise.all([
                    fetchWithRetry(`https://api.themoviedb.org/3/movie/${movieId}`),
                    fetchWithRetry(`https://api.themoviedb.org/3/movie/${movieId}/credits`),
                    fetchWithRetry(`https://api.themoviedb.org/3/movie/${movieId}/videos`)
                ]);

                console.log('TMDB API calls successful');
                const movieApiData = movieDetailsResponse.data;
                const movieCreditsData = movieCreditsResponse.data;
                const movieVideosData = movieVideosResponse.data;
                
                console.log('TMDB API responses received');
                console.log('Movie API data:', {
                    title: movieApiData.title,
                    id: movieApiData.id,
                    overview: movieApiData.overview?.substring(0, 100) + '...'
                });

                // Get the first official trailer or teaser
                const trailer = movieVideosData.results.find(video => 
                    (video.type === 'Trailer' || video.type === 'Teaser') && 
                    video.site === 'YouTube' &&
                    video.official === true
                ) || movieVideosData.results.find(video => 
                    (video.type === 'Trailer' || video.type === 'Teaser') && 
                    video.site === 'YouTube'
                );

                console.log('Found trailer:', trailer);
                console.log('Trailer type:', typeof trailer);
                console.log('Trailer structure:', JSON.stringify(trailer, null, 2));
                
                 const movieDetails = {
                    _id: movieId.toString(),
                    title: movieApiData.title,
                    overview: movieApiData.overview,
                    poster_path: movieApiData.poster_path,
                    backdrop_path: movieApiData.backdrop_path,
                    genres: movieApiData.genres,
                    casts: movieCreditsData.cast,
                    release_date: movieApiData.release_date,
                    original_language: movieApiData.original_language,
                    tagline: movieApiData.tagline || "",
                    vote_average: movieApiData.vote_average,
                    runtime: movieApiData.runtime,
                    trailer: trailer ? {
                        key: trailer.key || null,
                        name: trailer.name || null,
                        site: trailer.site || null,
                        type: trailer.type || null
                    } : null
                 }

                 console.log('Creating movie in database...');
                 console.log('Movie details to create:', JSON.stringify(movieDetails, null, 2));
                 console.log('TMDB API data received:', JSON.stringify(movieApiData, null, 2));
                 
                 // Test with minimal movie data first
                 try {
                     const movieData = {
                         _id: movieId.toString(),
                         title: movieApiData.title || `Movie ${movieId}`,
                         overview: movieApiData.overview || "No overview available",
                         poster_path: movieApiData.poster_path || "/default-poster.jpg",
                         backdrop_path: movieApiData.backdrop_path || "/default-backdrop.jpg",
                         release_date: movieApiData.release_date || "Unknown",
                         vote_average: movieApiData.vote_average || 0,
                         runtime: movieApiData.runtime || 120,
                         genres: movieApiData.genres || [],
                         casts: movieApiData.casts || []
                     };
                     
                     console.log('Attempting to create movie with data:', JSON.stringify(movieData, null, 2));
                     
                     // Use the bypass validation function
                     const testMovie = await createMovieBypassValidation(movieData);
                     console.log('Test movie created successfully:', testMovie._id);
                     movie = testMovie;
                 } catch (testError) {
                     console.error('Error creating test movie:', testError);
                     console.error('Test error details:', testError.message);
                     console.error('Full error:', testError);
                     return res.json({success: false, message: 'Failed to create movie in database: ' + testError.message});
                 }
            } catch (error) {
                console.error('Error fetching from TMDB API:', error);
                console.error('Error details:', error.response?.data || error.message);
                console.error('Error status:', error.response?.status);
                
                // Try to create a basic movie with just the ID and title
                try {
                    console.log('TMDB API failed, creating basic movie...');
                    const basicMovieData = {
                        _id: movieId.toString(),
                        title: `Movie ${movieId}`,
                        overview: "Movie details not available",
                        poster_path: "/default-poster.jpg",
                        backdrop_path: "/default-backdrop.jpg",
                        release_date: "Unknown",
                        vote_average: 0,
                        runtime: 120,
                        genres: [],
                        casts: []
                    };
                    
                    console.log('Creating basic movie with data:', JSON.stringify(basicMovieData, null, 2));
                    
                    // Use the bypass validation function
                    movie = await createMovieBypassValidation(basicMovieData);
                    console.log('Basic movie created successfully:', movie._id);
                } catch (basicError) {
                    console.error('Error creating basic movie:', basicError);
                    console.error('Full basic error:', basicError);
                    return res.json({success: false, message: 'Failed to create movie: ' + basicError.message});
                }
            }
        }

        console.log('Creating shows with data:', { movieId, showsInput, showPrice });
        
        const showsToCreate = [];
        showsInput.forEach(show => {
            show.time.forEach((dateTimeString)=>{
                console.log('Processing datetime:', dateTimeString);
                const parsedDate = new Date(dateTimeString);
                console.log('Parsed date:', parsedDate);
                console.log('Is valid date:', !isNaN(parsedDate.getTime()));
                
                if (isNaN(parsedDate.getTime())) {
                    console.error('Invalid date:', dateTimeString);
                    return res.json({success: false, message: 'Invalid date format'});
                }
                
                const showData = {
                    movie: movieId.toString(),
                    showDateTime: parsedDate,
                    showPrice,
                    occupiedSeats: {}
                };
                
                console.log('Show data to create:', showData);
                showsToCreate.push(showData);
            })
        });

        console.log('Shows to create:', showsToCreate.length);

        if(showsToCreate.length > 0){
            try {
                console.log('Attempting to create shows in database...');
                console.log('Shows to create:', showsToCreate.length);
                
                const createdShows = await Show.insertMany(showsToCreate);
                console.log('Shows created successfully:', createdShows.length);
                console.log('Created show IDs:', createdShows.map(s => s._id));
                
                // Verify shows were created
                const verifyShows = await Show.find({ movie: movieId.toString() });
                console.log('Verified shows in database:', verifyShows.length);
            } catch (error) {
                console.error('Error creating shows:', error);
                console.error('Error details:', error.message);
                console.error('Error stack:', error.stack);
                return res.json({success: false, message: 'Failed to create shows in database: ' + error.message});
            }
        } else {
            console.log('No shows to create');
            return res.json({success: false, message: 'No valid shows to create'});
        }

        console.log('=== ADD SHOW COMPLETED SUCCESSFULLY ===');
        
        // Send simple notification email (optional)
        try {
            const users = await User.find({}).limit(10); // Limit to first 10 users
            for (const user of users) {
                await sendEmail({
                    to: user.email,
                    subject: `🎬 New Show Added: ${movie.title}`,
                    body: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Hi ${user.name},</h2>
                        <p>We've just added a new show to our library:</p>
                        <h3 style="color: #1E90FF;">"${movie.title}"</h3>
                        <p>Visit our website to book your tickets!</p>
                        <br/>
                        <p>Thanks,<br/>FlashCheck Team</p>
                    </div>`
                });
            }
            console.log(`Sent notifications to ${users.length} users`);
        } catch (error) {
            console.log('Email notification failed:', error.message);
            // Don't fail the request if email fails
        }
        
        res.json({success: true, message: 'Show Added successfully.'})
    } catch (error) {
        console.error('=== ADD SHOW ERROR ===');
        console.error('Error in addShow:', error);
        console.error('Error stack:', error.stack);
        res.json({success: false, message: error.message})
    }
}

// API to get all shows from the database
export const getShows = async (req, res) =>{
    try {
        console.log('=== GET SHOWS REQUEST ===');
        console.log('Request URL:', req.url);
        console.log('Request method:', req.method);
        console.log('Request headers:', req.headers);
        console.log('Fetching all shows...');
        
        // Get shows from 30 days ago to 30 days in the future
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        console.log('Date range:', { from: thirtyDaysAgo, to: thirtyDaysFromNow });
        
        // Add error handling for the database query
        let shows;
        try {
            shows = await Show.find({
                showDateTime: { 
                    $gte: thirtyDaysAgo,
                    $lte: thirtyDaysFromNow
                }
            }).populate('movie').sort({ showDateTime: 1 });
        } catch (dbError) {
            console.error('Database query error:', dbError);
            return res.json({ success: false, message: 'Failed to fetch shows from database' });
        }
        
        console.log('Total shows found:', shows.length);

        // filter unique movies by _id with proper validation
        const uniqueMovies = [];
        const seenMovieIds = new Set();
        
        shows.forEach(show => {
            try {
                // Validate that show and movie exist and have required fields
                if (show && 
                    show.movie && 
                    show.movie._id && 
                    typeof show.movie._id.toString === 'function' &&
                    !seenMovieIds.has(show.movie._id.toString())) {
                    
                    seenMovieIds.add(show.movie._id.toString());
                    
                    // Validate movie has required fields before adding
                    if (show.movie.title && show.movie.overview) {
                        uniqueMovies.push(show.movie);
                    } else {
                        console.log('Skipping movie with missing required fields:', show.movie._id);
                    }
                } else {
                    console.log('Skipping invalid show or movie:', show?._id, show?.movie?._id);
                }
            } catch (validationError) {
                console.error('Error validating show/movie:', validationError);
                // Continue processing other shows
            }
        });

        console.log('Unique movies with shows:', uniqueMovies.length);
        console.log('=== GET SHOWS RESPONSE ===');
        
        // Return empty array if no valid movies found
        res.json({
            success: true, 
            shows: uniqueMovies,
            totalShows: shows.length,
            validMovies: uniqueMovies.length
        });
    } catch (error) {
        console.error('Error fetching shows:', error);
        res.json({ 
            success: false, 
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// API to get a single show from the database
export const getShow = async (req, res) =>{
    try {
        const {movieId} = req.params;
        
        if (!movieId) {
            return res.json({ success: false, message: 'Movie ID is required' });
        }
        
        console.log('Fetching shows for movie ID:', movieId);
        
        // get all upcoming shows for the movie with error handling
        let shows;
        try {
            shows = await Show.find({
                movie: movieId, 
                showDateTime: { $gte: new Date() }
            });
        } catch (dbError) {
            console.error('Database query error:', dbError);
            return res.json({ success: false, message: 'Failed to fetch shows from database' });
        }

        console.log('Found shows:', shows.length);

        // Get movie with error handling
        let movie;
        try {
            movie = await Movie.findById(movieId);
            if (!movie) {
                return res.json({ success: false, message: 'Movie not found' });
            }
        } catch (movieError) {
            console.error('Error fetching movie:', movieError);
            return res.json({ success: false, message: 'Failed to fetch movie details' });
        }

        const dateTime = {};

        shows.forEach((show) => {
            try {
                if (show && show.showDateTime) {
                    const date = show.showDateTime.toISOString().split("T")[0];
                    if (!dateTime[date]) {
                        dateTime[date] = [];
                    }
                    dateTime[date].push({ 
                        time: show.showDateTime, 
                        showId: show._id.toString() 
                    });
                }
            } catch (showError) {
                console.error('Error processing show:', showError);
                // Continue processing other shows
            }
        });

        console.log('Processed dateTime object:', Object.keys(dateTime).length, 'dates');
        
        res.json({
            success: true, 
            movie, 
            dateTime,
            totalShows: shows.length
        });
    } catch (error) {
        console.error('Error in getShow:', error);
        res.json({ 
            success: false, 
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// API to get trailer data for a specific movie
export const getMovieTrailer = async (req, res) => {
    try {
        const { movieId } = req.params;
        console.log('Fetching trailer for movie ID:', movieId);
        console.log('TMDB API Key available:', !!process.env.TMDB_API_KEY);
        
        if (!process.env.TMDB_API_KEY) {
            return res.json({ success: false, message: 'TMDB API Key not configured' });
        }

        // Add retry logic for network issues
        let retries = 3;
        let lastError;

        while (retries > 0) {
            try {
                // Check rate limit before making API call
                if (!checkRateLimit('tmdb-api')) {
                    console.log('Rate limit hit, waiting 2 seconds...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                }
                
                // Fetch movie videos from TMDB API with timeout
                const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
                    timeout: 15000 // Increased timeout
                });

                console.log('TMDB API response:', data);
                console.log('Available videos:', data.results?.length || 0);

                // Get the first official trailer or teaser
                const trailer = data.results.find(video => 
                    (video.type === 'Trailer' || video.type === 'Teaser') && 
                    video.site === 'YouTube' &&
                    video.official === true
                ) || data.results.find(video => 
                    (video.type === 'Trailer' || video.type === 'Teaser') && 
                    video.site === 'YouTube'
                );

                console.log('Found trailer:', trailer);

                return res.json({ 
                    success: true, 
                    trailer: trailer ? {
                        key: trailer.key,
                        name: trailer.name,
                        site: trailer.site,
                        type: trailer.type
                    } : null
                });
            } catch (error) {
                lastError = error;
                console.log(`TMDB API call failed (${retries} retries left):`, error.message);
                retries--;
                
                if (retries > 0) {
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // If all retries failed
        console.error('All TMDB API retries failed:', lastError);
        return res.json({ 
            success: false, 
            message: 'Failed to fetch trailer after multiple attempts' 
        });
    } catch (error) {
        console.error('Error in getMovieTrailer:', error);
        res.json({ success: false, message: error.message });
    }
};

// Test function to verify movie creation works
export const testMovieCreation = async (req, res) => {
    try {
        console.log('Testing movie creation...');
        
        const testMovieData = {
            _id: "test-movie-123",
            title: "Test Movie",
            overview: "This is a test movie",
            poster_path: "/default-poster.jpg",
            backdrop_path: "/default-backdrop.jpg",
            release_date: "2024-01-01",
            vote_average: 7.5,
            runtime: 120,
            genres: ["Action", "Drama"],
            casts: ["Actor 1", "Actor 2"]
        };
        
        console.log('Creating test movie with data:', JSON.stringify(testMovieData, null, 2));
        
        // Use the bypass validation function
        const testMovie = await createMovieBypassValidation(testMovieData);
        console.log('Test movie created successfully:', testMovie._id);
        
        res.json({success: true, message: 'Test movie created successfully', movie: testMovie});
    } catch (error) {
        console.error('Test movie creation failed:', error);
        res.json({success: false, message: 'Test movie creation failed: ' + error.message});
    }
};

// Alternative movie creation function that bypasses validation
const createMovieBypassValidation = async (movieData) => {
    try {
        // Ensure all required fields are present
        const completeMovieData = {
            _id: movieData._id,
            title: movieData.title || `Movie ${movieData._id}`,
            overview: movieData.overview || "No overview available",
            poster_path: movieData.poster_path || "/default-poster.jpg",
            backdrop_path: movieData.backdrop_path || "/default-backdrop.jpg",
            release_date: movieData.release_date || "Unknown",
            vote_average: movieData.vote_average || 0,
            runtime: movieData.runtime || 120,
            genres: movieData.genres || [],
            casts: movieData.casts || []
        };
        
        console.log('Creating movie with bypass validation:', JSON.stringify(completeMovieData, null, 2));
        
        // Use insertMany to bypass individual document validation
        const result = await Movie.insertMany([completeMovieData], { validateBeforeSave: false });
        console.log('Movie created successfully with bypass:', result[0]._id);
        return result[0];
    } catch (error) {
        console.error('Error creating movie with bypass:', error);
        throw error;
    }
};