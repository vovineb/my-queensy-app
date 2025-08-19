import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Calendar, Star, Wifi, Coffee, Car, Shield } from 'lucide-react';
import PropertyCalendar from '../property/PropertyCalendar';

const BookingModal = ({ isOpen, onClose, property, initialSelectedDates = null, initialGuests = 1 }) => {
  const [selectedDates, setSelectedDates] = useState(initialSelectedDates);
  const [guests, setGuests] = useState(initialGuests);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Sync initial values when opening
  React.useEffect(() => {
    if (isOpen) {
      setSelectedDates(initialSelectedDates);
      setGuests(initialGuests);
      setError('');
      setSuccess(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleDateSelect = (dates) => {
    setSelectedDates(dates);
  };

  const handleGuestsChange = (newGuests) => {
    setGuests(newGuests);
  };

  const calculateTotalPrice = () => {
    if (!selectedDates) return 0;
    const nights = Math.ceil((selectedDates.end - selectedDates.start) / (1000 * 60 * 60 * 24));
    return nights * property.price;
  };

  const handleBooking = async () => {
    setError('');
    setSuccess(false);
    if (!selectedDates) {
      setError('Please select your check-in and check-out dates.');
      return;
    }
    if (guests < 1 || guests > (property.maxGuests || 4)) {
      setError(`Please select between 1 and ${property.maxGuests || 4} guests.`);
      return;
    }
    
    setIsBooking(true);
    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-oceanic-600 to-pool-600 p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Book Your Stay</h2>
                    <p className="text-oceanic-100 text-lg">Select your dates and complete your booking</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-14 h-14 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:rotate-90"
                  aria-label="Close booking modal"
                >
                  <X className="w-7 h-7 text-white" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Property Details */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-oceanic-50 to-pool-50 rounded-2xl p-6 border border-oceanic-200">
                    <h3 className="text-2xl font-bold text-black mb-4">{property.name}</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-oceanic-600" />
                        <span className="text-black font-medium">{property.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-oceanic-600" />
                          <span className="text-black font-medium">Max {property.maxGuests || 4} guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          <span className="text-black font-medium">4.9/5</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-oceanic-600">
                          KES {property.price.toLocaleString()}
                        </span>
                        <span className="text-black font-medium">per night</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="bg-white rounded-2xl p-6 border border-ivory-200 shadow-lg">
                    <h4 className="text-lg font-semibold text-black mb-4">What's Included</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Wifi, label: 'Free WiFi' },
                        { icon: Coffee, label: 'Coffee Maker' },
                        { icon: Car, label: 'Free Parking' },
                        { icon: Shield, label: 'Security' }
                      ].map((amenity, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-oceanic-100 rounded-lg flex items-center justify-center">
                            <amenity.icon className="w-4 h-4 text-oceanic-600" />
                          </div>
                          <span className="text-black font-medium">{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calendar and Booking */}
                <div className="space-y-6">
                  <PropertyCalendar
                    property={property}
                    onDateSelect={handleDateSelect}
                    onGuestsChange={handleGuestsChange}
                    selectedDates={selectedDates}
                    guests={guests}
                    isReturningCustomer={false}
                  />

                  {/* Booking Summary */}
                  {selectedDates && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-oceanic-50 to-pool-50 rounded-2xl p-6 border border-oceanic-200"
                    >
                      <h4 className="text-lg font-semibold text-oceanic-800 mb-4">Booking Summary</h4>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-black font-medium">Check-in:</span>
                          <span className="text-black font-medium">
                            {selectedDates.start.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black font-medium">Check-out:</span>
                          <span className="text-black font-medium">
                            {selectedDates.end.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black font-medium">Nights:</span>
                          <span className="text-black font-medium">
                            {Math.ceil((selectedDates.end - selectedDates.start) / (1000 * 60 * 60 * 24))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black font-medium">Guests:</span>
                          <span className="text-black font-medium">{guests}</span>
                        </div>
                        <div className="border-t border-oceanic-200 pt-3">
                          <div className="flex justify-between">
                            <span className="text-lg font-semibold text-oceanic-800">Total:</span>
                            <span className="text-2xl font-bold text-oceanic-800">
                              KES {calculateTotalPrice().toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleBooking}
                        disabled={isBooking}
                        className="w-full py-5 px-8 bg-gradient-to-r from-oceanic-600 to-pool-600 text-white font-bold text-lg rounded-2xl hover:from-oceanic-700 hover:to-pool-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-oceanic-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isBooking ? 'Processing...' : 'Confirm Booking'}
                      </button>
                    </motion.div>
                  )}

                  {/* Validation / Success Messages */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">{error}</div>
                  )}
                  {success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700">
                      Booking successful! We will contact you shortly to confirm your reservation.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
