import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import Hero from "../components/Hero/Hero";
import Slider from "../components/Servicess/Slider";
import OurService from "../components/OurService/OurService";
import Contact from "../components/Contact/contact";
// import Testimonial from "../components/Testimonial/Testimonial";
import Banner from "../components/Banner/Banner";
// import BannerPic from "../components/BannerPic/BannerPic";
// import BannerImg from "../assets/nature.jpg";
// import SplashCursor from "../components/SplashCursor/SplashCursor";
// import OrderPopup from "../components/OrderPopup/OrderPopup";

// Import all video files
// import Video1 from "../assets/homepage/1.mp4";
// import Video2 from "../assets/homepage/2.mp4";
// import Video3 from "../assets/homepage/3.mp4";
// import Video4 from "../assets/homepage/4.mp4";
// import Video5 from "../assets/homepage/5.mp4";

// Import images for the image slider (fallback)
import Img1 from "../assets/homepage/11.jpg";
import Img2 from "../assets/homepage/22.jpg";
import Img3 from "../assets/homepage/33.jpg";
import Img4 from "../assets/homepage/44.jpg";
import Img5 from "../assets/homepage/55.jpg";

// Import BackendUrl for API calls
import { BackendUrl } from "../BackendUrl";

// Add GSAP imports
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { SplitText } from "gsap/SplitText";

// // Register GSAP plugins
// gsap.registerPlugin(ScrollTrigger, SplitText);

// Loading component with beautiful animations
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="flex flex-col items-center">
      <div className="flex">
        <div className="loader">
          <svg viewBox="0 0 80 80">
            <circle r="32" cy="40" cx="40" id="test"></circle>
          </svg>
        </div>
        <div className="loader triangle">
          <svg viewBox="0 0 86 80">
            <polygon points="43 8 79 72 7 72"></polygon>
          </svg>
        </div>
        <div className="loader">
          <svg viewBox="0 0 80 80">
            <rect height="64" width="64" y="8" x="8"></rect>
          </svg>
        </div>
      </div>
      <div className="loading-text">
        Loading your adventure...
      </div>
    </div>
  </div>
);

const Home = ({ showMenu, setShowMenu }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Listen for menu close on route change (for mobile nav)
  React.useEffect(() => {
    if (showMenu) {
      const closeMenuOnRoute = () => setShowMenu(false);
      window.addEventListener('popstate', closeMenuOnRoute);
      return () => window.removeEventListener('popstate', closeMenuOnRoute);
    }
  }, [showMenu, setShowMenu]);

  // Simulate loading time for the beautiful animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`relative min-h-screen bg-gradient-to-b from-black via-black to-blue-900 ${showMenu ? 'overflow-hidden' : 'overflow-x-hidden'}`}>
      {/* <SplashCursor /> */}
      {/* Blue blurred circle background effect centered, smaller and only in the center */}
      <div className="z-0 absolute opacity-80 rounded-full blur-[120px] w-[300px] h-[300px] bg-blue-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      {/* Hero Section with Video Slider */}
      <div className="relative min-h-screen">
        <ImageSlider />
        <div className="relative z-20">
          <Hero />
        </div>
      </div>

      {/* Main content section */}
      <div className="relative z-10">
        <Slider />
        <OurService />
        {/* <BannerPic img={BannerImg} /> */}
        <Banner />
        <Contact />
      </div>
    </div>
  );
};

Home.propTypes = {
  showMenu: PropTypes.bool.isRequired,
  setShowMenu: PropTypes.func.isRequired
};

// ImageSlider component
const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const progressRef = React.useRef(null);
  const imageRefs = React.useRef([]);

  // Fallback slides if API fails
  const fallbackSlides = [
    {
      imgSrc: Img1,
      title: "Wonderful.",
      subtitle: "Island",
      description: "🌴 Wonderful Island — Sri Lanka, a land of breathtaking beauty where golden beaches meet lush mountains. Discover ancient temples, vibrant wildlife, and warm hospitality. From serene tea plantations to rich cultural heritage, every moment on this island is a timeless memory.",
    },
    {
      imgSrc: Img2,
      title: "Camping.",
      subtitle: "Enjoy",
      description:
        "🏕️ Camping — Enjoy the Outdoors Escape into nature's embrace with the joy of camping. From starlit skies to crackling campfires, experience tranquility in the wild. Whether it's mountains, forests, or lakesides, every moment outdoors brings adventure, relaxation, and memories that last a lifetime.",
    },
    {
      imgSrc: Img3,
      title: "Adventures.",
      subtitle: "Off Road",
      description: "🚵 Adventures — Off RoadEmbrace the thrill of off-road adventures where rugged trails and untamed landscapes await. Conquer mountains, forests, and muddy terrains with every twist and turn. It's not just the destination — it's the adrenaline-fueled journey that makes every ride unforgettable.",
    },
    {
      imgSrc: Img4,
      title: "Road Trip.",
      subtitle: "Together",
      description: "🚗 Road Trip — TogetherHit the open road with friends and family for an unforgettable journey. Explore scenic routes, discover hidden gems, and create lasting memories along the way. A road trip is more than just travel; it's the joy of togetherness..",
    },
    {
      imgSrc: Img5,
      title: "Feel Nature.",
      subtitle: "Relax",
      description: "🌿 Feel Nature — RelaxDisconnect from the hustle and reconnect with nature. Breathe in the fresh air, listen to the calming sounds of wildlife, and unwind in serene landscapes. Let nature's beauty and tranquility restore your mind, body, and soul.",
    },
  ];

  // Fetch slides from Front API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BackendUrl}/api/front/`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Transform API data to match slide format
          const apiSlides = data.map(item => ({
            imgSrc: item.logo_image ? `${BackendUrl}${item.logo_image}` : Img1, // Use fallback if no image
            title: item.heading || "Welcome",
            subtitle: item.subheading || "Adventure",
            description: item.paragraph || "Discover amazing experiences with us.",
          }));
          setSlides(apiSlides);
        } else {
          // Use fallback slides if no data from API
          setSlides(fallbackSlides);
        }
      } catch (error) {
        console.error("Failed to fetch slides:", error);
        setError("Failed to load slides");
        // Use fallback slides on error
        setSlides(fallbackSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Progress bar and auto-slide logic
  useEffect(() => {
    if (isTransitioning || slides.length === 0) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleSlideChange('next');
          return 0;
        }
        return prev + 0.5;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning, slides.length]);

  // Slide change handler
  const handleSlideChange = (direction = 'next') => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % slides.length;
    } else if (direction === 'prev') {
      nextIndex = (currentIndex - 1 + slides.length) % slides.length;
    } else if (typeof direction === 'number') {
      nextIndex = direction;
    }
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
      setProgress(0);
    }, 400); // match transition duration
  };

  const handleDotClick = (index) => {
    if (index === currentIndex || isTransitioning || slides.length === 0) return;
    handleSlideChange(index);
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading slides...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && slides.length === 0) {
    return (
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <p>Using fallback content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      {/* Image slides with enhanced transitions */}
      {slides.map((slide, index) => (
        <div
          key={index}
          ref={el => imageRefs.current[index] = el}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 pointer-events-none ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            className="w-full h-full object-cover"
            src={slide.imgSrc}
            alt={slide.title}
            onError={(e) => {
              // Fallback to default image if API image fails to load
              e.target.src = Img1;
            }}
          />
        </div>
      ))}

      {/* Enhanced text content */}
      <div
        className="absolute inset-y-0 left-0 flex flex-col items-start justify-center pl-8 sm:pl-16 z-20"
        style={{
          width: "50%",
          maxWidth: "60vw",
          pointerEvents: "auto",
        }}
      >
        <h1
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-left break-words leading-tight w-full max-w-[95vw] perspective-1000"
          style={{ fontFamily: "'Bebas Neue'", color: "#111827" }}
        >
          <AnimatedText text={slides[currentIndex]?.title || "Welcome"} />
        </h1>
        <h2
          className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 text-left break-words leading-tight w-full max-w-[95vw] cursor-pointer"
          style={{ color: "#111827" }}
        >
          <AnimatedText text={slides[currentIndex]?.subtitle || "Adventure"} delay={300} />
        </h2>
        <p
          className="text-base sm:text-lg md:text-2xl lg:text-3xl text-left break-words leading-snug w-full max-w-[95vw] font-bold"
          style={{ textAlign: "justify", color: "#C0C0C0", fontFamily: "'Lobster', cursive" }}
        >
          <AnimatedText text={slides[currentIndex]?.description || "Discover amazing experiences with us."} delay={600} />
        </p>
      </div>

      {/* Enhanced navigation with progress bar */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 z-10">
        <div className="w-full max-w-[200px] h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            ref={progressRef}
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
    </div>
  );
};

// Add this helper for animated text
function AnimatedText({ text, className = "", delay = 0 }) {
  const [displayed, setDisplayed] = React.useState("");
  React.useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed((prev) => prev + text[i]);
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 18);
    }, delay);
    return () => {
      clearTimeout(timeout);
      setDisplayed("");
    };
  }, [text, delay]);
  return <span className={className}>{displayed}</span>;
}

export default Home;
