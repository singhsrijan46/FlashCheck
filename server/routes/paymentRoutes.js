import express from 'express';
import { createPayment, confirmPaymentAndBook, getPaymentStatus } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const paymentRouter = express.Router();

// Create payment intent
paymentRouter.post('/create-payment-intent', protect, createPayment);

// Confirm payment and create booking
paymentRouter.post('/confirm-payment', protect, confirmPaymentAndBook);

// Get payment status
paymentRouter.get('/status/:paymentIntentId', protect, getPaymentStatus);

export default paymentRouter; 