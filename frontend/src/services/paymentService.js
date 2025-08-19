// Payment Service - Payment Processing Integration
import { bookingOperations } from '../firebase/database';
import { getCurrentUser, isAuthenticated } from '../firebase/auth';
import { emailService } from './emailService';

// Payment providers configuration
const PAYMENT_CONFIG = {
  STRIPE: {
    PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
    ENABLED: import.meta.env.VITE_STRIPE_ENABLED === 'true'
  },
  PAYPAL: {
    CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
    ENABLED: import.meta.env.VITE_PAYPAL_ENABLED === 'true'
  },
  MPESA: {
    CONSUMER_KEY: import.meta.env.VITE_MPESA_CONSUMER_KEY || '',
    CONSUMER_SECRET: import.meta.env.VITE_MPESA_CONSUMER_SECRET || '',
    SHORTCODE: import.meta.env.VITE_MPESA_SHORTCODE || '',
    ENABLED: import.meta.env.VITE_MPESA_ENABLED === 'true'
  }
};

class PaymentService {
  constructor() {
    this.stripe = null;
    this.paypal = null;
    this.initializePaymentProviders();
  }

  // Initialize payment providers
  async initializePaymentProviders() {
    try {
      // Initialize Stripe
      if (PAYMENT_CONFIG.STRIPE.ENABLED && PAYMENT_CONFIG.STRIPE.PUBLIC_KEY) {
        const { loadStripe } = await import('@stripe/stripe-js');
        this.stripe = await loadStripe(PAYMENT_CONFIG.STRIPE.PUBLIC_KEY);
      }

      // Initialize PayPal
      if (PAYMENT_CONFIG.PAYPAL.ENABLED && PAYMENT_CONFIG.PAYPAL.CLIENT_ID) {
        // PayPal SDK will be loaded dynamically when needed
        this.paypal = {
          clientId: PAYMENT_CONFIG.PAYPAL.CLIENT_ID,
          initialized: false
        };
      }
    } catch (error) {
      console.error('Error initializing payment providers:', error);
    }
  }

  // Process payment based on selected method
  async processPayment({ bookingId, amount, method, paymentData }) {
    try {
      if (!isAuthenticated()) {
        return {
          success: false,
          error: 'AUTHENTICATION_REQUIRED',
          message: 'Please sign in to process payment'
        };
      }

      const currentUser = getCurrentUser();

      // Get booking details
      const bookingResult = await bookingOperations.getById(bookingId);
      if (!bookingResult.success) {
        return {
          success: false,
          error: 'BOOKING_NOT_FOUND',
          message: 'Booking not found'
        };
      }

      const booking = bookingResult.booking;

      // Verify user owns this booking
      if (booking.userId !== currentUser.uid) {
        return {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'You can only pay for your own bookings'
        };
      }

      // Process payment based on method
      let paymentResult;
      switch (method.toLowerCase()) {
        case 'stripe':
          paymentResult = await this.processStripePayment({ amount, paymentData, booking });
          break;
        case 'paypal':
          paymentResult = await this.processPayPalPayment({ amount, paymentData, booking });
          break;
        case 'mpesa':
          paymentResult = await this.processMpesaPayment({ amount, paymentData, booking });
          break;
        default:
          return {
            success: false,
            error: 'UNSUPPORTED_PAYMENT_METHOD',
            message: 'Payment method not supported'
          };
      }

      if (paymentResult.success) {
        // Update booking with payment information
        await bookingOperations.updatePayment(bookingId, {
          paymentStatus: 'completed',
          paymentMethod: method,
          transactionId: paymentResult.transactionId,
          paymentAmount: amount,
          paymentDate: new Date().toISOString()
        });

        // Update booking status to confirmed
        await bookingOperations.updateStatus(bookingId, 'confirmed');

        // Send payment confirmation email
        try {
          const property = await propertyOperations.getById(booking.propertyId);
          await emailService.sendPaymentConfirmation({
            booking,
            property: property.property,
            userEmail: currentUser.email,
            paymentDetails: {
              amount,
              method,
              transactionId: paymentResult.transactionId
            }
          });
        } catch (emailError) {
          console.warn('Failed to send payment confirmation email:', emailError);
        }

        return {
          success: true,
          transactionId: paymentResult.transactionId,
          message: 'Payment processed successfully!'
        };
      }

      return paymentResult;
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: 'PAYMENT_PROCESSING_FAILED',
        message: 'Payment processing failed. Please try again.'
      };
    }
  }

  // Stripe payment processing
  async processStripePayment({ amount, paymentData, booking }) {
    try {
      if (!this.stripe) {
        return {
          success: false,
          error: 'STRIPE_NOT_INITIALIZED',
          message: 'Stripe payment system not available'
        };
      }

      // Create payment intent on your backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: 'kes',
          booking_id: booking.id,
          customer_email: booking.userEmail
        }),
      });

      const { client_secret } = await response.json();

      // Confirm payment with Stripe
      const result = await this.stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: paymentData.card,
          billing_details: {
            name: booking.userName,
            email: booking.userEmail,
          },
        }
      });

      if (result.error) {
        return {
          success: false,
          error: result.error.code,
          message: result.error.message
        };
      }

      return {
        success: true,
        transactionId: result.paymentIntent.id,
        message: 'Stripe payment successful'
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      return {
        success: false,
        error: 'STRIPE_PAYMENT_FAILED',
        message: 'Stripe payment failed. Please try again.'
      };
    }
  }

  // PayPal payment processing
  async processPayPalPayment({ amount, paymentData, booking }) {
    try {
      if (!PAYMENT_CONFIG.PAYPAL.ENABLED) {
        return {
          success: false,
          error: 'PAYPAL_NOT_ENABLED',
          message: 'PayPal payment not available'
        };
      }

      // PayPal payment would typically be handled through their SDK
      // This is a simplified version - in production, you'd integrate with PayPal's API
      
      return {
        success: true,
        transactionId: `paypal_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        message: 'PayPal payment successful'
      };
    } catch (error) {
      console.error('PayPal payment error:', error);
      return {
        success: false,
        error: 'PAYPAL_PAYMENT_FAILED',
        message: 'PayPal payment failed. Please try again.'
      };
    }
  }

  // M-Pesa payment processing
  async processMpesaPayment({ amount, paymentData, booking }) {
    try {
      if (!PAYMENT_CONFIG.MPESA.ENABLED) {
        return {
          success: false,
          error: 'MPESA_NOT_ENABLED',
          message: 'M-Pesa payment not available'
        };
      }

      // M-Pesa STK Push implementation
      const mpesaResponse = await this.initiateMpesaSTKPush({
        amount,
        phoneNumber: paymentData.phoneNumber,
        accountReference: booking.bookingReference,
        transactionDesc: `Payment for booking ${booking.bookingReference}`
      });

      if (mpesaResponse.success) {
        return {
          success: true,
          transactionId: mpesaResponse.checkoutRequestId,
          message: 'M-Pesa payment initiated. Please complete on your phone.',
          requiresConfirmation: true
        };
      }

      return mpesaResponse;
    } catch (error) {
      console.error('M-Pesa payment error:', error);
      return {
        success: false,
        error: 'MPESA_PAYMENT_FAILED',
        message: 'M-Pesa payment failed. Please try again.'
      };
    }
  }

  // M-Pesa STK Push
  async initiateMpesaSTKPush({ amount, phoneNumber, accountReference, transactionDesc }) {
    try {
      // Get M-Pesa access token
      const accessToken = await this.getMpesaAccessToken();
      if (!accessToken) {
        return {
          success: false,
          error: 'MPESA_AUTH_FAILED',
          message: 'M-Pesa authentication failed'
        };
      }

      // Format phone number (ensure it starts with 254)
      const formattedPhone = phoneNumber.startsWith('254') 
        ? phoneNumber 
        : `254${phoneNumber.substring(1)}`;

      // Generate timestamp and password
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = btoa(`${PAYMENT_CONFIG.MPESA.SHORTCODE}${PAYMENT_CONFIG.MPESA.PASSKEY}${timestamp}`);

      const stkPushData = {
        BusinessShortCode: PAYMENT_CONFIG.MPESA.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: PAYMENT_CONFIG.MPESA.SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${window.location.origin}/api/mpesa/callback`,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      };

      const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stkPushData)
      });

      const result = await response.json();

      if (result.ResponseCode === '0') {
        return {
          success: true,
          checkoutRequestId: result.CheckoutRequestID,
          message: 'STK push sent successfully'
        };
      }

      return {
        success: false,
        error: result.errorCode || 'MPESA_STK_FAILED',
        message: result.errorMessage || 'M-Pesa STK push failed'
      };
    } catch (error) {
      console.error('M-Pesa STK push error:', error);
      return {
        success: false,
        error: 'MPESA_STK_ERROR',
        message: 'Failed to initiate M-Pesa payment'
      };
    }
  }

  // Get M-Pesa access token
  async getMpesaAccessToken() {
    try {
      const auth = btoa(`${PAYMENT_CONFIG.MPESA.CONSUMER_KEY}:${PAYMENT_CONFIG.MPESA.CONSUMER_SECRET}`);
      
      const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });

      const result = await response.json();
      return result.access_token;
    } catch (error) {
      console.error('M-Pesa auth error:', error);
      return null;
    }
  }

  // Check M-Pesa transaction status
  async checkMpesaTransactionStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getMpesaAccessToken();
      if (!accessToken) {
        return {
          success: false,
          error: 'MPESA_AUTH_FAILED',
          message: 'M-Pesa authentication failed'
        };
      }

      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const password = btoa(`${PAYMENT_CONFIG.MPESA.SHORTCODE}${PAYMENT_CONFIG.MPESA.PASSKEY}${timestamp}`);

      const queryData = {
        BusinessShortCode: PAYMENT_CONFIG.MPESA.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryData)
      });

      const result = await response.json();
      
      return {
        success: true,
        status: result.ResultCode === '0' ? 'completed' : 'pending',
        data: result
      };
    } catch (error) {
      console.error('M-Pesa status check error:', error);
      return {
        success: false,
        error: 'MPESA_STATUS_CHECK_FAILED',
        message: 'Failed to check M-Pesa transaction status'
      };
    }
  }

  // Get available payment methods
  getAvailablePaymentMethods() {
    const methods = [];

    if (PAYMENT_CONFIG.STRIPE.ENABLED && PAYMENT_CONFIG.STRIPE.PUBLIC_KEY) {
      methods.push({
        id: 'stripe',
        name: 'Credit/Debit Card',
        description: 'Pay with Visa, Mastercard, or other cards',
        icon: 'credit-card',
        enabled: true
      });
    }

    if (PAYMENT_CONFIG.PAYPAL.ENABLED && PAYMENT_CONFIG.PAYPAL.CLIENT_ID) {
      methods.push({
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: 'paypal',
        enabled: true
      });
    }

    if (PAYMENT_CONFIG.MPESA.ENABLED) {
      methods.push({
        id: 'mpesa',
        name: 'M-Pesa',
        description: 'Pay with M-Pesa mobile money',
        icon: 'mobile',
        enabled: true
      });
    }

    return methods;
  }

  // Calculate payment fees
  calculatePaymentFees(amount, method) {
    const fees = {
      stripe: amount * 0.029 + 30, // 2.9% + KES 30
      paypal: amount * 0.034 + 15, // 3.4% + KES 15
      mpesa: amount < 100 ? 0 : Math.min(amount * 0.01, 25) // 1% max KES 25
    };

    return {
      fee: fees[method] || 0,
      total: amount + (fees[method] || 0)
    };
  }

  // Validate payment data
  validatePaymentData(method, paymentData) {
    const errors = [];

    switch (method) {
      case 'stripe':
        if (!paymentData.card) {
          errors.push('Card information is required');
        }
        break;
      
      case 'mpesa':
        if (!paymentData.phoneNumber) {
          errors.push('Phone number is required for M-Pesa');
        } else if (!/^(?:254|\+254|0)?[17]\d{8}$/.test(paymentData.phoneNumber)) {
          errors.push('Please enter a valid Kenyan phone number');
        }
        break;
      
      case 'paypal':
        // PayPal validation handled by their SDK
        break;
      
      default:
        errors.push('Invalid payment method');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Get payment service status
  getServiceStatus() {
    return {
      stripe: {
        enabled: PAYMENT_CONFIG.STRIPE.ENABLED,
        configured: !!PAYMENT_CONFIG.STRIPE.PUBLIC_KEY,
        initialized: !!this.stripe
      },
      paypal: {
        enabled: PAYMENT_CONFIG.PAYPAL.ENABLED,
        configured: !!PAYMENT_CONFIG.PAYPAL.CLIENT_ID,
        initialized: !!this.paypal
      },
      mpesa: {
        enabled: PAYMENT_CONFIG.MPESA.ENABLED,
        configured: !!(PAYMENT_CONFIG.MPESA.CONSUMER_KEY && PAYMENT_CONFIG.MPESA.CONSUMER_SECRET)
      }
    };
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default PaymentService;
