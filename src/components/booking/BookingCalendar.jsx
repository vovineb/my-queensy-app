import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Users, MapPin, Star, Bed, Bath, Wifi, Coffee, Car, Shield, Clock, CheckCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isAfter, isBefore, addDays, differenceInCalendarDays } from 'date-fns';
import { useBookingService } from '../../hooks/useBookingService';

const BookingCalendar = ({ property, onBookingComplete }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [depositDueTime, setDepositDueTime] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('pending');
  const [bookedDates, setBookedDates] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Use booking service for real-time updates
  const { 
    createBooking, 
    getBookedDates, 
    checkAvailability, 
    subscribeToPropertyBookings,
    loading: bookingLoading 
  } = useBookingService();

  // Subscribe to real-time booking updates
  useEffect(() => {
    const unsubscribe = subscribeToPropertyBookings(property.id, (bookings) => {
      const dates = bookings.map(booking => ({
        start: booking.checkIn instanceof Date ? booking.checkIn : booking.checkIn.toDate(),
        end: booking.checkOut instanceof Date ? booking.checkOut : booking.checkOut.toDate(),
        status: booking.status,
        bookingId: booking.id
      }));
      setBookedDates(dates);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [property.id, subscribeToPropertyBookings]);

  // Load initial booked dates
  useEffect(() => {
    const loadBookedDates = async () => {
      try {
        const dates = await getBookedDates(property.id);
        setBookedDates(dates);
      } catch (error) {
        console.error('Error loading booked dates:', error);
      }
    };
    
    loadBookedDates();
  }, [property.id, getBookedDates]);

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

  // Calculate deposit due time (6 hours before check-in)
  useEffect(() => {
    if (dateRange[0].startDate) {
      const checkInTime = new Date(dateRange[0].startDate);
      checkInTime.setHours(14, 0, 0, 0); // Check-in at 2 PM
      const dueTime = addHours(checkInTime, -6); // 6 hours before
      setDepositDueTime(dueTime);
    }
  }, [dateRange]);

  // Check if a date is booked
  const isDateBooked = (date) => {
    return bookedDates.some(booking => 
      isWithinInterval(date, { start: booking.start, end: booking.end })
    );
  };

  // Enhanced day content renderer with real-time updates
  const dayContentRenderer = (date) => {
    const isBooked = isDateBooked(date);
    const isSelected = isWithinInterval(date, { 
      start: dateRange[0].startDate, 
      end: dateRange[0].endDate 
    });

    return (
      <motion.div 
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        className={`relative w-full h-full p-2 transition-all duration-300 ${
          isBooked 
            ? 'bg-red-500/20 cursor-not-allowed' 
            : isSelected 
              ? 'bg-blue-400/30' 
              : 'hover:bg-blue-400/10'
        }`}
      >
        <span className={`relative ${
          isBooked 
            ? 'text-red-400 line-through' 
            : isSelected 
              ? 'text-blue-400 font-bold' 
              : 'text-gray-300'
        }`}>
          {date.getDate()}
          {isBooked && (
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 h-0.5 bg-red-500 top-1/2 transform -translate-y-1/2"
            />
          )}
        </span>
        {isBooked && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-1 left-1/2 -translate-x-1/2"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const generateReceipt = () => {
    const receipt = `
QUEENSY BOOKING RECEIPT
----------------------
Property: ${property.title}
Check-in: ${format(dateRange[0].startDate, 'PPP')}
Check-out: ${format(dateRange[0].endDate, 'PPP')}
Nights: ${nights}
Price per night: KES ${pricePerNight.toLocaleString()}
Subtotal: KES ${totalCost.toLocaleString()}
Service Fee: KES ${serviceFee.toLocaleString()}
Deposit Required: KES ${depositAmount.toLocaleString()}
Deposit Due: ${depositDueTime ? format(depositDueTime, 'PPP p') : 'N/A'}
Total: KES ${finalTotal.toLocaleString()}
----------------------
Thank you for choosing Queensy!
    `;

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `queensy-booking-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleBooking = useCallback(async () => {
    setIsCheckingAvailability(true);
    
    try {
      // Check availability before booking
      const isAvailable = await checkAvailability(property.id, dateRange[0].startDate, dateRange[0].endDate);
      
      if (!isAvailable) {
        alert('Selected dates are no longer available. Please choose different dates.');
        setIsCheckingAvailability(false);
        return;
      }

      if (nights < 1) {
        alert('Please select at least one night.');
        setIsCheckingAvailability(false);
        return;
      }

      const bookingDetails = {
        propertyId: property.id,
        checkIn: dateRange[0].startDate,
        checkOut: dateRange[0].endDate,
        guests: 2, // Default guests
        totalPrice: pricing.totalPrice,
        status: 'confirmed',
        createdAt: new Date()
      };

      const createdBooking = await createBooking(bookingDetails);
      setBookingConfirmed(true);
      
      if (onBookingComplete) {
        onBookingComplete(createdBooking);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsCheckingAvailability(false);
    }
  }, [property.id, dateRange, nights, pricing.totalPrice, checkAvailability, createBooking, onBookingComplete]);

  const handleDepositPayment = () => {
    // Simulate payment processing
    setBookingStatus('confirmed');
    alert('Deposit payment processed successfully! Your booking is now confirmed.');
  };

  return (
    <div className={`rounded-xl p-6 ${
      bookingConfirmed ? 'bg-green-900/20 border border-green-500/30' : 'bg-black/20 border border-gray-700/30'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-playfair text-blue-400">Book Your Stay</h3>
        <div className="flex items-center gap-2 text-blue-100">
          <Calendar className="w-5 h-5" />
          <span className="text-sm">Real-time availability</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-6">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
            showCalendar 
              ? 'border-blue-400 bg-blue-400/10' 
              : 'border-gray-600 hover:border-blue-400'
          }`}
        >
          <span className="text-blue-100">
            {format(dateRange[0].startDate, 'MMM dd')} - {format(dateRange[0].endDate, 'MMM dd, yyyy')}
          </span>
          <Calendar className="w-5 h-5 text-blue-400" />
        </button>
        
        {showCalendar && (
          <div className="mt-4 p-4 bg-black/30 rounded-lg">
            <DateRange
              ranges={dateRange}
              onChange={(item) => setDateRange([item.selection])}
              minDate={new Date()}
              dayContentRenderer={dayContentRenderer}
              className="custom-calendar"
              rangeColors={['#3b82f6']}
            />
          </div>
        )}
      </div>

      {/* Booking Summary */}
      <div className="space-y-4 mb-6">
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

      {/* Deposit Information */}
      {depositDueTime && (
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Deposit Required</span>
          </div>
          <div className="text-blue-100 text-sm space-y-1">
            <div>Amount: KES {depositAmount.toLocaleString()}</div>
            <div>Due: {format(depositDueTime, 'PPP p')}</div>
            <div className="flex items-center gap-1 text-blue-300">
              <Clock className="w-4 h-4" />
              <span>6 hours before check-in</span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Actions */}
      {!bookingConfirmed ? (
        <motion.button
          onClick={handleBooking}
          disabled={isCheckingAvailability || bookingLoading}
          className={`btn btn-primary w-full py-4 text-lg font-bold transition-all duration-300 ${
            isCheckingAvailability || bookingLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:shadow-lg transform hover:scale-105'
          }`}
          whileHover={!isCheckingAvailability ? { scale: 1.02 } : {}}
          whileTap={!isCheckingAvailability ? { scale: 0.98 } : {}}
        >
          {isCheckingAvailability ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="loading-spinner"
              />
              Checking Availability...
            </span>
          ) : bookingLoading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="loading-spinner"
              />
              Creating Booking...
            </span>
          ) : (
            'Book Now'
          )}
        </motion.button>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Booking Created</span>
            </div>
            <p className="text-green-100 text-sm">
              Your booking has been created. Please complete the deposit payment to confirm.
            </p>
          </div>
          
          {bookingStatus === 'pending' && (
            <button
              onClick={handleDepositPayment}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Pay Deposit Now
            </button>
          )}
          
          {bookingStatus === 'confirmed' && (
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Booking Confirmed!</span>
              </div>
            </div>
          )}
          
          <button
            onClick={generateReceipt}
            className="w-full border border-blue-400 text-blue-400 font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-blue-400/10"
          >
            <Download className="w-5 h-5 inline mr-2" />
            Download Receipt
          </button>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-medium">Secure Booking</span>
        </div>
        <p className="text-blue-100 text-sm">
          All payments are processed securely. Your data is protected with industry-standard encryption.
        </p>
      </div>
    </div>
  );
};

export default memo(BookingCalendar);