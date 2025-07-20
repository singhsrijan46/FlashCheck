import React from 'react';
import './Dashboard.css';
import minecraftPoster from '../../../assets/demon-slayer_poster.webp';
import sinnersPoster from '../../../assets/demon-slayer.jpg';

const stats = [
  { label: 'Total Bookings', value: 4, icon: '📈' },
  { label: 'Total Revenue', value: '$2140', icon: '💲' },
  { label: 'Active Shows', value: 43, icon: '▶️' },
  { label: 'Total Users', value: 1, icon: '👤' },
];

const shows = [
  { title: 'Sinners', price: 22, rating: 7.5, time: 'Sun, June 7 at 8:51 PM', poster: sinnersPoster },
  { title: 'A Minecraft Movie', price: 19, rating: 6.5, time: 'Tue, June 10 at 11:35 PM', poster: minecraftPoster },
  { title: 'A Minecraft Movie', price: 29, rating: 6.5, time: 'Tue, June 17 at 1:38 AM', poster: minecraftPoster },
  { title: 'A Minecraft Movie', price: 39, rating: 6.5, time: 'Tue, June 10 at 10:51 PM', poster: minecraftPoster },
];

const Dashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2 className="admin-dashboard-heading">
        Admin <span className="highlight">Dashboard</span>
      </h2>
      <div className="admin-stats-row">
        {stats.map((stat, i) => (
          <div className="admin-stat-card" key={i}>
            <div className="admin-stat-label">{stat.label}</div>
            <div className="admin-stat-value">{stat.value}</div>
            <div className="admin-stat-icon">{stat.icon}</div>
          </div>
        ))}
      </div>
      <h3 className="admin-active-shows-title">Active Shows</h3>
      <div className="admin-shows-grid">
        {shows.map((show, i) => (
          <div className="admin-show-card" key={i}>
            <img src={show.poster} alt={show.title} className="admin-show-poster" />
            <div className="admin-show-title">{show.title}</div>
            <div className="admin-show-price">${show.price}</div>
            <div className="admin-show-rating">
              <span className="star">★</span> {show.rating}
            </div>
            <div className="admin-show-time">{show.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 