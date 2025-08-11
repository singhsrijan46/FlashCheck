import { createPaymentIntent, confirmPayment, createCheckoutSession } from '../services/stripeService.js';
import { sendBookingConfirmationEmail } from '../services/emailService.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import stripe from '../services/stripeService.js';

export const createPayment = async (req, res) => {
    try {
        const { showId, selectedSeats, amount } = req.body;
        const userId = req.user._id;

        // console.log('🔍 Creating payment for:', { showId, selectedSeats, amount, userId });

        // Validate required fields
        if (!showId || !selectedSeats || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Show ID, selected seats, and amount are required'
            });
        }

        // Validate that the show exists
        const show = await Show.findById(showId).populate('theatre');
        if (!show) {
            return res.status(404).json({
                success: false,
                message: 'Show not found'
            });
        }

        // Get movie details separately since movie ID is a string
        const movie = await Movie.findById(show.movie);
        if (!movie) {
            // console.error('❌ Movie not found:', show.movie);
        }

        // Check seat availability
        const isAnySeatTaken = selectedSeats.some(seat => show.occupiedSeats[seat]);
        if (isAnySeatTaken) {
            return res.status(400).json({
                success: false,
                message: 'Some selected seats are already booked'
            });
        }

        // Create metadata for Stripe
        const metadata = {
            userId: userId.toString(),
            showId: showId,
            selectedSeats: selectedSeats.join(','),
            movieTitle: movie?.title || 'Unknown Movie',
            theatreName: show.theatre?.name || 'Unknown Theatre',
            showDateTime: show.showDateTime.toISOString(),
            screen: show.screen,
            format: show.format
        };

        // Create payment intent
        const paymentResult = await createPaymentIntent(amount, 'usd', metadata);

        if (!paymentResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create payment intent',
                error: paymentResult.error
            });
        }

        // console.log('✅ Payment intent created:', paymentResult.paymentIntentId);

        res.json({
            success: true,
            clientSecret: paymentResult.clientSecret,
            paymentIntentId: paymentResult.paymentIntentId,
            message: 'Payment intent created successfully'
        });

    } catch (error) {
        // console.error('❌ Error creating payment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const confirmPaymentAndBook = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        const userId = req.user._id;

        // console.log('🔍 Confirming payment:', paymentIntentId);

        // Confirm payment with Stripe
        const paymentResult = await confirmPayment(paymentIntentId);

        if (!paymentResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Payment confirmation failed',
                error: paymentResult.error
            });
        }

        const paymentIntent = paymentResult.paymentIntent;

        // Check if payment was successful
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment was not successful',
                status: paymentIntent.status
            });
        }

        // Extract booking details from metadata
        const { showId, selectedSeats } = paymentIntent.metadata;
        const amount = paymentIntent.amount / 100; // Convert from cents

        // console.log('🔍 Creating booking from payment:', { showId, selectedSeats, amount });

        // Get the show with populated theatre data
        const show = await Show.findById(showId).populate('theatre');
        if (!show) {
            return res.status(404).json({
                success: false,
                message: 'Show not found'
            });
        }

        // Get movie details separately since movie ID is a string
        const movie = await Movie.findById(show.movie);
        if (!movie) {
            // console.error('❌ Movie not found:', show.movie);
        }

        // Parse selected seats
        const seatsArray = selectedSeats.split(',');

        // Check seat availability again (in case seats were booked during payment)
        const isAnySeatTaken = seatsArray.some(seat => show.occupiedSeats[seat]);
        if (isAnySeatTaken) {
            return res.status(400).json({
                success: false,
                message: 'Some selected seats are no longer available'
            });
        }

        // Get user details for email
        const user = await User.findById(userId);
        if (!user) {
            // console.error('❌ User not found for email:', userId);
        }

        // Create the booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: amount,
            bookedSeats: seatsArray,
            isPaid: true,
            paymentIntentId: paymentIntentId,
            paymentStatus: 'succeeded'
        });

        // Update show with occupied seats
        seatsArray.forEach(seat => {
            show.occupiedSeats[seat] = userId;
        });

        show.markModified('occupiedSeats');
        await show.save();

        // console.log('✅ Booking created successfully:', booking._id);

        // Send confirmation email
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
                    bookedSeats: seatsArray,
                    amount: amount,
                    bookingId: booking._id,
                    paymentStatus: 'succeeded'
                };

                const emailResult = await sendBookingConfirmationEmail(emailData);
                
                if (emailResult.success) {
                    // console.log('✅ Booking confirmation email sent successfully');
                } else {
                    // console.log('⚠️ Email not sent:', emailResult.message);
                }
            } catch (emailError) {
                // console.error('❌ Error sending confirmation email:', emailError);
                // Don't fail the booking if email fails
            }
        } else {
            // console.log('⚠️ No user email found, skipping confirmation email');
        }

        res.json({
            success: true,
            bookingId: booking._id,
            message: 'Payment successful and booking created'
        });

    } catch (error) {
        // console.error('❌ Error confirming payment and booking:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getPaymentStatus = async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        const paymentResult = await confirmPayment(paymentIntentId);

        if (!paymentResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Failed to get payment status',
                error: paymentResult.error
            });
        }

        res.json({
            success: true,
            status: paymentResult.paymentIntent.status,
            amount: paymentResult.paymentIntent.amount / 100,
            currency: paymentResult.paymentIntent.currency
        });

    } catch (error) {
        // console.error('❌ Error getting payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}; 

export const createCheckoutSessionController = async (req, res) => {
    try {
        const { showId, selectedSeats, amount } = req.body;
        const userId = req.user._id;

    

        // Validate required fields
        if (!showId || !selectedSeats || !amount) {
    
            return res.status(400).json({
                success: false,
                message: 'Show ID, selected seats, and amount are required'
            });
        }

        // Validate that the show exists
        const show = await Show.findById(showId).populate('theatre');
        if (!show) {
    
            return res.status(404).json({
                success: false,
                message: 'Show not found'
            });
        }

        // Get movie details separately since movie ID is a string
        const movie = await Movie.findById(show.movie);
        if (!movie) {
    
        }

        // Check seat availability
        const isAnySeatTaken = selectedSeats.some(seat => show.occupiedSeats[seat]);
        if (isAnySeatTaken) {
    
            return res.status(400).json({
                success: false,
                message: 'Some selected seats are already booked'
            });
        }

        // Create metadata for Stripe
        const metadata = {
            userId: userId.toString(),
            showId: showId,
            selectedSeats: selectedSeats.join(','),
            movieTitle: movie?.title || 'Unknown Movie',
            theatreName: show.theatre?.name || 'Unknown Theatre',
            showDateTime: show.showDateTime.toISOString(),
            screen: show.screen,
            format: show.format
        };



        // Create success and cancel URLs
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const successUrl = `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${baseUrl}/seat-layout/${showId}`;



        // Create checkout session
        const checkoutResult = await createCheckoutSession(amount, 'usd', metadata, successUrl, cancelUrl);



        if (!checkoutResult.success) {

            return res.status(500).json({
                success: false,
                message: 'Failed to create checkout session',
                error: checkoutResult.error
            });
        }



        res.json({
            success: true,
            sessionId: checkoutResult.sessionId,
            url: checkoutResult.url,
            message: 'Checkout session created successfully'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}; 

export const confirmCheckoutSession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const userId = req.user._id;

        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Checkout session not found'
            });
        }

        // Check if payment was successful
        if (session.payment_status !== 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Payment was not successful',
                status: session.payment_status
            });
        }

        // Extract booking details from metadata
        const { showId, selectedSeats } = session.metadata;
        const amount = session.amount_total / 100; // Convert from cents

        // Get the show with populated theatre data
        const show = await Show.findById(showId).populate('theatre');
        if (!show) {
            return res.status(404).json({
                success: false,
                message: 'Show not found'
            });
        }

        // Get movie details separately since movie ID is a string
        const movie = await Movie.findById(show.movie);
        if (!movie) {
            // console.error('❌ Movie not found:', show.movie);
        }

        // Parse selected seats
        const seatsArray = selectedSeats.split(',');

        // Check seat availability again (in case seats were booked during payment)
        const isAnySeatTaken = seatsArray.some(seat => show.occupiedSeats[seat]);
        if (isAnySeatTaken) {
            return res.status(400).json({
                success: false,
                message: 'Some selected seats are already booked'
            });
        }

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Create the booking
        const booking = new Booking({
            user: userId,
            show: showId,
            movie: show.movie,
            theatre: show.theatre._id,
            bookedSeats: seatsArray,
            amount: amount,
            paymentStatus: 'succeeded',
            paymentMethod: 'stripe',
            paymentIntentId: session.payment_intent,
            bookingDate: new Date(),
            showDateTime: show.showDateTime,
            screen: show.screen,
            format: show.format
        });

        await booking.save();

        // Update show's occupied seats
        seatsArray.forEach(seat => {
            show.occupiedSeats[seat] = true;
        });
        await show.save();

        // Send confirmation email
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
                    bookedSeats: seatsArray,
                    amount: amount,
                    bookingId: booking._id,
                    paymentStatus: 'succeeded'
                };

                const emailResult = await sendBookingConfirmationEmail(emailData);
                
                if (emailResult.success) {
                    // console.log('✅ Booking confirmation email sent successfully');
                } else {
                    // console.log('⚠️ Email not sent:', emailResult.message);
                }
            } catch (emailError) {
                // console.error('❌ Error sending confirmation email:', emailError);
                // Don't fail the booking if email fails
            }
        }

        // Prepare booking details for response
        const bookingResponse = {
            _id: booking._id,
            movieTitle: movie?.title || 'Unknown Movie',
            theatreName: show.theatre?.name || 'Unknown Theatre',
            screen: show.screen,
            format: show.format,
            showDateTime: show.showDateTime,
            bookedSeats: seatsArray,
            amount: amount,
            paymentStatus: 'succeeded'
        };

        res.json({
            success: true,
            booking: bookingResponse,
            message: 'Payment successful and booking created'
        });

    } catch (error) {
        // console.error('❌ Error confirming checkout session:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}; 