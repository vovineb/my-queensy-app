// Backend Booking Service
import { adminDb } from '../config/firebase.js';
import { ref, push, set, get, update, remove } from 'firebase-admin/database';
import { emailService } from './emailService.js';
import { generateBookingReference } from '../utils/helpers.js';

export const bookingService = {
  // Create new booking
  async createBooking(bookingData) {
    try {
      const bookingsRef = ref(adminDb, 'bookings');
      const newBookingRef = push(bookingsRef);
      
      const booking = {
        ...bookingData,
        id: newBookingRef.key,
        bookingReference: generateBookingReference(),
        status: 'confirmed',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await set(newBookingRef, booking);

      // Send confirmation email
      await emailService.sendBookingConfirmation(booking);

      return { success: true, booking };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }
  },

  // Get booking by ID
  async getBooking(bookingId) {
    try {
      const bookingRef = ref(adminDb, `bookings/${bookingId}`);
      const snapshot = await get(bookingRef);
      
      if (snapshot.exists()) {
        return { success: true, booking: snapshot.val() };
      } else {
        return { success: false, error: 'Booking not found' };
      }
    } catch (error) {
      console.error('Error getting booking:', error);
      return { success: false, error: error.message };
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    try {
      const bookingRef = ref(adminDb, `bookings/${bookingId}`);
      await update(bookingRef, {
        status,
        updatedAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating booking status:', error);
      return { success: false, error: error.message };
    }
  },

  // Update payment status
  async updatePaymentStatus(bookingId, paymentStatus, paymentData = {}) {
    try {
      const bookingRef = ref(adminDb, `bookings/${bookingId}`);
      await update(bookingRef, {
        paymentStatus,
        paymentData,
        updatedAt: new Date().toISOString()
      });

      // Send payment confirmation email if completed
      if (paymentStatus === 'completed') {
        const bookingResult = await this.getBooking(bookingId);
        if (bookingResult.success) {
          await emailService.sendPaymentConfirmation(bookingResult.booking);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating payment status:', error);
      return { success: false, error: error.message };
    }
  },

  // Cancel booking
  async cancelBooking(bookingId, reason = '') {
    try {
      const bookingRef = ref(adminDb, `bookings/${bookingId}`);
      await update(bookingRef, {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Send cancellation email
      const bookingResult = await this.getBooking(bookingId);
      if (bookingResult.success) {
        await emailService.sendBookingCancellation(bookingResult.booking);
      }

      return { success: true };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user bookings
  async getUserBookings(userId) {
    try {
      const bookingsRef = ref(adminDb, 'bookings');
      const snapshot = await get(bookingsRef);
      
      if (snapshot.exists()) {
        const allBookings = snapshot.val();
        const userBookings = Object.values(allBookings).filter(
          booking => booking.userId === userId
        );
        
        return { success: true, bookings: userBookings };
      } else {
        return { success: true, bookings: [] };
      }
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return { success: false, error: error.message };
    }
  },

  // Check availability
  async checkAvailability(propertyId, checkIn, checkOut) {
    try {
      const bookingsRef = ref(adminDb, 'bookings');
      const snapshot = await get(bookingsRef);
      
      if (snapshot.exists()) {
        const allBookings = Object.values(snapshot.val());
        const conflictingBookings = allBookings.filter(booking => {
          return booking.propertyId === propertyId &&
                 booking.status !== 'cancelled' &&
                 ((new Date(checkIn) >= new Date(booking.checkIn) && new Date(checkIn) < new Date(booking.checkOut)) ||
                  (new Date(checkOut) > new Date(booking.checkIn) && new Date(checkOut) <= new Date(booking.checkOut)) ||
                  (new Date(checkIn) <= new Date(booking.checkIn) && new Date(checkOut) >= new Date(booking.checkOut)));
        });

        return { 
          success: true, 
          available: conflictingBookings.length === 0,
          conflictingBookings 
        };
      }

      return { success: true, available: true, conflictingBookings: [] };
    } catch (error) {
      console.error('Error checking availability:', error);
      return { success: false, error: error.message };
    }
  }
};
