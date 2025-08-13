import { useState, useEffect } from "react";
import axios from "axios";
import {BackendUrl} from "../../BackendUrl";

const Slider = () => {
  const [displayText, setDisplayText] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fullText = "Welcome To";

  // Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/items/`);
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch items: ' + err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Typewriter effect for the heading
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    return () => clearInterval(typing);
  }, []);

  if (loading) return <div className="w-full h-[35vh] bg-sky-100 flex items-center justify-center text-sky-900">Loading...</div>;
  if (error) return <div className="w-full h-[35vh] bg-sky-100 flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="relative w-full flex flex-col items-center bg-gradient-to-b from-sky-400 via-sky-200 to-sky-50 overflow-hidden">
      {/* Blue blurred circle background effect */}
      <div className="z-0 absolute opacity-80 rounded-full blur-[200px] w-[40%] h-[40%] bg-sky-500 top-[100px] left-1/5 pointer-events-none" />
      {/* Animated Header with gradient background */}
      <div className="h-[35vh] w-full bg-transparent flex flex-col items-center justify-center gap-2 pt-4 pb-0">
        <p className="m-0 text-transparent text-3xl sm:text-4xl md:text-5xl font-mono font-medium uppercase animate-text bg-[url('https://images.unsplash.com/photo-1508624217470-5ef0f947d8be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxM3x8b2NlYW58ZW58MHwwfHx8MTc0Mzc5MjQzNnww&ixlib=rb-4.0.3&q=80&w=1080')] bg-contain bg-clip-text opacity-90 filter contrast-150 tracking-widest leading-none">
          {displayText}
        </p>
        <p className="m-0 text-transparent text-5xl sm:text-7xl md:text-8xl font-mono font-extrabold uppercase animate-textReverse bg-[url('https://images.unsplash.com/photo-1488330890490-c291ecf62571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwzfHxncmVlbnxlbnwwfDB8fHwxNzQzNzkyMzgwfDA&ixlib=rb-4.0.3&q=80&w=1080')] bg-contain bg-clip-text filter contrast-150 leading-none">
          Sri Lanka
        </p>
      </div>
      {/* Grid Layout Section with Image Cards */}
      <section className="w-full py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img 
                      src={`${BackendUrl}${item.image}`} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex flex-col justify-center items-center">
                      <p className="title text-white text-2xl font-bold mb-2">{item.title}</p>
                      <p className="text-white text-sm">Hover Me</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <p className="title text-white text-2xl font-bold mb-4">{item.title}</p>
                    <p className="text-white text-sm leading-relaxed px-4">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style jsx>{`
        .flip-card {
          background-color: transparent;
          width: 100%;
          height: 300px;
          perspective: 1000px;
          font-family: sans-serif;
        }

        .title {
          font-size: 1.5em;
          font-weight: 900;
          text-align: center;
          margin: 0;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }

        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2);
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border: 1px solid rgba(14, 165, 233, 0.5);
          border-radius: 1rem;
        }

        .flip-card-front {
          background: linear-gradient(120deg, rgba(14, 165, 233, 0.1) 60%, rgba(14, 165, 233, 0.2) 88%,
             rgba(14, 165, 233, 0.15) 40%, rgba(14, 165, 233, 0.3) 48%);
          color: white;
        }

        .flip-card-back {
          background: linear-gradient(120deg, rgba(14, 165, 233, 0.8) 30%, rgba(14, 165, 233, 0.9) 88%,
             rgba(14, 165, 233, 0.7) 40%, rgba(14, 165, 233, 0.85) 78%);
          color: white;
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Slider;