import express from 'express';
import { createPayment, confirmPaymentAndBook, getPaymentStatus, createCheckoutSessionController, confirmCheckoutSession } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const paymentRouter = express.Router();

// Create payment intent
paymentRouter.post('/create-payment-intent', protect, createPayment);

// Create checkout session
paymentRouter.post('/create-checkout-session', protect, createCheckoutSessionController);

// Confirm checkout session
paymentRouter.post('/confirm-checkout-session', protect, confirmCheckoutSession);

// Confirm payment and create booking
paymentRouter.post('/confirm-payment', protect, confirmPaymentAndBook);

// Get payment status
paymentRouter.get('/status/:paymentIntentId', protect, getPaymentStatus);

export default paymentRouter; 