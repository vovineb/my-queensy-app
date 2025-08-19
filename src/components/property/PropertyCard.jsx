import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Star, Wifi, Coffee, Car, Shield } from 'lucide-react';
import BookingModal from '../booking/BookingModal';

const PropertyCard = ({ property, isReturningCustomer = false }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const navigate = useNavigate();

  const amenities = [
    { icon: Wifi, label: 'WiFi' },
    { icon: Coffee, label: 'Coffee' },
    { icon: Car, label: 'Parking' },
    { icon: Shield, label: 'Security' }
  ];

  return (
    <>
      <motion.div
        whileHover={{ y: -12, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white dark:bg-navy-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group border border-ivory-200 dark:border-navy-700/40 mb-12"
      >
        {/* Image Container with Enhanced Spacing */}
        <div className="relative h-80 overflow-hidden">
          <img 
            src={property.images?.[0] || property.image} 
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {/* Price Tag with Better Spacing - Blue/Green gradient for visibility */}
          <div className="absolute top-6 right-6">
            <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold rounded-2xl shadow-lg">
              KES {property.price.toLocaleString()}/night
            </div>
          </div>
          
          {/* Badge with Enhanced Spacing */}
          <div className="absolute top-6 left-6">
            <div className="px-4 py-2 bg-oceanic-600 text-white font-semibold rounded-xl shadow-lg">
              {property.type || 'Premium'}
            </div>
          </div>
        </div>

        {/* Content with Improved Spacing */}
        <div className="p-10 space-y-8">
          {/* Title and Rating */}
          <div className="space-y-5">
            <h3 className="text-3xl font-bold text-black dark:text-oceanic-200 leading-tight tracking-wide">
              {property.name}
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                ))}
              </div>
              <span className="text-gray-600 dark:text-oceanic-300 font-medium text-lg">4.9 (128 reviews)</span>
            </div>
          </div>

          {/* Description with Better Typography */}
          <p className="text-black dark:text-oceanic-200 text-xl leading-relaxed font-medium tracking-wide">
            {property.description}
          </p>

          {/* Amenities Grid with Enhanced Spacing */}
          <div className="grid grid-cols-2 gap-6 pt-6">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-oceanic-50 dark:bg-navy-700/50 rounded-xl border border-oceanic-200 dark:border-navy-700">
                <div className="w-10 h-10 bg-oceanic-100 dark:bg-navy-700 rounded-lg flex items-center justify-center">
                  <amenity.icon className="w-5 h-5 text-oceanic-600 dark:text-oceanic-300" />
                </div>
                <span className="text-black dark:text-oceanic-200 font-semibold text-base">{amenity.label}</span>
              </div>
            ))}
          </div>

          {/* Property Details with Better Spacing */}
          <div className="flex items-center justify-between py-6 border-t border-ivory-200 dark:border-navy-700">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Bed className="w-7 h-7 text-oceanic-600 dark:text-oceanic-400" />
                <span className="text-black dark:text-oceanic-200 font-bold text-xl">{property.bedrooms || 1} Bedroom</span>
              </div>
              <div className="flex items-center gap-3">
                <Bath className="w-7 h-7 text-oceanic-600 dark:text-oceanic-400" />
                <span className="text-black dark:text-oceanic-200 font-bold text-xl">{property.bathrooms || 1} Bath</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-oceanic-600 dark:text-oceanic-400" />
              <span className="text-black dark:text-oceanic-200 font-medium text-lg">{property.location}</span>
            </div>
          </div>

          {/* Pricing Section with Enhanced Spacing */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-navy-700 dark:to-navy-600 rounded-2xl p-8 border border-blue-200 dark:border-navy-500">
            <div className="flex items-center justify-between mb-6">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                KES {property.price.toLocaleString()}
              </span>
              <span className="text-black dark:text-oceanic-200 font-medium text-lg">per night</span>
            </div>
            
            {isReturningCustomer && property.discountedPrice && (
              <div className="flex items-center gap-3">
                <span className="text-lg text-gray-500 line-through">
                  KES {property.originalPrice?.toLocaleString()}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded-full text-sm">
                  Returning Guest Discount
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons with Enhanced Styling */}
          <div className="flex gap-6 pt-6 justify-center flex-wrap">
            <motion.button
              onClick={() => setShowBookingModal(true)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-medium text-base font-bold px-6 py-3 shadow-lg flex-1 min-w-[140px] bg-blue-700 text-white hover:bg-blue-800 transition-all duration-300"
            >
              Book Now
            </motion.button>
            
            <motion.button
              onClick={() => navigate(`/properties/${property.id}`)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-medium text-base font-bold px-6 py-3 shadow-lg flex-1 min-w-[140px] bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
            >
              View Details
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        property={property}
      />
    </>
  );
};

export default PropertyCard;
