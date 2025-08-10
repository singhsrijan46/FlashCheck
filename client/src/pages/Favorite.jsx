import React from 'react'
import ChromaMovieCard from '../components/ChromaMovieCard'
import { useAppContext } from '../context/AppContext'
import './Favorite.css'

const Favorite = () => {

  const {favoriteMovies} = useAppContext()

  return favoriteMovies.length > 0 ? (
    <div className='favorite-page'>
      <div className='favorite-header'>
        <p className='favorite-title'>
          <span className='favorite-title-text'>Your Favorite </span>
          <span className='favorite-title-highlight'>Movies</span>
        </p>
      </div>
      <div className='favorite-grid'>
        {favoriteMovies.map((movie)=> (
          <ChromaMovieCard movie={movie} key={movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='favorite-empty'>
      <h1 className='favorite-empty-title'>No favorite movies yet</h1>
      <p className='favorite-empty-subtitle'>Start adding movies to your favorites to see them here.</p>
    </div>
  )
}

export default Favorite

