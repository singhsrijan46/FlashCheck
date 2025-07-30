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

      {bookings.map((item,index)=>(
        <div key={index} className='my-bookings-item'>
          <div className='my-bookings-content'>
            <img src={image_base_url + item.show.movie.poster_path} alt="" className='my-bookings-image'/>
            <div className='my-bookings-details'>
              <p className='my-bookings-movie-title'>{item.show.movie.title}</p>
              <p className='my-bookings-movie-runtime'>{timeFormat(item.show.movie.runtime)}</p>
              <p className='my-bookings-movie-date'>{dateFormat(item.show.showDateTime)}</p>
            </div>
          </div>
          <div className='my-bookings-actions'>
            <p className='my-bookings-seats'>Seats: {Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")}</p>
            <p className='my-bookings-amount'>{currency} {item.amount}</p>
          </div>
        </div>
      ))}
    </div>
  ) : <Loading />
}

export default MyBookings
