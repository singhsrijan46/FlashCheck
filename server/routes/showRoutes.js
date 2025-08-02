import express from "express";
import { addShow, getNowPlayingMovies, getShow, getShows, getMovieTrailer, debugMovies, updateMovieWithCompleteData, testTMDBAPI, checkEnvironment, searchMovies, getPopularMovies, debugShows } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

// Specific routes first
showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.get('/now-playing-public', getNowPlayingMovies) // Public route for testing
showRouter.get("/all", getShows)
showRouter.get("/debug", debugMovies)
showRouter.get("/debug-shows", debugShows)
showRouter.get("/test-tmdb", testTMDBAPI)
showRouter.get("/check-env", checkEnvironment)
showRouter.get("/search", searchMovies)
showRouter.get("/popular", getPopularMovies)
showRouter.put("/update-movie/:movieId", protectAdmin, updateMovieWithCompleteData)

// Parameterized routes last
showRouter.get("/:movieId", getShow)
showRouter.get("/:movieId/trailer", getMovieTrailer)
showRouter.post('/add', protectAdmin, addShow)

export default showRouter;