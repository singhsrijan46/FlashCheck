import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { axios, getToken } = useAppContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            handlePaymentSuccess(sessionId);
        } else {
            setLoading(false);
            toast.error('Invalid payment session');
            // Redirect to home if no session ID
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    }, [searchParams]);

    const handlePaymentSuccess = async (sessionId) => {
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/payment/confirm-checkout-session', {
                sessionId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success('Payment successful! Booking confirmed.');
                // Redirect to My Bookings after successful payment
                setTimeout(() => {
                    navigate('/my-bookings');
                }, 2000);
            } else {
                toast.error(data.message || 'Failed to confirm booking');
                // Redirect to home if payment confirmation fails
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            console.error('Payment confirmation error:', error);
            toast.error('Failed to confirm payment');
            // Redirect to home if there's an error
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="payment-success-container">
                <div className="payment-success-content">
                    <div className="loading-spinner"></div>
                    <h2>Processing your payment...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-success-container">
            <div className="payment-success-content">
                <div className="success-circle">
                    <div className="success-tick">✓</div>
                </div>
                <h1>Payment Successful!</h1>
                <p>Redirecting to My Bookings...</p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
