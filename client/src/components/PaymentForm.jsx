import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import './PaymentForm.css';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentFormContent = ({ amount, showId, selectedSeats, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { axios, getToken } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        // Create payment intent when component mounts
        createPaymentIntent();
    }, []);

    const createPaymentIntent = async () => {
        try {
            setLoading(true);
            
            const token = await getToken();
            const { data } = await axios.post('/api/payment/create-payment-intent', {
                showId,
                selectedSeats,
                amount
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setClientSecret(data.clientSecret);
            } else {
                toast.error(data.message || 'Failed to create payment intent');
            }
        } catch (error) {
            console.error('Error creating payment intent:', error);
            toast.error('Failed to initialize payment');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setLoading(true);

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (error) {
                toast.error(error.message || 'Payment failed');
            } else if (paymentIntent.status === 'succeeded') {
                // Confirm payment with backend
                await confirmPaymentWithBackend(paymentIntent.id);
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const confirmPaymentWithBackend = async (paymentIntentId) => {
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/payment/confirm-payment', {
                paymentIntentId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success('Payment successful! Booking confirmed.');
                onSuccess(data.bookingId);
            } else {
                toast.error(data.message || 'Failed to confirm booking');
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
            toast.error('Failed to confirm booking');
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    if (loading && !clientSecret) {
        return (
            <div className="payment-loading">
                <div className="payment-spinner"></div>
                <p>Initializing payment...</p>
            </div>
        );
    }

    return (
        <div className="payment-form-container">
            <div className="payment-header">
                <h2>Complete Your Payment</h2>
                <p>Total Amount: ${amount}</p>
            </div>

            <form onSubmit={handleSubmit} className="payment-form">
                <div className="payment-details">
                    <div className="payment-info">
                        <h3>Booking Details</h3>
                        <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                        <p><strong>Amount:</strong> ${amount}</p>
                    </div>

                    <div className="card-element-container">
                        <label>Card Information</label>
                        <CardElement options={cardElementOptions} />
                    </div>
                </div>

                <div className="payment-actions">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="payment-cancel-btn"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="payment-submit-btn"
                        disabled={!stripe || loading}
                    >
                        {loading ? 'Processing...' : `Pay $${amount}`}
                    </button>
                </div>
            </form>
        </div>
    );
};

const PaymentForm = ({ amount, showId, selectedSeats, onSuccess, onCancel }) => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentFormContent 
                amount={amount} 
                showId={showId} 
                selectedSeats={selectedSeats}
                onSuccess={onSuccess}
                onCancel={onCancel}
            />
        </Elements>
    );
};

export default PaymentForm; 