import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Star, Wifi, Coffee, Car, Shield } from 'lucide-react';
import BookingModal from '../booking/BookingModal';
import Card from '../common/Card';
import Button from '../common/Button';

const PropertyCard = ({ property, isReturningCustomer = false }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const navigate = useNavigate();

  const amenities = [
    { icon: Wifi, label: 'WiFi' },
    { icon: Coffee, label: 'Coffee' }
  ];

  return (
    <>
      <Card
        variant="default"
        padding="none"
        className="group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-[var(--card-bg)] border-none rounded-3xl min-h-[528px] w-[110%] mx-[-5%]"
      >
        {/* Enhanced Image Container - 3/4 of card height */}
        <div className="relative h-80 overflow-hidden rounded-t-3xl">
          <img 
            src={property.images?.[0] || property.image} 
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--vintage-dark)]/60 via-transparent to-transparent" />
          
          {/* Enhanced Price Tag */}
          <div className="absolute top-3 right-3">
            <div className="px-3 py-2 bg-[var(--vintage-sage)] text-[var(--tech-white)] font-semibold rounded-xl shadow-lg backdrop-blur-sm border border-[var(--vintage-cream)]/20 text-sm">
              KES {property.price.toLocaleString()}/night
            </div>
          </div>
          
          {/* Enhanced Badge */}
          <div className="absolute top-3 left-3">
            <div className="px-3 py-1 bg-[var(--vintage-brown)] text-[var(--tech-white)] font-medium rounded-lg shadow-lg backdrop-blur-sm border border-[var(--vintage-cream)]/20 text-xs">
              {property.type || 'Premium'}
            </div>
          </div>
        </div>

        {/* Enhanced Content with Better Spacing */}
        <div className="p-5 space-y-4">
          {/* Enhanced Title and Rating */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[var(--vintage-sage)] leading-tight tracking-wide font-display">
              {property.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[var(--vintage-sage)] fill-current" />
                ))}
              </div>
              <span className="text-[var(--vintage-brown)] font-medium text-sm font-sans">4.9 (128)</span>
            </div>
          </div>

          {/* Enhanced Property Details */}
          <div className="space-y-2 py-2 border-t border-[var(--vintage-sage)]/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-[var(--vintage-sage)]" />
                <span className="text-[var(--vintage-brown)] font-medium text-sm font-sans">{property.bedrooms || 1} Bed</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4 text-[var(--vintage-sage)]" />
                <span className="text-[var(--vintage-brown)] font-medium text-sm font-sans">{property.bathrooms || 1} Bath</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--vintage-sage)]" />
              <span className="text-[var(--vintage-brown)] font-medium text-sm font-sans">{property.location}</span>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex gap-3 pt-3">
            <Button
              onClick={() => setShowBookingModal(true)}
              variant="primary"
              size="medium"
              className="flex-1 font-sans bg-[var(--vintage-sage)] hover:bg-[var(--vintage-brown)] text-[var(--tech-white)] font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-base"
            >
              Book Now
            </Button>
            
            <Button
              onClick={() => navigate(`/properties/${property.id}`)}
              variant="secondary"
              size="medium"
              className="flex-1 font-sans bg-transparent hover:bg-[var(--vintage-sage)] text-[var(--vintage-sage)] hover:text-[var(--tech-white)] font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-[var(--vintage-sage)] text-base"
            >
              Details
            </Button>
          </div>
        </div>
      </Card>

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
