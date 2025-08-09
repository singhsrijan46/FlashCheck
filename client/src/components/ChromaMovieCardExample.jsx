import React from 'react';
import ChromaMovieCard from './ChromaMovieCard';
import ChromaMovieGrid from './ChromaMovieGrid';

// Example usage component
const ChromaMovieCardExample = () => {
  // Sample movie data for testing
  const sampleMovies = [
    {
      _id: "1",
      title: "Inception",
      backdrop_path: "/backdrop1.jpg",
      poster_path: "/poster1.jpg",
      vote_average: 8.8,
      release_date: "2010-07-16",
      original_language: "en"
    },
    {
      _id: "2", 
      title: "The Dark Knight",
      backdrop_path: "/backdrop2.jpg",
      poster_path: "/poster2.jpg",
      vote_average: 9.0,
      release_date: "2008-07-18",
      original_language: "en"
    },
    {
      _id: "3",
      title: "Interstellar", 
      backdrop_path: "/backdrop3.jpg",
      poster_path: "/poster3.jpg",
      vote_average: 8.6,
      release_date: "2014-11-07",
      original_language: "en"
    },
    {
      _id: "4",
      title: "The Matrix",
      backdrop_path: "/backdrop4.jpg", 
      poster_path: "/poster4.jpg",
      vote_average: 8.7,
      release_date: "1999-03-31",
      original_language: "en"
    },
    {
      _id: "5",
      title: "Pulp Fiction",
      backdrop_path: "/backdrop5.jpg",
      poster_path: "/poster5.jpg", 
      vote_average: 8.9,
      release_date: "1994-10-14",
      original_language: "en"
    },
    {
      _id: "6",
      title: "The Shawshank Redemption",
      backdrop_path: "/backdrop6.jpg",
      poster_path: "/poster6.jpg",
      vote_average: 9.3,
      release_date: "1994-09-23", 
      original_language: "en"
    }
  ];

  return (
    <div style={{ padding: '2rem', background: '#060010', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}>
        ChromaMovieCard Demo
      </h1>
      
      {/* Single Card Example */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ color: 'white', marginBottom: '1rem' }}>Single Card</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ChromaMovieCard 
            movie={sampleMovies[0]}
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
          />
        </div>
      </section>

      {/* Grid Example */}
      <section>
        <h2 style={{ color: 'white', marginBottom: '1rem' }}>Movie Grid</h2>
        <ChromaMovieGrid 
          movies={sampleMovies}
          columns={3}
          gap="1.5rem"
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </section>
    </div>
  );
};

export default ChromaMovieCardExample;
