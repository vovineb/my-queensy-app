import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { addDays, format, differenceInCalendarDays, isSameDay, isWithinInterval, addHours } from 'date-fns';
import { Download, Calendar, Info, AlertCircle, Clock, CreditCard, Check } from 'lucide-react';

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
  const [bookingStatus, setBookingStatus] = useState('pending'); // pending, confirmed, cancelled
  const [realTimeBookings, setRealTimeBookings] = useState([]);

  // Mock data for booked dates - replace with actual data from backend
  const bookedDates = [
    { start: addDays(new Date(), 5), end: addDays(new Date(), 7) },
    { start: addDays(new Date(), 15), end: addDays(new Date(), 18) }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // This would be replaced with actual WebSocket or API polling
      setRealTimeBookings(prev => [...prev]);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const nights = differenceInCalendarDays(dateRange[0].endDate, dateRange[0].startDate);
  const pricePerNight = property.price;
  const totalCost = nights * pricePerNight;
  const serviceFee = totalCost * 0.1; // 10% service fee
  const depositAmount = totalCost * 0.3; // 30% deposit
  const finalTotal = totalCost + serviceFee;

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

  // Custom day content renderer
  const dayContentRenderer = (date) => {
    const isBooked = isDateBooked(date);
    const isSelected = isWithinInterval(date, { 
      start: dateRange[0].startDate, 
      end: dateRange[0].endDate 
    });

    return (
      <div 
        className={`relative w-full h-full p-2 ${
          isBooked 
            ? 'bg-red-500/10' 
            : isSelected 
              ? 'bg-yellow-400/20' 
              : ''
        }`}
      >
        <span className={`${
          isBooked ? 'text-red-500' : isSelected ? 'text-yellow-400' : ''
        }`}>
          {date.getDate()}
        </span>
        {isBooked && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          </div>
        )}
      </div>
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

  const handleBooking = () => {
    // Check if selected dates overlap with booked dates
    const hasConflict = bookedDates.some(booking =>
      isWithinInterval(dateRange[0].startDate, { start: booking.start, end: booking.end }) ||
      isWithinInterval(dateRange[0].endDate, { start: booking.start, end: booking.end })
    );

    if (hasConflict) {
      alert('Selected dates are not available. Please choose different dates.');
      return;
    }

    // Validate minimum stay
    if (nights < 1) {
      alert('Please select at least one night.');
      return;
    }

    // Create booking object
    const bookingDetails = {
      propertyId: property.id,
      propertyTitle: property.title,
      checkIn: dateRange[0].startDate,
      checkOut: dateRange[0].endDate,
      nights,
      totalCost,
      serviceFee,
      depositAmount,
      depositDueTime,
      finalTotal,
      status: 'pending_deposit',
      bookingId: `BK-${Date.now()}`,
      createdAt: new Date()
    };

    // Here you would typically save to your backend
    console.log('Booking created:', bookingDetails);
    
    // Simulate real-time update
    setRealTimeBookings(prev => [...prev, bookingDetails]);
    
    setBookingConfirmed(true);
    if (onBookingComplete) {
      onBookingComplete(bookingDetails);
    }
  };

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
        <h3 className="text-2xl font-playfair text-yellow-400">Book Your Stay</h3>
        <div className="flex items-center gap-2 text-yellow-100">
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
              ? 'border-yellow-400 bg-yellow-400/10' 
              : 'border-gray-600 hover:border-yellow-400'
          }`}
        >
          <span className="text-yellow-100">
            {format(dateRange[0].startDate, 'MMM dd')} - {format(dateRange[0].endDate, 'MMM dd, yyyy')}
          </span>
          <Calendar className="w-5 h-5 text-yellow-400" />
        </button>
        
        {showCalendar && (
          <div className="mt-4 p-4 bg-black/30 rounded-lg">
            <DateRange
              ranges={dateRange}
              onChange={(item) => setDateRange([item.selection])}
              minDate={new Date()}
              dayContentRenderer={dayContentRenderer}
              className="custom-calendar"
            />
          </div>
        )}
      </div>

      {/* Booking Summary */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-yellow-100">
          <span>Price per night:</span>
          <span>KES {pricePerNight.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-yellow-100">
          <span>Nights:</span>
          <span>{nights}</span>
        </div>
        <div className="flex justify-between text-yellow-100">
          <span>Subtotal:</span>
          <span>KES {totalCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-yellow-100">
          <span>Service fee:</span>
          <span>KES {serviceFee.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-600 pt-2">
          <div className="flex justify-between text-yellow-400 font-bold">
            <span>Total:</span>
            <span>KES {finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Deposit Information */}
      {depositDueTime && (
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Deposit Required</span>
          </div>
          <div className="text-yellow-100 text-sm space-y-1">
            <div>Amount: KES {depositAmount.toLocaleString()}</div>
            <div>Due: {format(depositDueTime, 'PPP p')}</div>
            <div className="flex items-center gap-1 text-yellow-300">
              <Clock className="w-4 h-4" />
              <span>6 hours before check-in</span>
            </div>
          </div>
        </div>
      )}

      {/* Booking Actions */}
      {!bookingConfirmed ? (
        <button
          onClick={handleBooking}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
        >
          Book Now
        </button>
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
            className="w-full border border-yellow-400 text-yellow-400 font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-yellow-400/10"
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

export default BookingCalendar;