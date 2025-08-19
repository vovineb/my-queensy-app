// Email Service - EmailJS Integration
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service',
  TEMPLATE_IDS: {
    BOOKING_CONFIRMATION: import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE || 'booking_confirmation',
    CONTACT_FORM: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE || 'contact_form',
    WELCOME: import.meta.env.VITE_EMAILJS_WELCOME_TEMPLATE || 'welcome_email',
    BOOKING_CANCELLED: import.meta.env.VITE_EMAILJS_CANCELLATION_TEMPLATE || 'booking_cancelled',
    PAYMENT_CONFIRMATION: import.meta.env.VITE_EMAILJS_PAYMENT_TEMPLATE || 'payment_confirmation'
  },
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
};

class EmailService {
  constructor() {
    // Initialize EmailJS with public key
    if (EMAILJS_CONFIG.PUBLIC_KEY) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
  }

  // Send booking confirmation email
  async sendBookingConfirmation({ booking, property, userEmail }) {
    try {
      const templateParams = {
        to_email: userEmail,
        to_name: booking.userName,
        booking_reference: booking.bookingReference,
        property_name: property.name,
        check_in: this.formatDate(booking.checkIn),
        check_out: this.formatDate(booking.checkOut),
        guests: booking.guests,
        nights: booking.nights,
        total_cost: this.formatCurrency(booking.totalCost),
        price_per_night: this.formatCurrency(booking.pricePerNight),
        booking_status: booking.status,
        property_location: property.location,
        contact_phone: import.meta.env.VITE_WHATSAPP_NUMBER || '+254706880575',
        company_name: 'Queensy',
        booking_date: this.formatDate(new Date())
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_IDS.BOOKING_CONFIRMATION,
        templateParams
      );

      return {
        success: true,
        messageId: result.text,
        message: 'Booking confirmation email sent successfully'
      };
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send booking confirmation email'
      };
    }
  }

  // Send contact form submission
  async sendContactForm({ name, email, subject, message }) {
    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_email: 'info@queensy.com', // Your business email
        reply_to: email,
        submission_date: this.formatDate(new Date())
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_IDS.CONTACT_FORM,
        templateParams
      );

      return {
        success: true,
        messageId: result.text,
        message: 'Contact form submitted successfully'
      };
    } catch (error) {
      console.error('Error sending contact form:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send contact form'
      };
    }
  }

  // Send welcome email for new users
  async sendWelcomeEmail({ userEmail, userName }) {
    try {
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        company_name: 'Queensy',
        website_url: window.location.origin,
        contact_phone: import.meta.env.VITE_WHATSAPP_NUMBER || '+254706880575',
        welcome_date: this.formatDate(new Date())
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_IDS.WELCOME,
        templateParams
      );

      return {
        success: true,
        messageId: result.text,
        message: 'Welcome email sent successfully'
      };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send welcome email'
      };
    }
  }

  // Send booking cancellation email
  async sendBookingCancellation({ booking, property, userEmail, reason }) {
    try {
      const templateParams = {
        to_email: userEmail,
        to_name: booking.userName,
        booking_reference: booking.bookingReference,
        property_name: property.name,
        check_in: this.formatDate(booking.checkIn),
        check_out: this.formatDate(booking.checkOut),
        total_cost: this.formatCurrency(booking.totalCost),
        cancellation_reason: reason || 'No reason provided',
        cancellation_date: this.formatDate(new Date()),
        contact_phone: import.meta.env.VITE_WHATSAPP_NUMBER || '+254706880575',
        company_name: 'Queensy'
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_IDS.BOOKING_CANCELLED,
        templateParams
      );

      return {
        success: true,
        messageId: result.text,
        message: 'Cancellation email sent successfully'
      };
    } catch (error) {
      console.error('Error sending cancellation email:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send cancellation email'
      };
    }
  }

  // Send payment confirmation email
  async sendPaymentConfirmation({ booking, property, userEmail, paymentDetails }) {
    try {
      const templateParams = {
        to_email: userEmail,
        to_name: booking.userName,
        booking_reference: booking.bookingReference,
        property_name: property.name,
        payment_amount: this.formatCurrency(paymentDetails.amount),
        payment_method: paymentDetails.method,
        payment_id: paymentDetails.transactionId,
        payment_date: this.formatDate(new Date()),
        check_in: this.formatDate(booking.checkIn),
        check_out: this.formatDate(booking.checkOut),
        contact_phone: import.meta.env.VITE_WHATSAPP_NUMBER || '+254706880575',
        company_name: 'Queensy'
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_IDS.PAYMENT_CONFIRMATION,
        templateParams
      );

      return {
        success: true,
        messageId: result.text,
        message: 'Payment confirmation email sent successfully'
      };
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send payment confirmation email'
      };
    }
  }

  // Send admin notification (internal use)
  async sendAdminNotification({ type, data }) {
    try {
      const adminEmail = 'admin@queensy.com'; // Your admin email
      
      let templateParams = {
        to_email: adminEmail,
        notification_type: type,
        notification_date: this.formatDate(new Date()),
        company_name: 'Queensy'
      };

      // Add specific data based on notification type
      switch (type) {
        case 'NEW_BOOKING':
          templateParams = {
            ...templateParams,
            booking_reference: data.booking.bookingReference,
            property_name: data.property.name,
            guest_name: data.booking.userName,
            guest_email: data.booking.userEmail,
            check_in: this.formatDate(data.booking.checkIn),
            check_out: this.formatDate(data.booking.checkOut),
            total_cost: this.formatCurrency(data.booking.totalCost)
          };
          break;
        
        case 'NEW_CONTACT':
          templateParams = {
            ...templateParams,
            contact_name: data.name,
            contact_email: data.email,
            contact_subject: data.subject,
            contact_message: data.message
          };
          break;
        
        case 'BOOKING_CANCELLED':
          templateParams = {
            ...templateParams,
            booking_reference: data.booking.bookingReference,
            property_name: data.property.name,
            cancellation_reason: data.reason
          };
          break;
      }

      // Use contact form template for admin notifications
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_IDS.CONTACT_FORM,
        templateParams
      );

      return {
        success: true,
        messageId: result.text,
        message: 'Admin notification sent successfully'
      };
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send admin notification'
      };
    }
  }

  // Utility methods
  formatDate(date) {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount) {
    if (!amount) return 'KES 0';
    
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatTime(date) {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Test email configuration
  async testEmailConfiguration() {
    try {
      const testParams = {
        to_email: 'test@example.com',
        to_name: 'Test User',
        message: 'This is a test email to verify EmailJS configuration',
        from_name: 'Queensy System Test'
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_IDS.CONTACT_FORM,
        testParams
      );

      return {
        success: true,
        message: 'Email configuration test successful',
        result: result.text
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Email configuration test failed'
      };
    }
  }

  // Get email service status
  getServiceStatus() {
    return {
      configured: !!EMAILJS_CONFIG.PUBLIC_KEY,
      serviceId: EMAILJS_CONFIG.SERVICE_ID,
      templatesConfigured: Object.keys(EMAILJS_CONFIG.TEMPLATE_IDS).length,
      publicKeySet: !!EMAILJS_CONFIG.PUBLIC_KEY
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default EmailService;
