import express from "express";
import { addShow, getNowPlayingMovies, getShow, getShowByMovieId, getShows, getMovieTrailer, searchMovies, getPopularMovies, getMoviesByCity, getShowsByMovieAndCity, getSpecificShow } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

// Specific routes first (most specific to least specific)
showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.get('/now-playing-public', getNowPlayingMovies) // Public route for testing
showRouter.get('/city/:city', getMoviesByCity) // Get movies by city
showRouter.get("/all", getShows)
showRouter.get("/search", searchMovies)
showRouter.get("/popular", getPopularMovies)
showRouter.get("/specific/:showtimeId", getSpecificShow) // Get specific showtime by ID - MUST come before /:movieId

// Parameterized routes last (least specific)
showRouter.get("/:movieId", getShowByMovieId) // Get show by movie ID
showRouter.get("/:movieId/city/:city", getShowsByMovieAndCity) // Get shows by movie ID and city
showRouter.get("/:movieId/trailer", getMovieTrailer)
showRouter.post("/add", protectAdmin, addShow)

export default showRouter;