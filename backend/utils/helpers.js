// Backend Utility Functions
import crypto from 'crypto';

export const generateBookingReference = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `QS-${timestamp}-${randomStr}`;
};

export const formatCurrency = (amount, currency = 'KES') => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
};

export const calculateNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const validateDateRange = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return { valid: false, message: 'Check-in date cannot be in the past' };
  }

  if (end <= start) {
    return { valid: false, message: 'Check-out date must be after check-in date' };
  }

  return { valid: true };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

export const generateApiResponse = (success, data = null, message = '', statusCode = 200) => {
  return {
    success,
    data,
    message,
    statusCode,
    timestamp: new Date().toISOString()
  };
};
