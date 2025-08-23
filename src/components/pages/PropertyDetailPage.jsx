import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { MapPin, Users, Bed, Bath, Star, ArrowLeft, Calendar, Phone, Mail } from 'lucide-react';
import BookingModal from '../booking/BookingModal';
// Using images from public directory
const cImage = '/images/c.jpg';
const c2Image = '/images/c2.jpg';
const c3Image = '/images/c3.jpg';
const c4Image = '/images/c4.jpg';
const c5Image = '/images/c5.jpg';
const c6Image = '/images/c6.jpg';
const c7Image = '/images/c7.jpg';
const c8Image = '/images/c8.jpg';
const dImage = '/images/d.jpg';
const d1Image = '/images/d1.jpg';
const d2Image = '/images/d2.jpg';
const d3Image = '/images/d3.jpg';
const d4Image = '/images/d4.jpg';
const d5Image = '/images/d5.jpg';
const d6Image = '/images/d6.jpg';
const d7Image = '/images/d7.jpg';
const qImage = '/images/q.jpg';
const q1Image = '/images/q1.jpg';
const q2Image = '/images/q2.jpg';
const q3Image = '/images/q3.jpg';
const q4Image = '/images/q4.jpg';
const q5Image = '/images/q5.jpg';
const q6Image = '/images/q6.jpg';
const q7Image = '/images/q7.jpg';
const q8Image = '/images/q8.jpg';
const q9Image = '/images/q9.jpg';
const wImage = '/images/w.jpg';
const w1Image = '/images/w1.jpg';
const w2Image = '/images/w2.jpg';
const w3Image = '/images/w3.jpg';
const w4Image = '/images/w4.jpg';
const w5Image = '/images/w5.jpg';
const w6Image = '/images/w6.jpg';
const w7Image = '/images/w7.jpg';

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
    },
    4: {
      id: 4,
      title: 'Watamu Villa',
      fullDescription: 'Experience luxury and comfort in our beautiful Watamu Villa. This stunning 4-bedroom, 3-bathroom villa is perfect for large groups or families seeking a memorable vacation. With breathtaking views and premium amenities, you\'ll enjoy the ultimate beachfront experience in Watamu.',
      shortDescription: 'Beautiful villa with 4 bedrooms and 3 bathrooms, perfect for large groups or families.',
      images: [wImage, w1Image, w2Image, w3Image, w4Image, w5Image, w6Image, w7Image],
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      price: 20000,
      originalPrice: 20000,
      discountedPrice: 18000,
      amenities: [
        'Beach Front', 'WiFi', 'Kitchen', 'Ocean View', 'Air Conditioning',
        'Security', 'Daily Housekeeping', 'Beach Towels', 'Free Parking',
        'Private Pool', 'Garden', 'BBQ Area'
      ],
      location: 'Watamu',
      features: [
        'Spacious living areas with ocean views',
        'Four comfortable bedrooms with premium bedding',
        'Three modern bathrooms with premium fixtures',
        'Large private pool and garden area',
        'Fully equipped gourmet kitchen',
        'Outdoor BBQ area for entertaining'
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
    <main className="min-h-screen pt-16 sm:pt-20 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6" aria-label="Property navigation">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--vintage-sage)] hover:text-[var(--vintage-brown)] transition-colors mb-4 sm:mb-6"
          aria-label="Back to properties"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          Back
        </motion.button>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-20" role="region" aria-label="Property details content">
        {/* Property Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold font-playfair mb-4 text-[var(--vintage-sage)] font-sans" id="property-title">
            {property.title}
          </h1>
          <p className="text-base sm:text-xl max-w-3xl mx-auto text-[var(--text-secondary)]">
            {property.fullDescription}
          </p>
        </motion.header>

        {/* Image Gallery */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 sm:mb-16"
          aria-labelledby="image-gallery-heading"
        >
          <h2 id="image-gallery-heading" className="sr-only">Property Image Gallery</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Main Image with Auto-scroll - Takes 3/4 of left side */}
            <figure className="lg:col-span-3 space-y-6">
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
              <figcaption className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedImage === index
                        ? 'ring-4 ring-[var(--vintage-sage)] scale-105'
                        : 'hover:scale-105'
                    }`}
                    aria-label={`View image ${index + 1} of ${property.images.length}`}
                    aria-pressed={selectedImage === index}
                  >
                    <img
                      src={image}
                      alt={`${property.title} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </figcaption>
            </figure>

            {/* Property Details - Takes remaining 1/4 */}
            <section className="lg:col-span-1 space-y-6" aria-labelledby="property-details-heading">
              <div className="bg-[var(--vintage-cream)] p-6 rounded-2xl border border-[var(--vintage-sage)]/20 shadow-lg">
                <h2 id="property-details-heading" className="text-xl font-bold text-[var(--vintage-brown)] mb-4">Property Highlights</h2>
                <dl className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-[var(--vintage-sage)]" aria-hidden="true" />
                    <dt className="sr-only">Bedrooms</dt>
                    <dd className="text-[var(--vintage-brown)] font-medium">{property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-[var(--vintage-sage)]" aria-hidden="true" />
                    <dt className="sr-only">Bathrooms</dt>
                    <dd className="text-[var(--vintage-brown)] font-medium">{property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[var(--vintage-sage)]" aria-hidden="true" />
                    <dt className="sr-only">Maximum Guests</dt>
                    <dd className="text-[var(--vintage-brown)] font-medium">Up to {property.maxGuests} Guests</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[var(--vintage-sage)]" aria-hidden="true" />
                    <dt className="sr-only">Location</dt>
                    <dd className="text-[var(--vintage-brown)] font-medium">{property.location}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--vintage-sage)] mb-2">
                  KES {property.originalPrice.toLocaleString()}/night
                </div>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="inline-flex items-center justify-center whitespace-nowrap w-full min-h-[52px] px-7 py-4 bg-[var(--vintage-sage)] text-[var(--tech-white)] font-semibold rounded-xl hover:bg-[var(--vintage-brown)] transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  Book Now
                </button>
              </div>
            </section>
          </div>
        </motion.section>

        {/* Description + Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Glassy Description Block */}
          <div className="bg-[var(--vintage-cream)] backdrop-blur-md rounded-3xl p-8 border border-[var(--vintage-sage)]/20 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-[var(--vintage-brown)]">About this place</h3>
            <p className="text-[var(--vintage-brown)] text-lg leading-relaxed">{property.fullDescription}</p>
          </div>

          {/* Google Maps Embed */}
          <div className="bg-[var(--vintage-cream)] backdrop-blur-md rounded-3xl p-8 border border-[var(--vintage-sage)]/20 shadow-2xl"> 
            <h3 className="text-2xl font-bold mb-4 text-[var(--vintage-brown)]">Location</h3>
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
                  <p className="text-[var(--vintage-brown)]">Location unavailable</p>
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
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          aria-labelledby="amenities-features-heading"
        >
          <h2 id="amenities-features-heading" className="sr-only">Amenities and Features</h2>
          <div className="bg-[var(--vintage-cream)] backdrop-blur-md rounded-3xl p-8 border border-[var(--vintage-sage)]/20 shadow-2xl">
            <h3 id="amenities-heading" className="text-2xl font-bold mb-6 text-[var(--vintage-brown)]">Amenities</h3>
            <ul className="grid grid-cols-2 gap-3" aria-labelledby="amenities-heading">
              {property.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center gap-2 text-[var(--vintage-brown)]">
                  <div className="w-2 h-2 bg-[var(--vintage-sage)] rounded-full" aria-hidden="true"></div>
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-[var(--vintage-cream)] backdrop-blur-md rounded-3xl p-8 border border-[var(--vintage-sage)]/20 shadow-2xl">
            <h3 id="features-heading" className="text-2xl font-bold mb-6 text-[var(--vintage-brown)]">Features</h3>
            <ul className="space-y-3" aria-labelledby="features-heading">
              {property.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-[var(--vintage-brown)]">
                  <div className="w-2 h-2 bg-[var(--vintage-sage)] rounded-full mt-2 flex-shrink-0" aria-hidden="true"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-center text-white"
          aria-labelledby="contact-heading"
        >
          <h2 id="contact-heading" className="text-2xl font-bold mb-4">Ready to Book Your Stay?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Contact us today to secure your dates and start planning your dream vacation in Diani Beach
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="Contact options">
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transition-colors" aria-label="Call to book your stay">
              <Phone className="w-5 h-5 inline mr-2" aria-hidden="true" />
              Call Now
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-blue-600 transition-colors" aria-label="Email to book your stay">
              <Mail className="w-5 h-5 inline mr-2" aria-hidden="true" />
              Send Email
            </button>
          </div>
        </motion.section>
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
    </main>
  );
};

export default PropertyDetailPage;