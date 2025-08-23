import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, database } from '../../config/firebase';
import { ref, onValue, remove } from 'firebase/database';
import { Calendar, MapPin, Users, X } from 'lucide-react';

const UserBookings = () => {
  const [user] = useAuthState(auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const bookingsRef = ref(database, `bookings/${user.uid}`);
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setBookings(bookingsList);
      } else {
        setBookings([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!user) return;
    
    try {
      const bookingRef = ref(database, `bookings/${user.uid}/${bookingId}`);
      await remove(bookingRef);
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Please sign in to view your bookings</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-xl text-gray-600">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--vintage-cream)]/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-[var(--vintage-sage)]/30"
      >
        <h2 className="text-3xl font-bold text-[var(--vintage-brown)] mb-8 text-center">Your Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-[var(--vintage-brown)]">You don't have any bookings yet</p>
            <p className="text-[var(--vintage-sage)] mt-2">Start exploring our properties to make a booking</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.slice(0, 3).map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--vintage-cream)] rounded-2xl p-6 border border-[var(--vintage-sage)]/30 shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[var(--vintage-brown)]">{booking.propertyName}</h3>
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Cancel booking"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-[var(--vintage-brown)]">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{booking.location}</span>
                  </div>
                  
                  <div className="flex items-center text-[var(--vintage-brown)]">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{booking.checkIn} to {booking.checkOut}</span>
                  </div>
                  
                  <div className="flex items-center text-[var(--vintage-brown)]">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{booking.guests} guests</span>
                  </div>
                  
                  <div className="pt-3 border-t border-[var(--vintage-sage)]/30">
                    <p className="text-lg font-semibold text-[var(--vintage-brown)]">
                      KES {booking.totalPrice?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            {bookings.length > 3 && (
              <div className="text-center col-span-full mt-6">
                <button className="px-6 py-3 bg-[var(--vintage-sage)] text-[var(--tech-white)] font-semibold rounded-xl hover:bg-[var(--vintage-brown)] transition-all duration-300">
                  Show More Bookings
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserBookings;