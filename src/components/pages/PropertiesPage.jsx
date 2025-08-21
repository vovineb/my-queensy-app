import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Star, Bed, Bath, Users } from 'lucide-react';
import PropertyCard from '../property/PropertyCard';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const PropertiesPage = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('featured');

  const properties = [
    {
      id: 1,
      name: 'Chameleon 1',
      type: 'Apartment',
      location: 'Garden View, Diani Beach',
      price: 5500,
      originalPrice: 6500,
      discountedPrice: 5500,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      description: 'Cozy 1-bedroom unit perfect for couples or solo travelers seeking comfort and luxury.',
      amenities: ['WiFi', 'Coffee Maker', 'Free Parking', 'Security'],
      images: ['/images/c.jpg', '/images/c2.jpg', '/images/c3.jpg'],
      rating: 4.9,
      reviews: 128
    },
    {
      id: 2,
      name: 'Chameleon 2',
      type: 'Apartment',
      location: 'Beach Access, Diani Beach',
      price: 5500,
      originalPrice: 6500,
      discountedPrice: 5500,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      description: 'Charming 1-bedroom accommodation with direct beach access and stunning ocean views.',
      amenities: ['WiFi', 'Coffee Maker', 'Free Parking', 'Security'],
      images: ['/images/d.jpg', '/images/d1.jpg', '/images/d2.jpg'],
      rating: 4.8,
      reviews: 95
    },
    {
      id: 3,
      name: "Wendy's Penthouse",
      type: 'Penthouse',
      location: 'Ocean Front, Diani Beach',
      price: 15500,
      originalPrice: 15500,
      discountedPrice: 14000,
      bedrooms: 3,
      bathrooms: 3,
      maxGuests: 6,
      description: 'Luxurious 3-bedroom penthouse with panoramic coastal views and premium amenities.',
      amenities: ['WiFi', 'Coffee Maker', 'Free Parking', 'Security', 'Pool Access', 'Beach Equipment'],
      images: ['/images/q.jpg', '/images/q1.jpg', '/images/q2.jpg'],
      rating: 5.0,
      reviews: 67
    }
  ];

  // Handle URL search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.amenities.some(amenity => 
                             amenity.toLowerCase().includes(searchQuery.toLowerCase())
                           );
      
      const matchesType = !selectedType || property.type === selectedType;
      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [searchQuery, selectedType, priceRange]);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-16 sm:pt-20" role="main" aria-label="Properties listing page">
      {/* Hero Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-24 bg-[var(--color-primary)]" aria-labelledby="properties-hero-heading">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 id="properties-hero-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
              Our Premium Properties
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Discover our handpicked selection of luxury accommodations in the heart of Diani Beach
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section - Simplified */}
      <section className="py-4 bg-[var(--bg-secondary)]" aria-labelledby="filters-heading">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-lg p-4">
            {/* Simplified Filters - Only Property Type */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="w-full max-w-xs">
                <label htmlFor="property-type" className="block text-[var(--text-primary)] font-semibold mb-3 text-center">Property Type</label>
                <select
                  id="property-type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-base rounded-xl border border-[var(--vintage-sage)]/30 bg-[var(--vintage-cream)] text-[var(--vintage-brown)] placeholder-[var(--vintage-brown)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--vintage-sage)] focus:border-[var(--vintage-sage)] shadow-md"
                  aria-label="Filter by property type"
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid Section */}
      <section className="py-8 sm:py-12 md:py-16" aria-labelledby="properties-grid-heading">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 id="properties-grid-heading" className="sr-only">Properties listing</h2>
          
          {/* Sort Options */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 mb-6 sm:mb-8">
            <p className="text-[var(--text-primary)] font-medium">
              {filteredProperties.length} properties found
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-4 text-base bg-[var(--vintage-sage)] text-[var(--tech-white)] rounded-xl hover:bg-[var(--vintage-brown)] transition-all duration-300 font-semibold min-w-[100px] shadow-md"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Properties Grid - Laptop Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[var(--text-muted)] text-lg">No properties match your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PropertiesPage;
