// Backend Email Service
import nodemailer from 'nodemailer';

export const emailService = {
  // Initialize email transporter
  createTransporter() {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });
  },

  // Send booking confirmation email
  async sendBookingConfirmation(booking) {
    try {
      const transporter = this.createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.userEmail,
        subject: `Booking Confirmed - ${booking.propertyName}`,
        html: this.generateBookingConfirmationHTML(booking)
      };

      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      return { success: false, error: error.message };
    }
  },

  // Send payment confirmation email
  async sendPaymentConfirmation(booking) {
    try {
      const transporter = this.createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.userEmail,
        subject: `Payment Confirmed - ${booking.propertyName}`,
        html: this.generatePaymentConfirmationHTML(booking)
      };

      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
      return { success: false, error: error.message };
    }
  },

  // Send booking cancellation email
  async sendBookingCancellation(booking) {
    try {
      const transporter = this.createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.userEmail,
        subject: `Booking Cancelled - ${booking.propertyName}`,
        html: this.generateCancellationHTML(booking)
      };

      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending cancellation email:', error);
      return { success: false, error: error.message };
    }
  },

  // Generate booking confirmation HTML
  generateBookingConfirmationHTML(booking) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">QUEENSY STAYS</h1>
          <p style="color: #6b7280; margin: 5px 0;">Your Booking is Confirmed!</p>
        </div>

        <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin-top: 0;">Booking Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #374151; font-weight: bold;">Booking Reference:</td>
              <td style="padding: 8px 0; color: #1f2937;">${booking.bookingReference}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #374151; font-weight: bold;">Property:</td>
              <td style="padding: 8px 0; color: #1f2937;">${booking.propertyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #374151; font-weight: bold;">Check-in:</td>
              <td style="padding: 8px 0; color: #1f2937;">${new Date(booking.checkIn).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #374151; font-weight: bold;">Check-out:</td>
              <td style="padding: 8px 0; color: #1f2937;">${new Date(booking.checkOut).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #374151; font-weight: bold;">Guests:</td>
              <td style="padding: 8px 0; color: #1f2937;">${booking.guests}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #374151; font-weight: bold;">Total Cost:</td>
              <td style="padding: 8px 0; color: #059669; font-weight: bold; font-size: 18px;">KES ${booking.totalCost.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 5px 0;">Need help? Contact us:</p>
          <p style="color: #2563eb; font-weight: bold; margin: 5px 0;">+254 706 880 575</p>
          <p style="color: #2563eb; margin: 5px 0;">info@queensy.com</p>
        </div>
      </div>
    `;
  },

  // Generate payment confirmation HTML
  generatePaymentConfirmationHTML(booking) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">PAYMENT CONFIRMED</h1>
          <p style="color: #6b7280; margin: 5px 0;">Your payment has been successfully processed</p>
        </div>

        <div style="background: #ecfdf5; padding: 25px; border-radius: 12px; margin: 20px 0; border: 1px solid #10b981;">
          <h2 style="color: #059669; margin-top: 0;">Payment Details</h2>
          <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
          <p><strong>Property:</strong> ${booking.propertyName}</p>
          <p><strong>Amount Paid:</strong> KES ${booking.totalCost.toLocaleString()}</p>
          <p><strong>Payment Status:</strong> Completed</p>
        </div>

        <p style="color: #374151;">Your booking is now fully confirmed. We look forward to hosting you!</p>
      </div>
    `;
  },

  // Generate cancellation HTML
  generateCancellationHTML(booking) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0;">BOOKING CANCELLED</h1>
          <p style="color: #6b7280; margin: 5px 0;">Your booking has been cancelled</p>
        </div>

        <div style="background: #fef2f2; padding: 25px; border-radius: 12px; margin: 20px 0; border: 1px solid #f87171;">
          <h2 style="color: #dc2626; margin-top: 0;">Cancellation Details</h2>
          <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
          <p><strong>Property:</strong> ${booking.propertyName}</p>
          <p><strong>Cancelled Date:</strong> ${new Date(booking.cancelledAt).toLocaleDateString()}</p>
          ${booking.cancellationReason ? `<p><strong>Reason:</strong> ${booking.cancellationReason}</p>` : ''}
        </div>

        <p style="color: #374151;">If you have any questions about this cancellation, please contact us.</p>
      </div>
    `;
  }
};
