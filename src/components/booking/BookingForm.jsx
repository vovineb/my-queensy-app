import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, CreditCard, Check } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { addDays, format, differenceInCalendarDays } from 'date-fns';

const BookingForm = ({ property, onBookingComplete }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [guests, setGuests] = useState(1);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const nights = differenceInCalendarDays(dateRange[0].endDate, dateRange[0].startDate);
  const basePrice = property.price * nights;
  const serviceFee = basePrice * 0.1;
  const totalPrice = basePrice + serviceFee;

  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onBookingComplete({
      dates: dateRange[0],
      guests,
      totalPrice,
      property
    });
    
    setIsProcessing(false);
  };

  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-6">
      <h3 className="text-2xl font-bold text-white mb-6">Book Your Stay</h3>

      {/* Step 1: Dates */}
      <motion.div
        initial={false}
        animate={{ height: step === 1 ? 'auto' : '60px' }}
        className="overflow-hidden"
      >
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-3 w-full text-left mb-4"
        >
          <Calendar className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-medium">Select Dates</span>
        </button>
        
        {step === 1 && (
          <DateRange
            ranges={dateRange}
            onChange={item => setDateRange([item.selection])}
            minDate={new Date()}
            rangeColors={['#EAB308']}
            className="rounded-xl overflow-hidden"
          />
        )}
      </motion.div>

      {/* Step 2: Guests */}
      <motion.div
        initial={false}
        animate={{ height: step === 2 ? 'auto' : '60px' }}
        className="overflow-hidden border-t border-white/10 pt-4"
      >
        <button
          onClick={() => setStep(2)}
          className="flex items-center gap-3 w-full text-left mb-4"
        >
          <Users className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-medium">Number of Guests</span>
        </button>
        
        {step === 2 && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setGuests(prev => Math.max(1, prev - 1))}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              -
            </button>
            <span className="text-white font-medium">{guests}</span>
            <button
              onClick={() => setGuests(prev => Math.min(property.maxGuests, prev + 1))}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              +
            </button>
          </div>
        )}
      </motion.div>

      {/* Step 3: Payment */}
      <motion.div
        initial={false}
        animate={{ height: step === 3 ? 'auto' : '60px' }}
        className="overflow-hidden border-t border-white/10 pt-4"
      >
        <button
          onClick={() => setStep(3)}
          className="flex items-center gap-3 w-full text-left mb-4"
        >
          <CreditCard className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-medium">Payment Details</span>
        </button>
        
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between text-gray-300">
              <span>Base Price ({nights} nights)</span>
              <span>KES {basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Service Fee</span>
              <span>KES {serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white font-bold pt-2 border-t border-white/10">
              <span>Total</span>
              <span>KES {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={isProcessing}
        className={`w-full py-4 rounded-xl font-bold text-black transition-all ${
          isProcessing
            ? 'bg-gray-400'
            : 'bg-yellow-400 hover:bg-yellow-500'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
            />
            Processing...
          </span>
        ) : (
          'Complete Booking'
        )}
      </motion.button>

      {/* Success Message */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-bold text-white">Booking Confirmed!</h4>
          <p className="text-gray-300">
            Your stay at {property.title} has been confirmed. Check your email for details.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default BookingForm;