import React from 'react'
import { useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'
import './Movies.css'

const Movies = () => {

  const { shows, getShows } = useAppContext();

  useEffect(() => {
    getShows();
  }, []);

  return shows.length > 0 ? (
    <div className='movies-page'>

      <h1 className='movies-title'>Now Showing</h1>
      <div className='movies-grid'>
        {shows.map((show)=> (
          <MovieCard movie={show.movie} key={show._id}/>
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
