import React from 'react';
import './ListBookings.css';

const bookings = [
  { user: 'Great Stack', movie: 'K.O.', time: 'Mon, November 10 at 5:30 PM', seats: 'A1, A2', amount: '$46' },
  { user: 'Great Stack', movie: 'The Accountant²', time: 'Tue, June 10 at 11:30 PM', seats: 'C1, C2', amount: '$58' },
  { user: 'Great Stack', movie: 'A Minecraft Movie', time: 'Tue, June 17 at 1:38 AM', seats: 'G1, G2, G3, G4', amount: '$796' },
  { user: 'Great Stack', movie: 'A Minecraft Movie', time: 'Tue, June 17 at 1:38 AM', seats: 'E1, E2', amount: '$398' },
  { user: 'Great Stack', movie: 'Sinners', time: 'Sun, June 7 at 8:51 PM', seats: 'C5, C6, C7', amount: '$888' },
];

const ListBookings = () => {
  return (
    <div className="admin-list-bookings">
      <h2 className="admin-list-bookings-heading">
        List <span className="highlight">Bookings</span>
      </h2>
      <table className="admin-bookings-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Movie Name</th>
            <th>Show Time</th>
            <th>Seats</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={i}>
              <td>{b.user}</td>
              <td>{b.movie}</td>
              <td>{b.time}</td>
              <td>{b.seats}</td>
              <td>{b.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListBookings; 