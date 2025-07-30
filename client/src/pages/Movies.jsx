import React from 'react'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'
import './Movies.css'

const Movies = () => {

  const { shows } = useAppContext()

  return shows.length > 0 ? (
    <div className='movies-page'>

      <h1 className='movies-title'>Now Showing</h1>
      <div className='movies-grid'>
        {shows.map((movie)=> (
          <MovieCard movie={movie} key={movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='movies-empty'>
      <h1 className='movies-empty-title'>No movies available</h1>
    </div>
  )
}

export default Movies
