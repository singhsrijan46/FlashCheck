import React from 'react'
import './AboutUs.css'

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About Us</h1>
          <p>Your trusted partner for seamless movie ticket booking</p>
        </div>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            We were founded in 2024 with a simple mission: making movie ticket booking effortless and enjoyable. 
            What started as a small team of passionate movie enthusiasts has grown into a trusted platform 
            serving thousands of customers across India. Our journey began when we realized that booking movie 
            tickets was often a frustrating experience with long queues, limited showtime information, and 
            complicated booking processes. We decided to change this by creating a platform that puts the 
            user experience first. Today, we're proud to serve movie lovers across the country, helping them 
            discover and book their favorite films with just a few clicks.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide a seamless, user-friendly platform that connects 
            movie lovers with their favorite films. We believe that booking movie tickets should be as 
            simple as a few clicks. We strive to eliminate the stress and inconvenience that often comes 
            with movie ticket booking by offering real-time availability, instant confirmations, and a 
            mobile-first experience. Our goal is to make cinema accessible to everyone, ensuring that 
            the focus remains on enjoying the movie experience rather than the booking process. We're 
            committed to continuous innovation and improvement to provide the best possible service to 
            our customers.
          </p>
        </div>

        <div className="about-section">
          <h2>What We Offer</h2>
          <p>
            We provide access to the latest movies across all genres with real-time updates and instant booking confirmations. 
            Our platform offers simple and intuitive booking with secure payment options, optimized for all devices. 
            From blockbuster releases to indie gems, we ensure you never miss your favorite films. Our comprehensive 
            service includes detailed movie information, user reviews, showtime comparisons, and seat selection. 
            We partner with theaters nationwide to bring you the widest selection of movies and showtimes. 
            Our mobile app and responsive website work seamlessly across all devices, allowing you to book tickets 
            anytime, anywhere. We also offer special discounts, loyalty programs, and exclusive deals to make 
            your movie-going experience even more enjoyable.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs 