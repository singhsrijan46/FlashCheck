import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import './MovieDetails.css'

const MovieDetails = () => {

  const navigate = useNavigate()
  const {id} = useParams()
  const [show, setShow] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [loadingTrailer, setLoadingTrailer] = useState(false)

  const {shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, image_base_url} = useAppContext()

  const getShow = async ()=>{
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if(data.success){
        setShow(data)
        console.log('Movie data:', data.movie)
        console.log('Trailer data:', data.movie.trailer)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTrailer = async () => {
    try {
      setLoadingTrailer(true)
      console.log('Fetching trailer for movie ID:', id)
      const { data } = await axios.get(`/api/show/${id}/trailer`)
      console.log('Trailer API response:', data)
      if(data.success && data.trailer){
        setTrailer(data.trailer)
        console.log('Fetched trailer:', data.trailer)
      } else {
        console.log('Trailer API returned success: false or no trailer')
        // Try to use trailer from movie data if available
        if (show && show.movie && show.movie.trailer) {
          console.log('Using trailer from movie data:', show.movie.trailer)
          setTrailer(show.movie.trailer)
        }
      }
    } catch (error) {
      console.log('Error fetching trailer:', error)
      console.log('Error response:', error.response?.data)
      // Try to use trailer from movie data if available
      if (show && show.movie && show.movie.trailer) {
        console.log('Using trailer from movie data after error:', show.movie.trailer)
        setTrailer(show.movie.trailer)
      }
    } finally {
      setLoadingTrailer(false)
    }
  }

  const handleFavorite = async ()=>{
    try {
      if(!user) return toast.error("Please login to proceed");

      const { data } = await axios.post('/api/user/update-favorite', {movieId: id}, {headers: { Authorization: `Bearer ${await getToken()}` }})

      if(data.success){
        await fetchFavoriteMovies()
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleWatchTrailer = () => {
    console.log('Watch Trailer button clicked');
    console.log('Current trailer state:', trailer);
    console.log('Loading state:', loadingTrailer);
    
    if (!trailer || !trailer.key) {
      toast.error('No trailer available for this movie');
      return;
    }
    
    const trailerSection = document.getElementById('movie-trailer-section');
    if (trailerSection) {
      trailerSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.log('Trailer section not found');
    }
  }
  
  useEffect(()=>{
    getShow()
  },[id])

  useEffect(()=>{
    if(show && show.movie){
      getTrailer() // Fetch trailer data after show is loaded
    }
  },[show])

  return show ? (
    <div className='movie-details-page'>
      <div className='movie-details-container'>

        <img src={image_base_url + show.movie.poster_path} alt="" className='movie-details-poster'/>

        <div className='movie-details-content'>
          <p className='movie-details-language'>ENGLISH</p>
          <h1 className='movie-details-title'>{show.movie.title}</h1>
          <div className='movie-details-rating'>
            <StarIcon className="movie-details-rating-icon"/>
            {show.movie.vote_average.toFixed(1)} User Rating
          </div>

          <p className='movie-details-overview'>{show.movie.overview}</p>

          <p className='movie-details-meta'>
            {timeFormat(show.movie.runtime)} • {show.movie.genres.map(genre => genre.name).join(", ")} • {show.movie.release_date.split("-")[0]}
          </p>

          <div className='movie-details-actions'>
            <button 
              onClick={handleWatchTrailer}
              className='movie-details-trailer-btn'
              disabled={loadingTrailer}
            >
              <PlayCircleIcon className="movie-details-trailer-icon"/>
              {loadingTrailer ? 'Loading Trailer...' : 'Watch Trailer'}
            </button>
            <button 
              onClick={() => navigate(`/movies/${id}/showtimes`)} 
              className='movie-details-tickets-btn'
            >
              Buy Tickets
              </button>
            <button onClick={handleFavorite} className='movie-details-favorite-btn'>
              <Heart className={`movie-details-favorite-icon ${favoriteMovies.find(movie => movie._id === id) ? 'filled' : ""} `}/>
            </button>
          </div>
        </div>
      </div>

      <p className='movie-details-cast-title'>Your Favorite Cast</p>
      <div className='movie-details-cast-container'>
        <div className='movie-details-cast-grid'>
          {show.movie.casts.slice(0,12).map((cast,index)=> (
            <div key={index} className='movie-details-cast-item'>
              <img src={image_base_url + cast.profile_path} alt="" className='movie-details-cast-image'/>
              <p className='movie-details-cast-name'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trailer Section */}
      <div id="movie-trailer-section" className='movie-details-trailer-section'>
        <h2 className='movie-details-trailer-title'>Watch Trailer</h2>
        {loadingTrailer ? (
          <div className='movie-details-trailer-loading'>
            <p>Loading trailer...</p>
          </div>
        ) : trailer && trailer.key ? (
          <div className='movie-details-trailer-container'>
            <iframe
              className='movie-details-trailer-video'
              src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
              title={`${show.movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className='movie-details-trailer-container'>
            <p className='movie-details-trailer-message'>No trailer available for this movie.</p>
          </div>
        )}
      </div>

      <p className='movie-details-recommendations-title'>You May Also Like</p>
      <div className='movie-details-recommendations-grid'>
          {shows.slice(0,4).map((movie, index)=> (
            <MovieCard key={index} movie={movie}/>
          ))}
      </div>
      <div className='movie-details-show-more'>
          <button onClick={()=> {navigate('/movies'); scrollTo(0,0)}} className='movie-details-show-more-btn'>Show more</button>
      </div>

    </div>
  ) : <Loading />
}

export default MovieDetails
