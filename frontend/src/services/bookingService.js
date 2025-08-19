// Booking Service - Business Logic Layer
import { bookingOperations, propertyOperations, userOperations } from '../firebase/database';
import { getCurrentUser, isAuthenticated } from '../firebase/auth';
import { emailService } from './emailService';

class BookingService {
  constructor() {
    this.listeners = new Map();
  }

  // Create a new booking with enhanced validation and notifications
  async createBooking(bookingData) {
    try {
      // Validate user authentication
      if (!isAuthenticated()) {
        return {
          success: false,
          error: 'AUTHENTICATION_REQUIRED',
          message: 'Please sign in to make a booking'
        };
      }

      const currentUser = getCurrentUser();
      
      // Check property availability first
      const availabilityCheck = await propertyOperations.checkAvailability(
        bookingData.propertyId,
        bookingData.checkIn,
        bookingData.checkOut
      );

      if (!availabilityCheck.success || !availabilityCheck.available) {
        return {
          success: false,
          error: 'PROPERTY_UNAVAILABLE',
          message: 'Property is not available for selected dates',
          conflictingBookings: availabilityCheck.conflictingBookings
        };
      }

      // Calculate total cost
      const propertyResult = await propertyOperations.getById(bookingData.propertyId);
      if (!propertyResult.success) {
        return {
          success: false,
          error: 'PROPERTY_NOT_FOUND',
          message: 'Property not found'
        };
      }

      const property = propertyResult.property;
      const nights = this.calculateNights(bookingData.checkIn, bookingData.checkOut);
      const totalCost = this.calculateTotalCost(property.price, nights, bookingData.guests);

      // Enhanced booking data
      const enhancedBookingData = {
        ...bookingData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email,
        propertyName: property.name,
        pricePerNight: property.price,
        nights,
        totalCost,
        bookingReference: this.generateBookingReference(),
        paymentStatus: 'pending'
      };

      // Create booking in database
      const result = await bookingOperations.create(enhancedBookingData);
      
      if (result.success) {
        // Send confirmation email
        try {
          await emailService.sendBookingConfirmation({
            booking: result.booking,
            property: property,
            userEmail: currentUser.email
          });
        } catch (emailError) {
          console.warn('Failed to send booking confirmation email:', emailError);
          // Don't fail the booking if email fails
        }

        return {
          success: true,
          booking: result.booking,
          bookingId: result.bookingId,
          message: 'Booking created successfully!'
        };
      }

      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: 'BOOKING_CREATION_FAILED',
        message: 'Failed to create booking. Please try again.'
      };
    }
  }

  // Update booking status with notifications
  async updateBookingStatus(bookingId, status, additionalData = {}) {
    try {
      const result = await bookingOperations.updateStatus(bookingId, status, additionalData);
      
      if (result.success && status === 'confirmed') {
        // Send confirmation email when booking is confirmed
        try {
          const booking = await bookingOperations.getById(bookingId);
          const property = await propertyOperations.getById(booking.booking.propertyId);
          
          await emailService.sendBookingConfirmation({
            booking: booking.booking,
            property: property.property,
            userEmail: booking.booking.userEmail
          });
        } catch (emailError) {
          console.warn('Failed to send booking confirmation email:', emailError);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update booking status'
      };
    }
  }

  // Get bookings for a specific property with real-time updates
  subscribeToPropertyBookings(propertyId, callback) {
    const unsubscribe = bookingOperations.subscribeToPropertyBookings(propertyId, callback);
    this.listeners.set(`property_${propertyId}`, unsubscribe);
    return unsubscribe;
  }

  // Get all bookings with real-time updates
  subscribeToAllBookings(callback) {
    const unsubscribe = bookingOperations.subscribeToAllBookings(callback);
    this.listeners.set('all_bookings', unsubscribe);
    return unsubscribe;
  }

  // Get booked dates for a property
  async getBookedDates(propertyId) {
    const result = await bookingOperations.getBookedDates(propertyId);
    return result.success ? result.bookedDates : [];
  }

  // Check if dates are available
  async checkDateAvailability(propertyId, checkIn, checkOut) {
    const result = await propertyOperations.checkAvailability(propertyId, checkIn, checkOut);
    return result.success ? result.available : false;
  }

  // Cancel booking with notification
  async cancelBooking(bookingId, reason = '') {
    try {
      if (!isAuthenticated()) {
        return {
          success: false,
          error: 'AUTHENTICATION_REQUIRED',
          message: 'Please sign in to cancel booking'
        };
      }

      const currentUser = getCurrentUser();
      
      // Get booking details first
      const bookingResult = await bookingOperations.getById(bookingId);
      if (!bookingResult.success) {
        return {
          success: false,
          error: 'BOOKING_NOT_FOUND',
          message: 'Booking not found'
        };
      }

      const booking = bookingResult.booking;
      
      // Check if user owns this booking
      if (booking.userId !== currentUser.uid) {
        return {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'You can only cancel your own bookings'
        };
      }

      // Cancel the booking
      const result = await bookingOperations.cancel(bookingId, reason);
      
      if (result.success) {
        // Send cancellation email
        try {
          const property = await propertyOperations.getById(booking.propertyId);
          await emailService.sendBookingCancellation({
            booking,
            property: property.property,
            userEmail: currentUser.email,
            reason
          });
        } catch (emailError) {
          console.warn('Failed to send cancellation email:', emailError);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        error: 'CANCELLATION_FAILED',
        message: 'Failed to cancel booking. Please try again.'
      };
    }
  }

  // Get user's bookings
  async getUserBookings(userId = null) {
    try {
      const targetUserId = userId || (isAuthenticated() ? getCurrentUser().uid : null);
      
      if (!targetUserId) {
        return {
          success: false,
          error: 'NO_USER_ID',
          message: 'User ID required'
        };
      }

      return await bookingOperations.getUserBookings(targetUserId);
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to get user bookings'
      };
    }
  }

  // Calculate booking cost
  calculateTotalCost(pricePerNight, nights, guests = 1) {
    const baseCost = pricePerNight * nights;
    const guestSurcharge = guests > 2 ? (guests - 2) * 500 : 0; // KES 500 per extra guest
    return baseCost + guestSurcharge;
  }

  // Calculate nights between dates
  calculateNights(checkIn, checkOut) {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  // Generate booking reference
  generateBookingReference() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `QNS-${timestamp}-${random}`.toUpperCase();
  }

  // Clean up listeners
  unsubscribeFromProperty(propertyId) {
    const unsubscribe = this.listeners.get(`property_${propertyId}`);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(`property_${propertyId}`);
    }
  }

  // Clean up all listeners
  unsubscribeAll() {
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.listeners.clear();
  }
}

}

// Export singleton instance
export const bookingService = new BookingService();
export default BookingService;
