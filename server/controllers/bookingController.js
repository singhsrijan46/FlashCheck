import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import mongoose from "mongoose";

const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {

        
        const showData = await Show.findById(showId);
        
        if (!showData) {
            // console.log('❌ Show not found');
            return false;
        }
        
        if (!showData.occupiedSeats || typeof showData.occupiedSeats !== 'object') {
            showData.occupiedSeats = {};
        }
        
        // console.log('🔍 Current occupied seats:', Object.keys(showData.occupiedSeats));
        
        if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            // console.log('❌ Invalid selected seats');
            return false;
        }
        
        const isAnySeatTaken = selectedSeats.some(seat => showData.occupiedSeats[seat]);
        // console.log('🔍 Is any seat taken?', isAnySeatTaken);
        
        const result = !isAnySeatTaken;
        // console.log('🔍 Seats available?', result);
        
        return result;
    } catch (error) {
        // console.error('❌ checkSeatsAvailability error:', error.message);
        return false;
    }
}

export const createBooking = async (req, res)=>{
    try {
        const userId = req.user._id;
        const {showId, selectedSeats} = req.body;

        // console.log('🔍 Creating booking for user:', userId);
        // console.log('🔍 Show ID:', showId);
        // console.log('🔍 Selected seats:', selectedSeats);

        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)
        // console.log('🔍 Are seats available?', isAvailable);

        if(!isAvailable){
            // console.log('❌ Seats are not available');
            return res.json({success: false, message: "Selected Seats are not available."})
        }

        const showData = await Show.findById(showId).populate('movie');

        if (!showData) {
            // console.log('❌ Show not found');
            return res.json({success: false, message: "Show not found"});
        }

        // console.log('🔍 Show data found:', showData.movie?.title);

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

        // console.log('🔍 Total amount:', totalAmount);

        const booking = await Booking.create({
            user: userId,
            show: showData._id,
            amount: totalAmount,
            bookedSeats: selectedSeats,
            isPaid: true
        })

        // console.log('🔍 Booking created:', booking._id);

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');
        await showData.save();

        // console.log('🔍 Show updated with occupied seats');

        res.json({success: true, message: 'Booking created successfully', bookingId: booking._id})

    } catch (error) {
        // console.error('❌ Error in createBooking:', error.message);
        res.json({success: false, message: error.message})
    }
}

export const getOccupiedSeats = async (req, res)=>{
    try {
        const {showId} = req.params;

        const showData = await Show.findById(showId);

        if (!showData) {
            return res.json({success: false, message: "Show not found"});
        }

        res.json({success: true, occupiedSeats: showData.occupiedSeats || {}})

    } catch (error) {
        // console.error('Error in getOccupiedSeats:', error.message);
        res.json({success: false, message: error.message})
    }
}