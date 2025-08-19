import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { MapPin, Users, Bed, Bath, Star, ArrowLeft, Calendar, Phone, Mail } from 'lucide-react';
import BookingModal from '../booking/BookingModal';
import cImage from '../../assets/images/c.jpg';
import c2Image from '../../assets/images/c2.jpg';
import c3Image from '../../assets/images/c3.jpg';
import c4Image from '../../assets/images/c4.jpg';
import c5Image from '../../assets/images/c5.jpg';
import c6Image from '../../assets/images/c6.jpg';
import c7Image from '../../assets/images/c7.jpg';
import c8Image from '../../assets/images/c8.jpg';
import dImage from '../../assets/images/d.jpg';
import d1Image from '../../assets/images/d1.jpg';
import d2Image from '../../assets/images/d2.jpg';
import d3Image from '../../assets/images/d3.jpg';
import d4Image from '../../assets/images/d4.jpg';
import d5Image from '../../assets/images/d5.jpg';
import d6Image from '../../assets/images/d6.jpg';
import d7Image from '../../assets/images/d7.jpg';
import qImage from '../../assets/images/q.jpg';
import q1Image from '../../assets/images/q1.jpg';
import q2Image from '../../assets/images/q2.jpg';
import q3Image from '../../assets/images/q3.jpg';
import q4Image from '../../assets/images/q4.jpg';
import q5Image from '../../assets/images/q5.jpg';
import q6Image from '../../assets/images/q6.jpg';
import q7Image from '../../assets/images/q7.jpg';
import q8Image from '../../assets/images/q8.jpg';
import q9Image from '../../assets/images/q9.jpg';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Auto-scroll images
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % properties[id].images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [id]);

  // Property data with full details and all available images
  const properties = {
    1: {
      id: 1,
      title: 'Chameleon 1',
      fullDescription: 'Experience the perfect blend of comfort and luxury in our cozy 1-bedroom unit. This charming accommodation is designed for couples or solo travelers seeking a peaceful retreat in the heart of Diani Beach. The unit features modern amenities, garden views, and a private balcony where you can enjoy your morning coffee while listening to the sounds of nature.',
      shortDescription: 'Cozy 1-bedroom unit perfect for couples or solo travelers. Features modern amenities and garden views.',
      images: [cImage, c2Image, c3Image, c4Image, c5Image, c6Image, c7Image, c8Image],
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      price: 5500,
      originalPrice: 5500,
      discountedPrice: 5000,
      amenities: [
        'Garden View', 'WiFi', 'Kitchen', 'Balcony', 'Air Conditioning', 
        'Security', 'Daily Housekeeping', 'Beach Towels', 'Free Parking'
      ],
      location: 'Diani Beach',
      features: [
        'Private entrance for added privacy',
        'Fully equipped kitchen with modern appliances',
        'Comfortable seating area with garden views',
        'Private balcony with outdoor furniture',
        'Air conditioning and ceiling fans',
        '24/7 security and CCTV surveillance'
      ]
    },
    2: {
      id: 2,
      title: 'Chameleon 2',
      fullDescription: 'Discover tranquility in our charming 1-bedroom accommodation with direct beach access. This romantic getaway is perfect for couples looking to create unforgettable memories. The unit offers stunning ocean views, modern amenities, and a serene atmosphere that will make your stay truly special.',
      shortDescription: 'Charming 1-bedroom accommodation with beach access. Ideal for romantic getaways and peaceful retreats.',
      images: [dImage, d1Image, d2Image, d3Image, d4Image, d5Image, d6Image, d7Image],
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      price: 5500,
      originalPrice: 5500,
      discountedPrice: 5000,
      amenities: [
        'Beach Access', 'WiFi', 'Kitchen', 'Ocean View', 'Air Conditioning', 
        'Security', 'Daily Housekeeping', 'Beach Towels', 'Free Parking'
      ],
      location: 'Diani Beach',
      features: [
        'Direct access to pristine Diani Beach',
        'Panoramic ocean views from the balcony',
        'Fully equipped kitchen with dining area',
        'Comfortable bedroom with premium bedding',
        'Private bathroom with modern fixtures',
        'Outdoor seating area for relaxation'
      ]
    },
    3: {
      id: 3,
      title: 'Wendy\'s Penthouse',
      fullDescription: 'Indulge in the ultimate luxury experience at our exclusive 3-bedroom penthouse. This premium accommodation offers panoramic coastal views, private terrace access, and concierge services. Perfect for families or groups seeking the highest level of comfort and service in Diani Beach.',
      shortDescription: 'Luxurious 3-bedroom penthouse with panoramic coastal views. Fully inclusive with premium amenities.',
      images: [qImage, q1Image, q2Image, q3Image, q4Image, q5Image, q6Image, q7Image, q8Image, q9Image],
      bedrooms: 3,
      bathrooms: 3,
      maxGuests: 6,
      price: 15500,
      originalPrice: 15500,
      discountedPrice: 14000,
      amenities: [
        'Panoramic View', 'Private Terrace', 'Luxury Finishings', 'Concierge', 
        'Fully Inclusive', 'Premium Service', 'Private Pool', 'Gourmet Kitchen',
        'Master Suite', 'Ocean Front', 'Butler Service', 'Airport Transfer'
      ],
      location: 'Diani Beach',
      features: [
        'Spacious master bedroom with ocean views',
        'Two additional comfortable guest bedrooms',
        'Three modern bathrooms with premium fixtures',
        'Large private terrace with outdoor dining',
        'Fully equipped gourmet kitchen',
        'Concierge service for personalized assistance'
      ]
    }
  };

  const property = properties[id];

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-blue-800 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-400 mb-4">Property Not Found</h1>
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <div className="container mx-auto px-6 py-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>
      </div>

      <div className="container mx-auto px-6 pb-20">
        {/* Property Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-4 text-blue-600">
            {property.title}
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {property.fullDescription}
          </p>
        </motion.div>

                    {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Image with Auto-scroll */}
                <div className="space-y-4">
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden relative">
                    <img
                      src={property.images[selectedImage]}
                      alt={`${property.title} - Image ${selectedImage + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Auto-scroll indicator */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      Auto-scroll: {selectedImage + 1}/{property.images.length}
                    </div>
                  </div>
                  
                  {/* Thumbnail Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                          selectedImage === index 
                            ? 'ring-4 ring-blue-500 scale-105' 
                            : 'hover:scale-105'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${property.title} - Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

            {/* Property Details */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl">
                <h3 className="text-2xl font-bold text-blue-800 mb-4">Property Highlights</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Bed className="w-6 h-6 text-blue-600" />
                    <span className="text-blue-700">{property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="w-6 h-6 text-blue-600" />
                    <span className="text-blue-700">{property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    <span className="text-blue-700">Up to {property.maxGuests} Guests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <span className="text-blue-700">{property.location}</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-2">
                    KES {property.originalPrice.toLocaleString()}/night
                  </div>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="inline-flex items-center justify-center whitespace-nowrap w-full min-h-[56px] px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description + Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          {/* Glassy Description Block */}
          <div className={`${isDark ? 'bg-navy-800/80' : 'bg-white/80'} backdrop-blur-md rounded-3xl p-8 border ${isDark ? 'border-navy-700/40' : 'border-white/30'} shadow-2xl`}>
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>About this place</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed`}>{property.fullDescription}</p>
          </div>

          {/* Google Maps Embed */}
          <div className={`${isDark ? 'bg-navy-800/80' : 'bg-white/80'} backdrop-blur-md rounded-3xl p-4 border ${isDark ? 'border-navy-700/40' : 'border-white/30'} shadow-2xl`}> 
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Location</h3>
            <div className="rounded-2xl overflow-hidden">
              {property.location ? (
                <iframe
                  title={`Map of ${property.location}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
                  width="100%"
                  height="320"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="p-6 text-center">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Location unavailable</p>
                  <iframe
                    title="Default map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent('Diani Beach, Kenya')}&output=embed`}
                    width="100%"
                    height="320"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Amenities & Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          <div className={`${isDark ? 'bg-navy-800/80' : 'bg-white/80'} backdrop-blur-md rounded-3xl p-8 border ${isDark ? 'border-navy-700/40' : 'border-white/30'} shadow-2xl`}>
            <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {amenity}
                </div>
              ))}
            </div>
          </div>
          
          <div className={`${isDark ? 'bg-navy-800/80' : 'bg-white/80'} backdrop-blur-md rounded-3xl p-8 border ${isDark ? 'border-navy-700/40' : 'border-white/30'} shadow-2xl`}>
            <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Features</h3>
            <div className="space-y-3">
              {property.features.map((feature, index) => (
                <div key={index} className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Book Your Stay?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Contact us today to secure your dates and start planning your dream vacation in Diani Beach
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-colors">
              <Phone className="w-5 h-5 inline mr-2" />
              Call Now
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-blue-600 transition-colors">
              <Mail className="w-5 h-5 inline mr-2" />
              Send Email
            </button>
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        property={{
          name: property.title,
          location: property.location,
          maxGuests: property.maxGuests,
          price: property.price,
          discountedPrice: property.discountedPrice,
          originalPrice: property.originalPrice
        }}
      />
    </div>
  );
};

export default PropertyDetailPage;