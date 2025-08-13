import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DateRange } from 'react-date-range';
import { addDays, format, differenceInCalendarDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const PropertyCalendar = ({ property }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);

  const [guests, setGuests] = useState(1);
  const nights = differenceInCalendarDays(dateRange[0].endDate, dateRange[0].startDate);
  const basePrice = property.originalPrice;
  const totalPrice = basePrice * nights;

  // Mock availability data
  const bookedDates = [
    { startDate: addDays(new Date(), 14), endDate: addDays(new Date(), 16) },
    { startDate: addDays(new Date(), 20), endDate: addDays(new Date(), 22) }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1">
          <DateRange
            editableDateInputs={true}
            onChange={item => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            minDate={new Date()}
            disabledDates={bookedDates.map(date => ({
              startDate: date.startDate,
              endDate: date.endDate
            }))}
            rangeColors={['#facc15']}
            className="rounded-xl overflow-hidden shadow-lg"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1 space-y-4">
          <div className="rounded-xl p-6 bg-yellow-400/10 backdrop-blur-sm">
            <h4 className="text-lg font-semibold mb-4">Booking Summary</h4>
            
            {/* Dates */}
            <div className="space-y-2 mb-4">
              <p className="flex justify-between">
                <span>Check-in:</span>
                <span>{format(dateRange[0].startDate, 'MMM dd, yyyy')}</span>
              </p>
              <p className="flex justify-between">
                <span>Check-out:</span>
                <span>{format(dateRange[0].endDate, 'MMM dd, yyyy')}</span>
              </p>
              <p className="flex justify-between font-medium">
                <span>Duration:</span>
                <span>{nights} night{nights > 1 ? 's' : ''}</span>
              </p>
            </div>

            {/* Guests */}
            <div className="mb-4">
              <label className="block text-sm mb-2">Number of Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-gray-600"
              >
                {[...Array(property.guests)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Guest{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-4 border-t border-gray-600">
              <p className="flex justify-between">
                <span>Base Rate ({nights} night{nights > 1 ? 's' : ''})</span>
                <span>KES {basePrice.toLocaleString()}/night</span>
              </p>
              <p className="flex justify-between font-bold text-lg pt-2 border-t border-gray-600">
                <span>Total</span>
                <span>KES {totalPrice.toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Book Now Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 rounded-xl font-medium bg-yellow-400 text-black hover:bg-yellow-300 transition-colors"
          >
            Confirm Booking
          </motion.button>
        </div>
      </div>

      {/* Availability Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-400"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-400"></div>
          <span>Available</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCalendar;