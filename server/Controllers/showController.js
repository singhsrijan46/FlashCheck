import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res)=>{
    try {
        // Get all shows from database and populate movie details
        const shows = await Show.find({ showDateTime: { $gte: new Date() } })
            .populate('movie')
            .sort({ showDateTime: 1 });

        // Get unique movies from shows
        const uniqueMovies = [];
        const seenMovieIds = new Set();
        
        shows.forEach(show => {
            if (show.movie && !seenMovieIds.has(show.movie._id.toString())) {
                seenMovieIds.add(show.movie._id.toString());
                uniqueMovies.push(show.movie);
            }
        });

        console.log('Found movies with shows:', uniqueMovies.length);
        res.json({success: true, movies: uniqueMovies})
    } catch (error) {
        console.error('Error fetching now playing movies:', error);
        res.json({success: false, message: error.message})
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
                // Fetch movie details, credits, and videos from TMDB API
                const [movieDetailsResponse, movieCreditsResponse, movieVideosResponse] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                        timeout: 10000
                    }),

                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                        timeout: 10000
                    }),

                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                        timeout: 10000
                    })
                ]);

                console.log('TMDB API calls successful');
                const movieApiData = movieDetailsResponse.data;
                const movieCreditsData = movieCreditsResponse.data;
                const movieVideosData = movieVideosResponse.data;
                
                console.log('TMDB API responses received');

                // Get the first official trailer or teaser
                const trailer = movieVideosData.results.find(video => 
                    (video.type === 'Trailer' || video.type === 'Teaser') && 
                    video.site === 'YouTube' &&
                    video.official === true
                ) || movieVideosData.results.find(video => 
                    (video.type === 'Trailer' || video.type === 'Teaser') && 
                    video.site === 'YouTube'
                );

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
                        key: trailer.key,
                        name: trailer.name,
                        site: trailer.site,
                        type: trailer.type
                    } : null
                 }

                 console.log('Creating movie in database...');
                 // Add movie to the database
                 movie = await Movie.create(movieDetails);
                 console.log('Movie created successfully:', movie._id);
            } catch (error) {
                console.error('Error fetching from TMDB API:', error);
                console.error('Error details:', error.response?.data || error.message);
                return res.json({success: false, message: 'Failed to fetch movie data from TMDB API: ' + error.message});
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
                
                showsToCreate.push({
                    movie: movieId.toString(),
                    showDateTime: parsedDate,
                    showPrice,
                    occupiedSeats: {}
                })
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
                return res.json({success: false, message: 'Failed to create shows in database: ' + error.message});
            }
        } else {
            console.log('No shows to create');
            return res.json({success: false, message: 'No valid shows to create'});
        }

         //  Trigger Inngest event
         await inngest.send({
            name: "app/show.added",
             data: {movieTitle: movie.title}
         })

        console.log('=== ADD SHOW COMPLETED SUCCESSFULLY ===');
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
        console.log('Fetching all shows...');
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({ showDateTime: 1 });
        console.log('Total shows found:', shows.length);

        // filter unique movies by _id
        const uniqueMovies = [];
        const seenMovieIds = new Set();
        
        shows.forEach(show => {
            if (show.movie && !seenMovieIds.has(show.movie._id.toString())) {
                seenMovieIds.add(show.movie._id.toString());
                uniqueMovies.push(show.movie);
            }
        });

        console.log('Unique movies with shows:', uniqueMovies.length);
        res.json({success: true, shows: uniqueMovies})
    } catch (error) {
        console.error('Error fetching shows:', error);
        res.json({ success: false, message: error.message });
    }
}

// API to get a single show from the database
export const getShow = async (req, res) =>{
    try {
        const {movieId} = req.params;
        // get all upcoming shows for the movie
        const shows = await Show.find({movie: movieId, showDateTime: { $gte: new Date() }})

        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })

        res.json({success: true, movie, dateTime})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get trailer data for a specific movie
export const getMovieTrailer = async (req, res) => {
    try {
        const { movieId } = req.params;
        console.log('Fetching trailer for movie ID:', movieId);
        console.log('TMDB API Key available:', !!process.env.TMDB_API_KEY);
        
        // Fetch movie videos from TMDB API
        const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
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

        res.json({ 
            success: true, 
            trailer: trailer ? {
                key: trailer.key,
                name: trailer.name,
                site: trailer.site,
                type: trailer.type
            } : null
        });
    } catch (error) {
        console.error('Error in getMovieTrailer:', error);
        res.json({ success: false, message: error.message });
    }
};