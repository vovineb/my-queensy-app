import { useState, useEffect, useCallback } from 'react';
import { getFirestore } from 'firebase/firestore';
import BookingService from '../services/bookingService';

// Initialize booking service
let bookingService = null;

const useBookingService = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize service
  useEffect(() => {
    try {
      const db = getFirestore();
      bookingService = new BookingService(db);
    } catch (err) {
      console.warn('Firebase not available, using mock data');
      setError('Firebase not configured');
    }
  }, []);

  // Create booking
  const createBooking = useCallback(async (bookingData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (bookingService) {
        const booking = await bookingService.createBooking(bookingData);
        return booking;
      } else {
        // Mock implementation
        const mockBooking = {
          id: `mock-${Date.now()}`,
          ...bookingData,
          status: 'pending',
          createdAt: new Date()
        };
        return mockBooking;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to property bookings
  const subscribeToPropertyBookings = useCallback((propertyId, callback) => {
    if (bookingService) {
      return bookingService.subscribeToPropertyBookings(propertyId, callback);
    } else {
      // Mock implementation with real-time simulation
      const mockBookings = [
        {
          id: 'mock-1',
          propertyId,
          checkIn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        },
        {
          id: 'mock-2',
          propertyId,
          checkIn: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          checkOut: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        }
      ];
      
      callback(mockBookings);
      
      // Simulate real-time updates
      const interval = setInterval(() => {
        callback(mockBookings);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, []);

  // Get booked dates
  const getBookedDates = useCallback(async (propertyId) => {
    if (bookingService) {
      return await bookingService.getBookedDates(propertyId);
    } else {
      // Mock booked dates
      return [
        {
          start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        },
        {
          start: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        }
      ];
    }
  }, []);

  // Check availability
  const checkAvailability = useCallback(async (propertyId, checkIn, checkOut) => {
    if (bookingService) {
      return await bookingService.checkDateAvailability(propertyId, checkIn, checkOut);
    } else {
      // Mock availability check
      const bookedDates = await getBookedDates(propertyId);
      const requestStart = new Date(checkIn);
      const requestEnd = new Date(checkOut);
      
      return !bookedDates.some(booking => {
        const bookingStart = new Date(booking.start);
        const bookingEnd = new Date(booking.end);
        return (requestStart < bookingEnd && requestEnd > bookingStart);
      });
    }
  }, [getBookedDates]);

  // Update booking status
  const updateBookingStatus = useCallback(async (bookingId, status, additionalData = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      if (bookingService) {
        await bookingService.updateBookingStatus(bookingId, status, additionalData);
      } else {
        // Mock implementation
        console.log(`Mock: Updated booking ${bookingId} to status ${status}`);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bookings,
    loading,
    error,
    createBooking,
    subscribeToPropertyBookings,
    getBookedDates,
    checkAvailability,
    updateBookingStatus
  };
};

export default useBookingService;
