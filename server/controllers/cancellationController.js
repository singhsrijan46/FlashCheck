import { createRefund } from '../services/stripeService.js';
import { sendCancellationEmail } from '../services/emailService.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import User from '../models/User.js';
import Movie from '../models/Movie.js';

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user._id;

        // console.log('🔍 Cancelling booking:', bookingId, 'for user:', userId);

        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user owns this booking
        if (booking.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only cancel your own bookings'
            });
        }

        // Check if booking is already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        // Check if show time has passed (can't cancel past shows)
        const show = await Show.findById(booking.show);
        if (!show) {
            return res.status(404).json({
                success: false,
                message: 'Show not found'
            });
        }

        const now = new Date();
        const showTime = new Date(show.showDateTime);
        
        if (showTime < now) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel booking for a show that has already started'
            });
        }

        // Get movie details
        const movie = await Movie.findById(show.movie);
        if (!movie) {
            // console.error('❌ Movie not found:', show.movie);
        }

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            // console.error('❌ User not found:', userId);
        }

        // Process refund if payment was made
        let refundResult = null;
        if (booking.isPaid && booking.paymentIntentId) {
            try {
                refundResult = await createRefund(booking.paymentIntentId, booking.amount);
                
                if (!refundResult.success) {
                    // console.error('❌ Refund failed:', refundResult.error);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to process refund',
                        error: refundResult.error
                    });
                }
                
                // console.log('✅ Refund processed successfully:', refundResult.refundId);
            } catch (refundError) {
                // console.error('❌ Error processing refund:', refundError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to process refund',
                    error: refundError.message
                });
            }
        }

        // Update booking status
        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        booking.refundAmount = booking.amount;
        booking.refunded = true;
        if (refundResult) {
            booking.refundId = refundResult.refundId;
        }
        
        await booking.save();

        // Free up the seats in the show
        booking.bookedSeats.forEach(seat => {
            const seatOccupiedBy = show.occupiedSeats[seat];
            
            // Check if the seat is occupied by this user
            if (seatOccupiedBy && (seatOccupiedBy.toString() === userId.toString() || seatOccupiedBy === userId)) {
                delete show.occupiedSeats[seat];
            }
        });

        show.markModified('occupiedSeats');
        await show.save();

        // console.log('✅ Booking cancelled successfully:', bookingId);

        // Send cancellation email
        if (user && user.email) {
            try {
                const emailData = {
                    userName: user.name || user.email.split('@')[0],
                    userEmail: user.email,
                    movieTitle: movie?.title || 'Unknown Movie',
                    theatreName: show.theatre?.name || 'Unknown Theatre',
                    screen: show.screen,
                    format: show.format,
                    showDateTime: show.showDateTime,
                    bookedSeats: booking.bookedSeats,
                    amount: booking.amount,
                    bookingId: booking._id,
                    refundAmount: booking.refundAmount,
                    refundId: booking.refundId
                };

                const emailResult = await sendCancellationEmail(emailData);
                
                if (emailResult.success) {
                    // console.log('✅ Cancellation email sent successfully');
                } else {
                    // console.log('⚠️ Cancellation email not sent:', emailResult.message);
                }
            } catch (emailError) {
                // console.error('❌ Error sending cancellation email:', emailError);
                // Don't fail the cancellation if email fails
            }
        }

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            bookingId: booking._id,
            refundAmount: booking.refundAmount,
            refundId: booking.refundId
        });

    } catch (error) {
        // console.error('❌ Error cancelling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getCancellationPolicy = async (req, res) => {
    try {
        const policy = {
            canCancel: true,
            cancellationWindow: '2 hours before show time',
            refundPolicy: 'Full refund for cancellations made at least 2 hours before show time',
            restrictions: [
                'Cannot cancel bookings for shows that have already started',
                'Cannot cancel bookings that are already cancelled',
                'Only the booking owner can cancel their own bookings'
            ]
        };

        res.json({
            success: true,
            policy
        });

    } catch (error) {
        // console.error('❌ Error getting cancellation policy:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user._id;

        const bookings = await Booking.find({ user: userId })
            .populate('show')
            .sort({ createdAt: -1 });

        // Populate movie and theatre data for each booking
        const bookingsWithDetails = await Promise.all(
            bookings.map(async (booking) => {
                const show = booking.show;
                if (!show) return booking.toObject();

                const movie = await Movie.findById(show.movie);
                const theatre = await Show.findById(show._id).populate('theatre');

                return {
                    ...booking.toObject(),
                    movie: movie,
                    theatre: theatre?.theatre
                };
            })
        );

        res.json({
            success: true,
            bookings: bookingsWithDetails
        });

    } catch (error) {
        // console.error('❌ Error getting user bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}; 