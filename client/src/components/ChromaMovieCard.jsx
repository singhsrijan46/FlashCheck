import { useRef, useEffect } from "react";
import { StarIcon } from 'lucide-react';
import { gsap } from "gsap";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import "./ChromaMovieCard.css";

export const ChromaMovieCard = ({
  movie,
  className = "",
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  // Add null checks to prevent crashes
  if (!movie) {
    return null;
  }

  // Handle both movie and show.movie structures
  const movieData = movie.movie || movie;
  
  if (!movieData) {
    return null;
  }

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = () => {
    navigate(`/movies/${movieData._id}`);
    scrollTo(0, 0);
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
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
    <div
      ref={rootRef}
      className={`chroma-movie-grid ${className}`}
      style={{
        "--r": `${radius}px`,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <article
        className="chroma-movie-card"
        onMouseMove={handleCardMove}
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
      </article>
      <div className="chroma-movie-overlay" />
      <div ref={fadeRef} className="chroma-movie-fade" />
    </div>
  );
};

export default ChromaMovieCard;
