import express from "express";
import { addShow, getNowPlayingMovies, getShow, getShowByMovieId, getShows, getMovieTrailer, searchMovies, getPopularMovies } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

// Specific routes first
showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.get('/now-playing-public', getNowPlayingMovies) // Public route for testing
showRouter.get("/all", getShows)
showRouter.get("/search", searchMovies)
showRouter.get("/popular", getPopularMovies)

// Parameterized routes last
showRouter.get("/:movieId", getShowByMovieId) // Get show by movie ID
showRouter.get("/:movieId/trailer", getMovieTrailer)
showRouter.post("/add", protectAdmin, addShow)

export default showRouter;