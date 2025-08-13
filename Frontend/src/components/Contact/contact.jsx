import "./contact.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { BackendUrl } from "../../BackendUrl";
import PropTypes from "prop-types";

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

function SocialIcon({ icon, type }) {
  return (
    <button className="social-icon-btn" aria-label={`Visit our ${type} page`}>
      <span className={`social-icon-btn__back ${type}-gradient`}></span>
      <span className="social-icon-btn__front">
        <span className="social-icon-btn__icon" aria-hidden="true">
          {icon}
        </span>
      </span>
    </button>
  );
}

SocialIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
};

const Contact = () => {
  const [links, setLinks] = useState({
    facebook_link: "#",
    whatsapp_link: "#",
    instagram_link: "#",
  });
  const [linksLoading, setLinksLoading] = useState(true);
  const [linksError, setLinksError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    // Simulate loading time for the beautiful animation
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show loading for 1.5 seconds

    setLinksLoading(true);
    setLinksError(null);
    axios
      .get(`${BackendUrl}/api/social-links/`)
      .then((res) => {
        setLinks(res.data);
        setLinksLoading(false);
      })
      .catch((err) => {
        setLinksError("Failed to fetch social links");
        setLinksLoading(false);
        console.error("Failed to fetch links", err);
      });

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setSubmitError("Please fill in all fields.");
      setSubmitSuccess(null);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await axios.post(`${BackendUrl}/api/user/create/`, {
        user_name: form.name,
        user_email: form.email,
        user_message: form.message,
      });
      setSubmitSuccess("Message sent successfully. We'll get back to you soon!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setSubmitError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          Loading contact information...
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="text-gray-600 body-font relative bg-gradient-to-b from-sky-200 via-sky-100 to-sky-50 min-h-screen">
      <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
        <div className="lg:w-2/3 md:w-1/2 bg-gradient-to-br from-sky-200 via-blue-100 to-sky-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative shadow-xl border border-sky-200">
          <iframe 
            width="100%" 
            height="100%" 
            className="absolute inset-0" 
            frameBorder="0" 
            title="map" 
            marginHeight="0"
            marginWidth="0" 
            scrolling="no"
            src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=Sri%20Lanka+(Eco%20Travels)&ie=UTF8&t=&z=14&iwloc=B&output=embed"
            style={{ filter: "grayscale(0.3) contrast(1.1) opacity(0.8)" }}
          ></iframe>
          <div className="bg-gradient-to-r from-white/95 to-sky-50/95 relative flex flex-wrap py-8 px-8 rounded-xl shadow-2xl border border-sky-100 backdrop-blur-sm">
            <div className="lg:w-1/2 px-6">
              <h2 className="title-font font-bold text-sky-800 tracking-widest text-xs uppercase mb-3">📍 Address</h2>
              <p className="mt-1 text-sky-700 font-medium">Colombo, Sri Lanka<br />Eco Travels Headquarters</p>
            </div>
            <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
              <h2 className="title-font font-bold text-sky-800 tracking-widest text-xs uppercase mb-3">📧 Email</h2>
              <a className="text-sky-600 leading-relaxed font-medium hover:text-sky-800 transition-colors">info@ecotravels.lk</a>
              <h2 className="title-font font-bold text-sky-800 tracking-widest text-xs uppercase mt-4 mb-3">📞 Phone</h2>
              <p className="leading-relaxed text-sky-700 font-medium">+94 11 234 5678</p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 md:w-1/2 bg-gradient-to-br from-white via-blue-50 to-sky-100 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 rounded-lg shadow-lg p-8 border border-blue-200">
          <h2 className="text-sky-800 text-xl mb-2 font-bold title-font">Contact Us</h2>
          <p className="leading-relaxed mb-6 text-sky-600">Get in touch with us for your next adventure in Sri Lanka</p>
          
          {/* Social Media Section */}
          <div className="mb-6 p-4 bg-white/60 rounded-lg border border-blue-100">
            <h3 className="text-sky-800 text-base mb-3 font-semibold">Follow Us</h3>
            {linksLoading ? (
              <p className="text-sm text-sky-500">Loading social links...</p>
            ) : linksError ? (
              <p className="text-red-500 text-sm">{linksError}</p>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="social-icons flex gap-4"
              >
                <motion.div variants={item}>
                  <a
                    href={links.facebook_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon
                      icon={<Facebook className="h-5 w-5" />}
                      type="facebook"
                    />
                  </a>
                </motion.div>
                <motion.div variants={item}>
                  <a
                    href={links.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon
                      icon={<FaWhatsapp className="h-5 w-5" />}
                      type="whatsapp"
                    />
                  </a>
                </motion.div>
                <motion.div variants={item}>
                  <a
                    href={links.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon
                      icon={<Instagram className="h-5 w-5" />}
                      type="instagram"
                    />
                  </a>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="contents">
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-sky-700 font-medium">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={form.name}
                onChange={handleChange}
                className="w-full bg-white/80 rounded-lg border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
                placeholder="Your full name"
                required
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-sky-700 font-medium">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={form.email}
                onChange={handleChange}
                className="w-full bg-white/80 rounded-lg border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="relative mb-6">
              <label htmlFor="message" className="leading-7 text-sm text-sky-700 font-medium">Message</label>
              <textarea 
                id="message" 
                name="message" 
                value={form.message}
                onChange={handleChange}
                className="w-full bg-white/80 rounded-lg border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 h-32 text-base outline-none text-gray-700 py-2 px-4 resize-none leading-6 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
                placeholder="Tell us about your travel plans..."
                required
              ></textarea>
            </div>

            {submitError && (
              <p className="text-red-600 text-sm mb-3">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="text-green-700 text-sm mb-3">{submitSuccess}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`text-white bg-gradient-to-r from-sky-500 to-blue-600 border-0 py-3 px-8 focus:outline-none rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg transform ${
                submitting
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:from-sky-600 hover:to-blue-700 hover:shadow-xl hover:scale-105'
              }`}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
            <p className="text-xs text-sky-500 mt-4 text-center">
              We&apos;ll get back to you within 24 hours. Your adventure awaits! 🌟
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;