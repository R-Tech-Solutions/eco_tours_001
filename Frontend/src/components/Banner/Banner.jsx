import { MdFlight, MdOutlineLocalHotel } from "react-icons/md";
import { IoIosWifi } from "react-icons/io";
import { IoFastFoodSharp } from "react-icons/io5";
import { motion } from "framer-motion";

const Banner = () => (
  <section className="bg-gradient-to-b from-sky-300 via-sky-100 to-sky-50 min-h-screen w-full flex flex-col items-center justify-center py-12 relative z-50">
    <div className="about-3d-perspective w-full flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="about-3d-card relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 md:p-12 gap-8"
      >
        {/* Left: Animated Earth with Stars */}
        <motion.div
          className="flex-1 flex items-center justify-center mb-6 md:mb-0 relative"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
        >
          <div className="section-banner relative">
            {/* Twinkling Stars */}
            <div id="star-1">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>

            <div id="star-2">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>

            <div id="star-3">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>

            <div id="star-4">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>

            <div id="star-5">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>

            <div id="star-6">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>

            <div id="star-7">
              <div className="curved-corner-star">
                <div id="curved-corner-bottomright"></div>
                <div id="curved-corner-bottomleft"></div>
              </div>
              <div className="curved-corner-star">
                <div id="curved-corner-topright"></div>
                <div id="curved-corner-topleft"></div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Right: Animated Text and Icons */}
        <motion.div
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
        >
          <motion.h1
            className="text-4xl font-bold mb-2 text-sky-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            About Us
          </motion.h1>
          <motion.p
            className="max-w-xl text-lg text-gray-700 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            We are passionate about helping you explore the world. Our team is dedicated to providing the best travel experiences, from flights and hotels to food and Wi-Fi, ensuring your journey is smooth and memorable.
          </motion.p>
          <div className="flex flex-wrap gap-6 w-full justify-center md:justify-start">
            <motion.div
              whileHover={{ scale: 1.15, rotate: -6 }}
              className="flex flex-col items-center transition-transform duration-300"
            >
              <MdFlight className="text-5xl text-sky-500 mb-2 drop-shadow-lg" />
              <span className="font-semibold">Flights</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.15, rotate: 6 }}
              className="flex flex-col items-center transition-transform duration-300"
            >
              <MdOutlineLocalHotel className="text-5xl text-sky-500 mb-2 drop-shadow-lg" />
              <span className="font-semibold">Hotels</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.15, rotate: -6 }}
              className="flex flex-col items-center transition-transform duration-300"
            >
              <IoIosWifi className="text-5xl text-sky-500 mb-2 drop-shadow-lg" />
              <span className="font-semibold">Wi-Fi</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.15, rotate: 6 }}
              className="flex flex-col items-center transition-transform duration-300"
            >
              <IoFastFoodSharp className="text-5xl text-sky-500 mb-2 drop-shadow-lg" />
              <span className="font-semibold">Food</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      <style>{`
        .about-3d-perspective {
          perspective: 1200px;
        }
        .about-3d-card {
          will-change: transform;
          transition: transform 0.5s cubic-bezier(.25,.8,.25,1), box-shadow 0.5s;
        }
        .about-3d-card:hover {
          transform: rotateY(12deg) scale(1.04) translateY(-8px);
          box-shadow: 0 16px 40px 0 rgba(56,189,248,0.18), 0 2px 8px 0 rgba(99,102,241,0.12);
        }
        
        .section-banner {
          height: 250px;
          width: 250px;
          position: relative;
          transition: left 0.3s linear;
          background: 
            radial-gradient(circle at 30% 30%, #87CEEB 0%, #4682B4 25%, #1E90FF 50%, #0000CD 100%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cpath d='M150,100 Q200,80 250,100 Q300,120 350,100 Q320,160 350,220 Q300,240 250,220 Q200,200 150,220 Q180,160 150,100' fill='%23008000' opacity='0.9'/%3E%3Cpath d='M650,100 Q700,80 750,100 Q800,120 850,100 Q820,160 850,220 Q800,240 750,220 Q700,200 650,220 Q680,160 650,100' fill='%23008000' opacity='0.8'/%3E%3Cpath d='M400,80 Q450,60 500,80 Q550,100 600,80 Q570,140 600,200 Q550,220 500,200 Q450,180 400,200 Q430,140 400,80' fill='%23008000' opacity='0.7'/%3E%3Cpath d='M250,260 Q300,240 350,260 Q400,280 450,260 Q420,320 450,380 Q400,400 350,380 Q300,360 250,380 Q280,320 250,260' fill='%23008000' opacity='0.6'/%3E%3Cpath d='M550,260 Q600,240 650,260 Q700,280 750,260 Q720,320 750,380 Q700,400 650,380 Q600,360 550,380 Q580,320 550,260' fill='%23008000' opacity='0.5'/%3E%3Cpath d='M400,340 Q450,320 500,340 Q550,360 600,340 Q570,400 600,460 Q550,480 500,460 Q450,440 400,460 Q430,400 400,340' fill='%23008000' opacity='0.4'/%3E%3Cpath d='M300,140 Q350,120 400,140 Q450,160 500,140 Q470,200 500,260 Q450,280 400,260 Q350,240 300,260 Q330,200 300,140' fill='%23008000' opacity='0.3'/%3E%3C/svg%3E");
          background-size: cover, cover;
          background-position: center, center;
          border-radius: 50%;
          animation: earthRotate 45s linear infinite;
          box-shadow: 
            0 0 80px rgba(135, 206, 235, 0.8),
            inset 0 0 150px rgba(0, 0, 0, 0.03),
            inset 0 0 300px rgba(135, 206, 235, 0.02);
          position: relative;
          overflow: hidden;
        }
        
        .section-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%);
          animation: earthShine 5s ease-in-out infinite;
        }
        
        @keyframes earthRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes earthShine {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .curved-corner-star {
          display: flex;
          position: relative;
        }

        #curved-corner-bottomleft,
        #curved-corner-bottomright,
        #curved-corner-topleft,
        #curved-corner-topright {
          width: 4px;
          height: 5px;
          overflow: hidden;
          position: relative;
        }

        #curved-corner-bottomleft:before,
        #curved-corner-bottomright:before,
        #curved-corner-topleft:before,
        #curved-corner-topright:before {
          content: "";
          display: block;
          width: 200%;
          height: 200%;
          position: absolute;
          border-radius: 50%;
        }

        #curved-corner-bottomleft:before {
          bottom: 0;
          left: 0;
          box-shadow: -5px 5px 0 0 white;
        }

        #curved-corner-bottomright:before {
          bottom: 0;
          right: 0;
          box-shadow: 5px 5px 0 0 white;
        }

        #curved-corner-topleft:before {
          top: 0;
          left: 0;
          box-shadow: -5px -5px 0 0 white;
        }

        #curved-corner-topright:before {
          top: 0;
          right: 0;
          box-shadow: 5px -5px 0 0 white;
        }

        @keyframes twinkling {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 1;
          }
        }

        #star-1 {
          position: absolute;
          left: -20px;
          animation: twinkling 3s infinite;
        }

        #star-2 {
          position: absolute;
          left: -40px;
          top: 30px;
          animation: twinkling 2s infinite;
        }
        #star-3 {
          position: absolute;
          left: 350px;
          top: 90px;
          animation: twinkling 4s infinite;
        }
        #star-4 {
          position: absolute;
          left: 200px;
          top: 290px;
          animation: twinkling 3s infinite;
        }
        #star-5 {
          position: absolute;
          left: 50px;
          top: 270px;
          animation: twinkling 1.5s infinite;
        }

        #star-6 {
          position: absolute;
          left: 250px;
          top: -50px;
          animation: twinkling 4s infinite;
        }
        #star-7 {
          position: absolute;
          left: 290px;
          top: 60px;
          animation: twinkling 2s infinite;
        }

        /* Override global styles for Banner section */
        .banner-section {
          background-color: transparent !important;
          color: inherit !important;
        }
        
        .banner-section * {
          color: inherit !important;
        }
      `}</style>
    </div>
  </section>
);

export default Banner;
