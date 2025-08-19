// Firebase Realtime Database Functions
import { 
  ref, 
  push, 
  set, 
  get, 
  update, 
  remove, 
  onValue, 
  off,
  serverTimestamp,
  query,
  orderByChild,
  orderByKey,
  limitToLast,
  equalTo
} from 'firebase/database';
import { database } from './config';

// Database paths
const PATHS = {
  BOOKINGS: 'bookings',
  PROPERTIES: 'properties',
  USERS: 'users',
  AVAILABILITY: 'availability',
  CONTACT_SUBMISSIONS: 'contactSubmissions',
  REVIEWS: 'reviews'
};

// Booking operations
export const bookingOperations = {
  // Create a new booking
  create: async (bookingData) => {
    try {
      const bookingsRef = ref(database, PATHS.BOOKINGS);
      const newBookingRef = push(bookingsRef);
      
      const booking = {
        ...bookingData,
        id: newBookingRef.key,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'pending'
      };
      
      await set(newBookingRef, booking);
      
      return {
        success: true,
        bookingId: newBookingRef.key,
        booking,
        message: 'Booking created successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create booking'
      };
    }
  },

  // Get booking by ID
  getById: async (bookingId) => {
    try {
      const bookingRef = ref(database, `${PATHS.BOOKINGS}/${bookingId}`);
      const snapshot = await get(bookingRef);
      
      if (snapshot.exists()) {
        return {
          success: true,
          booking: snapshot.val()
        };
      } else {
        return {
          success: false,
          message: 'Booking not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to get booking'
      };
    }
  },

  // Get user bookings
  getByUser: async (userId) => {
    try {
      const bookingsRef = ref(database, PATHS.BOOKINGS);
      const userBookingsQuery = query(bookingsRef, orderByChild('userId'), equalTo(userId));
      const snapshot = await get(userBookingsQuery);
      
      const bookings = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          bookings.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }
      
      return {
        success: true,
        bookings: bookings.sort((a, b) => b.createdAt - a.createdAt)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to get user bookings'
      };
    }
  },

  // Update booking status
  updateStatus: async (bookingId, status, additionalData = {}) => {
    try {
      const bookingRef = ref(database, `${PATHS.BOOKINGS}/${bookingId}`);
      const updates = {
        status,
        updatedAt: serverTimestamp(),
        ...additionalData
      };
      
      await update(bookingRef, updates);
      
      return {
        success: true,
        message: `Booking status updated to ${status}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update booking status'
      };
    }
  },

  // Cancel booking
  cancel: async (bookingId, reason = '') => {
    try {
      const updates = {
        status: 'cancelled',
        cancelledAt: serverTimestamp(),
        cancellationReason: reason,
        updatedAt: serverTimestamp()
      };
      
      const bookingRef = ref(database, `${PATHS.BOOKINGS}/${bookingId}`);
      await update(bookingRef, updates);
      
      return {
        success: true,
        message: 'Booking cancelled successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to cancel booking'
      };
    }
  }
};

// Property operations
export const propertyOperations = {
  // Get all properties
  getAll: async () => {
    try {
      const propertiesRef = ref(database, PATHS.PROPERTIES);
      const snapshot = await get(propertiesRef);
      
      const properties = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          properties.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }
      
      return {
        success: true,
        properties
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to get properties'
      };
    }
  },

  // Get property by ID
  getById: async (propertyId) => {
    try {
      const propertyRef = ref(database, `${PATHS.PROPERTIES}/${propertyId}`);
      const snapshot = await get(propertyRef);
      
      if (snapshot.exists()) {
        return {
          success: true,
          property: {
            id: propertyId,
            ...snapshot.val()
          }
        };
      } else {
        return {
          success: false,
          message: 'Property not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to get property'
      };
    }
  },

  // Check availability
  checkAvailability: async (propertyId, checkIn, checkOut) => {
    try {
      const bookingsRef = ref(database, PATHS.BOOKINGS);
      const propertyBookingsQuery = query(
        bookingsRef, 
        orderByChild('propertyId'), 
        equalTo(propertyId)
      );
      
      const snapshot = await get(propertyBookingsQuery);
      const existingBookings = [];
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const booking = childSnapshot.val();
          if (booking.status === 'confirmed' || booking.status === 'pending') {
            existingBookings.push(booking);
          }
        });
      }
      
      // Check for date conflicts
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      const hasConflict = existingBookings.some(booking => {
        const bookingCheckIn = new Date(booking.checkIn);
        const bookingCheckOut = new Date(booking.checkOut);
        
        return (
          (checkInDate >= bookingCheckIn && checkInDate < bookingCheckOut) ||
          (checkOutDate > bookingCheckIn && checkOutDate <= bookingCheckOut) ||
          (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut)
        );
      });
      
      return {
        success: true,
        available: !hasConflict,
        conflictingBookings: hasConflict ? existingBookings : []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to check availability'
      };
    }
  }
};

// User operations
export const userOperations = {
  // Create user profile
  create: async (userId, userData) => {
    try {
      const userRef = ref(database, `${PATHS.USERS}/${userId}`);
      const userProfile = {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await set(userRef, userProfile);
      
      return {
        success: true,
        message: 'User profile created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create user profile'
      };
    }
  },

  // Get user profile
  getById: async (userId) => {
    try {
      const userRef = ref(database, `${PATHS.USERS}/${userId}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        return {
          success: true,
          user: snapshot.val()
        };
      } else {
        return {
          success: false,
          message: 'User profile not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to get user profile'
      };
    }
  },

  // Update user profile
  update: async (userId, updates) => {
    try {
      const userRef = ref(database, `${PATHS.USERS}/${userId}`);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await update(userRef, updateData);
      
      return {
        success: true,
        message: 'User profile updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update user profile'
      };
    }
  }
};

// Contact form operations
export const contactOperations = {
  // Submit contact form
  submit: async (contactData) => {
    try {
      const contactRef = ref(database, PATHS.CONTACT_SUBMISSIONS);
      const newContactRef = push(contactRef);
      
      const submission = {
        ...contactData,
        id: newContactRef.key,
        createdAt: serverTimestamp(),
        status: 'new'
      };
      
      await set(newContactRef, submission);
      
      return {
        success: true,
        submissionId: newContactRef.key,
        message: 'Contact form submitted successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to submit contact form'
      };
    }
  }
};

// Real-time listeners
export const realtimeListeners = {
  // Listen to booking changes
  onBookingChange: (bookingId, callback) => {
    const bookingRef = ref(database, `${PATHS.BOOKINGS}/${bookingId}`);
    return onValue(bookingRef, callback);
  },

  // Listen to user bookings
  onUserBookingsChange: (userId, callback) => {
    const bookingsRef = ref(database, PATHS.BOOKINGS);
    const userBookingsQuery = query(bookingsRef, orderByChild('userId'), equalTo(userId));
    return onValue(userBookingsQuery, callback);
  },

  // Remove listener
  removeListener: (ref, callback) => {
    off(ref, 'value', callback);
  }
};

// Utility functions
export const dbUtils = {
  // Generate unique ID
  generateId: () => {
    return push(ref(database, 'temp')).key;
  },

  // Get server timestamp
  getServerTimestamp: () => serverTimestamp(),

  // Format date for database
  formatDate: (date) => {
    return date instanceof Date ? date.toISOString() : date;
  }
};
