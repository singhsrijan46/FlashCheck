import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets'
import Loading from '../components/Loading'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { CalendarIcon, ClockIcon, MapPinIcon, CreditCardIcon, TicketIcon } from 'lucide-react'
import './MyBookings.css'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const { axios, getToken, user, image_base_url} = useAppContext()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMyBookings = async () =>{
    try {
      const {data} = await axios.get('/api/user/bookings', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
        if (data.success) {
          setBookings(data.bookings)
        }

    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    if(user){
      getMyBookings()
    }
    
  },[user])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getBookingStatus = (booking) => {
    const showDate = new Date(booking.show?.showDateTime)
    const now = new Date()
    
    if (showDate < now) {
      return { status: 'completed', text: 'Completed', color: '#10b981' }
    } else if (showDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return { status: 'upcoming', text: 'Today', color: '#f59e0b' }
    } else {
      return { status: 'upcoming', text: 'Upcoming', color: '#3b82f6' }
    }
  }

  return !isLoading ? (
    <div className='my-bookings-page'>
      <div className='my-bookings-header'>
        <h1 className='my-bookings-title'>My Bookings</h1>
        <p className='my-bookings-subtitle'>Track your movie tickets and booking history</p>
      </div>

      {bookings.length === 0 ? (
        <div className='my-bookings-empty'>
          <div className='my-bookings-empty-icon'>
            <TicketIcon size={48} />
          </div>
          <h3 className='my-bookings-empty-title'>No Bookings Yet</h3>
          <p className='my-bookings-empty-text'>You haven't made any bookings yet. Start by exploring our movies!</p>
          <Link to='/movies' className='my-bookings-empty-btn'>
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className='my-bookings-grid'>
          {bookings.map((booking) => {
            const status = getBookingStatus(booking)
            return (
              <div key={booking._id} className="my-bookings-card">
                <div className="my-bookings-card-header">
                  <div className="my-bookings-movie-poster">
                    <img 
                      src={image_base_url + (booking.show?.movie?.poster_path || '/default-poster.jpg')} 
                      alt={booking.show?.movie?.title || 'Movie'}
                      className="my-bookings-poster-image"
                    />
                  </div>
                  <div className="my-bookings-status">
                    <span 
                      className="my-bookings-status-badge"
                      style={{ backgroundColor: status.color }}
                    >
                      {status.text}
                    </span>
                  </div>
                </div>

                <div className="my-bookings-card-content">
                  <h3 className="my-bookings-movie-title">
                    {booking.show?.movie?.title || 'Unknown Movie'}
                  </h3>
                  
                  <div className="my-bookings-details">
                    <div className="my-bookings-detail-item">
                      <CalendarIcon className="my-bookings-detail-icon" />
                      <span>{formatDate(booking.show?.showDateTime)}</span>
                    </div>
                    
                    <div className="my-bookings-detail-item">
                      <ClockIcon className="my-bookings-detail-icon" />
                      <span>{formatTime(booking.show?.showDateTime)}</span>
                    </div>
                    
                    <div className="my-bookings-detail-item">
                      <MapPinIcon className="my-bookings-detail-icon" />
                      <span>Cinema Hall</span>
                    </div>
                  </div>

                  <div className="my-bookings-seats-section">
                    <h4 className="my-bookings-seats-title">Booked Seats</h4>
                    <div className="my-bookings-seats-grid">
                      {booking.bookedSeats.map((seat, index) => (
                        <span key={index} className="my-bookings-seat-badge">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="my-bookings-card-footer">
                    <div className="my-bookings-amount">
                      <CreditCardIcon className="my-bookings-amount-icon" />
                      <span className="my-bookings-amount-text">
                        {currency}{booking.amount}
                      </span>
                    </div>
                    
                    <div className="my-bookings-actions">
                      <button className="my-bookings-action-btn my-bookings-view-btn">
                        View Details
                      </button>
                      {status.status === 'upcoming' && (
                        <button className="my-bookings-action-btn my-bookings-cancel-btn">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  ) : <Loading />
}

export default MyBookings
