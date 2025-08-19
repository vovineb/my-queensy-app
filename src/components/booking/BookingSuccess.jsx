import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Calendar, Users, MapPin, Phone, Mail } from 'lucide-react';
import PaymentModal from '../payment/PaymentModal';

const BookingSuccess = ({ booking, property, onClose }) => {
  const [showPayment, setShowPayment] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePaymentSuccess = (paymentResult) => {
    // Handle successful payment
    console.log('Payment successful:', paymentResult);
    setShowPayment(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-green-100">
            Your reservation has been successfully created
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Booking Reference */}
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Booking Reference</p>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 font-mono">
              {booking.bookingReference}
            </p>
          </div>

          {/* Property Details */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <img
                src={property.images?.[0] || property.image}
                alt={property.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {property.name}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check-in</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(booking.checkIn)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check-out</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(booking.checkOut)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Guests</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
                  <p className="font-bold text-xl text-gray-900 dark:text-white">
                    {formatCurrency(booking.totalCost)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Guest Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{booking.userEmail}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{booking.guestPhone}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Payment Status</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {booking.paymentStatus === 'completed' ? 'Payment completed' : 'Payment pending'}
                </p>
              </div>
              {booking.paymentStatus !== 'completed' && (
                <button
                  onClick={() => setShowPayment(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Complete Payment
                </button>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">What's Next?</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Check your email for the booking confirmation</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Save your booking reference: <strong>{booking.bookingReference}</strong></span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Contact us if you need to make any changes</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Prepare for an amazing stay!</span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Need help? Contact us:
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a
                href="tel:+254706880575"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                +254 706 880 575
              </a>
              <a
                href="mailto:info@queensy.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                info@queensy.com
              </a>
            </div>
          </div>

          {/* Close Button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        booking={booking}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default BookingSuccess;
