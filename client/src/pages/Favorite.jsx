import React from 'react'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'
import './Favorite.css'

const Favorite = () => {

  const {favoriteMovies} = useAppContext()

  return favoriteMovies.length > 0 ? (
    <div className='favorite-page'>

      <h1 className='favorite-title'>Your Favorite Movies</h1>
      <div className='favorite-grid'>
        {favoriteMovies.map((movie)=> (
          <MovieCard movie={movie} key={movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='favorite-empty'>
      <h1 className='favorite-empty-title'>No movies available</h1>
    </div>
  )
}

export default Favorite

