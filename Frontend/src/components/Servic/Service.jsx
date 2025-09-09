"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { BackendUrl } from "../../BackendUrl";
import "./ServiceCard.css";
import PropTypes from "prop-types";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Helper: get image URL for preview (like AddPlace)
const getImageUrl = (img) => {
  if (!img) return "/placeholder.svg";
  
  // Handle full URLs
  if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://"))) {
    return img;
  }
  
  // Handle relative paths from backend
  if (typeof img === "string") {
    // If it's already a full URL from Django serializer, return as is
    if (img.includes('://')) {
      return img;
    }
    
    // If it's a relative path, construct the full URL
    const cleanPath = img.startsWith('/') ? img.substring(1) : img;
    return `${BackendUrl}/media/${cleanPath}`;
  }
  
  // Handle File objects (if any)
  if (img instanceof File) {
    return URL.createObjectURL(img);
  }
  
  return "/placeholder.svg";
};

const PlaceCard = ({ place, onClick, buttonText = "Book Now" }) => (
  <div className="uiverse-card" onClick={() => onClick(place)} style={{ position: 'relative' }}>
    {/* Main image as background */}
    {place.main_image && (
      <>
        <img
          src={place.main_image_url || getImageUrl(place.main_image)}
          alt={place.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
          onError={(e) => {
            e.target.src = '/placeholder.svg';
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.25)',
            zIndex: 1,
          }}
        />
      </>
    )}
    {/* SVG icon */}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ zIndex: 2, position: 'relative' }}>
      <path
        d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"
      ></path>
    </svg>
    <div className="uiverse-card__content" style={{ zIndex: 3, position: 'relative' }}>
      <p className="uiverse-card__title">{place.title}</p>
      <p className="uiverse-card__description">{place.description}</p>
      <p className="uiverse-card__description price">
        ${place.price ? Number(place.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
      </p>
      <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-300">
        {buttonText}
      </button>
    </div>
  </div>
);

PlaceCard.propTypes = {
  place: PropTypes.shape({
    main_image: PropTypes.string,
    main_image_url: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
};

// Update SectionHeader to use the popping, black, bold, large, and animated style
const SectionHeader = ({ title }) => (
  <motion.h1
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5 }}
    className="text-4xl font-extrabold mb-10 mt-10 text-black drop-shadow-lg animate-pulse"
  >
    {title}
  </motion.h1>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

// Particle background component (from PlaceView.jsx)
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 2,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

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
        Loading amazing destinations...
      </div>
    </div>
  </div>
);

export default function TravelService() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const smootherRef = useRef(null);
  const mainRef = useRef(null);

  // Add scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${BackendUrl}/api/places/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Data received successfully
        // Log the first place to see the structure (for debugging)
        if (data && data.length > 0) {
          console.log('Places loaded successfully:', data.length, 'places');
        }
        setPlaces(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching places:', error);
        setLoading(false);
      });
  }, []);

  // GSAP ScrollSmoother effect
  useEffect(() => {
    if (mainRef.current && !smootherRef.current) {
      smootherRef.current = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        effects: true,
      });
    }
    // Always scroll to top on mount (page reload)
    window.scrollTo(0, 0);
    if (smootherRef.current) {
      smootherRef.current.scrollTo(0, true);
    }
    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
        smootherRef.current = null;
      }
    };
  }, []);

  const trendingPlaces = places.filter((p) => p.place_type === "trending");
  const five_day = places.filter((p) => p.place_type === "five_day");
  const seven_days = places.filter((p) => p.place_type === "seven_days");
  const eight_days = places.filter((p) => p.place_type === "eight_days");
  const ten_days = places.filter((p) => p.place_type === "ten_days");
  const fourteen_days = places.filter((p) => p.place_type === "fourteen_days");
  const eighteen_dyas = places.filter((p) => p.place_type === "eighteen_dyas");
  // Remove the getTrendingPlace function and use array indices directly
  const trendingPlace1 = trendingPlaces[0] || {};
  const trendingPlace2 = trendingPlaces[1] || {};
  const trendingPlace3 = trendingPlaces[2] || {};
  const trendingPlace4 = trendingPlaces[3] || {};
  const trendingPlace5 = trendingPlaces[4] || {};

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-sky-400 via-sky-100 to-sky-50 overflow-hidden">
      {/* Blue blurred circle background effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 opacity-40 blur-[180px]" />
      <ParticleBackground />
      <div className="relative z-10" id="smooth-wrapper">
        <div id="smooth-content" ref={mainRef}>
          <div
            className="container mx-auto py-20 px-5"
            style={{ scrollBehavior: "smooth" }} // Enable smooth scroll for anchor navigation
          >
            {/* Trending Section */}
           
            {/* Trending Section - Smooth & Unique Design */}
            {(trendingPlace1?.main_image || trendingPlace2?.main_image || trendingPlace3?.main_image || trendingPlace4?.main_image || trendingPlace5?.main_image) ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.6, -0.05, 0.01, 0.99] }}
                className="mb-24"
                style={{ marginTop: "80px" }}
              >
                {/* Floating background elements */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <motion.div
                    className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
                    animate={{
                      x: [0, 100, 0],
                      y: [0, -50, 0],
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl"
                    animate={{
                      x: [0, -80, 0],
                      y: [0, 60, 0],
                      scale: [1, 0.8, 1],
                      opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 4
                    }}
                  />
                </motion.div>

                {/* Header with smooth animations */}
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
                  className="text-center mb-16 relative z-10"
                >
                  <motion.h1 
                    className="text-6xl font-black mb-6 text-black"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      backgroundSize: "200% 200%"
                    }}
                  >
                    ✨ Trending Destinations
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                  >
                    Embark on extraordinary journeys to the world&apos;s most captivating destinations
                  </motion.p>
                </motion.div>

                {/* Smooth Card Grid with staggered animations */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 3 }}
                >
                  {/* Card 1 - Glass Morphism */}
                  {trendingPlace1?.main_image && (
          <motion.div
                      initial={{ opacity: 0, y: 50, rotateY: -15 }}
                      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 4.5, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="group relative overflow-hidden rounded-3xl transform perspective-1000"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={trendingPlace1.main_image_url || getImageUrl(trendingPlace1.main_image)}
                          alt={trendingPlace1.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      </div>

                      {/* Glass Overlay */}
                      <div className="relative h-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                        {/* Top Section with Image */}
                        <div className="relative h-80 overflow-hidden rounded-t-3xl">
            <img
              src={trendingPlace1.main_image_url || getImageUrl(trendingPlace1.main_image)}
              alt={trendingPlace1.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                          
                          {/* Glass Price Badge */}
                          <div 
                            className="absolute top-4 right-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-4 py-2 shadow-2xl"
                          >
                            <span className="text-lg font-bold text-white drop-shadow-lg">
                              ${trendingPlace1.price ? Number(trendingPlace1.price).toLocaleString() : "0"}
                            </span>
                          </div>

                          {/* Glass Status Badge */}

                        </div>

                        {/* Glass Content Section */}
                        <div className="p-8 bg-white/10 backdrop-blur-xl border-t border-white/20">
                                                    <h3
                            className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300 drop-shadow-lg"
                          >
                            {trendingPlace1.title}
                          </h3>
              {trendingPlace1.package_title && (
                            <p className="text-blue-200 font-semibold mb-4 text-lg drop-shadow-md">{trendingPlace1.package_title}</p>
                          )}
                          <p className="text-white/90 mb-6 line-clamp-2 leading-relaxed drop-shadow-md">
                            {trendingPlace1.subtitle || "Experience the adventure of a lifetime"}
                          </p>
                          
                          {/* Glass Button */}
            <button
              onClick={() => navigate(`/PlaceView/${trendingPlace1.id}`, { state: { place: trendingPlace1 } })}
                            className="w-full bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:bg-white/30 hover:border-white/50"
            >
                            Explore Now →
            </button>
                        </div>
                      </div>
          </motion.div>
        )}

                  {/* Card 2 - Glass Morphism */}
                  {trendingPlace2?.main_image && (
          <motion.div
                      initial={{ opacity: 0, y: 50, rotateY: -15 }}
                      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 4.5, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="group relative overflow-hidden rounded-3xl transform perspective-1000"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={trendingPlace2.main_image_url || getImageUrl(trendingPlace2.main_image)}
                          alt={trendingPlace2.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      </div>

                      {/* Glass Overlay */}
                      <div className="relative h-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                        {/* Top Section with Image */}
                        <div className="relative h-80 overflow-hidden rounded-t-3xl">
            <img
              src={trendingPlace2.main_image_url || getImageUrl(trendingPlace2.main_image)}
              alt={trendingPlace2.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                          
                          {/* Glass Price Badge */}
                          <div 
                            className="absolute top-4 right-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-4 py-2 shadow-2xl"
                          >
                            <span className="text-lg font-bold text-white drop-shadow-lg">
                              ${trendingPlace2.price ? Number(trendingPlace2.price).toLocaleString() : "0"}
                            </span>
                          </div>

                          {/* Glass Status Badge */}
                          
                        </div>

                        {/* Glass Content Section */}
                        <div className="p-8 bg-white/10 backdrop-blur-xl border-t border-white/20">
                                                    <h3
                            className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300 drop-shadow-lg"
                          >
                            {trendingPlace2.title}
                          </h3>
              {trendingPlace2.package_title && (
                            <p className="text-blue-200 font-semibold mb-4 text-lg drop-shadow-md">{trendingPlace2.package_title}</p>
                          )}
                          <p className="text-white/90 mb-6 line-clamp-2 leading-relaxed drop-shadow-md">
                            {trendingPlace2.subtitle || "Unforgettable memories await"}
                          </p>
                          
                          {/* Glass Button */}
            <button
              onClick={() => navigate(`/PlaceView/${trendingPlace2.id}`, { state: { place: trendingPlace2 } })}
                            className="w-full bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:bg-white/30 hover:border-white/50"
            >
                            Discover More →
            </button>
                        </div>
                      </div>
          </motion.div>
        )}

                  {/* Card 3 - Glass Morphism */}
                  {trendingPlace3?.main_image && (
          <motion.div
                      initial={{ opacity: 0, y: 50, rotateY: -15 }}
                      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 4.5, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="group relative overflow-hidden rounded-3xl transform perspective-1000"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={trendingPlace3.main_image_url || getImageUrl(trendingPlace3.main_image)}
                          alt={trendingPlace3.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      </div>

                      {/* Glass Overlay */}
                      <div className="relative h-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                        {/* Top Section with Image */}
                        <div className="relative h-80 overflow-hidden rounded-t-3xl">
            <img
              src={trendingPlace3.main_image_url || getImageUrl(trendingPlace3.main_image)}
              alt={trendingPlace3.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                          
                          {/* Glass Price Badge */}
                          <motion.div 
                            className="absolute top-4 right-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-4 py-2 shadow-2xl"
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className="text-lg font-bold text-white drop-shadow-lg">
                              ${trendingPlace3.price ? Number(trendingPlace3.price).toLocaleString() : "0"}
                            </span>
                          </motion.div>

                          {/* Glass Status Badge */}
                          <motion.div 
                            className="absolute top-4 left-4 bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-xl border border-white/30 text-white px-3 py-1 rounded-full text-sm font-bold shadow-2xl"
                            whileHover={{ scale: 1.1 }}
                          >
                          </motion.div>
                        </div>

                        {/* Glass Content Section */}
                        <div className="p-8 bg-white/10 backdrop-blur-xl border-t border-white/20">
                                                    <h3
                            className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300 drop-shadow-lg"
                          >
                            {trendingPlace3.title}
                          </h3>
              {trendingPlace3.package_title && (
                            <p className="text-blue-200 font-semibold mb-4 text-lg drop-shadow-md">{trendingPlace3.package_title}</p>
                          )}
                          <p className="text-white/90 mb-6 line-clamp-2 leading-relaxed drop-shadow-md">
                            {trendingPlace3.subtitle || "Adventure calls your name"}
                          </p>
                          
                          {/* Glass Button */}
            <button
              onClick={() => navigate(`/PlaceView/${trendingPlace3.id}`, { state: { place: trendingPlace3 } })}
                            className="w-full bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:bg-white/30 hover:border-white/50"
            >
                            Book Adventure →
            </button>
                        </div>
                      </div>
          </motion.div>
        )}

                  {/* Card 4 - Glass Morphism */}
                  {trendingPlace4?.main_image && (
          <motion.div
                      initial={{ opacity: 0, y: 50, rotateY: -15 }}
                      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 4.5, delay: 2.0, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="group relative overflow-hidden rounded-3xl transform perspective-1000"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={trendingPlace4.main_image_url || getImageUrl(trendingPlace4.main_image)}
                          alt={trendingPlace4.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      </div>

                      {/* Glass Overlay */}
                      <div className="relative h-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                        {/* Top Section with Image */}
                        <div className="relative h-80 overflow-hidden rounded-t-3xl">
            <img
              src={trendingPlace4.main_image_url || getImageUrl(trendingPlace4.main_image)}
              alt={trendingPlace4.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                          
                          {/* Glass Price Badge */}
                          <div 
                            className="absolute top-4 right-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-4 py-2 shadow-2xl"
                          >
                            <span className="text-lg font-bold text-white drop-shadow-lg">
                              ${trendingPlace4.price ? Number(trendingPlace4.price).toLocaleString() : "0"}
                            </span>
                          </div>

                          {/* Glass Status Badge */}

                        </div>

                        {/* Glass Content Section */}
                        <div className="p-8 bg-white/10 backdrop-blur-xl border-t border-white/20">
                                                    <h3
                            className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300 drop-shadow-lg"
                          >
                            {trendingPlace4.title}
                          </h3>
              {trendingPlace4.package_title && (
                            <p className="text-blue-200 font-semibold mb-4 text-lg drop-shadow-md">{trendingPlace4.package_title}</p>
                          )}
                          <p className="text-white/90 mb-6 line-clamp-2 leading-relaxed drop-shadow-md">
                            {trendingPlace4.subtitle || "Your dream destination awaits"}
                          </p>
                          
                          {/* Glass Button */}
            <button
              onClick={() => navigate(`/PlaceView/${trendingPlace4.id}`, { state: { place: trendingPlace4 } })}
                            className="w-full bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:bg-white/30 hover:border-white/50"
            >
                            Start Journey →
            </button>
                        </div>
                      </div>
          </motion.div>
        )}

                  {/* Card 5 - Glass Morphism */}
                  {trendingPlace5?.main_image && (
          <motion.div
                      initial={{ opacity: 0, y: 50, rotateY: -15 }}
                      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 4.5, delay: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="group relative overflow-hidden rounded-3xl transform perspective-1000"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={trendingPlace5.main_image_url || getImageUrl(trendingPlace5.main_image)}
                          alt={trendingPlace5.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      </div>

                      {/* Glass Overlay */}
                      <div className="relative h-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                        {/* Top Section with Image */}
                        <div className="relative h-80 overflow-hidden rounded-t-3xl">
            <img
              src={trendingPlace5.main_image_url || getImageUrl(trendingPlace5.main_image)}
              alt={trendingPlace5.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                          
                          {/* Glass Price Badge */}
                          <div 
                            className="absolute top-4 right-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-4 py-2 shadow-2xl"
                          >
                            <span className="text-lg font-bold text-white drop-shadow-lg">
                              ${trendingPlace5.price ? Number(trendingPlace5.price).toLocaleString() : "0"}
                            </span>
                          </div>

                          {/* Glass Status Badge */}
                          
                        </div>

                        {/* Glass Content Section */}
                        <div className="p-8 bg-white/10 backdrop-blur-xl border-t border-white/20">
                                                    <h3
                            className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300 drop-shadow-lg"
                          >
                            {trendingPlace5.title}
                          </h3>
              {trendingPlace5.package_title && (
                            <p className="text-blue-200 font-semibold mb-4 text-lg drop-shadow-md">{trendingPlace5.package_title}</p>
                          )}
                          <p className="text-white/90 mb-6 line-clamp-2 leading-relaxed drop-shadow-md">
                            {trendingPlace5.subtitle || "Exclusive experiences await"}
                          </p>
                          
                          {/* Glass Button */}
            <button
              onClick={() => navigate(`/PlaceView/${trendingPlace5.id}`, { state: { place: trendingPlace5 } })}
                            className="w-full bg-white/20 backdrop-blur-xl border border-white/30 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-2xl hover:bg-white/30 hover:border-white/50"
            >
                            Reserve Now →
            </button>
                        </div>
                      </div>
          </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">🌍</div>
                                     <h2 className="text-3xl font-bold text-gray-700 mb-4">No Trending Places Yet</h2>
                   <p className="text-gray-500 mb-6">We&apos;re preparing amazing destinations for you!</p>
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6">
                    <p className="text-sm text-gray-600">Check back soon for exciting new adventures</p>
                  </div>
              </div>
              </motion.div>
            )}
            {/* Leisure Travel Section */}
            <SectionHeader title="Five Day Package" />
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {five_day.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={(place) => navigate(`/PlaceView/${place.id}`, { state: { place } })}
                  buttonText="View Details"
                />
              ))}
            </motion.div>
            {/* Adventure Travel Section */}
            <SectionHeader title="Seven Day Package" />

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              
              {seven_days.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={(place) => navigate(`/PlaceView/${place.id}`, { state: { place } })}
                  buttonText="Buy Now"
                />
              ))}
            </motion.div>




            {/* Hiking & Trekking Section */}
            <SectionHeader title="Eight Day Package" />
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {eight_days.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={(place) => navigate(`/PlaceView/${place.id}`, { state: { place } })}
                  buttonText="Buy Now"
                />
              ))}
            </motion.div>

            <SectionHeader title="Ten Day Package" />
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {ten_days.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={(place) => navigate(`/PlaceView/${place.id}`, { state: { place } })}
                  buttonText="Buy Now"
                />
              ))}
            </motion.div>


            <SectionHeader title="Fourteen Day Package" />
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {fourteen_days.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={(place) => navigate(`/PlaceView/${place.id}`, { state: { place } })}
                  buttonText="Buy Now"
                />
              ))}
            </motion.div>

            <SectionHeader title="Eighteen Day Package" />
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {eighteen_dyas.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={(place) => navigate(`/PlaceView/${place.id}`, { state: { place } })}
                  buttonText="Buy Now"
                />
              ))}
            </motion.div>            

            
          </div>
        </div>
      </div>
    </section>
  );
}

{/* Travel Guides Section */}

{/* <motion.section
className="mt-28 bg-gray-900 text-white py-10"
initial={{ opacity: 0, scale: 0.9 }}
whileInView={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.8 }}
>
<h2 className="text-2xl font-bold text-center mb-6">Travel Guides</h2>
<Swiper
  slidesPerView={1}
  spaceBetween={30}
  loop={true}
  navigation
  pagination={{ clickable: true }}
  modules={[Navigation, Pagination]}
  className="w-full max-w-4xl mx-auto"
>
  <SwiperSlide>
    <motion.div
      className="bg-gray-800 p-5 rounded-lg text-center shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        {/* You can use a static image or a guide image from backend if available */}
        // <img
        //   src={"/placeholder.svg"}
        //   alt="Travel Guide"
        //   className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-gray-500"
        // />
//       </motion.div>
//       <p className="text-gray-300 italic">
//         "I have traveled across many countries!"
//       </p>
//       <h4 className="font-semibold mt-2 text-white">Akeel Shihab</h4>
//       <p className="text-sm text-gray-400">Travel Guide</p>
//     </motion.div>
//   </SwiperSlide>
// </Swiper>
// </motion.section> */

