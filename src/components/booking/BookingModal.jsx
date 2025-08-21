import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar, Star, Wifi, Coffee, Car, Shield } from 'lucide-react';
import PropertyCalendar from '../property/PropertyCalendar';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Card from '../common/Card';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="max-h-[90vh] overflow-y-auto p-0"
      showCloseButton={false}
    >
      {/* Custom Header */}
      <div className="bg-gradient-to-r from-[var(--vintage-sage)] to-[var(--vintage-brown)] p-8 rounded-t-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--tech-white)]/20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-[var(--tech-white)]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[var(--tech-white)] font-sans">Book Your Stay</h2>
              <p className="text-[var(--vintage-cream)] text-lg font-sans">Select your dates and complete your booking</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-16 h-16 bg-[var(--tech-white)]/20 hover:bg-[var(--tech-white)]/30 rounded-2xl flex items-center justify-center"
            aria-label="Close booking modal"
            icon={
              <svg
                className="w-8 h-8 text-[var(--tech-white)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            }
          />
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Property Details */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[var(--vintage-cream)] to-[var(--vintage-cream)] rounded-2xl p-6 border border-[var(--vintage-sage)]/30">
              <h3 className="text-2xl font-bold text-[var(--vintage-brown)] mb-4">{property.name}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-[var(--vintage-sage)]" />
                  <span className="text-[var(--vintage-brown)] font-medium">{property.location}</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-[var(--vintage-sage)]" />
                    <span className="text-[var(--vintage-brown)] font-medium">Max {property.maxGuests || 4} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-[var(--vintage-brown)] font-medium">4.9/5</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-[var(--vintage-sage)]">
                    KES {property.price.toLocaleString()}
                  </span>
                  <span className="text-[var(--vintage-brown)] font-medium">per night</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-[var(--tech-white)] rounded-2xl p-6 border border-[var(--vintage-sage)]/20 shadow-lg">
              <h4 className="text-lg font-semibold text-[var(--vintage-brown)] mb-4">What's Included</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Wifi, label: 'Free WiFi' },
                  { icon: Coffee, label: 'Coffee Maker' },
                  { icon: Car, label: 'Free Parking' },
                  { icon: Shield, label: 'Security' }
                ].map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--vintage-sage)]/20 rounded-lg flex items-center justify-center">
                      <amenity.icon className="w-5 h-5 text-[var(--vintage-sage)]" />
                    </div>
                    <span className="text-[var(--vintage-brown)] font-medium">{amenity.label}</span>
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
                className="bg-gradient-to-br from-[var(--vintage-cream)] to-[var(--vintage-cream)] rounded-2xl p-6 border border-[var(--vintage-sage)]/30"
              >
                <h4 className="text-xl font-semibold text-[var(--vintage-brown)] mb-4">Booking Summary</h4>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[var(--vintage-brown)] font-medium">Check-in:</span>
                    <span className="text-[var(--vintage-brown)] font-medium">
                      {selectedDates.start.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--vintage-brown)] font-medium">Check-out:</span>
                    <span className="text-[var(--vintage-brown)] font-medium">
                      {selectedDates.end.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--vintage-brown)] font-medium">Nights:</span>
                    <span className="text-[var(--vintage-brown)] font-medium">
                      {Math.ceil((selectedDates.end - selectedDates.start) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--vintage-brown)] font-medium">Guests:</span>
                    <span className="text-[var(--vintage-brown)] font-medium">{guests}</span>
                  </div>
                  <div className="border-t border-[var(--vintage-sage)]/30 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-[var(--vintage-brown)]">Total:</span>
                      <span className="text-2xl font-bold text-[var(--vintage-sage)]">
                        KES {calculateTotalPrice().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={isBooking}
                  isLoading={isBooking}
                  variant="primary"
                  size="large"
                  className="w-full py-6 px-8 text-lg font-semibold bg-[var(--vintage-sage)] hover:bg-[var(--vintage-brown)] text-[var(--tech-white)] rounded-xl"
                >
                  Confirm Booking
                </Button>
              </motion.div>
            )}

            {/* Validation / Success Messages */}
            {error && (
              <Card variant="default" className="p-4 bg-red-50 border border-red-200 text-red-700">
                {error}
              </Card>
            )}
            {success && (
              <Card variant="default" className="p-4 bg-green-50 border border-green-200 text-green-700">
                Booking successful! We will contact you shortly to confirm your reservation.
              </Card>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BookingModal;
