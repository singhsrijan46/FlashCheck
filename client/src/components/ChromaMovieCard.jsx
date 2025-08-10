import { StarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import "./ChromaMovieCard.css";

export const ChromaMovieCard = ({
  movie,
  className = "",
}) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();

  // Add null checks to prevent crashes
  if (!movie) {
    return null;
  }

  // Handle both movie and show.movie structures
  const movieData = movie.movie || movie;
  
  if (!movieData) {
    return null;
  }

  const handleCardClick = () => {
    navigate(`/movies/${movieData._id}`);
    scrollTo(0, 0);
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage for CSS custom properties
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    card.style.setProperty("--mouse-x", `${xPercent}%`);
    card.style.setProperty("--mouse-y", `${yPercent}%`);
  };

  const handleCardLeave = (e) => {
    const card = e.currentTarget;
    // Reset to center when mouse leaves
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "50%");
  };

  // Generate border color based on rating
  const getBorderColor = (rating) => {
    if (rating >= 8) return "#10B981";
    if (rating >= 6) return "#3B82F6";
    if (rating >= 4) return "#F59E0B";
    return "#EF4444";
  };

  const movieRating = movieData.vote_average || 0;
  const borderColor = getBorderColor(movieRating);

  return (
    <div className={`chroma-movie-card-container ${className}`}>
      <article
        className="chroma-movie-card"
        onMouseMove={handleCardMove}
        onMouseLeave={handleCardLeave}
        onClick={handleCardClick}
        style={{
          "--card-border": borderColor,
          cursor: "pointer",
        }}
      >
        <div className="chroma-movie-img-wrapper">
          <img 
            src={image_base_url + (movieData.poster_path || movieData.backdrop_path || '/default-poster.jpg')} 
            alt={movieData.title || 'Movie Poster'}
            loading="lazy" 
          />
          <div className="chroma-movie-poster-overlay">
            <div className="chroma-movie-rating-container">
              <div className="chroma-movie-rating-block">
                <StarIcon className="chroma-movie-rating-icon"/>
                <span className="chroma-movie-rating-value">{movieRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="chroma-movie-language-container">
              <span className="chroma-movie-language-badge">
                {movieData.original_language?.toUpperCase() || 'EN'}
              </span>
            </div>
          </div>
        </div>
        <footer className="chroma-movie-info">
          <h3 className="chroma-movie-title">{movieData.title || 'Unknown Movie'}</h3>
          <div className="chroma-movie-meta">
            <span className="chroma-movie-votes">
              {(Math.random() * (20 - 5) + 5).toFixed(1)}k votes
            </span>
            <span className="chroma-movie-dot">&bull;</span>
            <span className="chroma-movie-year">
              {movieData.release_date ? new Date(movieData.release_date).getFullYear() : 'N/A'}
            </span>
          </div>
        </footer>
        
        {/* CSS-based spotlight effect */}
        <div className="chroma-movie-spotlight"></div>
        
        {/* CSS-based glow effect */}
        <div className="chroma-movie-glow"></div>
      </article>
    </div>
  );
};

export default ChromaMovieCard;
