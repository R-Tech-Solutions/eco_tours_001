import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BlogCard = ({ image, date, title, description, author }) => {
  return (
    <>
      <Link
        to={`/blogs/${title}`}
        onClick={() => {
          window.scrollTo(0, 0);
          // window.scroll({
          //   top: 0,
          //   left: 0,
          //   behavior: "smooth",
          // });
        }}
        state={{ image, date, title, description, author }}
      >
        <motion.div 
          className="p-4 shadow-lg transition-all duration-500 hover:shadow-xl bg-gradient-to-b from-sky-400 via-sky-100 to-sky-50 rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#87CEEB' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(59, 130, 246, 0.2)",
            y: -5
          }}
        >
          <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-4">
            <div className="overflow-hidden rounded-xl">
              <motion.img
                src={image}
                alt="No image"
                className="mx-auto h-[250px] w-full object-cover"
                whileHover={{ 
                  scale: 1.05,
                  filter: "brightness(1.1) contrast(1.1)"
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="flex justify-between pt-3 text-white/70">
              <p className="text-sm">{date}</p>
              <p className="line-clamp-1 text-sm">By {author}</p>
            </div>
            <div className="space-y-2 py-3">
              <motion.h1 
                className="line-clamp-1 font-bold text-white"
                whileHover={{ 
                  color: "#3B82F6",
                  textShadow: "0 0 10px rgba(59, 130, 246, 0.5)"
                }}
                transition={{ duration: 0.3 }}
              >
                {title}
              </motion.h1>
              <p className="line-clamp-2 text-white/80">{description}</p>
            </div>
          </div>
        </motion.div>
      </Link>
    </>
  );
};

export default BlogCard;
