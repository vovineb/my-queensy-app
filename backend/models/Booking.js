// Backend Booking Model
export class Booking {
  constructor(data) {
    this.id = data.id || null;
    this.bookingReference = data.bookingReference || null;
    this.propertyId = data.propertyId;
    this.propertyName = data.propertyName;
    this.propertyLocation = data.propertyLocation;
    this.userId = data.userId;
    this.userEmail = data.userEmail;
    this.guestName = data.guestName;
    this.guestPhone = data.guestPhone;
    this.checkIn = data.checkIn;
    this.checkOut = data.checkOut;
    this.guests = data.guests;
    this.nights = data.nights;
    this.pricePerNight = data.pricePerNight;
    this.totalCost = data.totalCost;
    this.status = data.status || 'pending';
    this.paymentStatus = data.paymentStatus || 'pending';
    this.paymentData = data.paymentData || {};
    this.specialRequests = data.specialRequests || '';
    this.cancellationReason = data.cancellationReason || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.cancelledAt = data.cancelledAt || null;
  }

  // Validate booking data
  validate() {
    const errors = [];

    if (!this.propertyId) errors.push('Property ID is required');
    if (!this.propertyName) errors.push('Property name is required');
    if (!this.userId) errors.push('User ID is required');
    if (!this.userEmail) errors.push('User email is required');
    if (!this.guestName) errors.push('Guest name is required');
    if (!this.guestPhone) errors.push('Guest phone is required');
    if (!this.checkIn) errors.push('Check-in date is required');
    if (!this.checkOut) errors.push('Check-out date is required');
    if (!this.guests || this.guests < 1) errors.push('At least 1 guest is required');
    if (!this.totalCost || this.totalCost <= 0) errors.push('Total cost must be greater than 0');

    // Date validation
    const checkInDate = new Date(this.checkIn);
    const checkOutDate = new Date(this.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      errors.push('Check-in date cannot be in the past');
    }

    if (checkOutDate <= checkInDate) {
      errors.push('Check-out date must be after check-in date');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Convert to plain object for database storage
  toObject() {
    return {
      id: this.id,
      bookingReference: this.bookingReference,
      propertyId: this.propertyId,
      propertyName: this.propertyName,
      propertyLocation: this.propertyLocation,
      userId: this.userId,
      userEmail: this.userEmail,
      guestName: this.guestName,
      guestPhone: this.guestPhone,
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      guests: this.guests,
      nights: this.nights,
      pricePerNight: this.pricePerNight,
      totalCost: this.totalCost,
      status: this.status,
      paymentStatus: this.paymentStatus,
      paymentData: this.paymentData,
      specialRequests: this.specialRequests,
      cancellationReason: this.cancellationReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      cancelledAt: this.cancelledAt
    };
  }

  // Create from database object
  static fromObject(obj) {
    return new Booking(obj);
  }

  // Update booking status
  updateStatus(status) {
    this.status = status;
    this.updatedAt = new Date().toISOString();
  }

  // Update payment status
  updatePaymentStatus(paymentStatus, paymentData = {}) {
    this.paymentStatus = paymentStatus;
    this.paymentData = { ...this.paymentData, ...paymentData };
    this.updatedAt = new Date().toISOString();
  }

  // Cancel booking
  cancel(reason = '') {
    this.status = 'cancelled';
    this.cancellationReason = reason;
    this.cancelledAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Check if booking can be cancelled
  canBeCancelled() {
    const checkInDate = new Date(this.checkIn);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

    return this.status !== 'cancelled' && 
           this.status !== 'completed' && 
           hoursUntilCheckIn > 24; // Can cancel up to 24 hours before check-in
  }

  // Calculate refund amount
  calculateRefund() {
    if (!this.canBeCancelled()) return 0;

    const checkInDate = new Date(this.checkIn);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

    // Refund policy: 100% if cancelled 48+ hours before, 50% if 24-48 hours
    if (hoursUntilCheckIn >= 48) {
      return this.totalCost;
    } else if (hoursUntilCheckIn >= 24) {
      return this.totalCost * 0.5;
    }

    return 0;
  }
}
