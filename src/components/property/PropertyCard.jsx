import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import PropertyCalendar from './PropertyCalendar';

const PropertyCard = ({ property, isReturningCustomer = false }) => {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const [showBooking, setShowBooking] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-2xl overflow-hidden transition-all duration-500 group ${
        isDark 
          ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' 
          : 'bg-white/80 backdrop-blur-sm border border-gray-200/50'
      }`}
    >
      {/* Image Section */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <motion.img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
        <div className={`absolute inset-0 ${
          isDark ? 'bg-gradient-to-t from-gray-900/90 to-transparent' 
                : 'bg-gradient-to-t from-gray-50/90 to-transparent'
        }`} />
        
        {/* Property Details Badge */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          <div className="property-amenity">
            {property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}
          </div>
          <div className="property-amenity">
            {property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}
          </div>
          <div className="property-amenity">
            Up to {property.guests} Guests
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-6">
        {/* Title */}
        <h3 className={`text-2xl font-bold font-playfair group-hover:text-yellow-400 transition-colors`}>
          {property.title}
        </h3>

        {/* Description */}
        <p className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {property.shortDescription}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, 4).map((amenity, index) => (
            <span
              key={index}
              className="property-amenity"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 4 && (
            <span className="property-amenity">
              +{property.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
          <div>
            {isReturningCustomer ? (
              <>
                <p className={`text-sm line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  KES {property.originalPrice.toLocaleString()}
                </p>
                <p className="text-2xl font-bold text-green-400">
                  KES {property.discountedPrice.toLocaleString()}/night
                </p>
                <p className="text-sm text-green-400">Returning Customer Price</p>
              </>
            ) : (
              <>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  KES {property.originalPrice.toLocaleString()}/night
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Best available rate
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            onClick={() => setShowBooking(!showBooking)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${
              isDark 
                ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
                : 'bg-yellow-600 text-white hover:bg-yellow-500'
            }`}
          >
            {showBooking ? 'Hide Calendar' : 'Book Now'}
          </motion.button>
          
          <motion.button
            onClick={() => navigate(`/properties/${property.id}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-3 px-6 rounded-xl font-medium border-2 transition-colors ${
              isDark 
                ? 'border-gray-600 hover:bg-gray-700/50' 
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            View Details
          </motion.button>
        </div>

        {/* Booking Calendar */}
        {showBooking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="booking-calendar"
          >
            <PropertyCalendar property={property} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyCard;