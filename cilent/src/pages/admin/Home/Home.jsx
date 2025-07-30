import React from 'react';
import './Home.css';
import { Outlet, Routes, Route, Navigate } from 'react-router-dom';
import AdminNavBar from '../../../components/admin/NavBar/NavBar';
import Dashboard from '../Dashboard/Dashboard';
import AddShows from '../AddShows/AddShows';
import ListShows from '../ListShows/ListShows';
import ListBookings from '../ListBookings/ListBookings';

const Home = () => {
  return (
    <div className="admin-layout">
      <AdminNavBar />
      <main className="admin-main">
        <Routes>
          <Route index element={<Navigate to='/admin/dashboard' replace />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='add-shows' element={<AddShows />} />
          <Route path='list-shows' element={<ListShows />} />
          <Route path='list-bookings' element={<ListBookings />} />
        </Routes>
      </main>
    </div>
  );
};

export default Home; 