import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { validation } from '../../utils/validation';

const PaymentModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [availableMethods, setAvailableMethods] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const methods = paymentService.getAvailablePaymentMethods();
      setAvailableMethods(methods);
      if (methods.length > 0) {
        setSelectedMethod(methods[0].id);
      }
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date as MM/YY
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5);
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format phone number
    else if (name === 'phoneNumber') {
      const formatted = value.replace(/\D/g, '');
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
    }
    else {
      setPaymentData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePaymentData = () => {
    const newErrors = {};

    if (selectedMethod === 'stripe') {
      const cardValidation = validation.creditCard(paymentData.cardNumber.replace(/\s/g, ''));
      if (!cardValidation.valid) newErrors.cardNumber = cardValidation.message;

      const expiryValidation = validation.expiryDate(paymentData.expiryDate);
      if (!expiryValidation.valid) newErrors.expiryDate = expiryValidation.message;

      const cvvValidation = validation.cvv(paymentData.cvv);
      if (!cvvValidation.valid) newErrors.cvv = cvvValidation.message;

      const nameValidation = validation.name(paymentData.cardholderName);
      if (!nameValidation.valid) newErrors.cardholderName = nameValidation.message;
    }

    if (selectedMethod === 'mpesa') {
      const phoneValidation = validation.phone(paymentData.phoneNumber);
      if (!phoneValidation.valid) newErrors.phoneNumber = phoneValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validatePaymentData()) return;

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      const result = await paymentService.processPayment({
        bookingId: booking.id,
        amount: booking.totalCost,
        method: selectedMethod,
        paymentData: selectedMethod === 'stripe' ? {
          card: {
            number: paymentData.cardNumber.replace(/\s/g, ''),
            exp_month: paymentData.expiryDate.split('/')[0],
            exp_year: `20${paymentData.expiryDate.split('/')[1]}`,
            cvc: paymentData.cvv
          }
        } : {
          phoneNumber: paymentData.phoneNumber
        }
      });

      if (result.success) {
        setPaymentStatus('success');
        setTimeout(() => {
          onPaymentSuccess(result);
          onClose();
        }, 2000);
      } else {
        setPaymentStatus('error');
        setErrors({ payment: result.message });
      }
    } catch (error) {
      setPaymentStatus('error');
      setErrors({ payment: 'Payment processing failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!booking) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Complete Payment
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking Summary */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Booking Summary
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Property:</span>
                    <span className="text-blue-900 dark:text-blue-100 font-medium">
                      {booking.propertyName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Dates:</span>
                    <span className="text-blue-900 dark:text-blue-100">
                      {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Guests:</span>
                    <span className="text-blue-900 dark:text-blue-100">{booking.guests}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-700">
                    <span className="text-blue-900 dark:text-blue-100 font-bold">Total:</span>
                    <span className="text-blue-900 dark:text-blue-100 font-bold text-lg">
                      {formatCurrency(booking.totalCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Select Payment Method
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {availableMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {method.id === 'stripe' && <CreditCard className="w-5 h-5 text-blue-600" />}
                        {method.id === 'mpesa' && <Smartphone className="w-5 h-5 text-green-600" />}
                        <div className="text-left">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {method.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Form */}
              {selectedMethod === 'stripe' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={paymentData.cardholderName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                    {errors.cardholderName && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange}
                      maxLength={19}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handleInputChange}
                        maxLength={5}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123"
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'mpesa' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      M-Pesa Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={paymentData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="254712345678"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      You will receive an STK push notification to complete the payment
                    </p>
                  </div>
                </div>
              )}

              {/* Error Messages */}
              {errors.payment && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 dark:text-red-300">{errors.payment}</p>
                  </div>
                </div>
              )}

              {/* Payment Status */}
              {paymentStatus === 'success' && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 dark:text-green-300">Payment successful!</p>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || paymentStatus === 'success'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : paymentStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Payment Complete</span>
                  </>
                ) : (
                  <span>Pay {formatCurrency(booking.totalCost)}</span>
                )}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Your payment information is secure and encrypted
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
