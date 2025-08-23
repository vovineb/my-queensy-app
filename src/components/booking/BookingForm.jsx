import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import Button from '../common/Button';
import { bookingService } from '../../services/bookingService';
import { isAuthenticated, getCurrentUser } from '../../firebase/auth';
import { validation, validateForm, bookingValidationRules } from '../../utils/validation';
import { motion } from 'framer-motion';
import { Calendar, Users, CreditCard, Check, AlertCircle, Mail, User } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { addDays, format, differenceInCalendarDays } from 'date-fns';
import { database } from '../../config/firebase';
import { ref, push } from 'firebase/database';

const BookingForm = ({ property, onBookingComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    checkIn: null,
    checkOut: null
  });
  const [bookingReference, setBookingReference] = useState('');
  const [authRequired, setAuthRequired] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  const nights = useMemo(() => 
    differenceInCalendarDays(dateRange[0].endDate, dateRange[0].startDate), 
    [dateRange]
  );
  
  const pricing = useMemo(() => {
    const basePrice = property.price * nights;
    const serviceFee = basePrice * 0.1;
    const totalPrice = basePrice + serviceFee;
    return { basePrice, serviceFee, totalPrice };
  }, [property.price, nights]);

  // Initialize form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, []);

  // Real-time validation using validation utils
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    let result;
    
    switch (name) {
      case 'name':
        result = validation.name(value);
        break;
      case 'email':
        result = validation.email(value);
        break;
      case 'phone':
        result = validation.phone(value);
        break;
      case 'guests':
        result = validation.guests(value, property.maxGuests || 8);
        break;
      default:
        return true;
    }
    
    if (result.valid) {
      delete newErrors[name];
    } else {
      newErrors[name] = result.message;
    }
    
    setErrors(newErrors);
    return result.valid;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation with debounce
    setTimeout(() => {
      validateField(name, value);
    }, 300);
  }, []);

  const validateAllFields = () => {
    // Validate dates
    const dateValidation = validation.bookingDates(
      dateRange[0].startDate,
      dateRange[0].endDate
    );
    
    if (!dateValidation.valid) {
      setErrors(prev => ({ ...prev, dates: dateValidation.message }));
      return false;
    }

    // Validate form data
    const formValidation = validateForm(formData, {
      name: [validation.required, validation.name],
      email: [validation.required, validation.email],
      phone: [validation.required, validation.phone],
      guests: [(value) => validation.guests(value, property.maxGuests || 8)]
    });
    
    if (!formValidation.valid) {
      setErrors(prev => ({ ...prev, ...formValidation.errors }));
      return false;
    }
    
    // Clear any previous errors
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication
    if (!isAuthenticated()) {
      setAuthRequired(true);
      setErrors({ submit: 'Please sign in to complete your booking' });
      return;
    }
    
    // Validate all fields
    if (!validateAllFields()) {
      return;
    }
    
    setIsProcessing(true);
    setIsValidating(true);
    
    try {
      // Check availability first
      setIsValidating(true);
      const isAvailable = await bookingService.checkDateAvailability(
        property.id,
        dateRange[0].startDate,
        dateRange[0].endDate
      );
      
      if (!isAvailable) {
        setErrors({ submit: 'Selected dates are no longer available. Please choose different dates.' });
        setIsProcessing(false);
        setIsValidating(false);
        return;
      }
      
      setIsValidating(false);
      
      // Create booking
      const bookingData = {
        propertyId: property.id,
        checkIn: dateRange[0].startDate.toISOString(),
        checkOut: dateRange[0].endDate.toISOString(),
        guests: formData.guests,
        guestName: formData.name,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        specialRequests: formData.message || ''
      };
      
      const result = await bookingService.createBooking(bookingData);
      
      if (result.success) {
        setBookingReference(result.booking.bookingReference);
        setSuccess(true);
        
        // Save booking to Firebase
        try {
          const user = getCurrentUser();
          if (user) {
            const bookingData = {
              propertyId: property.id,
              propertyName: property.name || property.title,
              location: property.location,
              checkIn: dateRange[0].startDate.toISOString(),
              checkOut: dateRange[0].endDate.toISOString(),
              guests: formData.guests,
              totalPrice: pricing.totalPrice,
              guestName: formData.name,
              guestEmail: formData.email,
              guestPhone: formData.phone,
              specialRequests: formData.message || '',
              bookingDate: new Date().toISOString(),
              status: 'confirmed'
            };
            
            // Save to user's bookings
            const userBookingsRef = ref(database, `bookings/${user.uid}`);
            await push(userBookingsRef, bookingData);
          }
        } catch (firebaseError) {
          console.error('Error saving booking to Firebase:', firebaseError);
        }
        
        // Call parent callback
        if (onBookingComplete) {
          onBookingComplete({
            booking: result.booking,
            dates: dateRange[0],
            guests: formData.guests,
            totalPrice: pricing.totalPrice,
            property,
            guestInfo: formData
          });
        }
      } else {
        setErrors({ submit: result.message || 'Booking failed. Please try again.' });
      }
      
      setIsProcessing(false);
    } catch (error) {
      console.error('Booking submission error:', error);
      setIsProcessing(false);
      setIsValidating(false);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    }
  };

  return (
    <div 
      className="max-w-md mx-auto bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 shadow-2xl"
      role="form"
      aria-label="Property booking form"
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Book Your Stay</h2>

      {/* Step 1: Dates */}
      <motion.div
        initial={false}
        animate={{ height: step === 1 ? 'auto' : '60px' }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 25,
          duration: 0.6
        }}
        className="overflow-hidden"
      >
        <motion.button
          onClick={() => setStep(1)}
          className="flex items-center gap-3 w-full text-left mb-4"
          aria-expanded={step === 1}
          aria-controls="dates-section"
          aria-label="Select booking dates section"
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            animate={{ rotate: step === 1 ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Calendar className="w-5 h-5 text-blue-400" />
          </motion.div>
          <span className="text-white font-medium">Select Dates</span>
        </motion.button>
        
        {step === 1 && (
          <div id="dates-section" role="region" aria-label="Date selection calendar">
            <DateRange
              ranges={dateRange}
              onChange={item => setDateRange([item.selection])}
              minDate={new Date()}
              className="w-full"
              rangeColors={['#3b82f6']}
              aria-label="Select check-in and check-out dates"
            />
          </div>
        )}
      </motion.div>

      {/* Step 2: Guests */}
      <motion.div
        initial={false}
        animate={{ height: step === 2 ? 'auto' : '60px' }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 25,
          duration: 0.6
        }}
        className="overflow-hidden border-t border-white/10 pt-4"
      >
        <button
          onClick={() => setStep(2)}
          className="flex items-center gap-3 w-full text-left mb-4"
          aria-expanded={step === 2}
          aria-controls="guests-section"
          aria-label="Select number of guests section"
        >
          <Users className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Number of Guests</span>
        </button>
        
        {step === 2 && (
          <div id="guests-section" role="region" aria-label="Guest count selection">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setFormData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
                aria-label="Decrease guest count"
                disabled={formData.guests <= 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                -
              </motion.button>
              <motion.span 
                className="text-white font-medium text-lg"
                role="status"
                aria-live="polite"
                aria-label={`${formData.guests} guests selected`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                key={formData.guests}
              >
                {formData.guests}
              </motion.span>
              <motion.button
                onClick={() => setFormData(prev => ({ ...prev, guests: Math.min(8, prev.guests + 1) }))}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
                aria-label="Increase guest count"
                disabled={formData.guests >= 8}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                +
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Step 3: Guest Information */}
      <motion.div
        initial={false}
        animate={{ height: step === 3 ? 'auto' : '60px' }}
        className="overflow-hidden border-t border-white/10 pt-4"
      >
        <button
          onClick={() => setStep(3)}
          className="flex items-center gap-3 w-full text-left mb-4"
          aria-expanded={step === 3}
          aria-controls="guest-info-section"
          aria-label="Guest information section"
        >
          <User className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Guest Information</span>
        </button>
        
        {step === 3 && (
          <div id="guest-info-section" className="space-y-4" role="region" aria-label="Guest contact information">
            <div>
              <label htmlFor="guest-name" className="sr-only">Full Name</label>
              <input
                id="guest-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                aria-required="true"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <motion.p
                  id="name-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                  role="alert"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>
            
            <div>
              <label htmlFor="guest-email" className="sr-only">Email Address</label>
              <input
                id="guest-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <motion.p
                  id="email-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                  role="alert"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>
            
            <div>
              <label htmlFor="guest-phone" className="sr-only">Phone Number</label>
              <input
                id="guest-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (+254...)"
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none"
                aria-required="true"
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <motion.p
                  id="phone-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                  role="alert"
                >
                  {errors.phone}
                </motion.p>
              )}
            </div>
            
            <div>
              <label htmlFor="special-requests" className="sr-only">Special Requests</label>
              <textarea
                id="special-requests"
                name="message"
                value={formData.message || ''}
                onChange={handleChange}
                placeholder="Special requests or notes (optional)"
                rows={3}
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:border-blue-400 focus:outline-none resize-none"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Step 4: Payment Summary */}
      <motion.div
        initial={false}
        animate={{ height: step === 4 ? 'auto' : '60px' }}
        className="overflow-hidden border-t border-white/10 pt-4"
      >
        <button
          onClick={() => setStep(4)}
          className="flex items-center gap-3 w-full text-left mb-4"
        >
          <CreditCard className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Payment Summary</span>
        </button>
        
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex justify-between text-gray-300">
              <span>Base Price ({nights} nights)</span>
              <span>KES {pricing.basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Service Fee</span>
              <span>KES {pricing.serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white font-bold pt-2 border-t border-white/10">
              <span>Total</span>
              <span>KES {pricing.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={isProcessing || Object.keys(errors).length > 0}
        className={`btn btn-primary w-full py-4 text-lg font-bold transition-all ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
        whileHover={{ 
          scale: isProcessing ? 1 : 1.02,
          boxShadow: isProcessing ? "none" : "0 10px 25px rgba(59, 130, 246, 0.3)"
        }}
        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
        animate={{
          background: isProcessing 
            ? "linear-gradient(45deg, #6b7280, #9ca3af)" 
            : "linear-gradient(45deg, #3b82f6, #1d4ed8)"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          background: { duration: 0.3 }
        }}
        aria-label="Complete booking reservation"
        aria-describedby={errors.submit ? 'submit-error' : undefined}
      >
        {isProcessing ? (
          <div className="flex items-center gap-3">
            {isValidating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                <span>Validating...</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                <span>Processing Booking...</span>
              </>
            )}
          </div>
        ) : (
          'Complete Booking'
        )}
      </motion.button>
      
      {/* Form Errors */}
      {(errors.submit || errors.dates) && (
        <motion.div
          id="submit-error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-xl text-red-400 flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          {errors.submit || errors.dates}
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 p-6 bg-green-900/20 border border-green-500 rounded-xl"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto"
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>
          <h4 className="text-xl font-bold text-green-400">Booking Confirmed!</h4>
          <p className="text-green-300">
            Your stay at {property.name || property.title} has been confirmed. A confirmation email has been sent to {formData.email}.
          </p>
          <div className="text-sm text-green-400 bg-green-900/30 p-3 rounded-lg">
            <p><strong>Booking Reference:</strong> {bookingReference}</p>
            <p><strong>Dates:</strong> {format(dateRange[0].startDate, 'MMM dd')} - {format(dateRange[0].endDate, 'MMM dd, yyyy')}</p>
            <p><strong>Guests:</strong> {formData.guests}</p>
            <p><strong>Total:</strong> KES {pricing.totalPrice.toLocaleString()}</p>
          </div>
          
          {authRequired && (
            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-300 text-sm">
              <p>Please sign in to complete your booking and access your booking history.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default memo(BookingForm);