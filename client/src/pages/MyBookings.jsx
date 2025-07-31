import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets'
import Loading from '../components/Loading'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
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
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    if(user){
      getMyBookings()
    }
    
  },[user])


  return !isLoading ? (
    <div className='my-bookings-page'>
      <h1 className='my-bookings-title'>My Bookings</h1>

      {bookings.map((booking) => (
        <div key={booking._id} className="my-bookings-booking">
          <div className="my-bookings-booking-info">
            <h3>{booking.show?.movie?.title || 'Unknown Movie'}</h3>
            <p>Date: {new Date(booking.show?.showDateTime).toLocaleDateString()}</p>
            <p>Time: {new Date(booking.show?.showDateTime).toLocaleTimeString()}</p>
            <p>Seats: {booking.bookedSeats.join(', ')}</p>
            <p>Amount: ${booking.amount}</p>
          </div>
        </div>
      ))}
    </div>
  ) : <Loading />
}

export default MyBookings
