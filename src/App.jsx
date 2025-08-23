import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppFloatingButton from './components/common/WhatsAppFloatingButton';

import AboutUsPage from './components/pages/AboutUsPage';
import PropertiesPage from './components/pages/PropertiesPage';
import PropertyDetailPage from './components/pages/PropertyDetailPage';
import HomePage from './components/pages/HomePage';
import ContactPage from './components/pages/ContactPage';
import SignUpPage from './components/pages/SignUpPage';
import LoginPage from './components/pages/LoginPage';
import UserBookings from './components/booking/UserBookings';
import ScrollToTop from './components/common/ScrollToTop';

import BlogPage from './components/blog/BlogPage';
import BlogDetail from './components/blog/BlogDetail';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0m_RLdLwrN4H00pRcZ_EOMCq6bcsg68g",
  authDomain: "my-queensy-app.firebaseapp.com",
  projectId: "my-queensy-app",
  storageBucket: "my-queensy-app.firebasestorage.app",
  messagingSenderId: "199451469300",
  appId: "1:199451469300:web:c2479e388c20b99ca6c5a1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// BlogDetail wrapper to handle slug parameter
const BlogDetailWrapper = () => {
  const { slug } = useParams();
  return <BlogDetail slug={slug} />;
};

// Property data for the application

// GOOGLE_MAPS_API_KEY_INSERTION_POINT: Replace with your actual Google Maps API Key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your Google Maps API Key

// Custom Hooks
const useTypingEffect = (phrases, typingSpeed = 80, deleteSpeed = 50, pauseTime = 2000) => {
  const [currentText, setCurrentText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? deleteSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deleteSpeed, pauseTime]);
  return currentText;
};

// Data (Mock Data - In a real CMS, this would be fetched from Firestore)
const propertiesData = [
  {
    id: 'chameleon-1',
    title: 'Chameleon 1: The Serene Retreat',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    price: 5500,
    originalPrice: 5500,
    discountedPrice: 5000,
    guests: 2,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Swimming Pool', 'Balcony', 'Queen-size Bed', 'Ocean View', 'Air Conditioning', 'Private Entrance'],
    shortDescription: 'A tranquil 1-bedroom suite perfect for romantic getaways.',
    fullDescription: `Discover the tranquil embrace of Chameleon 1. This exquisite 1-bedroom suite, featuring a plush Queen-size bed and a pristine bathroom, is perfectly designed for romantic getaways or a peaceful solo escape. Accommodating 1-2 guests, you'll wake up to the gentle ocean breeze on your private balcony, offering stunning panoramic views.
    Indulge in the sparkling swimming pool, just steps away. Every detail, from the crisp linens to the subtle coastal decor, ensures an unforgettable stay. Experience true relaxation, just a short stroll from the pristine Diani Beach.
    The suite features modern amenities while maintaining an authentic Kenyan coastal charm. Your private balcony becomes your sanctuary, perfect for morning coffee or evening sundowners as you watch the Indian Ocean's ever-changing moods.
    We've curated this space to be a true escape, a place where you can unwind, reconnect with nature, and create cherished memories. The gentle sound of waves and the vibrant local birdlife will be your daily soundtrack.`
  },
  {
    id: 'chameleon-2',
    title: 'Chameleon 2: The Vibrant Escape',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    price: 5500,
    originalPrice: 5500,
    discountedPrice: 5000,
    guests: 3,
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Swimming Pool Access', 'Family Friendly', 'Queen-size Bed', 'Local Attractions', 'Garden View', 'Shared Lounge'],
    shortDescription: 'A delightful 1-bedroom haven perfect for small families or friends.',
    fullDescription: `Step into the vibrant energy of Chameleon 2, a delightful 1-bedroom haven perfect for small families or friends. This suite offers a comfortable Queen-size bed and a well-appointed bathroom. Its spacious layout and cheerful decor invite relaxation after a day of Diani adventures.
    Enjoy the shared swimming pool and easy access to local attractions. Chameleon 2 provides a perfect blend of comfort and convenience for your Mombasa journey. The bright, airy interiors reflect the coastal lifestyle, while thoughtful touches ensure every guest feels at home.
    Located in the heart of our property, this suite offers the perfect base for exploring everything Diani has to offer, from world-class beaches to vibrant local markets and authentic Swahili culture. It's designed for those who seek both adventure and a cozy retreat.`
  },
  {
    id: 'wendys-penthouse',
    title: "Wendy's Penthouse: Grandeur Redefined",
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    price: 15500,
    originalPrice: 15500,
    discountedPrice: 14000,
    guests: 6,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ['3 Bedrooms', '3 Baths', 'Bathtub', 'WiFi', 'Netflix', 'Fully Equipped Kitchen', 'Group Friendly', 'Oceanfront', 'Private Balcony', 'Daily Housekeeping'],
    shortDescription: 'A sprawling residence boasting 3 opulent bedrooms for the ultimate luxury experience.',
    fullDescription: `Elevate your Diani experience in the magnificent Wendy's Penthouse. This sprawling residence boasts 3 opulent bedrooms with a King, Queen, and Double bed, complemented by 3 lavish bathrooms, including a decadent bathtub. Ideal for up to 6 guests, it's perfect for discerning business travelers, group reservations, or families seeking unparalleled comfort.
    Enjoy the convenience of a fully equipped kitchen with a modern fridge and cooker, hot showers, complimentary high-speed WiFi, and Netflix pre-paid on all TVs. The spacious living areas are designed for both relaxation and entertainment, featuring contemporary furnishings and stunning coastal-inspired decor.
    Special discounts are available for extended stays, and co-sharing options make luxury accessible. Each bedroom is thoughtfully designed as a private sanctuary, while common areas encourage gathering and creating unforgettable memories with loved ones.
    The penthouse represents the pinnacle of coastal luxury living, where every detail has been carefully curated to exceed expectations and create lasting memories of your Kenyan coastal adventure. From the panoramic ocean views to the personalized service, every moment here is designed to be exceptional.`
  }
];

const testimonialsData = [
  {
    id: 1,
    name: 'Shery L.',
    title: 'Marketing Executive',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop',
    quote: "Queensy exceeded every expectation! Chameleon 1 was pure magic - waking up to ocean views and George's exceptional hospitality made our anniversary unforgettable. The attention to detail is remarkable."
  },
  {
    id: 2,
    name: 'Prof. Don M.',
    title: 'University Professor',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=80&h=80&fit=crop',
    quote: "As an academic who travels frequently, I can confidently say Wendy's Penthouse offers unparalleled comfort. The blend of luxury and authentic Kenyan hospitality creates a truly unique experience."
  },
  {
    id: 3,
    name: 'Winnie M.',
    title: 'Travel Blogger',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=80&h=80&fit=crop',
    quote: "I've stayed in hundreds of accommodations worldwide, but Queensy stands apart. The properties are immaculate, the location is perfect, and the service is genuinely world-class. Highly recommended!"
  },
  {
    id: 4,
    name: 'Maria S.',
    title: 'Business Consultant',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=80&h=80&fit=crop',
    quote: "Chameleon 2 provided the perfect base for our family vacation. The kids loved the pool, we loved the comfort, and everyone appreciated the proximity to Diani Beach. Will definitely return!"
  }
];

const partnersData = [
  { name: 'Kenya Tourism Board', logo: 'https://placehold.co/120x60/0a0a0a/e0e0e0?text=KTB' },
  { name: 'Diani Beach Hotels', logo: 'https://placehold.co/120x60/0a0a0a/e0e0e0?text=DBH' },
  { name: 'Mombasa Tours', logo: 'https://placehold.co/120x60/0a0a0a/e0e0e0?text=MT' },
  { name: 'Safari Expeditions', logo: 'https://placehold.co/120x60/0a0a0a/e0e0e0?text=SE' },
  { name: 'Coastal Airlines', logo: 'https://placehold.co/120x60/0a0a0a/e0e0e0?text=CA' },
  { name: 'Local Restaurants', logo: 'https://placehold.co/120x60/0a0a0a/e0e0e0?text=LR' }
];

// Components
const NotificationCard = ({ type, message, onClose, isVisible }) => {
  const getStyles = () => {
    switch (type) {
      case 'error':
        return 'border-red-500 bg-red-900/20 text-red-200';
      case 'success':
        return 'border-green-500 bg-green-900/20 text-green-200';
      case 'warning':
        return 'border-blue-500 bg-blue-900/20 text-blue-200';
      default:
        return 'border-blue-500 bg-blue-900/20 text-blue-200';
    }
  };
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'success':
        return <Check className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };
  if (!isVisible) return null;
  return (
    <div className={`border-l-4 p-4 rounded-r-lg mb-4 flex items-start gap-3 transition-all duration-500 ${getStyles()}`}>
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const ProgressBar = ({ progress, label }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-300 mb-2">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-200 to-blue-600 h-2 rounded-full transition-all duration-1000 animate-pulse"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="App">
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <Suspense fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 border-4 border-[var(--vintage-sage)] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[var(--text-secondary)]">Fetching Queensy Updates...</p>
              </div>
          </div>
      }>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailWrapper />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/bookings" element={<UserBookings />} />
  
        </Routes>
      </Suspense>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
};

// Main App Component
const App = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Getting things ready...");
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // App component rendering
    
    // Initialize Firebase
    const initializeFirebase = async () => {
      try {
        setLoadingMessage("Fetching Queensy Updates...");
        setLoadingProgress(20);
        
        // Test Firebase connection
        await testFirebaseConnection();
        
        setLoadingMessage("Setting up authentication...");
        setLoadingProgress(40);
        
        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          // Auth state changed
          setUser(user);
          setIsAuthReady(true);
          setLoadingMessage("Almost there...");
          setLoadingProgress(80);
          
          setTimeout(() => {
            setLoadingMessage("Welcome to Queensy!");
            setLoadingProgress(100);
          }, 500);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setError(error);
        setLoadingMessage("Error initializing app...");
      }
    };

    const testFirebaseConnection = async () => {
      try {
        // Test anonymous sign-in
        const result = await signInAnonymously(auth);
        // Anonymous sign-in successful
        
        // Test custom token sign-in (if available)
        try {
          const customToken = await auth.currentUser?.getIdToken();
          // Custom token test completed
        } catch (tokenError) {
          // Custom token error (expected)
        }
        
      } catch (error) {
        // Firebase connection test failed
        
        if (error.code === 'auth/admin-restricted-operation') {
          // Firebase configuration troubleshooting tips available in development
        }
        
        // Continue with app initialization even if Firebase fails
        setLoadingMessage("Setting up app without Firebase...");
        setLoadingProgress(60);
      }
    };

    initializeFirebase();
  }, []);

  // Loading screen with custom messages
  if (!isAuthReady && !error) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Single Loading animation */}
          <div className="w-16 h-16 border-4 border-[var(--vintage-sage)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          
          {/* Progress bar */}
          <div className="w-64 bg-gray-800 rounded-full h-2 mx-auto">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          
          {/* Loading message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-blue-400">
              Queensy
            </h2>
            <p className="text-gray-300 font-body">
              {loadingMessage}
            </p>
            <p className="text-sm text-gray-500">
              {loadingProgress}% complete
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error boundary
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-red-400 font-sans">
              Application Error
            </h2>
            <p className="text-gray-300 font-body font-sans">
              {error.message || 'Something went wrong while loading the application.'}
            </p>
            
            <div className="space-y-2 text-sm text-gray-500">
              <p>If this persists, please:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check your internet connection</li>
                <li>Refresh the page</li>
                <li>Clear browser cache</li>
              </ul>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;