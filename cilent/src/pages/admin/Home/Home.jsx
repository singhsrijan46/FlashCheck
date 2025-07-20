import React from 'react';
import './Home.css';
import { Outlet } from 'react-router-dom';
import AdminNavBar from '../../../components/admin/NavBar/NavBar';

const Home = () => {
  return (
    <div className="admin-layout">
      <AdminNavBar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Home; 