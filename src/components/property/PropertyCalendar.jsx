import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, CalendarDays, DollarSign, CheckCircle } from 'lucide-react';

const PropertyCalendar = ({ property, onDateSelect, onGuestsChange, selectedDates, guests, totalPrice, isReturningCustomer }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);

  // Generate calendar data
  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      calendar.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendar;
  };

  // Check if date is available
  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Past dates are not available
    if (date < today) return false;
    
    // Check if date is booked
    return !bookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    );
  };

  // Check if date is in selected range
  const isInSelectedRange = (date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  // Handle date selection
  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      if (date > selectedStartDate) {
        setSelectedEndDate(date);
        onDateSelect({ start: selectedStartDate, end: date });
      } else {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      }
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    
    const nights = Math.ceil((selectedEndDate - selectedStartDate) / (1000 * 60 * 60 * 24));
    const basePrice = isReturningCustomer ? property.discountedPrice : property.price;
    
    return nights * basePrice;
  };

  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate sample available dates (in real app, this would come from API)
  useEffect(() => {
    const today = new Date();
    const available = [];
    const booked = [];
    
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      if (Math.random() > 0.3) { // 70% availability
        available.push(date);
      } else {
        booked.push(date);
      }
    }
    
    setAvailableDates(available);
    setBookedDates(booked);
  }, []);

  const calendar = generateCalendar(currentMonth);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-ivory-200 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-oceanic-100 to-pool-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-oceanic-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black">Select Your Dates</h3>
            <p className="text-gray-600">Choose your check-in and check-out dates</p>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className="w-10 h-10 bg-gradient-to-r from-oceanic-100 to-pool-100 hover:from-oceanic-200 hover:to-pool-200 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 text-oceanic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <span className="text-lg font-semibold text-black min-w-[120px] text-center">
            {getMonthName(currentMonth)}
          </span>
          
          <button
            onClick={goToNextMonth}
            className="w-10 h-10 bg-gradient-to-r from-oceanic-100 to-pool-100 hover:from-oceanic-200 hover:to-pool-200 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 text-oceanic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-8">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar dates */}
        <div className="grid grid-cols-7 gap-2">
          {calendar.map((date, index) => {
            const isAvailable = isDateAvailable(date);
            const isSelected = selectedStartDate && date.toDateString() === selectedStartDate.toDateString();
            const isEndSelected = selectedEndDate && date.toDateString() === selectedEndDate.toDateString();
            const isInRange = isInSelectedRange(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <motion.button
                key={index}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative w-12 h-12 rounded-xl text-sm font-medium transition-all duration-200
                  ${isAvailable 
                    ? 'hover:bg-oceanic-100 hover:text-oceanic-700 cursor-pointer' 
                    : 'cursor-not-allowed'
                  }
                  ${isSelected || isEndSelected 
                    ? 'bg-oceanic-600 text-white shadow-lg' 
                    : ''
                  }
                  ${isInRange && !isSelected && !isEndSelected 
                    ? 'bg-oceanic-100 text-oceanic-700' 
                    : ''
                  }
                  ${!isAvailable 
                    ? 'bg-gray-100 text-gray-400' 
                    : 'bg-white text-black'
                  }
                  ${isToday 
                    ? 'ring-2 ring-oceanic-400' 
                    : ''
                  }
                  border border-gray-200
                `}
                disabled={!isAvailable}
              >
                {date.getDate()}
                {!isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Guest Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-pool-100 to-oceanic-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-pool-600" />
          </div>
          <h4 className="text-lg font-semibold text-black">Number of Guests</h4>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => onGuestsChange(Math.max(1, guests - 1))}
            className="w-10 h-10 bg-gradient-to-r from-oceanic-100 to-pool-100 hover:from-oceanic-200 hover:to-pool-200 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 text-oceanic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <span className="text-2xl font-bold text-black min-w-[40px] text-center">{guests}</span>
          
          <button
            onClick={() => onGuestsChange(Math.min(property.maxGuests || 4, guests + 1))}
            disabled={guests >= (property.maxGuests || 4)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
              guests >= (property.maxGuests || 4)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-oceanic-100 to-pool-100 hover:from-oceanic-200 hover:to-pool-200'
            }`}
          >
            <svg className="w-5 h-5 text-oceanic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          <span className="text-gray-600 ml-4">Maximum {property.maxGuests || 4} guests</span>
        </div>
      </div>

      {/* Price Calculation */}
      {selectedStartDate && selectedEndDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-oceanic-50 to-pool-50 rounded-2xl p-6 border border-oceanic-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-oceanic-100 to-pool-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-oceanic-600" />
            </div>
            <h4 className="text-lg font-semibold text-black">Price Breakdown</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium text-black">
                {selectedStartDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium text-black">
                {selectedEndDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nights:</span>
              <span className="font-medium text-black">
                {Math.ceil((selectedEndDate - selectedStartDate) / (1000 * 60 * 60 * 24))}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price per night:</span>
              <span className="font-medium text-black">
                KES {isReturningCustomer ? property.discountedPrice : property.price}
              </span>
            </div>
            
            <div className="border-t border-oceanic-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-black">Total:</span>
                <span className="text-2xl font-bold text-oceanic-600">
                  KES {calculateTotalPrice().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-oceanic-600 rounded-full"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-oceanic-100 rounded-full"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-100 rounded-full"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCalendar;