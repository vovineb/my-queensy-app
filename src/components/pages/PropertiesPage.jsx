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
      images: ['/src/assets/images/c.jpg', '/src/assets/images/c2.jpg', '/src/assets/images/c3.jpg'],
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
      images: ['/src/assets/images/d.jpg', '/src/assets/images/d1.jpg', '/src/assets/images/d2.jpg'],
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
      images: ['/src/assets/images/q.jpg', '/src/assets/images/q1.jpg', '/src/assets/images/q2.jpg'],
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
      const matchesLocation = !selectedLocation || property.location.includes(selectedLocation);
      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];

      return matchesSearch && matchesType && matchesLocation && matchesPrice;
    });
  }, [searchQuery, selectedType, selectedLocation, priceRange]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-50 to-white pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-oceanic-600 via-blue-600 to-pool-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white font-playfair mb-8 leading-tight">
              Our Premium Properties
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Discover our handpicked selection of luxury accommodations in the heart of Diani Beach
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className={`py-16 ${isDark ? 'bg-navy-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className={`${isDark ? 'bg-navy-800 border-navy-600' : 'bg-white border-ivory-200'} rounded-3xl shadow-2xl p-8 border`}>
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties by name, location, or amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full pl-12 pr-12 py-4 text-lg border ${isDark ? 'border-navy-600 bg-navy-700 text-ivory-100 placeholder-ivory-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-2xl focus:ring-2 focus:ring-oceanic-500 focus:border-transparent`}
                  aria-label="Search properties"
                />
                <button
                  type="button"
                  onClick={() => {/* Live filter; button provided for accessibility */}}
                  title="Search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center bg-oceanic-50 hover:bg-oceanic-100 text-oceanic-700 focus:outline-none focus:ring-2 focus:ring-oceanic-500"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className={`block ${isDark ? 'text-ivory-200' : 'text-gray-700'} font-semibold mb-3`}>Property Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`w-full px-4 py-3 border ${isDark ? 'border-navy-600 bg-navy-700 text-ivory-100' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-oceanic-500 focus:border-transparent`}
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>

              <div>
                <label className={`block ${isDark ? 'text-ivory-200' : 'text-gray-700'} font-semibold mb-3`}>Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={`w-full px-4 py-3 border ${isDark ? 'border-navy-600 bg-navy-700 text-ivory-100' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-oceanic-500 focus:border-transparent`}
                >
                  <option value="">All Locations</option>
                  <option value="Garden View">Garden View</option>
                  <option value="Beach Access">Beach Access</option>
                  <option value="Ocean Front">Ocean Front</option>
                </select>
              </div>

              <div>
                <label className={`block ${isDark ? 'text-ivory-200' : 'text-gray-700'} font-semibold mb-3`}>Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className={`w-full px-3 py-3 border ${isDark ? 'border-navy-600 bg-navy-700 text-ivory-100' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-oceanic-500 focus:border-transparent`}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                    className={`w-full px-3 py-3 border ${isDark ? 'border-navy-600 bg-navy-700 text-ivory-100' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-oceanic-500 focus:border-transparent`}
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('');
                    setSelectedLocation('');
                    setPriceRange([0, 50000]);
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className={`py-16 ${isDark ? 'bg-gradient-to-b from-navy-900 to-navy-800' : 'bg-gradient-to-b from-white to-ivory-50'}`}>
        <div className="container mx-auto px-6">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-12">
            <h2 className={`text-3xl font-bold ${isDark ? 'text-ivory-100' : 'text-black'}`}>
              {filteredProperties.length} Properties Found
            </h2>
            <div className="flex items-center gap-4">
              <span className={`${isDark ? 'text-ivory-300' : 'text-gray-600'}`}>Sort by:</span>
              <select className={`px-4 py-2 border ${isDark ? 'border-navy-600 bg-navy-700 text-ivory-100' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-oceanic-500`}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12"
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PropertyCard property={property} isReturningCustomer={false} />
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-ivory-300' : 'text-gray-600'} mb-4`}>No Properties Found</h3>
              <p className={`${isDark ? 'text-ivory-400' : 'text-gray-500'} mb-8`}>Try adjusting your search criteria or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('');
                  setSelectedLocation('');
                  setPriceRange([0, 50000]);
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-8 font-playfair leading-tight">
            Ready to Book Your Dream Vacation?
          </h2>
          <p className="text-xl text-blue-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Contact us today to secure your preferred dates and start planning your perfect getaway
          </p>
          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md border border-ivory-200 rounded-3xl p-10 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <a
                href="tel:+254707335604"
                className="px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl rounded-3xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-blue-500/30"
              >
                Call Now: +254 707 335 604
              </a>
              <Link
                to="/contact"
                className="px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl rounded-3xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-blue-500/40"
              >
                Send Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertiesPage;
