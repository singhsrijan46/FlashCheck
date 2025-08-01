import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import ListBookings from './pages/admin/ListBookings'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import Loading from './components/Loading'
import ShowtimeSelection from './pages/ShowtimeSelection'
import SearchMovies from './pages/SearchMovies'

const App = () => {

  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isLoginRoute = location.pathname === '/login'

  const { user, loading } = useAppContext()

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/movies' element={<Movies/>} />
        <Route path='/movies/:id' element={<MovieDetails/>} />
        <Route path='/movies/:id/showtimes' element={<ShowtimeSelection/>} />
        <Route path='/movies/:id/:date' element={<SeatLayout/>} />
        <Route path='/my-bookings' element={user ? <MyBookings/> : <Login state={{ from: location }}/>} />
        <Route path='/loading/:nextUrl' element={<Loading/>} />
        <Route path='/favorite' element={user ? <Favorite/> : <Login state={{ from: location }}/>} />
        <Route path='/login' element={<Home/>} />
        <Route path='/search' element={<SearchMovies />} />

        <Route path='/admin/*' element={user && user.role === 'admin' ? <Layout/> : <Login state={{ from: location }}/>}>
          <Route index element={<Dashboard/>}/>
          <Route path="add-shows" element={<AddShows/>}/>
          <Route path="list-shows" element={<ListShows/>}/>
          <Route path="list-bookings" element={<ListBookings/>}/>
        </Route>
      </Routes>
      
      {/* Render login as overlay when on login route */}
      {isLoginRoute && <Login state={{ from: location.state?.from || location }}/>} 
      
      {!isAdminRoute && location.pathname !== '/movies/' + location.pathname.split('/')[2] + '/showtimes' && location.pathname.split('/').length !== 4 && <Footer />}
    </>
  )
}

export default App
