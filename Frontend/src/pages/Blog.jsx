import { useState, useEffect } from "react";
import axios from "axios";
import {BackendUrl} from "../BackendUrl";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add CSS styles for modern card hover effect
  useEffect(() => {
    const cardStyles = `
      .blog-card {
        width: 320px;
        height: 320px;
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.4s ease;
        margin: 0 auto;
      }

      .blog-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      .card-front {
        width: 100%;
        height: 100%;
        position: relative;
        background: #000;
      }

      .card-front img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all 0.5s ease;
      }

      .hover-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 24px;
        font-weight: 600;
        text-align: center;
        opacity: 1;
        transition: all 0.5s ease;
        z-index: 2;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }

      .card-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95));
        padding: 24px;
        transform: translateY(100%);
        transition: all 0.5s ease;
        color: white;
        text-align: center;
        z-index: 3;
      }

      .card-content h3 {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 12px;
        line-height: 1.3;
      }

      .card-content p {
        font-size: 14px;
        line-height: 1.5;
        opacity: 0.9;
        margin: 0;
      }

      .blog-card:hover .card-front img {
        transform: scale(1.1);
        filter: brightness(0.7);
      }

      .blog-card:hover .hover-text {
        opacity: 0;
        transform: translate(-50%, -50%) translateY(-20px);
      }

      .blog-card:hover .card-content {
        transform: translateY(0);
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = cardStyles;
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

    fetchPosts();

    return () => clearTimeout(loadingTimer);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log('Fetching blog posts from:', `${BackendUrl}/api/posts/`);
      const response = await axios.get(`${BackendUrl}/api/posts/`);
      console.log('Blog posts fetched successfully:', response.data);
      if (response.data && response.data.length > 0) {
        console.log('First post image URL:', response.data[0].post_image_url);
        console.log('First post image field:', response.data[0].post_image);
        console.log('First post title:', response.data[0].post_title);
      } else {
        console.log('No blog posts found in response');
      }
      setBlogPosts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
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
          Loading amazing stories...
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

  if (error) {
    return (
      <div 
        className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 mt-16"
        style={{
          background: "linear-gradient(to bottom, #87CEEB, #B0E0E6, #E0F6FF)",
          backgroundColor: '#87CEEB'
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #87CEEB, #B0E0E6, #E0F6FF)",
        backgroundColor: '#87CEEB'
      }}
    >
      <div className="relative z-10 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 pt-24 md:pt-32">
            <h1 className="text-4xl font-bold text-black mb-6 drop-shadow-lg">Travel Blog</h1>
            <p className="text-lg text-gray-600">Discover amazing stories and travel tips</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {blogPosts.map((post) => {
              console.log('Rendering blog post:', post.id, post.post_title);
              console.log('Image URL being used:', post.post_image_url || post.post_image || '/placeholder.svg');
              return (
                <div key={post.id} className="blog-card">
                  <div className="card-front">
                    <img 
                      src={post.post_image_url || post.post_image || '/placeholder.svg'} 
                      alt={post.post_title} 
                      onError={(e) => {
                        console.error('Blog image failed to load:', post.post_image_url || post.post_image);
                        e.target.src = '/placeholder.svg';
                      }}
                      onLoad={() => {
                        console.log('Blog image loaded successfully:', post.post_title);
                      }}
                    />
                  <div className="hover-text">Hover to Read</div>
                </div>
                <div className="card-content">
                  <h3>{post.post_title}</h3>
                  <p>
                    {post.post_content.length > 150 
                      ? `${post.post_content.substring(0, 150)}...` 
                      : post.post_content
                    }
                  </p>
                </div>
              </div>
            );
            })}
          </div>
        </div>
        {/* Fixed bottom nav for mobile/hidden nav */}
        <nav className="fixed left-0 w-full z-50 bg-black/80 backdrop-blur-md border-t border-white/10 flex justify-around items-center py-3 md:hidden" style={{ bottom: '1.5rem' }}>
          <a href="/" className="text-white flex flex-col items-center text-xs hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8l2 2m-2-2v8m0 0H7m6 0h4" /></svg>
            Home
          </a>
          <a href="/gallery" className="text-white flex flex-col items-center text-xs hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12V8a2 2 0 012-2h12a2 2 0 012 2v4" /></svg>
            Gallery
          </a>
          <a href="/services" className="text-white flex flex-col items-center text-xs hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" /></svg>
            Services
          </a>
          <a href="/blog" className="text-white flex flex-col items-center text-xs hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
            Blog
          </a>
        </nav>
      </div>
    </section>
  );
};

export default Blog;