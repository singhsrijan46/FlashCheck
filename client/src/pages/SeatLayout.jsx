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

  const navigate = useNavigate()
  const {axios, getToken, user} = useAppContext();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  const getShow = async () =>{
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success){
        setShow(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getOccupiedSeats = async () => {
    try {
      const { data } = await axios.get(`/api/booking/occupied-seats/${id}/${date}`)
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats)
      }
    } catch (error) {
      console.log('Error getting occupied seats:', error)
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

  const bookTickets = async () => {
    if (selectedSeats.length === 0) {
      return toast("Please select at least one seat")
    }
    try {
      const { data } = await axios.post('/api/booking/create', {
        movieId: id,
        date: date,
        selectedSeats,
        amount: selectedSeats.length * show.showPrice
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
      console.log(error)
      toast.error("Error creating booking")
    }
  }

  useEffect(() => {
    getShow()
    getOccupiedSeats()
  }, [id, date])

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
      <div className='seat-layout-section-label'>{sectionName}</div>
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
          <button onClick={bookTickets} className='seat-layout-checkout-btn'>
            Proceed to Checkout
            <ArrowRightIcon className="seat-layout-checkout-icon"/>
          </button>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout
