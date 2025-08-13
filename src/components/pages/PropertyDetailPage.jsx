import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bed, Bath, Users, Check } from 'lucide-react';
import BookingCalendar from '../booking/BookingCalendar';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [bookingComplete, setBookingComplete] = useState(false);

  // Mock data - replace with actual data fetching
  const property = {
    id: 1,
    title: "Luxury Ocean View Villa",
    description: "Experience the ultimate in coastal living with this stunning ocean view villa...",
    price: 25000,
    images: ["/src/assets/images/property1.jpg"],
    amenities: ["Pool", "WiFi", "AC", "Kitchen"],
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6
  };

  const handleBookingComplete = (bookingDetails) => {
    setBookingComplete(true);
    // Handle booking completion (e.g., save to database, send confirmation email)
    console.log('Booking completed:', bookingDetails);
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-black to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column - Property Details */}
          <div className="space-y-6">
            <h1 className="text-4xl font-playfair text-yellow-400 mb-4">{property.title}</h1>
            
            {/* Property Image */}
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4">
              <span className="bg-black/30 px-6 py-3 rounded-xl text-yellow-100 font-medium">
                {property.bedrooms} Bedrooms
              </span>
              <span className="bg-black/30 px-6 py-3 rounded-xl text-yellow-100 font-medium">
                {property.bathrooms} Bathrooms
              </span>
              <span className="bg-black/30 px-6 py-3 rounded-xl text-yellow-100 font-medium">
                Up to {property.maxGuests} Guests
              </span>
            </div>

            {/* Description */}
            <div className="bg-black/20 p-6 rounded-xl">
              <h2 className="text-2xl font-playfair text-yellow-400 mb-4">About this property</h2>
              <p className="text-yellow-100 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-black/20 p-6 rounded-xl">
              <h2 className="text-2xl font-playfair text-yellow-400 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-yellow-100">
                    <Check className="w-5 h-5 text-yellow-400" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Calendar */}
          <div className="lg:sticky lg:top-24">
            <BookingCalendar
              property={property}
              onBookingComplete={handleBookingComplete}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;