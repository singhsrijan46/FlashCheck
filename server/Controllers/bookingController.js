import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import stripe from "stripe";
import mongoose from "mongoose";

const checkSeatsAvailability = async (movieId, date, selectedSeats) => {
    try {
        console.log('checkSeatsAvailability - movieId:', movieId, 'date:', date, 'type:', typeof movieId);
        
        // Debug: Check all shows for this movie
        const allShowsForMovie = await Show.find({ movie: movieId.toString() });
        console.log('All shows for movieId', movieId, ':', allShowsForMovie.length);
        allShowsForMovie.forEach(show => {
            console.log('Show:', show._id, 'Movie:', show.movie, 'DateTime:', show.showDateTime);
        });
        
        // Find the specific show for this movie and date
        // Use movieId as string since it's from TMDB (numeric ID)
        const showData = await Show.findOne({
            movie: movieId.toString(),
            showDateTime: {
                $gte: new Date(date + 'T00:00:00.000Z'),
                $lt: new Date(date + 'T23:59:59.999Z')
            }
        });
        
        if (!showData) {
            console.log('No show found for movieId:', movieId, 'date:', date);
            return false;
        }
        
        console.log('checkSeatsAvailability - found show:', showData._id);
        
        // Defensive: ensure occupiedSeats is always an object
        if (!showData.occupiedSeats || typeof showData.occupiedSeats !== 'object') {
            showData.occupiedSeats = {};
        }
        // Defensive: ensure selectedSeats is an array
        if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            console.log('selectedSeats is not a valid array:', selectedSeats);
            return false;
        }
        // Debug log
        console.log('Checking seats:', selectedSeats, 'Occupied:', showData.occupiedSeats);
        const isAnySeatTaken = selectedSeats.some(seat => showData.occupiedSeats[seat]);
        return !isAnySeatTaken;
    } catch (error) {
        console.log('checkSeatsAvailability error:', error.message);
        return false;
    }
}

export const createBooking = async (req, res)=>{
    try {
        const userId = req.user._id;
        const {movieId, date, selectedSeats} = req.body;
        const { origin } = req.headers;

        console.log('createBooking - movieId:', movieId, 'date:', date, 'type:', typeof movieId);

        // Check if the seat is available for the selected show
        const isAvailable = await checkSeatsAvailability(movieId, date, selectedSeats)

        if(!isAvailable){
            return res.json({success: false, message: "Selected Seats are not available."})
        }

        // Get the show details
        const showData = await Show.findOne({
            movie: movieId.toString(),
            showDateTime: {
                $gte: new Date(date + 'T00:00:00.000Z'),
                $lt: new Date(date + 'T23:59:59.999Z')
            }
        }).populate('movie');

        // Create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showData._id,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save();

         // Stripe Gateway Initialize
         console.log('STRIPE_SECRET_KEY configured:', !!process.env.STRIPE_SECRET_KEY);
         console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length);
         const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

         // Check if Stripe key is configured
         if (!process.env.STRIPE_SECRET_KEY) {
             console.error('STRIPE_SECRET_KEY not configured');
             return res.json({success: false, message: 'Payment gateway not configured'});
         }

         // Creating line items to for Stripe
         const line_items = [{
            price_data: {
                currency: 'usd',
                product_data:{
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1
         }]

         try {
            const session = await stripeInstance.checkout.sessions.create({
                success_url: `${origin}/loading/my-bookings`,
                cancel_url: `${origin}/my-bookings`,
                line_items: line_items,
                mode: 'payment',
                metadata: {
                    bookingId: booking._id.toString()
                },
                expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
            })

            booking.paymentLink = session.url
            await booking.save()

            res.json({success: true, url: session.url})
         } catch (stripeError) {
            console.error('Stripe session creation error:', stripeError.message);
            res.json({success: false, message: 'Failed to create payment session.'});
         }

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export const getOccupiedSeats = async (req, res)=>{
    try {
        
        const {movieId, date} = req.params;
        console.log('getOccupiedSeats - movieId:', movieId, 'date:', date, 'type:', typeof movieId);
        
        // Find the specific show for this movie and date
        const showData = await Show.findOne({
            movie: movieId.toString(),
            showDateTime: {
                $gte: new Date(date + 'T00:00:00.000Z'),
                $lt: new Date(date + 'T23:59:59.999Z')
            }
        });
        
        if (!showData) {
            console.log('No show found for movieId:', movieId, 'date:', date);
            return res.json({success: false, message: 'No show found for this movie and date'});
        }
        
        console.log('getOccupiedSeats - found show:', showData._id);
        const occupiedSeats = Object.keys(showData.occupiedSeats || {});

        res.json({success: true, occupiedSeats})

    } catch (error) {
        console.log('getOccupiedSeats error:', error.message);
        res.json({success: false, message: error.message})
    }
}