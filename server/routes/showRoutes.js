import express from "express";
import { addShow, getNowPlayingMovies, getShow, getShows, getMovieTrailer } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

// Specific routes first
showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.get("/all", getShows)

// Parameterized routes last
showRouter.get("/:movieId", getShow)
showRouter.get("/:movieId/trailer", getMovieTrailer)
showRouter.post('/add', protectAdmin, addShow)

export default showRouter;