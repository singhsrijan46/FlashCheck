import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
});

export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency,
            metadata: metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        };
    } catch (error) {
        // console.error('Error creating payment intent:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const createCheckoutSession = async (amount, currency = 'usd', metadata = {}, successUrl, cancelUrl) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: metadata.movieTitle || 'Movie Ticket',
                            description: `Seats: ${metadata.selectedSeats || 'N/A'}`,
                        },
                        unit_amount: Math.round(amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: metadata,
        });

        return {
            success: true,
            sessionId: session.id,
            url: session.url
        };
    } catch (error) {
        // console.error('Error creating checkout session:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const confirmPayment = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return {
            success: true,
            paymentIntent: paymentIntent
        };
    } catch (error) {
        // console.error('Error confirming payment:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const createRefund = async (paymentIntentId, amount = null) => {
    try {
        const refundData = {
            payment_intent: paymentIntentId,
        };

        if (amount) {
            refundData.amount = Math.round(amount * 100); // Convert to cents
        }

        const refund = await stripe.refunds.create(refundData);
        return {
            success: true,
            refund: refund
        };
    } catch (error) {
        // console.error('Error creating refund:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export default stripe; 