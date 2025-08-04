import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'
import './SeatLayout.css'

const seatRowLetters = ['A','B','C','D','E','F','G','H','I','J','K'] // 11 rows
const seatsPerBlock = 5 // 5 seats per block (4 blocks total = 20 seats per row)

const silverRows = seatRowLetters.slice(0, 3) // A-C
const goldRows = seatRowLetters.slice(3, 7) // D-G
const diamondRows = seatRowLetters.slice(7) // H-K

const SeatLayout = () => {
  const {id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [show, setShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const navigate = useNavigate()
  const {axios, getToken, user} = useAppContext();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  const getShow = async () => {
    try {
      // Find the specific show for this movie and date
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success){
        // Get all shows for this movie and find the one for the specific date
        const showsResponse = await axios.get(`/api/show/all`)
        if (showsResponse.data.success) {
          const dateStr = date; // date is already in YYYY-MM-DD format
          const movieShows = showsResponse.data.shows.filter(show => {
            const showMovieId = typeof show.movie === 'object' ? show.movie._id : show.movie;
            const showDate = new Date(show.showDateTime).toISOString().split('T')[0];
            
            return (showMovieId === id || showMovieId === id.toString()) && showDate === dateStr;
          });
          
          if (movieShows.length > 0) {
            setShow(movieShows[0]);
          } else {
            console.error('No show found for movie', id, 'on date', date);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching show:', error)
    }
  }

  const getOccupiedSeats = async () => {
    try {
      const { data } = await axios.get(`/api/booking/occupied-seats/${id}/${date}`)
      if (data.success) {
        // Convert object keys to array of occupied seat IDs
        const occupiedSeatIds = Object.keys(data.occupiedSeats || {});
        setOccupiedSeats(occupiedSeatIds);
      }
    } catch (error) {
      console.error('Error getting occupied seats:', error)
    }
  }

  const handleSeatClick = (seatId) =>{
      if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
        return toast("You can only select 5 seats")
      }
      if(occupiedSeats.includes(seatId)){
        return toast('This seat is already booked')
      }
      setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const getSeatPrice = (seatId) => {
    const rowLetter = seatId.charAt(0)
    if (silverRows.includes(rowLetter)) {
      return show.silverPrice
    } else if (goldRows.includes(rowLetter)) {
      return show.goldPrice
    } else if (diamondRows.includes(rowLetter)) {
      return show.diamondPrice
    }
    return show.silverPrice // fallback
  }

  const calculateTotalAmount = () => {
    return selectedSeats.reduce((total, seatId) => {
      return total + getSeatPrice(seatId)
    }, 0)
  }

  const bookTickets = async () => {
    if (selectedSeats.length === 0) {
      return toast("Please select at least one seat")
    }
    try {
      const { data } = await axios.post('/api/booking/create', {
        movieId: id,
        date: date,
        selectedSeats,
        amount: calculateTotalAmount()
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success("Booking created successfully!")
        navigate('/my-bookings')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error("Error creating booking")
    }
  }

  useEffect(() => {
    console.log('SeatLayout - Fetching show for movie:', id, 'date:', date);
    getShow()
    getOccupiedSeats()
  }, [id, date])

  useEffect(() => {
    console.log('SeatLayout - Show data:', show);
    console.log('SeatLayout - Occupied seats:', occupiedSeats);
  }, [show, occupiedSeats]);

  const renderSeatBlock = (rowLetter, blockNumber) => {
    const blockSeats = []
    const startSeat = (blockNumber - 1) * seatsPerBlock + 1
    for (let i = 0; i < seatsPerBlock; i++) {
      const seatNumber = startSeat + i
      const seatId = `${rowLetter}${seatNumber}`
      const isSelected = selectedSeats.includes(seatId)
      const isOccupied = occupiedSeats.includes(seatId)
      blockSeats.push(
        <button
          key={seatId}
          onClick={() => handleSeatClick(seatId)}
          className={`seat-layout-seat ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
          disabled={isOccupied}
        >
          {seatId}
        </button>
      )
    }
    return blockSeats
  }

  const renderSection = (rows, sectionName) => (
    <div className='seat-layout-section'>
      <div className='seat-layout-section-label'>
        {sectionName}
        {show && (
          <span className='seat-layout-section-price'>
            {sectionName === 'Silver' && ` - ${currency}${show.silverPrice}`}
            {sectionName === 'Gold' && ` - ${currency}${show.goldPrice}`}
            {sectionName === 'Diamond' && ` - ${currency}${show.diamondPrice}`}
          </span>
        )}
      </div>
      <div className='seat-layout-rows'>
        {rows.map(rowLetter => (
          <div key={rowLetter} className='seat-layout-row'>
            <div className='seat-layout-block upper-left'>
              {renderSeatBlock(rowLetter, 1)}
            </div>
            <div className='seat-layout-block upper-right'>
              {renderSeatBlock(rowLetter, 2)}
        </div>
            <div className='seat-layout-center-gap'></div>
            <div className='seat-layout-block lower-left'>
              {renderSeatBlock(rowLetter, 3)}
      </div>
            <div className='seat-layout-block lower-right'>
              {renderSeatBlock(rowLetter, 4)}
              </div>
                  </div>
                ))}
              </div>
          </div>
  )

  if (!user) return <Loading />

  return show ? (
    <div className='seat-layout-page'>
      <div className='seat-layout-container'>
        <div className='seat-layout-main seat-layout-main-large'>
          <h1 className='seat-layout-title'>Select your seat</h1>
          <div className='seat-layout-screen-container'>
            <div className='seat-layout-screen'></div>
            <p className='seat-layout-screen-text'>SCREEN</p>
          </div>
          <div className='seat-layout-theater'>
            {renderSection(silverRows, 'Silver')}
            {renderSection(goldRows, 'Gold')}
            {renderSection(diamondRows, 'Diamond')}
          </div>
        </div>
        
        {/* Summary Section */}
        <div className='seat-layout-summary'>
          <div className='seat-layout-summary-content'>
            <h2 className='seat-layout-summary-title'>Booking Summary</h2>
            
            {/* Movie Info */}
            <div className='seat-layout-movie-info'>
              <h3 className='seat-layout-movie-title'>{show.movie?.title || 'Movie'}</h3>
              <p className='seat-layout-movie-date'>{date}</p>
            </div>
            
            {/* Selected Seats */}
            <div className='seat-layout-seats-info'>
              <h4 className='seat-layout-seats-title'>Selected Seats</h4>
              {selectedSeats.length === 0 ? (
                <p className='seat-layout-no-seats'>No seats selected</p>
              ) : (
                <div className='seat-layout-seats-list'>
                  {selectedSeats.map((seatId, index) => (
                    <div key={index} className='seat-layout-seat-item'>
                      <span className='seat-layout-seat-id'>{seatId}</span>
                      <span className='seat-layout-seat-price'>
                        {currency}{getSeatPrice(seatId)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Price Breakdown */}
            <div className='seat-layout-price-breakdown'>
              <div className='seat-layout-price-row'>
                <span>Number of Seats:</span>
                <span>{selectedSeats.length}</span>
              </div>
              <div className='seat-layout-price-row'>
                <span>Total Amount:</span>
                <span className='seat-layout-total-price'>
                  {currency}{calculateTotalAmount()}
                </span>
              </div>
            </div>
            
            {/* Checkout Button */}
            <button 
              onClick={bookTickets} 
              className='seat-layout-checkout-btn'
              disabled={selectedSeats.length === 0}
            >
              Proceed to Checkout
              <ArrowRightIcon className="seat-layout-checkout-icon"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout
