import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import { motion, useSpring, useMotionValue } from "framer-motion";
import {BackendUrl} from "../../BackendUrl";

// Helper: get image URL for preview
const getImageUrl = (img) => {
  if (!img) return "/placeholder.svg";
  if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://")))
    return img;
  if (typeof img === "string") return `${BackendUrl}${img}`;
  return "/placeholder.svg";
};

// Particle background component
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
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

// Itinerary Item Component
const ItineraryItem = ({ day, sub_iterative_description, sub_description, photos, borderColor }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-l-4 p-4 mb-4 ${borderColor} bg-gray-800 rounded`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold">Day {day}</h3>
            <p className="text-gray-300">{sub_iterative_description}</p>
          </div>
          <span className="text-white">{open ? "−" : "+"}</span>
        </div>
      </button>
      {open && (
        <div className="mt-4 text-sm text-gray-200">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {photos && photos.map((photo, idx) => (
              <img
                key={idx}
                className="w-full h-64 object-cover rounded-lg"
                src={getImageUrl(photo.image)}
                alt={`Day ${day} Photo ${idx + 1}`}
              />
            ))}
          </div>
          <p className="mb-2">{sub_description}</p>
        </div>
      )}
    </div>
  );
};

ItineraryItem.propTypes = {
  day: PropTypes.number.isRequired,
  sub_iterative_description: PropTypes.string.isRequired,
  sub_description: PropTypes.string.isRequired,
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      image: PropTypes.string
    })
  ).isRequired,
  borderColor: PropTypes.string.isRequired
};

const PlaceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imageRef = useRef(null);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const scale = useSpring(1, springConfig);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const imageX = useSpring(0, springConfig);
  const imageY = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    
    mouseX.set(clientX);
    mouseY.set(clientY);
    
    // 3D tilt effect for main image
    rotateX.set((y - 0.5) * 12);
    rotateY.set((x - 0.5) * 12);
    imageX.set((x - 0.5) * 8);
    imageY.set((y - 0.5) * 8);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    imageX.set(0);
    imageY.set(0);
    scale.set(1);
  };

  const handleImageMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    
    // Enhanced 3D tilt for image container
    rotateX.set((y - 0.5) * 12);
    rotateY.set((x - 0.5) * 12);
    imageX.set((x - 0.5) * 10);
    imageY.set((y - 0.5) * 10);
    scale.set(1.02);
  };

  const handleImageMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    imageX.set(0);
    imageY.set(0);
    scale.set(1);
  };

  // Handle scroll to top on mount and reload
  useEffect(() => {
    // Function to scroll to top
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    // Scroll to top on mount
    scrollToTop();

    // Handle before unload to ensure scroll position is reset
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', scrollToTop);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', scrollToTop);
    };
  }, []);

  useEffect(() => {
    // Simulate loading time for the beautiful animation
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show loading for 1.5 seconds

    setLoading(true);
    fetch(`${BackendUrl}/api/places/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        // Map backend fields to frontend model
        const mapped = {
          id: data.id,
          subtitle: data.title,
          place_history: data.subtitle,
          main_image: data.main_image,
          sub_images: data.sub_images || [],
          included: data.include,
          exclude: data.exclude,
          tour_highlights: data.tour_highlights,
          about_place: data.about_place,
          price: data.price,
          package_title: data.package_title,
          price_title: data.price_title,
          itinerary_days: data.itinerary_days || [],
        };
        setPlace(mapped);
        setCurrentImage(data.main_image);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching place:", error);
        setLoading(false);
      });

    return () => clearTimeout(loadingTimer);
  }, [id]);

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
          Loading your adventure details...
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!place) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <div className="inline-block p-8 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/30 shadow-2xl transform -rotate-1 hover:rotate-0 transition-all duration-300" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/80"
        >
          Place not found
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="flex flex-col items-center w-full bg-gradient-to-b from-sky-400 via-sky-100 to-sky-50 text-white min-h-screen relative overflow-hidden pt-20"
      style={{ backgroundColor: '#87CEEB', marginTop: '0', minHeight: '100vh', height: '100%' }}
    >
      <ParticleBackground />
      {/* Modern floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 rounded-full blur-xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
      <div className="w-full max-w-4xl px-4 mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="relative pt-5 pb-5 w-full"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <header className="relative w-full">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white drop-shadow-lg"
              whileHover={{
                scale: 1.02,
                textShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
              }}
            >
              {place.subtitle}
            </motion.h1>
          </header>
        </motion.div>

        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="flex flex-col gap-8 items-center w-full"
        >
          <div 
            className="flex justify-center w-full relative group"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
              isolation: "isolate",
              willChange: "transform"
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div
              ref={imageRef}
              style={{
                rotateX,
                rotateY,
                scale,
                x: imageX,
                y: imageY,
                transformStyle: "preserve-3d",
                willChange: "transform",
                isolation: "isolate"
              }}
              className="relative rounded-2xl w-full h-auto max-h-[500px] shadow-lg border border-white/20 backdrop-blur-sm hover:border-white/25 transition-all duration-300 overflow-hidden"
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
            >
              <motion.img
                whileHover={{ 
                  filter: "brightness(1.03) contrast(1.01)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                }}
                transition={{ 
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="w-full h-full object-cover rounded-2xl min-w-full min-h-full"
                style={{
                  transform: "scale(1.1)",
                  transformOrigin: "center center",
                  willChange: "transform"
                }}
                src={getImageUrl(currentImage)}
                alt="Main View"
              />
            </div>
          </div>
          <div className="flex justify-center flex-wrap gap-4 w-full">
            {/* Main image thumbnail */}
            <motion.div
              whileHover={{ 
                scale: 1.15, 
                rotate: 8,
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.4)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -2, 0],
                rotate: [0, 1, 0],
                scale: [1, 1.01, 1]
              }}
              transition={{ 
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="relative group cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5],
                  borderRadius: ["12px", "14px", "12px"]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.img
                onClick={() => setCurrentImage(place.main_image)}
                className={`relative w-20 h-20 rounded-xl cursor-pointer object-cover border backdrop-blur-sm transition-all duration-400 hover:border-white/50 ${
                  currentImage === place.main_image
                    ? "border-blue-500 ring-3 ring-blue-400 ring-opacity-50"
                    : "border-white/20"
                }`}
                src={getImageUrl(place.main_image)}
                alt="Main Thumbnail"
                whileHover={{
                  filter: "brightness(1.2) contrast(1.15) saturate(1.05)",
                  scale: 1.05,
                  borderRadius: "14px"
                }}
                animate={{
                  scale: currentImage === place.main_image ? [1, 1.03, 1] : 1,
                  borderRadius: currentImage === place.main_image ? ["12px", "14px", "12px"] : "12px"
                }}
                transition={{
                  scale: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  borderRadius: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              />
            </motion.div>
            {/* Sub images thumbnails */}
            {Array.isArray(place.sub_images) &&
              place.sub_images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -1.5, 0],
                    rotate: [0, -0.5, 0],
                    x: [0, Math.sin(idx) * 1, 0]
                  }}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: -8,
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.4)",
                    y: -5
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    delay: 0.8 + idx * 0.1,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    y: {
                      duration: 4 + idx * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    rotate: {
                      duration: 7 + idx * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    x: {
                      duration: 5 + idx * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="relative group cursor-pointer"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.7, 0.5],
                      borderRadius: ["12px", "16px", "12px"]
                    }}
                    transition={{
                      duration: 6 + idx * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.img
                    onClick={() => setCurrentImage(img.image)}
                    className={`relative w-20 h-20 rounded-xl cursor-pointer object-cover border backdrop-blur-sm transition-all duration-400 hover:border-white/50 ${
                      currentImage === img.image
                        ? "border-blue-500 ring-3 ring-blue-400 ring-opacity-50"
                        : "border-white/20"
                    }`}
                    src={getImageUrl(img.image)}
                    alt={`Sub ${idx + 1}`}
                    whileHover={{
                      filter: "brightness(1.2) contrast(1.15) saturate(1.05)",
                      scale: 1.05,
                      borderRadius: "16px"
                    }}
                    animate={{
                      scale: currentImage === img.image ? [1, 1.03, 1] : 1,
                      borderRadius: currentImage === img.image ? ["12px", "16px", "12px"] : "12px"
                    }}
                    transition={{
                      scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      borderRadius: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  />
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Reserve Card Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="max-w-md w-full rounded-2xl shadow-2xl overflow-hidden mt-20 relative group"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            style={{
              rotateX,
              rotateY,
              scale,
              transformStyle: "preserve-3d",
            }}
            className="relative p-8 bg-black/60 backdrop-blur-2xl border border-white/30 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            {place.package_title && (
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-lg font-semibold text-blue-300 mb-2"
              >
                {place.package_title}
              </motion.h3>
            )}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="text-xl font-bold text-white mb-2"
            >
              {place.price_title}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="space-y-3 mb-6"
            >
              <div className="flex justify-between">
                <span className="text-white">Price</span>
                <span className="font-semibold text-white">Total : ${place.price}</span>
              </div>
              <span className="font-semibold text-white">{place.place_history}</span>
              <p className="text-sm text-white/80">
                (Price includes taxes and booking fees)
              </p>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                textShadow: "0 0 8px rgba(255, 255, 255, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/Forms/${place.id}`)}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg"
            >
              Reserve Now
            </motion.button>
          </motion.div>
        </motion.div>

        {/* About Section */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="py-8 w-full relative group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="relative p-8 bg-black/60 backdrop-blur-2xl border border-white/30 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="text-xl font-bold mb-4 text-white"
            >
              About This Tour
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="text-gray-300"
            >
              {place.about_place}
            </motion.p>
          </div>
        </motion.main>

        {/* Highlights Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="py-8 w-full relative group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="relative p-8 bg-black/60 backdrop-blur-2xl border border-white/30 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-2xl font-bold text-white mb-6"
            >
              TOUR HIGHLIGHTS
            </motion.h2>
            {(() => {
              let highlights = place.tour_highlights;
              if (typeof highlights === "string" && highlights.trim().startsWith("[")) {
                try {
                  highlights = JSON.parse(highlights);
                } catch (error) {
                  console.error("Error parsing highlights:", error);
                }
              }
              return Array.isArray(highlights) ? (
                <ul className="space-y-2 list-disc pl-5">
                  {highlights.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + idx * 0.1 }}
                      className="text-gray-300"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">{highlights}</p>
              );
            })()}
          </div>
        </motion.div>

        {/* Itinerary Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="w-full mb-10 relative group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="relative p-8 bg-black/60 backdrop-blur-2xl border border-white/30 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              className="text-3xl font-bold text-white mb-6"
            >
              Tour Itinerary
            </motion.h2>
            {place.itinerary_days && place.itinerary_days.length > 0 ? (
              place.itinerary_days.map((day, idx) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + idx * 0.1 }}
                >
                  <ItineraryItem
                    day={day.day}
                    sub_iterative_description={day.sub_iterative_description}
                    sub_description={day.sub_description}
                    photos={day.photos}
                    borderColor={idx % 2 === 0 ? "border-green-500" : "border-blue-500"}
                  />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-300">No itinerary data available</p>
            )}
          </div>
        </motion.div>

        {/* Included-Excluded Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="w-full mb-20 relative group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="relative p-8 bg-black/60 backdrop-blur-2xl border border-white/30 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
              className="text-3xl font-bold text-white mb-6"
            >
              What&apos;s Included & Excluded
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="text-xl font-semibold mb-4 text-white"
                >
                  Included
                </motion.h3>
                {(() => {
                  let included = place.included;
                  if (typeof included === "string" && included.trim().startsWith("[")) {
                    try {
                      included = JSON.parse(included);
                    } catch (error) {
                      console.error("Error parsing included items:", error);
                    }
                  }
                  return Array.isArray(included) ? (
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      {included.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.1 + idx * 0.1 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-300">{included}</p>
                  );
                })()}
              </div>
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="text-xl font-semibold mb-4 text-white"
                >
                  Excluded
                </motion.h3>
                {(() => {
                  let excluded = place.exclude;
                  if (typeof excluded === "string" && excluded.trim().startsWith("[")) {
                    try {
                      excluded = JSON.parse(excluded);
                    } catch (error) {
                      console.error("Error parsing excluded items:", error);
                    }
                  }
                  return Array.isArray(excluded) ? (
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      {excluded.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2.1 + idx * 0.1 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-300">{excluded}</p>
                  );
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PlaceView;
