import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, ArrowRight } from 'lucide-react';
import { blogPosts } from '../../data/blogData';
import BlogPost from './BlogPost';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold font-playfair mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover insights, tips, and stories from our luxury accommodations in Diani
          </p>
        </motion.div>

        {/* Search & Filter */}
        <div className="max-w-4xl mx-auto mb-16 space-y-8">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-400 text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-black/20 backdrop-blur-sm rounded-3xl overflow-hidden border border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 group"
            >
              {/* Blog Post Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Blog Post Content */}
              <div className="p-8 space-y-6">
                {/* Category Tag */}
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400 font-medium uppercase tracking-wide">
                    {post.category}
                  </span>
                </div>

                {/* Blog Post Title */}
                <h3 className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors leading-tight">
                  {post.title}
                </h3>

                {/* Blog Post Excerpt */}
                <div className="space-y-4">
                  {post.excerpt.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-blue-100 leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>

                {/* Read More Link */}
                <div className="pt-4">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors group"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-2xl font-bold mb-4">No posts found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter to find what you're looking for
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;