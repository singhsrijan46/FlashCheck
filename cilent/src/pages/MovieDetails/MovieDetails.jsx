import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import './MovieDetails.css';
import poster from '../../assets/demon-slayer_poster.webp';
import logo from '../../assets/demon-slayer_logo.png';
import { ArrowLeft } from 'lucide-react';
import FeaturedSection from '../../components/FeaturedSection/FeaturedSection';
import { useAppContext } from '../../context/AppContext';

const MovieDetails = ({ onCityClick, onSignInClick }) => {
  // Remove city from useParams
  const { movieId } = useParams();
  const { city = 'new-delhi' } = useAppContext();
  const navigate = useNavigate();
  const trailerRef = useRef(null);

  // Sample movie data - in a real app, this would be fetched based on movieId
  const movie = {
    id: movieId,
    title: 'Demon Slayer: Mugen Train',
    year: '2025',
    rating: 'U/A 13+',
    duration: '1h 53m',
    languages: '5 Languages',
    genres: ['Action', 'Anime', 'Fantasy'],
    votes: 1250,
    score: 8.5,
    desc: 'A demon-hunting adventure with breathtaking animation and heartfelt storytelling. Tanjiro Kamado and his companions board the Mugen Train to investigate a series of disappearances, only to find themselves facing a powerful demon that has been consuming passengers.',
    poster,
    logo,
    director: 'Haruo Sotozaki',
    producer: 'Yuma Takahashi',
    writer: 'Koyoharu Gotouge',
    cast: [
      { name: 'Tanjiro Kamado', actor: 'Natsuki Hanae', img: logo, role: 'Main Character' },
      { name: 'Nezuko Kamado', actor: 'Akari Kitō', img: logo, role: 'Supporting Character' },
      { name: 'Kyojuro Rengoku', actor: 'Satoshi Hino', img: logo, role: 'Flame Hashira' },
      { name: 'Inosuke Hashibira', actor: 'Yoshitsugu Matsuoka', img: logo, role: 'Supporting Character' },
      { name: 'Zenitsu Agatsuma', actor: 'Hiro Shimono', img: logo, role: 'Supporting Character' },
    ],
    crew: [
      { name: 'Haruo Sotozaki', role: 'Director', img: logo },
      { name: 'Yuma Takahashi', role: 'Producer', img: logo },
      { name: 'Koyoharu Gotouge', role: 'Original Creator', img: logo },
      { name: 'Akira Matsushima', role: 'Character Designer', img: logo },
      { name: 'Yuki Kajiura', role: 'Music Composer', img: logo },
    ],
    trailer: 'https://www.youtube.com/embed/ATJYac_dORw',
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleShowTrailer = () => {
    if (trailerRef.current) {
      trailerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="moviedetails-page-container">
      
      {/* Back Button */}
      <button className="back-button" onClick={handleBackClick}>
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Banner Section */}
      <div className="movie-banner">
        <img className="banner-bg" src={movie.poster} alt="Movie Banner" />
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <div className="banner-left">
            <img className="movie-poster" src={movie.poster} alt="Movie Poster" />
            <div className="movie-info">
              <img className="movie-logo" src={movie.logo} alt="Movie Logo" />
              <h1 className="movie-title">{movie.title}</h1>
              <div className="movie-meta">
                <span>{movie.year}</span>
                <span>| {movie.rating}</span>
                <span>| {movie.duration}</span>
                <span>| {movie.languages}</span>
              </div>
              <div className="movie-rating-genres">
                <span className="movie-score">⭐ {movie.score} ({movie.votes} votes)</span>
                <div className="movie-genres">
                  {movie.genres.map((genre, i) => (
                    <span key={i} className="genre-tag">{genre}</span>
                  ))}
                </div>
              </div>
              <div className="movie-action-buttons">
                <button className="book-ticket-btn">Book Ticket</button>
                <button className="show-trailer-btn" onClick={handleShowTrailer}>Show Trailer</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Sections */}
      <div className="movie-details-sections">
        {/* About Section */}
        <section className="about-section">
          <h2>About</h2>
          <p>{movie.desc}</p>
        </section>

        {/* Cast Section */}
        <section className="cast-section">
          <h2>Cast</h2>
          <div className="cast-list">
            {movie.cast.map((member, idx) => (
              <div className="cast-card" key={idx}>
                <img src={member.img} alt={member.name} className="cast-img" />
                <div className="cast-info">
                  <span className="cast-name">{member.name}</span>
                  <span className="cast-actor">{member.actor}</span>
                  <span className="cast-role">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Crew Section */}
        <section className="crew-section">
          <h2>Crew</h2>
          <div className="crew-list">
            {movie.crew.map((member, idx) => (
              <div className="crew-card" key={idx}>
                <img src={member.img} alt={member.name} className="crew-img" />
                <div className="crew-info">
                  <span className="crew-name">{member.name}</span>
                  <span className="crew-role">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trailer Section */}
        <section className="trailer-section" ref={trailerRef}>
          <h2>Trailer</h2>
          <div className="trailer-embed-wrapper">
            <iframe
              width="100%"
              height="400"
              src={movie.trailer}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </div>

      <div className="recommended-section-wrapper">
        <FeaturedSection heading="Recommended Movies" onMovieClick={(movieId) => navigate(`/movies/${movieId}`)} />
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetails; 