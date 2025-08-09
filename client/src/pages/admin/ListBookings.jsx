import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import './ListBookings.css';

const ListBookings = () => {
    const currency = import.meta.env.VITE_CURRENCY

    const {axios, getToken, user} = useAppContext()

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAllBookings = async () => {
        try {
          const { data } = await axios.get("/api/admin/all-bookings", {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            setBookings(data.bookings || [])
            setError(null)
        } catch (error) {

          setError('Failed to load bookings')
          setBookings([])
        }
        setIsLoading(false)
    };

     useEffect(() => {
      if (user) {
        getAllBookings();
      }    
    }, [user]);

    const renderSeats = (bookedSeats) => {
      if (!bookedSeats) return 'N/A';
      if (typeof bookedSeats === 'object') {
        return Object.keys(bookedSeats).map(seat => bookedSeats[seat]).join(", ");
      }
      return bookedSeats;
    };

  return !isLoading ? (
    <>
      <div className="list-bookings-container">
        {error && (
          <div className="list-bookings-error">
            {error}
          </div>
        )}
        {bookings.length === 0 && !error ? (
          <div className="list-bookings-empty">
            No bookings found
          </div>
        ) : (
          <table className="list-bookings-table">
              <thead className="list-bookings-thead">
                  <tr>
                      <th className="list-bookings-th">User Name</th>
                      <th className="list-bookings-th">Movie Name</th>
                      <th className="list-bookings-th">Show Time</th>
                      <th className="list-bookings-th">Seats</th>
                      <th className="list-bookings-th">Amount</th>
                  </tr>
              </thead>
              <tbody className="list-bookings-tbody">
                  {bookings.map((item, index) => (
                      <tr key={index} className="list-bookings-tr">
                          <td className="list-bookings-td">{item?.user?.name || 'N/A'}</td>
                          <td className="list-bookings-td">{item?.show?.movie?.title || 'N/A'}</td>
                          <td className="list-bookings-td">{item?.show?.showDateTime ? dateFormat(item.show.showDateTime) : 'N/A'}</td>
                          <td className="list-bookings-td">{renderSeats(item?.bookedSeats)}</td>
                          <td className="list-bookings-td">{currency} {item?.amount || 'N/A'}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
        )}
      </div>
    </>
  ) : <Loading />
}

export default ListBookings
