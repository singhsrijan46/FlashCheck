import React from 'react';
import './ListShows.css';

const ListShows = () => {
  return (
    <div className="admin-list-shows">
      <h2><span>List </span><span className="highlight">Shows</span></h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Movie Name</th>
            <th>Show Time</th>
            <th>Total Bookings</th>
            <th>Earnings</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>The Accountant²</td>
            <td>Tue, June 10 at 8:30 PM</td>
            <td>0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>A Minecraft Movie</td>
            <td>Tue, June 10 at 10:51 PM</td>
            <td>0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>The Accountant²</td>
            <td>Tue, June 10 at 11:30 PM</td>
            <td>2</td>
            <td>$58</td>
          </tr>
          <tr>
            <td>A Minecraft Movie</td>
            <td>Tue, June 10 at 11:35 PM</td>
            <td>0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>Ballerina</td>
            <td>Wed, June 11 at 1:30 AM</td>
            <td>0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>The Accountant²</td>
            <td>Wed, June 11 at 4:30 AM</td>
            <td>0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>Ballerina</td>
            <td>Thu, June 12 at 1:30 AM</td>
            <td>0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>A Minecraft Movie</td>
            <td>Tue, June 17 at 1:38 AM</td>
            <td>10</td>
            <td>$290</td>
          </tr>
          <tr>
            <td>How to Train Your Dragon</td>
            <td>Mon, November 10 at 2:30 PM</td>
            <td>0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>K.O.</td>
            <td>Mon, November 10 at 2:30 PM</td>
            <td>0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>Mission: Impossible - The Final Reckoning</td>
            <td>Mon, November 10 at 2:30 PM</td>
            <td>0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>K.O.</td>
            <td>Mon, November 10 at 5:30 PM</td>
            <td>2</td>
            <td>$46</td>
          </tr>
          <tr>
            <td>How to Train Your Dragon</td>
            <td>Mon, November 10 at 5:30 PM</td>
            <td>0</td>
            <td>$0</td>
          </tr>
          <tr>
            <td>Mission: Impossible - The Final Reckoning</td>
            <td>Mon, November 10 at 5:30 PM</td>
            <td>0</td>
            <td>$0</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ListShows; 