import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import mongoose from "mongoose";

const checkSeatsAvailability = async (movieId, date, selectedSeats) => {
    try {
        const allShowsForMovie = await Show.find({ movie: movieId.toString() });
        
        const showData = await Show.findOne({
            movie: movieId.toString(),
            showDateTime: {
                $gte: new Date(date + 'T00:00:00.000Z'),
                $lt: new Date(date + 'T23:59:59.999Z')
            }
        });
        
        if (!showData) {
            return false;
        }
        
        if (!showData.occupiedSeats || typeof showData.occupiedSeats !== 'object') {
            showData.occupiedSeats = {};
        }
        
        if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            return false;
        }
        
        const isAnySeatTaken = selectedSeats.some(seat => showData.occupiedSeats[seat]);
        return !isAnySeatTaken;
    } catch (error) {
        console.error('checkSeatsAvailability error:', error.message);
        return false;
    }
}

export const createBooking = async (req, res)=>{
    try {
        const userId = req.user._id;
        const {movieId, date, selectedSeats} = req.body;

        const isAvailable = await checkSeatsAvailability(movieId, date, selectedSeats)

        if(!isAvailable){
            return res.json({success: false, message: "Selected Seats are not available."})
        }

        const showData = await Show.findOne({
            movie: movieId.toString(),
            showDateTime: {
                $gte: new Date(date + 'T00:00:00.000Z'),
                $lt: new Date(date + 'T23:59:59.999Z')
            }
        }).populate('movie');

        // Calculate total amount based on seat prices
        const calculateSeatPrice = (seatId) => {
            const rowLetter = seatId.charAt(0);
            const silverRows = ['A', 'B', 'C'];
            const goldRows = ['D', 'E', 'F', 'G'];
            const diamondRows = ['H', 'I', 'J', 'K'];
            
            if (silverRows.includes(rowLetter)) {
                return showData.silverPrice;
            } else if (goldRows.includes(rowLetter)) {
                return showData.goldPrice;
            } else if (diamondRows.includes(rowLetter)) {
                return showData.diamondPrice;
            }
            return showData.silverPrice; // fallback
        };

        const totalAmount = selectedSeats.reduce((total, seatId) => {
            return total + calculateSeatPrice(seatId);
        }, 0);

        const booking = await Booking.create({
            user: userId,
            show: showData._id,
            amount: totalAmount,
            bookedSeats: selectedSeats,
            isPaid: true
        })

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');
        await showData.save();

        res.json({success: true, message: 'Booking created successfully', bookingId: booking._id})

    } catch (error) {
        console.error('Error in createBooking:', error.message);
        res.json({success: false, message: error.message})
    }
}

export const getOccupiedSeats = async (req, res)=>{
    try {
        const {movieId, date} = req.params;

        const showData = await Show.findOne({
            movie: movieId.toString(),
            showDateTime: {
                $gte: new Date(date + 'T00:00:00.000Z'),
                $lt: new Date(date + 'T23:59:59.999Z')
            }
        });

        if (!showData) {
            return res.json({success: false, message: "Show not found"});
        }

        res.json({success: true, occupiedSeats: showData.occupiedSeats || {}})

    } catch (error) {
        console.error('Error in getOccupiedSeats:', error.message);
        res.json({success: false, message: error.message})
    }
}