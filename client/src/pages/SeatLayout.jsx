import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import PaymentForm from '../components/PaymentForm'
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
  const {id, date, showtimeId } = useParams()
  const location = useLocation()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [show, setShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const navigate = useNavigate()
  const {axios, getToken, user, selectedCity} = useAppContext();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  const getShow = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 SeatLayout - Starting to fetch show data...');
      console.log('🔍 Parameters:', { id, date, showtimeId });
      console.log('🔍 Location state:', location.state);
      
      let selectedShow = null;
      
      // First, try to use the showtime data from navigation state
      if (location.state?.showtimeData) {
        console.log('🔍 Using showtime data from navigation state');
        selectedShow = location.state.showtimeData;
      }
      
      // If we don't have state data, use date-based search
      if (!selectedShow && id && date) {
        console.log('🔍 Using date-based search for movie:', id, 'date:', date);
        
        // Get all shows for this movie in the selected city
        const city = selectedCity || 'Varanasi';
        console.log('🔍 Fetching shows for city:', city);
        
        try {
          const showsResponse = await axios.get(`/api/show/${id}/city/${city}`);
          console.log('🔍 Shows response:', showsResponse.data);
          
          if (showsResponse.data.success) {
            const shows = showsResponse.data.shows;
            console.log('🔍 Found shows:', shows.length);
            
            // Find the show for the specific date
            const dateStr = date; // date is already in YYYY-MM-DD format
            const showsForDate = shows.filter(show => {
              const showDate = new Date(show.showDateTime).toISOString().split('T')[0];
              return showDate === dateStr;
            });
            
            console.log('🔍 Shows for date:', showsForDate.length);
            
            if (showsForDate.length > 0) {
              // Use the first show for the date
              selectedShow = showsForDate[0];
              console.log('🔍 Selected show from date search:', selectedShow);
            } else {
              console.error('❌ No show found for movie', id, 'on date', date);
              setError('No show found for the selected date');
              return;
            }
          } else {
            console.error('❌ Failed to fetch shows');
            setError('Failed to load show data');
            return;
          }
        } catch (error) {
          console.error('❌ Error fetching shows:', error);
          setError('Failed to load show data. Please try again.');
          return;
        }
      }
      
      if (selectedShow) {
        console.log('🔍 Final selected show:', selectedShow);
        console.log('🔍 Show prices:', {
          silver: selectedShow.silverPrice,
          gold: selectedShow.goldPrice,
          diamond: selectedShow.diamondPrice
        });
        setShow(selectedShow);
      } else {
        console.error('❌ No show found');
        setError('No show found. Please try selecting a different showtime.');
      }
    } catch (error) {
      console.error('❌ Error fetching show:', error);
      setError('Failed to load show data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const getOccupiedSeats = async () => {
    try {
      if (!show) {
        console.log('🔍 No show data available for occupied seats check');
        return;
      }
      
      console.log('🔍 Fetching occupied seats for show:', show._id);
      const { data } = await axios.get(`/api/booking/occupied-seats/${show._id}`)
      
      if (data.success) {
        // Convert object keys to array of occupied seat IDs
        const occupiedSeatIds = Object.keys(data.occupiedSeats || {});
        console.log('🔍 Found occupied seats:', occupiedSeatIds);
        setOccupiedSeats(occupiedSeatIds);
      } else {
        console.error('❌ Failed to fetch occupied seats:', data.message);
      }
    } catch (error) {
      console.error('❌ Error getting occupied seats:', error);
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
    if (!show) return 0;
    
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

  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      return toast("Please select at least one seat")
    }
    
    if (!show) {
      return toast("No show data available")
    }
    
    if (!user) {
      return toast("Please login to book tickets")
    }
    
    setShowPayment(true)
  }

  const handlePaymentSuccess = (bookingId) => {
    toast.success("Payment successful! Booking confirmed.")
    navigate('/my-bookings')
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
  }

  useEffect(() => {
    if (id && date) {
      getShow()
    }
  }, [id, date])

  useEffect(() => {
    if (show) {
      getOccupiedSeats()
    }
  }, [show])

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

  if (loading) {
    return (
      <div className='seat-layout-page'>
        <div className='seat-layout-loading'>
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='seat-layout-page'>
        <div className='seat-layout-error'>
          <h2>Error Loading Seat Layout</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/movies')} className='seat-layout-back-btn'>
            Back to Movies
          </button>
        </div>
      </div>
    )
  }

  return show ? (
    <div className='seat-layout-page'>
      {/* Payment Form Overlay */}
      {showPayment && (
        <div className='payment-overlay'>
          <PaymentForm
            amount={calculateTotalAmount()}
            showId={show._id}
            selectedSeats={selectedSeats}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      )}
      
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
              {show.theatre && (
                <p className='seat-layout-theatre-info'>
                  {show.theatre.name} • {show.format} • Screen {show.screen}
                </p>
              )}
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
              onClick={handleCheckout} 
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
    <div className='seat-layout-page'>
      <div className='seat-layout-error'>
        <h2>No Show Found</h2>
        <p>No show found for the selected date.</p>
        <button onClick={() => navigate('/movies')} className='seat-layout-back-btn'>
          Back to Movies
        </button>
      </div>
    </div>
  )
}

export default SeatLayout
