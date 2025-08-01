import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
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
            bookedSeats: selectedSeats,
            isPaid: true // Set as paid since no payment gateway
        })

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save();

        // Return success without payment processing
        res.json({success: true, message: 'Booking created successfully', bookingId: booking._id})

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