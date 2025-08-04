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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, image_base_url} = useAppContext()

  const getShow = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('MovieDetails - Fetching show for ID:', id);
      const { data } = await axios.get(`/api/show/${id}`)
      console.log('MovieDetails - Show data received:', data);
      if(data.success){
        setShow(data.show)
      } else {
        setError(data.message || 'Failed to fetch movie details');
      }
    } catch (error) {
      console.error('Error fetching show:', error)
      setError('Failed to load movie details. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const getTrailer = async () => {
    try {
      setLoadingTrailer(true)
      
      // First check if trailer is already stored in movie data
      if (show && show.movie && show.movie.trailer && show.movie.trailer.key) {
        setTrailer(show.movie.trailer)
        setLoadingTrailer(false)
        return
      }
      
      // If not stored, fetch from API
      const { data } = await axios.get(`/api/show/${id}/trailer`)
      if(data.success && data.trailer){
        setTrailer(data.trailer)
      } else {
        setTrailer(null)
      }
    } catch (error) {
      console.error('Error fetching trailer:', error)
      setTrailer(null)
    } finally {
      setLoadingTrailer(false)
    }
  }

  const handleFavorite = async () => {
    try {
      if(!user) return toast.error("Please login to proceed");

      const { data } = await axios.post('/api/user/update-favorite', {movieId: id}, {headers: { Authorization: `Bearer ${await getToken()}` }})

      if(data.success){
        await fetchFavoriteMovies()
        toast.success(data.message)
      }
    } catch (error) {
      console.error('Error updating favorite:', error)
    }
  }

  const handleWatchTrailer = () => {
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
    }
  }
  
  useEffect(() => {
    getShow();
    getTrailer();
  }, [id]);

  useEffect(() => {
    console.log('MovieDetails - show data:', show);
    console.log('MovieDetails - movie data:', show?.movie);
    console.log('MovieDetails - casts:', show?.movie?.casts);
    console.log('MovieDetails - trailer:', trailer);
  }, [show, trailer]);

  return (
    <div className='movie-details-page'>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
          <p>Loading movie details...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
          <p>Error: {error}</p>
          <button onClick={() => getShow()} style={{ marginTop: '10px', padding: '10px 20px' }}>
            Try Again
          </button>
        </div>
      ) : show ? (
        <>
          <div className='movie-details-container'>
            <img src={image_base_url + (show.movie?.poster_path || '/default-poster.jpg')} alt="" className='movie-details-poster'/>

            <div className='movie-details-content'>
              <p className='movie-details-language'>{show.movie?.original_language?.toUpperCase() || 'ENGLISH'}</p>
              <h1 className='movie-details-title'>{show.movie?.title || 'Unknown Movie'}</h1>
              <div className='movie-details-rating'>
                <StarIcon className="movie-details-rating-icon"/>
                {(show.movie?.vote_average || 0).toFixed(1)} User Rating
              </div>

              <p className='movie-details-overview'>{show.movie?.overview || 'No overview available'}</p>

              <p className='movie-details-meta'>
                {show.movie?.runtime ? timeFormat(show.movie.runtime) : '120 min'} • 
                {show.movie?.original_language?.toUpperCase() || 'EN'} • 
                {show.movie?.release_date ? show.movie.release_date.split("-")[0] : 'N/A'}
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
              {show.movie?.casts && show.movie.casts.length > 0 ? (
                show.movie.casts.slice(0,12).map((cast,index)=> (
                  <div key={index} className='movie-details-cast-item'>
                    <img src={image_base_url + (cast.profile_path || '/default-profile.jpg')} alt="" className='movie-details-cast-image'/>
                    <p className='movie-details-cast-name'>{cast.name}</p>
                  </div>
                ))
              ) : (
                <div className='movie-details-cast-message'>
                  <p>Cast information not available</p>
                </div>
              )}
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
                  title={`${show.movie?.title || 'Movie'} Trailer`}
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
            {shows.slice(0,4).map((show, index)=> (
              <MovieCard key={index} movie={show.movie}/>
            ))}
          </div>
          <div className='movie-details-show-more'>
            <button onClick={()=> {navigate('/movies'); scrollTo(0,0)}} className='movie-details-show-more-btn'>Show more</button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
          <p>Movie not found</p>
        </div>
      )}
    </div>
  )
}

export default MovieDetails
