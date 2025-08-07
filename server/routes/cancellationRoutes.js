import express from 'express';
import { cancelBooking, getCancellationPolicy, getUserBookings } from '../controllers/cancellationController.js';
import { protect } from '../middleware/auth.js';

const cancellationRouter = express.Router();

// Get cancellation policy
cancellationRouter.get('/policy', getCancellationPolicy);

// Get user's bookings (for cancellation page)
cancellationRouter.get('/bookings', protect, getUserBookings);

// Cancel a booking
cancellationRouter.post('/cancel/:bookingId', protect, cancelBooking);

export default cancellationRouter; 