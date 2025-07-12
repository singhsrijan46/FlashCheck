import React, { useRef, useState } from 'react';
import './HeroSection.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

import banner1 from '../../assets/demon-slayer.jpg';
import logo1 from '../../assets/demon-slayer_logo.png';

// import banner2 from '../../assets/movie2.jpg';
// import logo2 from '../../assets/movie2_logo.png';

// import banner3 from '../../assets/movie3.jpg';
// import logo3 from '../../assets/movie3_logo.png';

// import banner4 from '../../assets/movie4.jpg';
// import logo4 from '../../assets/movie4_logo.png';

// import banner5 from '../../assets/movie5.jpg';
// import logo5 from '../../assets/movie5_logo.png';

const slides = [
  {
    banner: banner1,
    logo: logo1,
    year: '2025',
    rating: 'U/A 13+',
    duration: '1h 53m',
    languages: '5 Languages',
    desc: 'A demon-hunting adventure with breathtaking animation and heartfelt storytelling.',
    tags: 'Action | Anime | Fantasy',
  },
  {
    banner: banner1,
    logo: logo1,
    year: '2024',
    rating: 'U/A 16+',
    duration: '2h 10m',
    languages: '3 Languages',
    desc: 'Cybernetics and rebellion merge in a gripping futuristic thriller.',
    tags: 'Sci-Fi | Action | Drama',
  },
  {
    banner: banner1,
    logo: logo1,
    year: '2023',
    rating: 'U',
    duration: '1h 30m',
    languages: 'English',
    desc: 'Heartwarming animated journey of friendship and growth.',
    tags: 'Animation | Family | Adventure',
  },
  {
    banner: banner1,
    logo: logo1,
    year: '2022',
    rating: 'U/A',
    duration: '2h',
    languages: 'Hindi, Tamil',
    desc: 'A spine-chilling horror mystery with shocking twists.',
    tags: 'Horror | Mystery | Thriller',
  },
  {
    banner: banner1,
    logo: logo1,
    year: '2021',
    rating: 'A',
    duration: '2h 15m',
    languages: '4 Languages',
    desc: 'A gritty crime drama rooted in betrayal and survival.',
    tags: 'Crime | Suspense | Drama',
  }
];

const HeroSection = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleThumbClick = (index) => {
    swiperRef.current?.slideToLoop(index); // slideToLoop ensures loop works correctly
  };

  return (
    <div className="herosection-wrapper">
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        effect="fade"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="herosection-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className='herosection'>
              <img src={slide.banner} alt="Movie Banner" />
              <div className='blend-overlay'></div>
              <div className='gradient-container'></div>

              <ul className={`details ${index === activeIndex ? 'fade-in' : 'fade-out'}`}>
                <img src={slide.logo} alt="Movie Logo" />
                <p className="p1">{slide.year} | {slide.rating} | {slide.duration} | {slide.languages}</p>
                <p className="p2">{slide.desc}</p>
                <p className="p3">{slide.tags}</p>
                <button>See Details</button>
              </ul>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <div className="thumbnails">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.banner}
            alt="thumb"
            className={`thumb ${index === activeIndex ? 'active-thumb' : ''}`}
            onClick={() => handleThumbClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
