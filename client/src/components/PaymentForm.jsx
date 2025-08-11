import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import './PaymentForm.css';

const PaymentForm = ({ amount, showId, selectedSeats, onSuccess, onCancel }) => {
    const { axios, getToken } = useAppContext();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        try {
            setLoading(true);
            
    
            
            const token = await getToken();

            
            const requestData = {
                showId,
                selectedSeats,
                amount
            };
            

            
            const { data } = await axios.post('/api/payment/create-checkout-session', requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });



            if (data.success && data.url) {

                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
    
                toast.error(data.message || 'Failed to create checkout session');
            }
        } catch (error) {

            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error('Failed to initialize checkout');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-form-container">
            <div className="payment-header">
                <h2>Complete Your Payment</h2>
                <p>Total Amount: ${amount}</p>
            </div>

            <div className="payment-details">
                <div className="payment-info">
                    <h3>Booking Details</h3>
                    <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                    <p><strong>Amount:</strong> ${amount}</p>
                </div>

                <div className="checkout-info">
                    <h3>Secure Payment</h3>
                    <p>You will be redirected to Stripe's secure checkout page to complete your payment.</p>
                    <div className="security-badges">
                        <span className="security-badge">🔒 Secure</span>
                        <span className="security-badge">💳 Multiple Payment Methods</span>
                        <span className="security-badge">✅ PCI Compliant</span>
                    </div>
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
                    type="button" 
                    onClick={handleCheckout}
                    className="payment-submit-btn"
                    disabled={loading}
                >
                    {loading ? 'Redirecting...' : `Pay $${amount}`}
                </button>
            </div>
        </div>
    );
};

export default PaymentForm; 