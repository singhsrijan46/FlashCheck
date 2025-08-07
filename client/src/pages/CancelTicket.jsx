import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './CancelTicket.css';

const CancelTicket = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [policy, setPolicy] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
        fetchCancellationPolicy();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/cancellation/bookings`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setBookings(response.data.bookings);
            } else {
                toast.error('Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const fetchCancellationPolicy = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/cancellation/policy`);
            if (response.data.success) {
                setPolicy(response.data.policy);
            }
        } catch (error) {
            console.error('Error fetching cancellation policy:', error);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            return;
        }

        setCancelling(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/cancellation/cancel/${bookingId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('Booking cancelled successfully! Check your email for refund details.');
                fetchBookings(); // Refresh the list
            } else {
                toast.error(response.data.message || 'Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            const errorMessage = error.response?.data?.message || 'Failed to cancel booking';
            toast.error(errorMessage);
        } finally {
            setCancelling(false);
        }
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isShowPassed = (showDateTime) => {
        return new Date(showDateTime) < new Date();
    };

    const canCancel = (booking, showDateTime) => {
        if (booking.status === 'cancelled') return false;
        if (isShowPassed(showDateTime)) return false;
        return true;
    };

    if (loading) {
        return (
            <div className="cancel-ticket-container">
                <div className="cancel-ticket-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cancel-ticket-container">
            <div className="cancel-ticket-header">
                <h1>🎫 My Bookings</h1>
                <p>View and manage your ticket bookings</p>
            </div>

            {policy && (
                <div className="cancellation-policy">
                    <h3>📋 Cancellation Policy</h3>
                    <div className="policy-details">
                        <p><strong>Cancellation Window:</strong> {policy.cancellationWindow}</p>
                        <p><strong>Refund Policy:</strong> {policy.refundPolicy}</p>
                        <div className="policy-restrictions">
                            <strong>Restrictions:</strong>
                            <ul>
                                {policy.restrictions.map((restriction, index) => (
                                    <li key={index}>{restriction}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <div className="no-bookings-icon">🎬</div>
                    <h3>No Bookings Found</h3>
                    <p>You haven't made any bookings yet.</p>
                    <button 
                        className="browse-movies-btn"
                        onClick={() => navigate('/movies')}
                    >
                        Browse Movies
                    </button>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map((booking) => {
                        const show = booking.show;
                        const movie = booking.movie;
                        const theatre = booking.theatre;
                        const showDateTime = show?.showDateTime;
                        const isPassed = showDateTime ? isShowPassed(showDateTime) : false;
                        const canCancelBooking = showDateTime ? canCancel(booking, showDateTime) : false;

                        return (
                            <div key={booking._id} className={`booking-card ${booking.status === 'cancelled' ? 'cancelled' : ''} ${isPassed ? 'passed' : ''}`}>
                                <div className="booking-header">
                                    <div className="booking-status">
                                        {booking.status === 'cancelled' ? (
                                            <span className="status-cancelled">❌ Cancelled</span>
                                        ) : isPassed ? (
                                            <span className="status-passed">⏰ Show Passed</span>
                                        ) : (
                                            <span className="status-active">✅ Active</span>
                                        )}
                                    </div>
                                    <div className="booking-id">
                                        ID: {booking._id.slice(-8)}
                                    </div>
                                </div>

                                <div className="booking-content">
                                    <div className="movie-info">
                                        <h3>{movie?.title || 'Unknown Movie'}</h3>
                                        <p className="theatre-name">{theatre?.name || 'Unknown Theatre'}</p>
                                    </div>

                                    <div className="booking-details">
                                        <div className="detail-row">
                                            <span className="label">Screen:</span>
                                            <span className="value">{show?.screen || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Format:</span>
                                            <span className="value">{show?.format || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Show Time:</span>
                                            <span className="value">
                                                {showDateTime ? formatDateTime(showDateTime) : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Seats:</span>
                                            <span className="value">
                                                {booking.bookedSeats.join(', ')}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Amount:</span>
                                            <span className="value">${booking.amount}</span>
                                        </div>
                                        {booking.status === 'cancelled' && (
                                            <div className="detail-row">
                                                <span className="label">Refund Amount:</span>
                                                <span className="value refund-amount">${booking.refundAmount}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="booking-actions">
                                        {canCancelBooking && (
                                            <button
                                                className="cancel-btn"
                                                onClick={() => handleCancelBooking(booking._id)}
                                                disabled={cancelling}
                                            >
                                                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                                            </button>
                                        )}
                                        {!canCancelBooking && booking.status !== 'cancelled' && (
                                            <p className="cannot-cancel">
                                                Cannot cancel - show has already started
                                            </p>
                                        )}
                                        {booking.status === 'cancelled' && (
                                            <p className="already-cancelled">
                                                Booking has been cancelled
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CancelTicket; 