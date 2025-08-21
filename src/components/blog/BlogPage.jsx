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
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 id="blog-heading" className="text-5xl md:text-6xl font-bold font-playfair mb-6 text-[var(--text-primary)]">
            Our Blog
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Discover insights, tips, and stories from our luxury accommodations in Diani
          </p>
        </motion.header>

        {/* Search & Filter */}
        <section className="max-w-4xl mx-auto mb-16 space-y-8" aria-labelledby="search-filter-heading">
          <h2 id="search-filter-heading" className="sr-only">Search and Filter Blog Posts</h2>
          {/* Search */}
          <div className="relative" role="search">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl px-6 py-4 pl-12 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          </div>

          {/* Categories */}
          <nav className="flex flex-wrap gap-3 justify-center" aria-label="Blog categories">
            {categories.map(category => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors font-sans ${
                  selectedCategory === category
                    ? 'bg-[var(--color-primary)] text-[var(--tech-white)]'
                    : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </nav>
        </section>

        {/* Blog Posts Grid */}
        <section aria-labelledby="blog-posts-heading">
          <h2 id="blog-posts-heading" className="sr-only">Blog Posts</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            role="list"
          >
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-[var(--card-bg)] backdrop-blur-sm rounded-3xl overflow-hidden border border-[var(--card-border)] hover:border-[var(--color-primary)]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--shadow-hover)] group"
                role="listitem"
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
                    <Tag className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-sm text-[var(--color-primary)] font-medium uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>

                  {/* Blog Post Title */}
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                    {post.title}
                  </h3>

                  {/* Blog Post Excerpt */}
                  <div className="space-y-4">
                    {post.excerpt.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-[var(--text-secondary)] leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>

                  {/* Read More Link */}
                  <div className="pt-4">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-semibold transition-colors group"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">No posts found</h3>
            <p className="text-[var(--text-muted)]">
              Try adjusting your search or filter to find what you're looking for
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default BlogPage;