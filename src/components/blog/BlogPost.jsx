import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag, ChevronRight } from 'lucide-react';

const BlogPost = ({ post }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6">
        <motion.img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Category Tag */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <Tag className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-white font-medium">{post.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Date */}
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{post.date}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold font-playfair group-hover:text-yellow-400 transition-colors">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-300 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Read More */}
        <motion.div
          className="inline-flex items-center gap-2 text-yellow-400 font-medium"
          whileHover={{ x: 5 }}
        >
          Read More
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.article>
  );
};

export default BlogPost;