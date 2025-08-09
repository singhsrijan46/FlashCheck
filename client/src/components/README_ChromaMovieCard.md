# ChromaMovieCard Usage Guide

## Overview
The ChromaMovieCard is a modern, animated movie card component with the following features:
- Chroma/spotlight effect that follows mouse movement
- Dynamic gradient colors based on movie rating
- Smooth GSAP animations
- Responsive design
- All original MovieCard functionality preserved

## Usage

### Individual Card
```jsx
import ChromaMovieCard from './components/ChromaMovieCard';

// Single movie card
<ChromaMovieCard 
  movie={movieData}
  radius={300}
  damping={0.45}
  fadeOut={0.6}
  ease="power3.out"
/>
```

### Grid of Cards
```jsx
import ChromaMovieGrid from './components/ChromaMovieGrid';

// Grid of multiple movie cards
<ChromaMovieGrid 
  movies={moviesArray}
  columns={3}
  gap="1.5rem"
  radius={300}
  damping={0.45}
  fadeOut={0.6}
  ease="power3.out"
/>
```

### Replacing Existing MovieCard

#### In HeroSection.jsx
```jsx
// OLD:
import MovieCard from '../components/MovieCard';
{movies.map((movie, index) => (
  <MovieCard key={index} movie={movie} />
))}

// NEW:
import ChromaMovieGrid from '../components/ChromaMovieGrid';
<ChromaMovieGrid 
  movies={movies}
  columns={4}
  className="hero-movies-grid"
/>
```

#### In FeaturedSection.jsx
```jsx
// OLD:
import MovieCard from '../components/MovieCard';
{movies.map((movie, index) => (
  <MovieCard key={index} movie={movie} />
))}

// NEW:
import ChromaMovieGrid from '../components/ChromaMovieGrid';
<ChromaMovieGrid 
  movies={movies}
  columns={3}
  className="featured-movies-grid"
/>
```

#### In Movies.jsx (Movie listing page)
```jsx
// OLD:
import MovieCard from '../components/MovieCard';
{movies.map((movie, index) => (
  <MovieCard key={index} movie={movie} />
))}

// NEW:
import ChromaMovieGrid from '../components/ChromaMovieGrid';
<ChromaMovieGrid 
  movies={movies}
  columns={4}
  className="movies-page-grid"
/>
```

## Props

### ChromaMovieCard Props
- `movie` (object, required): Movie data object
- `radius` (number, default: 300): Spotlight effect radius
- `damping` (number, default: 0.45): Animation damping
- `fadeOut` (number, default: 0.6): Fade out duration
- `ease` (string, default: "power3.out"): GSAP easing function
- `className` (string, default: ""): Additional CSS classes

### ChromaMovieGrid Props
- `movies` (array, required): Array of movie objects
- `columns` (number, default: 3): Number of grid columns
- `gap` (string, default: "1.5rem"): Grid gap size
- `radius` (number, default: 300): Spotlight effect radius for all cards
- `damping` (number, default: 0.45): Animation damping for all cards
- `fadeOut` (number, default: 0.6): Fade out duration for all cards
- `ease` (string, default: "power3.out"): GSAP easing for all cards
- `className` (string, default: ""): Additional CSS classes

## Movie Object Structure
The component expects the same movie object structure as the original MovieCard:
```javascript
{
  _id: "unique_id",
  title: "Movie Title",
  backdrop_path: "/path/to/backdrop.jpg",
  poster_path: "/path/to/poster.jpg",
  vote_average: 7.5,
  release_date: "2024-01-01",
  original_language: "en"
}
```

## Color System
- **Green gradient**: Rating >= 8.0 (Excellent)
- **Blue gradient**: Rating >= 6.0 (Good)
- **Orange gradient**: Rating >= 4.0 (Average)
- **Red gradient**: Rating < 4.0 (Poor)

## Features Preserved from Original MovieCard
- Click navigation to movie details page
- Rating display with star icon
- Language badge
- Movie title and year
- Book Ticket button on hover
- Responsive design
- Image lazy loading
- Error handling for missing data

## Performance Notes
- Uses GSAP for smooth animations
- Optimized for 60fps performance
- Minimal re-renders with useRef
- Lazy loading for images
- CSS transforms for hardware acceleration
