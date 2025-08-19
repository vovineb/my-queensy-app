const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin
admin.initializeApp();

// Email transporter configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

// Booking confirmation trigger
exports.onBookingCreated = functions.database.ref('/bookings/{bookingId}')
  .onCreate(async (snapshot, context) => {
    const booking = snapshot.val();
    const bookingId = context.params.bookingId;

    try {
      // Get property details
      const propertySnapshot = await admin.database()
        .ref(`/properties/${booking.propertyId}`)
        .once('value');
      const property = propertySnapshot.val();

      // Send confirmation email to guest
      await sendBookingConfirmationEmail(booking, property);

      // Send notification email to admin
      await sendAdminNotificationEmail(booking, property, 'NEW_BOOKING');

      // Log success
      console.log(`Booking confirmation sent for booking ${bookingId}`);
      
      return null;
    } catch (error) {
      console.error('Error processing booking creation:', error);
      return null;
    }
  });

// Booking status update trigger
exports.onBookingStatusChanged = functions.database.ref('/bookings/{bookingId}/status')
  .onUpdate(async (change, context) => {
    const newStatus = change.after.val();
    const previousStatus = change.before.val();
    const bookingId = context.params.bookingId;

    // Only process certain status changes
    if (newStatus === previousStatus) return null;

    try {
      // Get booking details
      const bookingSnapshot = await admin.database()
        .ref(`/bookings/${bookingId}`)
        .once('value');
      const booking = bookingSnapshot.val();

      // Get property details
      const propertySnapshot = await admin.database()
        .ref(`/properties/${booking.propertyId}`)
        .once('value');
      const property = propertySnapshot.val();

      // Handle different status changes
      switch (newStatus) {
        case 'confirmed':
          await sendBookingConfirmationEmail(booking, property);
          break;
        case 'cancelled':
          await sendBookingCancellationEmail(booking, property);
          break;
        case 'completed':
          await sendBookingCompletionEmail(booking, property);
          break;
      }

      // Always notify admin of status changes
      await sendAdminNotificationEmail(booking, property, `BOOKING_${newStatus.toUpperCase()}`);

      console.log(`Processed status change for booking ${bookingId}: ${previousStatus} -> ${newStatus}`);
      return null;
    } catch (error) {
      console.error('Error processing booking status change:', error);
      return null;
    }
  });

// Contact form submission trigger
exports.onContactFormSubmitted = functions.database.ref('/contacts/{contactId}')
  .onCreate(async (snapshot, context) => {
    const contact = snapshot.val();
    const contactId = context.params.contactId;

    try {
      // Send auto-reply to user
      await sendContactAutoReply(contact);

      // Send notification to admin
      await sendContactNotificationEmail(contact);

      console.log(`Contact form processed: ${contactId}`);
      return null;
    } catch (error) {
      console.error('Error processing contact form:', error);
      return null;
    }
  });

// Payment processing webhook
exports.processPaymentWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const { bookingId, paymentStatus, transactionId, amount } = req.body;

    if (paymentStatus === 'completed') {
      // Update booking payment status
      await admin.database()
        .ref(`/bookings/${bookingId}`)
        .update({
          paymentStatus: 'completed',
          transactionId: transactionId,
          paidAmount: amount,
          paidAt: admin.database.ServerValue.TIMESTAMP,
          status: 'confirmed'
        });

      // Get booking and property details for email
      const bookingSnapshot = await admin.database()
        .ref(`/bookings/${bookingId}`)
        .once('value');
      const booking = bookingSnapshot.val();

      const propertySnapshot = await admin.database()
        .ref(`/properties/${booking.propertyId}`)
        .once('value');
      const property = propertySnapshot.val();

      // Send payment confirmation email
      await sendPaymentConfirmationEmail(booking, property, {
        transactionId,
        amount
      });

      res.status(200).json({ success: true, message: 'Payment processed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Scheduled function to check booking reminders
exports.sendBookingReminders = functions.pubsub.schedule('0 9 * * *')
  .timeZone('Africa/Nairobi')
  .onRun(async (context) => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // Get bookings checking in tomorrow
      const bookingsSnapshot = await admin.database()
        .ref('/bookings')
        .orderByChild('checkIn')
        .startAt(tomorrow.getTime())
        .endAt(dayAfterTomorrow.getTime() - 1)
        .once('value');

      const bookings = bookingsSnapshot.val();
      
      if (bookings) {
        for (const [bookingId, booking] of Object.entries(bookings)) {
          if (booking.status === 'confirmed') {
            // Get property details
            const propertySnapshot = await admin.database()
              .ref(`/properties/${booking.propertyId}`)
              .once('value');
            const property = propertySnapshot.val();

            // Send reminder email
            await sendBookingReminderEmail(booking, property);
          }
        }
      }

      console.log('Booking reminders sent successfully');
      return null;
    } catch (error) {
      console.error('Error sending booking reminders:', error);
      return null;
    }
  });

// Email helper functions
async function sendBookingConfirmationEmail(booking, property) {
  const mailOptions = {
    from: functions.config().email.user,
    to: booking.userEmail,
    subject: `Booking Confirmation - ${property.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Booking Confirmed!</h2>
        <p>Dear ${booking.userName},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Booking Details</h3>
          <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
          <p><strong>Property:</strong> ${property.name}</p>
          <p><strong>Location:</strong> ${property.location}</p>
          <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
          <p><strong>Guests:</strong> ${booking.guests}</p>
          <p><strong>Total Cost:</strong> KES ${booking.totalCost.toLocaleString()}</p>
        </div>
        
        <p>We look forward to hosting you!</p>
        <p>Best regards,<br>The Queensy Team</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <p>Contact us: +254706880575 | info@queensy.com</p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

async function sendBookingCancellationEmail(booking, property) {
  const mailOptions = {
    from: functions.config().email.user,
    to: booking.userEmail,
    subject: `Booking Cancelled - ${property.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Booking Cancelled</h2>
        <p>Dear ${booking.userName},</p>
        <p>Your booking has been cancelled as requested.</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Cancelled Booking Details</h3>
          <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
          <p><strong>Property:</strong> ${property.name}</p>
          <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
        </div>
        
        <p>If you have any questions, please contact us.</p>
        <p>Best regards,<br>The Queensy Team</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

async function sendPaymentConfirmationEmail(booking, property, paymentDetails) {
  const mailOptions = {
    from: functions.config().email.user,
    to: booking.userEmail,
    subject: `Payment Confirmed - ${property.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Payment Confirmed!</h2>
        <p>Dear ${booking.userName},</p>
        <p>Your payment has been successfully processed.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Details</h3>
          <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
          <p><strong>Amount Paid:</strong> KES ${paymentDetails.amount.toLocaleString()}</p>
          <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
        </div>
        
        <p>Your booking is now confirmed and ready!</p>
        <p>Best regards,<br>The Queensy Team</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

async function sendAdminNotificationEmail(booking, property, type) {
  const mailOptions = {
    from: functions.config().email.user,
    to: 'admin@queensy.com',
    subject: `${type}: ${booking.bookingReference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${type.replace('_', ' ')}</h2>
        <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
        <p><strong>Property:</strong> ${property.name}</p>
        <p><strong>Guest:</strong> ${booking.userName} (${booking.userEmail})</p>
        <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
        <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
        <p><strong>Total:</strong> KES ${booking.totalCost.toLocaleString()}</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

async function sendContactAutoReply(contact) {
  const mailOptions = {
    from: functions.config().email.user,
    to: contact.email,
    subject: 'Thank you for contacting Queensy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank You for Contacting Us!</h2>
        <p>Dear ${contact.name},</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p><strong>Your Message:</strong></p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Subject:</strong> ${contact.subject}</p>
          <p>${contact.message}</p>
        </div>
        <p>Best regards,<br>The Queensy Team</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

async function sendContactNotificationEmail(contact) {
  const mailOptions = {
    from: functions.config().email.user,
    to: 'admin@queensy.com',
    subject: `New Contact Form: ${contact.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
          ${contact.message}
        </div>
        <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}
