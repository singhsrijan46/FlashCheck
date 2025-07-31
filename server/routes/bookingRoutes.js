import express from "express";
import { protect } from "../middleware/auth.js";
import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post('/create', protect, createBooking)
bookingRouter.get('/occupied-seats/:movieId/:date', getOccupiedSeats)

export default bookingRouter;