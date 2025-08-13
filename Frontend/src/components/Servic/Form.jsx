import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DateRangePicker } from "rsuite";
import { ChevronDown, Minus, Plus, Users } from "lucide-react";
import {BackendUrl} from "../../BackendUrl";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

// Add CSS animation for neumorphic inputs
const neumorphicStyles = `
  @keyframes inputGradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .neumorphic-input:focus {
    background: rgba(241, 241, 241, 0.1) !important;
  }
  
  /* Date input specific styles */
  input[type="date"]::-webkit-calendar-picker-indicator {
    background: transparent;
    color: transparent;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  
  input[type="date"]::-webkit-datetime-edit {
    color: white;
  }
  
  input[type="date"]::-webkit-datetime-edit-fields-wrapper {
    color: white;
  }
  
  input[type="date"]::-webkit-datetime-edit-text {
    color: white;
  }
  
  input[type="date"]::-webkit-datetime-edit-month-field {
    color: white;
  }
  
  input[type="date"]::-webkit-datetime-edit-day-field {
    color: white;
  }
  
  input[type="date"]::-webkit-datetime-edit-year-field {
    color: white;
  }
  
  input[type="date"]::-webkit-inner-spin-button {
    display: none;
  }
  
  input[type="date"]::-webkit-clear-button {
    display: none;
  }
`;

const HotelBookingForm = ({
  adults,
  setAdults,
  childrenAges,
  setChildrenAges,
}) => {
  const [travellingWithPets, setTravellingWithPets] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  const incrementCounter = (setter, value) => {
    setter(value + 1);
  };

  const decrementCounter = (setter, value) => {
    if (value > 0) setter(value - 1);
  };

  // Handle children count and ages
  const handleAddChild = () => {
    setChildrenAges([...childrenAges, "Age needed"]);
  };

  const handleRemoveChild = () => {
    if (childrenAges.length > 0) {
      setChildrenAges(childrenAges.slice(0, -1));
    }
  };

  const handleChildAgeChange = (idx, value) => {
    const updatedAges = [...childrenAges];
    updatedAges[idx] = value;
    setChildrenAges(updatedAges);
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl mb-6 overflow-hidden relative"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 0 30px rgba(59, 130, 246, 0.2)",
        y: -5
      }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut"
      }}
    >
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <motion.div 
        className="bg-gradient-to-r from-black/90 via-black/80 to-black/90 backdrop-blur-xl px-4 py-3 text-white flex items-center gap-2 border-b border-white/20 cursor-pointer relative overflow-hidden"
        onClick={() => setShowForm(!showForm)}
        whileHover={{ 
          backgroundColor: "rgba(0,0,0,0.95)",
          backgroundImage: "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(0,0,0,0.95), rgba(59, 130, 246, 0.1))"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          whileHover={{ 
            scale: 1.2, 
            rotate: [0, -10, 10, 0],
            filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))"
          }}
          transition={{ 
            duration: 0.4,
            rotate: {
              duration: 0.6,
              ease: "easeInOut"
            }
          }}
        >
          <Users size={20} className="text-blue-400" />
        </motion.div>
        
        <motion.span 
          className="font-medium relative z-10"
          animate={{
            textShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 10px rgba(255,255,255,0.5)", "0 0 0px rgba(255,255,255,0)"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {adults} adults • {childrenAges.length} child • 1 room
        </motion.span>
        
        <motion.button
          type="button"
          className="ml-auto focus:outline-none relative z-10"
          aria-label="Toggle booking form"
          whileHover={{ 
            scale: 1.3,
            filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))"
          }}
          whileTap={{ scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ rotate: showForm ? 180 : 0 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 200
            }}
          >
            <ChevronDown size={16} className="text-blue-400" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Form Content - Conditionally Rendered */}
      <AnimatePresence mode="wait">
      {showForm && (
          <motion.div 
            className="p-4 space-y-6 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-xl relative overflow-hidden"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 100
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)"
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>

          {/* Adults Section */}
            <motion.div 
              className="flex items-center justify-between relative z-10"
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <motion.span 
                className="text-white font-medium"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 10px rgba(255,255,255,0.5)"
                }}
                transition={{ duration: 0.2 }}
              >
                Adults
              </motion.span>
            <div className="flex items-center gap-3">
                <motion.button
                type="button"
                onClick={() => decrementCounter(setAdults, adults)}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.15, 
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                    borderColor: "rgba(59, 130, 246, 0.5)"
                  }}
                  whileTap={{ scale: 0.85 }}
                  onHoverStart={() => setHoveredButton('minus-adults')}
                  onHoverEnd={() => setHoveredButton(null)}
                  transition={{ duration: 0.3 }}
                >
                  {/* Ripple effect */}
                  {hoveredButton === 'minus-adults' && (
                    <motion.div
                      className="absolute inset-0 bg-blue-400/20 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    whileHover={{ 
                      rotate: -180,
                      scale: 1.2
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeInOut"
                    }}
              >
                <Minus size={16} className="text-white" />
                  </motion.div>
                </motion.button>
                
                <motion.div className="relative">
                  <motion.span 
                    className="w-12 h-12 flex items-center justify-center text-center font-bold text-white text-lg rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 backdrop-blur-xl"
                    key={adults}
                    initial={{ 
                      scale: 1.5, 
                      color: "#3B82F6",
                      backgroundColor: "rgba(59, 130, 246, 0.3)",
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)"
                    }}
                    animate={{ 
                      scale: 1, 
                      color: "#FFFFFF",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      boxShadow: "0 0 0px rgba(59, 130, 246, 0)"
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                {adults}
                  </motion.span>
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-400/30"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
                
                <motion.button
                type="button"
                onClick={() => incrementCounter(setAdults, adults)}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.15, 
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                    borderColor: "rgba(59, 130, 246, 0.5)"
                  }}
                  whileTap={{ scale: 0.85 }}
                  onHoverStart={() => setHoveredButton('plus-adults')}
                  onHoverEnd={() => setHoveredButton(null)}
                  transition={{ duration: 0.3 }}
                >
                  {/* Ripple effect */}
                  {hoveredButton === 'plus-adults' && (
                    <motion.div
                      className="absolute inset-0 bg-blue-400/20 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    whileHover={{ 
                      rotate: 180,
                      scale: 1.2
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeInOut"
                    }}
                  >
                    <Plus size={16} className="text-white" />
                  </motion.div>
                </motion.button>
            </div>
            </motion.div>

          {/* Children Section */}
            <motion.div 
              className="flex items-center justify-between relative z-10"
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <motion.span 
                className="text-white font-medium"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 10px rgba(255,255,255,0.5)"
                }}
                transition={{ duration: 0.2 }}
              >
                Children
              </motion.span>
            <div className="flex items-center gap-3">
                <motion.button
                type="button"
                onClick={handleRemoveChild}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.15, 
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                    borderColor: "rgba(59, 130, 246, 0.5)"
                  }}
                  whileTap={{ scale: 0.85 }}
                  onHoverStart={() => setHoveredButton('minus-children')}
                  onHoverEnd={() => setHoveredButton(null)}
                  transition={{ duration: 0.3 }}
                >
                  {/* Ripple effect */}
                  {hoveredButton === 'minus-children' && (
                    <motion.div
                      className="absolute inset-0 bg-blue-400/20 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    whileHover={{ 
                      rotate: -180,
                      scale: 1.2
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeInOut"
                    }}
                  >
                    <Minus size={16} className="text-white" />
                  </motion.div>
                </motion.button>
                
                <motion.div className="relative">
                  <motion.span 
                    className="w-12 h-12 flex items-center justify-center text-center font-bold text-white text-lg rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 backdrop-blur-xl"
                    key={childrenAges.length}
                    initial={{ 
                      scale: 1.5, 
                      color: "#8B5CF6",
                      backgroundColor: "rgba(139, 92, 246, 0.3)",
                      boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)"
                    }}
                    animate={{ 
                      scale: 1, 
                      color: "#FFFFFF",
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                      boxShadow: "0 0 0px rgba(139, 92, 246, 0)"
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                {childrenAges.length}
                  </motion.span>
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-purple-400/30"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
                
                <motion.button
                type="button"
                onClick={handleAddChild}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.15, 
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                    borderColor: "rgba(59, 130, 246, 0.5)"
                  }}
                  whileTap={{ scale: 0.85 }}
                  onHoverStart={() => setHoveredButton('plus-children')}
                  onHoverEnd={() => setHoveredButton(null)}
                  transition={{ duration: 0.3 }}
                >
                  {/* Ripple effect */}
                  {hoveredButton === 'plus-children' && (
                    <motion.div
                      className="absolute inset-0 bg-blue-400/20 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    whileHover={{ 
                      rotate: 180,
                      scale: 1.2
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeInOut"
                    }}
                  >
                    <Plus size={16} className="text-white" />
                  </motion.div>
                </motion.button>
            </div>
            </motion.div>
            
          {/* Children Age Dropdowns */}
            <AnimatePresence mode="popLayout">
          {childrenAges.map((age, idx) => (
                <motion.div 
                  className="relative mt-2" 
                  key={idx}
                  initial={{ opacity: 0, x: -30, scale: 0.8, height: 0 }}
                  animate={{ opacity: 1, x: 0, scale: 1, height: "auto" }}
                  exit={{ opacity: 0, x: 30, scale: 0.8, height: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: idx * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  layout
                >
                  <motion.select
                value={age}
                onChange={(e) => handleChildAgeChange(idx, e.target.value)}
                    className="w-full px-4 py-3 border border-white/20 rounded-xl appearance-none bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent relative overflow-hidden"
                    whileHover={{ 
                      backgroundColor: "rgba(0,0,0,0.8)",
                      borderColor: "rgba(59, 130, 246, 0.6)",
                      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.2)",
                      scale: 1.02
                    }}
                    whileFocus={{ 
                      scale: 1.05,
                      borderColor: "#3B82F6",
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
                    }}
                    transition={{ duration: 0.3 }}
              >
                <option value="Age needed">Age needed</option>
                <option value="0">0 years</option>
                <option value="1">01 years</option>
                <option value="2">02 years</option>
                <option value="3">03 years</option>
                <option value="4">04 years</option>
                <option value="5">05 years</option>
                <option value="6">06 years</option>
                <option value="7">07 years</option>
                <option value="8">08 years</option>
                <option value="9">09 years</option>
                <option value="10">10 years</option>
                <option value="11">11 years</option>
                <option value="12">12 years</option>
                <option value="13">13 years</option>
                <option value="14">14 years</option>
                <option value="15">15 years</option>
                <option value="16">16 years</option>
                <option value="17">17 years</option>
                  </motion.select>
                  <motion.div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 pointer-events-none"
                    animate={{ 
                      rotate: showForm ? 180 : 0,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 0.5,
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

          {/* Done Button */}
            <motion.button
            type="button"
            onClick={() => setShowForm(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                background: "linear-gradient(45deg, #2563EB, #7C3AED, #2563EB)",
                boxShadow: "0 15px 35px rgba(59, 130, 246, 0.4), 0 0 30px rgba(124, 58, 237, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <span className="relative z-10">Done</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Form = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlace = location.state?.place;
  
  const [countryCode, setCountryCode] = useState("+94");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [price, setPrice] = useState(selectedPlace?.price || "");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    specialRequests: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Add state for adults, childrenAges to Form and pass them to HotelBookingForm
  const [adults, setAdults] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]);

  // Inject neumorphic styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = neumorphicStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Handle scroll to top on mount and before reload
  useEffect(() => {
    // Function to scroll to top
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Scroll to top on mount
    scrollToTop();

    // Handle before unload
    const handleBeforeUnload = () => {
      scrollToTop();
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

    if (!selectedPlace) {
      setLoading(true);
      fetch(`${BackendUrl}/api/places/${id}/`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((data) => {
          setPrice(data.price);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }

    return () => clearTimeout(loadingTimer);
  }, [id, selectedPlace]);

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
          Loading booking form...
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validate form data
    if (!formData.fullName || !formData.email || !arrivalDate || !phoneNumber || adults === 0) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const bookingData = {
      user_name: formData.fullName,
      email: formData.email,
      phone: `${countryCode}${phoneNumber}`,
      place: id,
      arrival_date: arrivalDate,
      price: totalPrice,
      adults: adults,
      children: childrenAges.length,
      children_ages: childrenAges, // <-- Add this line
      description: formData.specialRequests
    };

    try {
      const response = await fetch(`${BackendUrl}/api/bookings/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      setSuccess(true);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        specialRequests: ""
      });
      setArrivalDate("");
      setPhoneNumber("");
      setAdults(0);
      setChildrenAges([]);
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate("/Service");
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total adults, total children, and total price
  const totalAdults = adults;
  const totalChildren = childrenAges.length;
  const freeChildren = childrenAges.filter(
    (age) => Number(age) >= 0 && Number(age) <= 5
  ).length;
  const halfPriceChildren = childrenAges.filter(
    (age) => Number(age) > 5 && Number(age) <= 12
  ).length;
  const fullPriceChildren = childrenAges.filter(
    (age) => Number(age) > 12 && Number(age) <= 17
  ).length;

  // Calculate total price with detailed breakdown
  const basePrice = Number(price) || 0;
  const adultsTotal = totalAdults * basePrice;
  const halfPriceChildrenTotal = halfPriceChildren * (basePrice / 2);
  const fullPriceChildrenTotal = fullPriceChildren * basePrice;
  const totalPrice = adultsTotal + halfPriceChildrenTotal + fullPriceChildrenTotal;

  return (
    <div className="pt-28 p-4 sm:p-8 md:p-12 lg:p-20 bg-gradient-to-b from-sky-400 via-sky-100 to-sky-50 min-h-screen" style={{ backgroundColor: '#87CEEB' }}>
      {/* Add pt-28 to push content below a fixed navbar */}
      {/* Selected Place Details Section */}
      {selectedPlace && (
        <div className="max-w-4xl mx-auto mb-8 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative h-48 sm:h-56 md:h-64">
            <img
              src={selectedPlace.main_image ? `${BackendUrl}${selectedPlace.main_image}` : "/placeholder.svg"}
              alt={selectedPlace.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{selectedPlace.title}</h1>
              {selectedPlace.package_title && (
                <p className="text-lg sm:text-xl text-blue-300 mb-2">{selectedPlace.package_title}</p>
              )}
              <div className="flex flex-wrap items-center space-x-2 sm:space-x-4">
                <span className="bg-blue-600 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                  {selectedPlace.place_type}
                </span>
                <span className="text-xl sm:text-2xl font-bold">${selectedPlace.price}</span>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-black/40 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">About This Place</h3>
                <p className="text-gray-200 text-sm sm:text-base">{selectedPlace.about_place}</p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Tour Highlights</h3>
                <p className="text-gray-200 text-sm sm:text-base">{selectedPlace.tour_highlights}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Section */}
      <section className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
          Complete Your Booking
        </h2>
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 text-green-800 bg-green-200 rounded-lg text-lg font-semibold flex items-center justify-center">
            <span role="img" aria-label="check">✅</span>&nbsp;Thank you for your booking!
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-transparent p-0 sm:p-6 rounded-lg">
          {/* Insert HotelBookingForm here */}
          <HotelBookingForm
            adults={adults}
            setAdults={setAdults}
            childrenAges={childrenAges}
            setChildrenAges={setChildrenAges}
          />

          {/* Replace date range with single arrival date */}
          <div className="mt-4">
            <label className="text-white block mb-2 text-sm" htmlFor="arrival-date">
              Arrival Date
            </label>
            <div className="relative">
            <input
              id="arrival-date"
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
                className="w-full h-12 px-3 py-2 border-none text-white text-sm rounded-lg focus:outline-none neumorphic-input pr-10 appearance-none"
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(128,128,128,0.05), rgba(255,255,255,0.1))',
                  backgroundSize: '200% 200%',
                  animation: 'inputGradient 4s infinite',
                  boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.1), inset 2px 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '1px',
                  colorScheme: 'dark'
                }}
                min={new Date().toISOString().split('T')[0]}
              required
            />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            {arrivalDate && (
              <div className="mt-2 text-xs text-white/70">
                Selected: {new Date(arrivalDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-white text-sm" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                className="block w-full h-12 px-3 py-2 mt-2 text-white border-none rounded-lg focus:outline-none neumorphic-input"
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(128,128,128,0.05), rgba(255,255,255,0.1))',
                  backgroundSize: '200% 200%',
                  animation: 'inputGradient 4s infinite',
                  boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.1), inset 2px 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '1px'
                }}
                required
              />
            </div>

            <div>
              <label className="text-white text-sm" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full h-12 px-3 py-2 mt-2 text-white border-none rounded-lg focus:outline-none neumorphic-input"
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(128,128,128,0.05), rgba(255,255,255,0.1))',
                  backgroundSize: '200% 200%',
                  animation: 'inputGradient 4s infinite',
                  boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.1), inset 2px 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '1px'
                }}
                required
              />
            </div>

            <div>
              <label className="text-white text-sm" htmlFor="phone">
                Phone Number
              </label>
              <div className="flex mt-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="block px-3 py-2 text-white border-none rounded-l-lg focus:outline-none neumorphic-input"
                  style={{
                    background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(128,128,128,0.05), rgba(255,255,255,0.1))',
                    backgroundSize: '200% 200%',
                    animation: 'inputGradient 4s infinite',
                    boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.1), inset 2px 2px 4px rgba(0,0,0,0.3)',
                    letterSpacing: '1px'
                  }}
                >
                  <option value="+94">LK +94</option>
                  <option value="+91">IN +91</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+61">AU +61</option>
                </select>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full h-12 px-3 py-2 text-white border-none rounded-r-lg focus:outline-none neumorphic-input"
                  style={{
                    background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(128,128,128,0.05), rgba(255,255,255,0.1))',
                    backgroundSize: '200% 200%',
                    animation: 'inputGradient 4s infinite',
                    boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.1), inset 2px 2px 4px rgba(0,0,0,0.3)',
                    letterSpacing: '1px'
                  }}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm" htmlFor="specialRequests">
                Special Requests
              </label>
              <textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                className="block w-full h-12 px-3 py-2 mt-2 text-white border-none rounded-lg focus:outline-none neumorphic-input resize-none"
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(128,128,128,0.05), rgba(255,255,255,0.1))',
                  backgroundSize: '200% 200%',
                  animation: 'inputGradient 4s infinite',
                  boxShadow: 'inset -2px -2px 4px rgba(255,255,255,0.1), inset 2px 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '1px'
                }}
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-white">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Price Breakdown</h2>
            
            <div className="flex justify-between items-center text-sm">
              <span>Base Price per Person:</span>
              <span>${basePrice}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span>Adults ({totalAdults}):</span>
              <span>${adultsTotal}</span>
            </div>

            {halfPriceChildren > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span>Children Half Price ({halfPriceChildren}):</span>
                <span>${halfPriceChildrenTotal}</span>
              </div>
            )}

            {fullPriceChildren > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span>Children Full Price ({fullPriceChildren}):</span>
                <span>${fullPriceChildrenTotal}</span>
              </div>
            )}

            {freeChildren > 0 && (
              <div className="flex justify-between items-center text-green-400 text-sm">
                <span>Free Children ({freeChildren}):</span>
                <span>Free</span>
              </div>
            )}

            <div className="border-t border-white/20 pt-2 mt-2">
              <div className="flex justify-between items-center font-bold text-base sm:text-lg">
                <span>Total Price:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <p className="text-[11px] sm:text-[12px] text-gray-300 mt-2">
              Note: Children 0-5 years are free, 6-12 years are half price, 13-17 years are full price
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 sm:px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Form;

// There is no usage of `activeClassName` in this file.
// The warning is coming from a <NavLink> or <Link> component in your Navbar or another component.
// To fix this, in your Navbar (or wherever you use NavLink), replace:
//   <NavLink to="/somewhere" activeClassName="active">...</NavLink>
// with (for React Router v6+):
//   <NavLink to="/somewhere" className={({ isActive }) => isActive ? "active" : ""}>...</NavLink>