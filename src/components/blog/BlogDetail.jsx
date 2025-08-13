import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag, ChevronLeft, Share2, Clock, User } from 'lucide-react';
import { blogPosts } from '../../data/blogData';

// Custom hook for back navigation with refresh
const useBackNavigation = () => {
  const navigate = useNavigate();
  
  const goBack = () => {
    // Store current page in session storage
    sessionStorage.setItem('lastPage', window.location.pathname);
    
    // Navigate back
    navigate(-1);
    
    // Refresh the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  return { goBack };
};

// Markdown to HTML converter
const convertMarkdownToHTML = (markdown) => {
  if (!markdown) return '';
  
      return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-display font-semibold text-blue-300 mb-4 mt-6">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-display font-bold text-blue-400 mb-6 mt-8">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-display font-bold text-blue-400 mb-8 mt-10">$1</h1>')
      
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-400 font-semibold">$1</strong>')
    
    // Italic text
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    
    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="w-full h-auto rounded-lg my-6" />')
    
          // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
    
    // Wrap lists in ul tags
    .replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-2 mb-6 text-gray-300 font-body">$1</ul>')
    
    // Paragraphs
    .replace(/^(?!<[h|u|o]|<li|<img|<a)(.*$)/gim, '<p class="text-gray-300 font-body leading-relaxed mb-6">$1</p>')
    
    // Clean up empty paragraphs
    .replace(/<p class="text-gray-300 font-body leading-relaxed mb-6"><\/p>/g, '')
    
    // Clean up multiple line breaks
    .replace(/\n\s*\n/g, '\n')
    
    // Final cleanup
    .trim();
};

const BlogDetail = ({ slug }) => {
  const navigate = useNavigate();
  const { goBack } = useBackNavigation();
  const post = blogPosts.find(p => p.slug === slug) || {
    title: "Exploring Diani's Hidden Treasures",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=400&fit=crop",
    content: `
      # Discover the untold stories and hidden gems of Diani Beach
      
      Diani Beach stretches along Kenya's southern coast, offering visitors a slice of paradise with its powder-white sand and turquoise waters. The beach has consistently been voted as one of Africa's best, and it's easy to see why.

      ## The Perfect Beach Getaway
      
      Diani Beach stretches along Kenya's southern coast, offering visitors a slice of paradise with its powder-white sand and turquoise waters. The beach has consistently been voted as one of Africa's best, and it's easy to see why.

      ## Local Culture and Traditions

      The local Digo community has called this area home for centuries, and their rich cultural heritage adds an authentic dimension to your stay. From traditional dances to local cuisine, every experience here tells a story.

      ## Water Activities and Adventures

      * Snorkeling and diving in coral reefs
      * Kitesurfing and windsurfing
      * Glass-bottom boat trips
      * Dolphin watching excursions

      ## Luxury Accommodations

      Our properties offer the perfect blend of comfort and luxury, with modern amenities while maintaining authentic coastal charm. Each room is designed to maximize your comfort while providing stunning views of the Indian Ocean.

      ## Dining and Cuisine

      Sample the finest local and international cuisine at our recommended restaurants. Fresh seafood, tropical fruits, and traditional Swahili dishes create an unforgettable culinary experience.

      ## Getting Here and Around

      Diani is easily accessible via Ukunda Airstrip, just a 10-minute drive from our properties. We can arrange airport transfers and local transportation to ensure a smooth, hassle-free stay.
    `,
    category: "Travel Guide",
    date: "December 15, 2024",
    author: "Queensy Team",
    readTime: "8 min read"
  };

  const formatContent = (content) => {
    return convertMarkdownToHTML(content);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white pt-32 pb-16"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Category & Date */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Tag className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white font-medium">{post.category}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{post.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{post.readTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{post.author}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                {post.title}
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-invert mx-auto">
          {/* Back Button */}
          <motion.button
            onClick={goBack}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-500 mb-8 font-medium transition-colors"
            whileHover={{ x: -5 }}
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Blog
          </motion.button>

          {/* Share Button */}
                      <motion.button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-blue-400 mb-8 font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Share2 className="w-5 h-5" />
              Share Article
            </motion.button>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />

          {/* Article Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-gray-700"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-blue-400 font-semibold">{post.author}</p>
              <p className="text-gray-400 text-sm">{post.date}</p>
            </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">{post.readTime}</span>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-400 text-sm">{post.category}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogDetail;