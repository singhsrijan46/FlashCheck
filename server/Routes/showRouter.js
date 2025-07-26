import express from 'express';
import { addShow, getNowPlayingMovies, getShow, getShows } from '../Controllers/showController.js';
import { protectAdmin } from "../Middlewares/auth.js";

const showRouter = express.Router();

showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.get('/add', protectAdmin, addShow)
showRouter.get('/all', getShows)
showRouter.get('/:movieId', getShow)

export default showRouter;