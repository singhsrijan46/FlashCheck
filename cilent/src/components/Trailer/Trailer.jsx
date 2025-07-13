import React, { useState } from 'react';
import './Trailer.css';

const TRAILERS = [
  {
    id: 1,
    title: 'Marvel Television\'s Ironheart | Official Trailer | Disney+',
    youtubeId: 'Q9Hh2yCFFdA',
    thumbnail: 'https://img.youtube.com/vi/Q9Hh2yCFFdA/mqdefault.jpg',
  },
  {
    id: 2,
    title: 'Thunderbolts | Final Trailer',
    youtubeId: 'r6eYYb6V5lA',
    thumbnail: 'https://img.youtube.com/vi/r6eYYb6V5lA/mqdefault.jpg',
  },
  {
    id: 3,
    title: 'Captain America: Brave New World | Official Trailer',
    youtubeId: 'ZlNFpri-Y40',
    thumbnail: 'https://img.youtube.com/vi/ZlNFpri-Y40/mqdefault.jpg',
  },
  {
    id: 4,
    title: 'What If...? | Official Trailer',
    youtubeId: 'x9D0uUKJ5KI',
    thumbnail: 'https://img.youtube.com/vi/x9D0uUKJ5KI/mqdefault.jpg',
  },
];

const Trailer = () => {
  const [selected, setSelected] = useState(TRAILERS[0]);

  return (
    <div className="trailer-section">
      <h2 className="trailer-heading">Recently Dropped Trailer</h2>
      <div className="main-trailer">
        <iframe
          width="100%"
          height="450"
          src={`https://www.youtube.com/embed/${selected.youtubeId}`}
          title={selected.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="trailer-thumbnails">
        {TRAILERS.map((trailer) => (
          <div
            key={trailer.id}
            className={`thumbnail-item${selected.id === trailer.id ? ' selected' : ''}`}
            onClick={() => setSelected(trailer)}
          >
            <img src={trailer.thumbnail} alt={trailer.title} />
            <div className="play-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,0.5)" />
                <polygon points="16,13 28,20 16,27" fill="#fff" />
              </svg>
            </div>
            <div className="trailer-title">{trailer.title.split('|')[0].trim()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trailer; 