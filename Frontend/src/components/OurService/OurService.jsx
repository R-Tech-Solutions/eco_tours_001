"use client";
import { BackendUrl } from "../../BackendUrl";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import axios from "axios";
import "./OurService.css";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function OurService({ onOrderClick }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${BackendUrl}/api/services/`);
        setServices(response.data.slice(0, 5));
        setLoading(false);
      } catch (err) {
        setError(
          "Failed to fetch services: " + (err.response?.status || err.message)
        );
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fallback for missing services to always show 5 cards
  const fallbackServices = [
    {
      service_title: "Personalized Vacation Planning",
      service_description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit.",
    },
    {
      service_title: "Custom Itinerary Planning",
      service_description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit.",
    },
    {
      service_title: "Price Monitoring",
      service_description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit.",
    },
    {
      service_title: "Top-Rated Travel Advisors",
      service_description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit.",
    },
    {
      service_title: "Wedding & Honeymoon Planning",
      service_description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad ut aperiam mollitia officia, natus eligendi. Magnam assumenda incidunt magni impedit.",
    },
  ];

  // Merge backend services with fallback to always have 5
  const mergedServices = [
    ...services.map(s => ({
      service_title: s.service_title || s.title || "No Title",
      service_description: s.service_description || s.description || "No Description",
    })),
    ...fallbackServices
  ].slice(0, 5);

  return (
    <section className="bg-gradient-to-b from-sky-300 via-sky-100 to-sky-50 min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Service Cards Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-2 sm:px-4 py-8 sm:py-12">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="my-8 ml-12 sm:ml-24 text-2xl sm:text-3xl font-bold text-black font-['Poppins']"
        >
          Our Services
        </motion.h1>
        {loading ? (
          <p>Loading services...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-wrap justify-center gap-4 sm:gap-5 p-2 sm:p-5 sm:mr-20"
          >
            {mergedServices.map((service, index) => (
              <motion.div key={index} variants={item}>
                <ServiceCard
                  icon={null}
                  title={service.service_title}
                  description={service.service_description}
                  additionalText=""
                  onOrderClick={onOrderClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

OurService.propTypes = {
  onOrderClick: PropTypes.func.isRequired,
};

function ServiceCard({
  icon,
  title,
  description,
  additionalText,
  onOrderClick,
}) {
  return (
    <div className="card" onClick={onOrderClick}>
      <div
        className="card-content"
        style={{
          position: "relative",
          zIndex: 3,
          textAlign: "center",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        {icon && <div style={{ marginBottom: 16, fontSize: 36 }}>{icon}</div>}
        <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 10 }}>{title}</h3>
        <p style={{ fontSize: 15, margin: 0, marginBottom: 8 }}>{description}</p>
        {additionalText && (
          <p style={{ fontSize: 12, color: '#555' }}>{additionalText}</p>
        )}
      </div>
    </div>
  );
}

ServiceCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  additionalText: PropTypes.string.isRequired,
  onOrderClick: PropTypes.func.isRequired,
};

