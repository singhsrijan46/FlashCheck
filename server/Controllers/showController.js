import axios from 'axios';
import movieModel from '../Models/Movie.js';
import showModel from '../Models/User.js';

//API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res) => {
    try{
        const { data } = await axios.get('', {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
        })
        const movies = data.results;
        res.json({success: true, movies: movies})
    } catch(error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

//API to add a new show to the database
export const addShow = async (req, res) => {
    try{
        const { movieId, showsInput, showPrice } = req.body;

        let movie = await Movie.findById(movieId)

        if(!movie) {
            //Fetch movie details and credits from TMDB API
            const [ movieDetailsResponse, movieCreditsResponse ] = await Promise.all([
                axios.get('', {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
                }),
                axios.get('', {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
                })
            ])
            const movieApiData = movieDetailsResponse.data;
            const movieCreditData = movieCreditsResponse.data;

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieApiData.cast,
                release_data: movieApiData.release_data,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                runtime: movieApiData.runtime
            }
                
            //Add movie to the database
            movie = await movieModel.create(movieDetails);
        }

        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time) => {
                const dataTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        });

        if(showsToCreate.length > 0){
            await showModel.insertMany(showsToCreate);
        }
        res.json({success: true, message: 'Show added successfully'})
    } catch(error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

//API to get all show from the database
export const getShows = async (req, res) => {
    try{
        const shows = await showModel.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime: 1});

        //filter unique shows
        const uniqueShows = new Set(shows.map(show => show.movie))

        res.json({success: true, shows: Array.from(uniqueShows)})
    } catch(error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

//API to get a single show from the database
export const getShow = async (req, res) => {
    try {
        const {movieId} = req.params;

        //get all upcoming shows for the movie
        const shows = await showModel.find({movie: movieId, showDateTime: { $gte: new Date() }})

        const movie = await movieModel.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]) {
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })

        res.json({ success: true, movie, dataTime})
    } catch(error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}