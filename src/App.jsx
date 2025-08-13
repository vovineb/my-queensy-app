import React, { useState, useEffect, useRef, createContext, useContext, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Menu, X, MapPin, Phone, Mail, Instagram, Linkedin, Twitter, MessageCircle, Sun, Moon, Star, Wifi, Utensils, Car, Waves, Bed, Bath, Users, Calendar, ChevronLeft, ChevronRight, Play, Check, AlertCircle, Info, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCarousel from './components/common/ImageCarousel';
import Heading3D from './components/common/Heading3D';
import GlobeGallery from './components/common/GlobeGallery';
import { blogPosts } from './data/blogData';
import './styles/carousel3d.css';
import './styles/layout.css';
import './styles/typography.css';
import StatsSection, { StatsCounter } from './components/common/StatsCounter';
import BlogPage from './components/blog/BlogPage';
import BlogDetail from './components/blog/BlogDetail';
import ErrorBoundary from './components/ErrorBoundary';
import emailjs from '@emailjs/browser';

// BlogDetail wrapper to handle slug parameter
const BlogDetailWrapper = () => {
  const { slug } = useParams();
  return <BlogDetail slug={slug} />;
};

// Custom hook for back navigation with refresh
const useBackNavigation = () => {
  const navigate = useNavigate();
  
  const goBack = () => {
    // Store current page in session storage
    sessionStorage.setItem('lastPage', window.location.pathname);
    
    // Navigate back
    navigate(-1);
    
    // Refresh the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  return { goBack };
};

// --- Firebase Configuration and Initialization ---
// These global variables are provided by the Canvas environment.
// Ensure they are defined or provide fallbacks for local development.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let firebaseApp;
let db;
let auth;

// FIREBASE_API_KEY_INSERTION_POINT: Replace with your actual Firebase config
const firebaseConfigDefaults = {
  apiKey: "AIzaSyB0m_RLdLwrN4H00pRcZ_EOMCq6bcsg68g",
  authDomain: "my-queensy-app.firebaseapp.com",
  projectId: "my-queensy-app",
  storageBucket: "my-queensy-app.firebasestorage.app",
  messagingSenderId: "199451469300",
  appId:"1:199451469300:web:c2479e388c20b99ca6c5a1",
};

// Use provided config if available, otherwise use defaults for local testing
const currentFirebaseConfig = Object.keys(firebaseConfig).length > 0 ? firebaseConfig : firebaseConfigDefaults;

// Firebase config loaded

if (currentFirebaseConfig.projectId && !firebaseApp) { // Initialize only once
  try {
    firebaseApp = initializeApp(currentFirebaseConfig);
    db = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
    // Firebase initialized successfully
  } catch (error) {
    // Log error for debugging but don't expose sensitive info
    if (process.env.NODE_ENV === 'development') {
      console.error('Firebase initialization error:', error);
    }
  }
}

// GOOGLE_MAPS_API_KEY_INSERTION_POINT: Replace with your actual Google Maps API Key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your Google Maps API Key

// --- Theme Context ---
const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <Router>
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
          {children}
        </div>
      </Router>
    </ThemeContext.Provider>
  );
};

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

const useThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  return { isDark, toggleTheme };
};

const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
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

const blogPostsData = [
  {
    id: 'things-to-do-kenya',
    title: "Things to do when in Kenya: A Local's Guide",
    slug: 'things-to-do-kenya',
    image: 'https://placehold.co/400x250/1a1a1a/d4af37?text=Kenya+Adventures',
    excerpt: 'Discover the hidden gems and authentic experiences that make Kenya truly magical, from a local perspective.',
    content: `Kenya is a land of incredible diversity, offering experiences that go far beyond the typical tourist trail. As someone who has lived and breathed this beautiful country, I'm excited to share the authentic Kenya that locals know and love.

    **Coastal Adventures in Diani and Mombasa**

    Start your journey along our pristine coastline. Diani Beach isn't just about sunbathing – it's about connecting with a living ecosystem. Wake up early to witness dhow boats returning with the night's catch, their triangular sails silhouetted against the dawn sky.

    In Mombasa's Old Town, lose yourself in the narrow streets where Swahili, Arab, and Portuguese influences create architectural poetry. Visit Fort Jesus not just as a tourist, but to understand the complex history that shaped our coastal culture.

    **Safari Beyond the Obvious**

    While Maasai Mara is spectacular, consider the lesser-known conservancies like Ol Pejeta or Samburu. Here, you'll encounter species found nowhere else – the Grevy's zebra, reticulated giraffe, and Somali ostrich paint a different picture of African wildlife.

    **Cultural Immersion**

    Visit a Maasai village, but choose community-run tourism initiatives where your visit directly benefits local families. Learn traditional beadwork, participate in cattle herding, and understand the delicate balance between ancient traditions and modern life.

    **Nairobi's Hidden Side**

    Beyond the safari starting point, Nairobi pulses with creativity. Explore the Karen Blixen Museum, then venture to local art galleries in the Karen area. The city's coffee culture rivals any global capital – try single-origin beans from different Kenyan regions.

    **Practical Tips from a Local**

    - Always carry cash in smaller denominations
    - Learn basic Swahili greetings – locals appreciate the effort
    - Try ugali, nyama choma, and fresh tropical fruits from roadside vendors
    - Respect photography customs, especially in rural areas
    - Pack layers – our climate varies dramatically with altitude`
  },
  {
    id: 'hidden-gems-diani-mombasa',
    title: 'Hidden Gems: Places to Visit in Diani & Mombasa',
    slug: 'hidden-gems-diani-mombasa',
    image: 'https://placehold.co/400x250/1a1a1a/d4af37?text=Hidden+Gems',
    excerpt: 'Uncover the secret spots and local favorites that most tourists never discover in coastal Kenya.',
    content: `The Kenyan coast holds secrets that even guidebooks miss. After years of exploring every corner of Diani and Mombasa, I've discovered places that capture the true spirit of coastal Kenya.

    **Diani's Secret Spots**

    **Kongo Mosque Ruins**: Hidden in the coastal forest, these 14th-century ruins whisper stories of ancient trade routes. The walk through indigenous forest reveals colobus monkeys and rare bird species.

    **Chale Island**: Accessible only at low tide, this tiny island offers pristine coral gardens perfect for snorkeling. Local fishermen know the best spots – ask politely and they might share their secrets.

    **Shimba Hills National Reserve**: Just 30 minutes from Diani, this forest reserve is home to the rare sable antelope. The Sheldrick Falls hike rewards you with a hidden waterfall perfect for a refreshing dip.

    **Mombasa's Local Treasures**

    **Spice Markets of Old Town**: Beyond the tourist shops, local spice vendors sell cardamom, cinnamon, and star anise that locals use daily. Join a cooking class to understand how these spices transform simple ingredients.

    **Pembe za Ndovu (Elephant Tusks)**: While tourists photograph the iconic tusks, locals know the small tea shops nearby serve the best kahawa tungu (bitter coffee) and mahamri (coastal donuts).

    **Bamburi Nature Trail**: This former quarry has been transformed into a nature sanctuary. Evening visits offer chances to spot bushbabies and enjoy traditional taarab music performances.

    **Insider Experiences**

    **Local Fish Markets**: Visit Kilifi Creek fish market at dawn to see the night's catch auction. The energy is infectious, and you'll understand why fresh fish tastes different here.

    **Traditional Dhow Building**: In villages near Kilifi, master craftsmen still build dhows using techniques passed down through generations. Witnessing this ancient art is truly special.

    **Community Beach Cleanups**: Join local environmental groups for weekend beach cleanups. It's a meaningful way to connect with conservation-minded locals while protecting our pristine coastline.

    These hidden gems offer authentic connections with local culture and natural beauty that typical tourist routes simply cannot match.`
  },
  {
    id: 'budgeting-safari-kenya',
    title: 'Budgeting for Your Safari: Price for Normal Things (e.g., a Toothbrush)',
    slug: 'budgeting-safari-kenya',
    image: 'https://placehold.co/400x250/1a1a1a/d4af37?text=Safari+Budget',
    excerpt: 'A practical guide to understanding costs in Kenya, from everyday items to safari experiences.',
    content: `Planning a Kenyan safari involves more than just booking game drives. Understanding local prices helps you budget realistically and avoid tourist traps while supporting local communities fairly.

    **Everyday Items (Nairobi/Mombasa Prices)**

    - Toothbrush: KES 150-300 ($1-2)
    - Bottled water (500ml): KES 50-80 ($0.35-0.55)
    - Local SIM card: KES 100 plus credit
    - Sunscreen (quality brand): KES 800-1,200 ($5.50-8.25)
    - Insect repellent: KES 600-900 ($4-6)
    - Basic first aid supplies: KES 500-1,000 ($3.50-7)

    **Food & Dining**

    **Local Restaurants**:
    - Nyama choma (grilled meat): KES 500-800 ($3.50-5.50)
    - Ugali and vegetables: KES 200-350 ($1.40-2.40)
    - Fresh fruit juice: KES 100-200 ($0.70-1.40)

    **Mid-range Restaurants**:
    - International cuisine: KES 1,500-2,500 ($10-17)
    - Seafood at coast: KES 2,000-3,500 ($14-24)

    **Street Food** (safe and delicious):
    - Samosas: KES 20-30 each
    - Mandazi (sweet bread): KES 10-20 each
    - Fresh coconut: KES 50-100

    **Transportation**

    - Matatu (local bus) in city: KES 30-80
    - Boda boda (motorcycle taxi): KES 100-300 for short distances
    - Uber/Bolt in Nairobi: KES 200-600 for city trips
    - Tuk-tuk in Mombasa: KES 150-400
    - Safari vehicle hire: KES 15,000-25,000 per day

    **Safari-Specific Costs**

    **Park Entrance Fees**:
    - Maasai Mara: $70-80 per person per day
    - Amboseli: $60 per person per day
    - Tsavo: $52 per person per day
    - Conservancies: $40-100 per person per day

    **Accommodation**:
    - Budget camps: $50-150 per person per night
    - Mid-range lodges: $200-400 per person per night
    - Luxury lodges: $500-1,500 per person per night

    **Money-Saving Tips**

    1. **Shop at local supermarkets**: Nakumatt, Carrefour, or Tuskys for supplies
    2. **Eat where locals eat**: Authentic food at fair prices
    3. **Negotiate respectfully**: Expected in markets, not in established shops
    4. **Group safaris**: Share costs for vehicles and guides
    5. **Visit during shoulder seasons**: March-May and November offer lower prices

    **Tipping Guidelines**

    - Safari guide: $10-15 per person per day
    - Hotel staff: KES 200-500 per day
    - Restaurant service: 10% if not included
    - Porters: KES 200-300 per bag

    **Budget Planning Framework**

    **Budget Safari** (per person for 7 days):
    - Accommodation: $350-750
    - Meals: $200-350
    - Park fees: $300-400
    - Transport: $200-400
    - Miscellaneous: $150-250
    **Total**: $1,200-2,150

    **Mid-range Safari** (per person for 7 days):
    - Accommodation: $1,400-2,800
    - Meals: $350-600
    - Park fees: $400-500
    - Transport: $300-600
    - Miscellaneous: $250-400
    **Total**: $2,700-4,900

    Remember, supporting local communities through fair pricing creates sustainable tourism that benefits everyone.`
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

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        isDark ? 'bg-gray-700' : 'bg-blue-400'
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
          isDark ? 'translate-x-0 bg-gray-300' : 'translate-x-7 bg-white'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-gray-700" />
        ) : (
          <Sun className="w-3 h-3 text-blue-600" />
        )}
      </div>
    </button>
  );
};

const WhatsAppFloatingButton = () => {
  return (
    <a
      href="https://wa.me/254706880575"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
    </a>
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

const Header = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/properties', label: 'Properties' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/signup', label: 'Sign Up' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? 'bg-black/95 backdrop-blur-md h-16 shadow-lg'
            : 'bg-white/95 backdrop-blur-md h-16 text-gray-900 shadow-lg'
          : isDark
            ? 'bg-transparent h-20'
            : 'bg-transparent h-20 text-gray-900'
      }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/home" className="flex items-center space-x-3 z-10">
          <img
            src="https://placehold.co/60x60/0a0a0a/d4af37?text=Queensy+Logo"
            alt="Queensy Logo"
            className="w-12 h-12 rounded-lg"
          />
          <span className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
            Queensy
          </span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 z-10">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative py-3 px-6 text-lg font-medium transition-all duration-300 rounded-full border-2 ${
                location.pathname === link.to
                  ? isDark
                    ? 'text-blue-400 border-blue-400 bg-blue-400/10'
                    : 'text-blue-600 border-blue-600 bg-blue-600/10'
                  : isDark
                    ? 'text-white border-gray-700 hover:text-blue-400 hover:border-blue-400 hover:bg-blue-400/10'
                    : 'text-gray-900 border-gray-200 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-600/10'
              }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-blue-400' : 'bg-blue-600'} animate-pulse`}></div>
              )}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden p-2 z-10 ${isDark ? 'text-white' : 'text-gray-900'}`}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`absolute top-full left-0 right-0 z-40 ${isDark ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-md md:hidden shadow-lg`}>
            <nav className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg transition-colors ${
                    location.pathname === link.to
                      ? isDark
                        ? 'text-blue-400 bg-blue-400/10'
                        : 'text-blue-600 bg-blue-600/10'
                      : isDark
                        ? 'text-white hover:text-blue-400 hover:bg-blue-400/10'
                        : 'text-gray-900 hover:text-blue-600 hover:bg-blue-600/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-600">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const Footer = () => {
  const { isDark } = useContext(ThemeContext);
  const [userId, setUserId] = useState('N/A'); // Default value

  useEffect(() => {
    // FIREBASE_AUTH_USAGE_FOOTER: Get current user ID if authenticated
    if (auth && auth.currentUser) {
      setUserId(auth.currentUser.uid);
    } else {
      // Fallback for anonymous or unauthenticated users
      setUserId(crypto.randomUUID()); // Generate a random ID for unauthenticated sessions
    }
  }, []);

  return (
    <footer
      className="bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://placehold.co/1920x200/00004d/e0e0e0?text=Queensy+Diani')`,
      }}
    >
      <div className="absolute inset-0 bg-blue-900/90"></div>
      <div className="relative container mx-auto px-4 py-12 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4 font-playfair">Queensy</h3>
            <p className="text-blue-100 mb-4">Your Luxurious Escape in Diani, Mombasa</p>
            <div className="space-y-2 text-sm text-blue-200">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Diani Beach Road, Diani, Mombasa, Kenya
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                954-383-8287
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@queensy.com
              </p>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { to: '/home', label: 'Home' },
                { to: '/properties', label: 'Book Now' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-blue-200 hover:text-blue-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Policies */}
          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Policies</h4>
            <div className="space-y-2 text-sm">
                              <a href="#" className="block text-blue-200 hover:text-blue-400 transition-colors">Rules & Regulations</a>
                <a href="#" className="block text-blue-200 hover:text-blue-400 transition-colors">Refund Policy</a>
                <a href="#" className="block text-blue-200 hover:text-blue-400 transition-colors">Privacy Policy</a>
                <a href="#" className="block text-blue-200 hover:text-blue-400 transition-colors">Terms of Service</a>
            </div>
          </div>
          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Follow Us</h4>
            <div className="flex space-x-4 mb-4">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/florida/', label: 'LinkedIn' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                // Assuming TikTok icon is not in lucide-react, use a placeholder or SVG if needed
                // { icon: 'Tiktok', href: '#', label: 'TikTok' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-blue-400 transition-colors hover:scale-110 transform duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
            <div className="text-xs text-blue-300">
              <p>User ID: {userId}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-700 mt-8 pt-8 text-center text-sm text-blue-200">
          <p>&copy; 2024 Queensy. All rights reserved. | Diani Beach, Mombasa, Kenya</p>
        </div>
      </div>
    </footer>
  );
};

const PropertyCard = ({ property, isReturningCustomer = false }) => {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg transition-all duration-500 group ${
      isDark 
        ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' 
        : 'bg-white/80 backdrop-blur-sm border border-gray-200/50'
    }`}>
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          {property.guests} Guests
        </div>
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-gray-900/90 to-transparent' : 'bg-gradient-to-t from-gray-50/90 to-transparent'}`}></div>
      </div>

      <div className="p-8">
        <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'} font-playfair group-hover:text-blue-500 transition-colors`}>
          {property.title}
        </h3>

        <p className={`mb-6 text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {property.shortDescription}
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
            isDark 
              ? 'bg-gray-700/50 text-gray-200 hover:bg-gray-700/70' 
              : 'bg-gray-100/50 text-gray-700 hover:bg-gray-100/70'
          } transition-colors`}>
            {property.bedrooms} Beds
          </span>
          <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
            isDark 
              ? 'bg-gray-700/50 text-gray-200 hover:bg-gray-700/70' 
              : 'bg-gray-100/50 text-gray-700 hover:bg-gray-100/70'
          } transition-colors`}>
            {property.bathrooms} Baths
          </span>
          <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
            isDark 
              ? 'bg-gray-700/50 text-gray-200 hover:bg-gray-700/70' 
              : 'bg-gray-100/50 text-gray-700 hover:bg-gray-100/70'
          } transition-colors`}>
            {property.maxGuests} Guests
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className={`px-3 py-1.5 rounded-full text-sm ${
                isDark 
                  ? 'bg-gray-700/30 text-gray-300 hover:bg-gray-700/50' 
                  : 'bg-gray-100/30 text-gray-600 hover:bg-gray-100/50'
              } transition-colors`}
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className={`px-3 py-1.5 rounded-full text-sm ${
              isDark 
                ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70' 
                : 'bg-gray-200/50 text-gray-500 hover:bg-gray-200/70'
            } transition-colors`}>
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex flex-col space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              {isReturningCustomer ? (
                <div className="space-y-2">
                  <p className={`text-sm line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    KES {property.originalPrice.toLocaleString()}
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    KES {property.discountedPrice.toLocaleString()}/night
                  </p>
                  <p className="text-sm text-green-400 flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Returning Customer Discount
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    KES {property.price.toLocaleString()}/night
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Best available rate
                  </p>
                </div>
              )}
            </div>
            <div className="property-card button-container">
              <button
                onClick={() => setShowBooking(!showBooking)}
                className={`btn btn-primary ${
                  isDark 
                    ? 'from-gray-100 to-white text-gray-900 hover:from-gray-200 hover:to-gray-100' 
                    : 'from-gray-900 to-gray-800 text-white hover:from-black hover:to-gray-900'
                }`}
              >
                {showBooking ? 'Hide Booking' : 'Book Now'}
              </button>
              <button
                onClick={() => navigate(`/properties/${property.id}`)}
                className={`btn btn-secondary ${
                  isDark 
                    ? 'border-gray-300 text-gray-300 hover:bg-gray-300/10' 
                    : 'border-gray-900 text-gray-900 hover:bg-gray-900/10'
                }`}
              >
                View Details
              </button>
            </div>
          </div>

          {/* Booking Calendar */}
          {showBooking && (
            <div className="mt-6 border-t border-gray-700/50 pt-6">
              <BookingCalendar property={property} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial }) => {
  const { isDark } = useContext(ThemeContext);
  return (
    <div className={`p-6 rounded-xl ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    } shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center mb-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h4 className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            {testimonial.name}
          </h4>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {testimonial.title}
          </p>
        </div>
      </div>

      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-blue-400 text-blue-400" />
        ))}
      </div>

      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'} italic`}>
        "{testimonial.quote}"
      </p>
    </div>
  );
};

const BlogCard = ({ post }) => {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-500 group ${
        isDark ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' : 'bg-white/80 backdrop-blur-sm border border-gray-200'
      }`}
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-gray-900/80 to-transparent' : 'bg-gradient-to-t from-white/80 to-transparent'}`}></div>
      </div>

      <div className="p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-blue-400/20 text-blue-400' : 'bg-blue-600/20 text-blue-600'}`}>
            {post.category}
          </span>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {post.date}
          </span>
        </div>

        <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair line-clamp-2 relative group-hover:text-blue-300 transition-colors`}>
          {post.title}
        </h3>

        <p className={`mb-6 text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
          {post.excerpt}
        </p>

        <button
          onClick={() => navigate(`/blog/${post.slug}`)}
          className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg ${
            isDark 
              ? 'bg-blue-400/10 text-blue-400 hover:bg-blue-400/20' 
              : 'bg-blue-600/10 text-blue-600 hover:bg-blue-600/20'
          } transition-all duration-300 group-hover:gap-3`}
        >
          Read More
          <ChevronRight className="w-4 h-4 transition-transform" />
        </button>
      </div>
    </motion.article>
  );
};

const PartnerMarquee = () => {
  const { isDark } = useContext(ThemeContext);
  return (
    <div className="overflow-hidden">
      <div className="flex animate-marquee gap-8 py-4">
        {[...partnersData, ...partnersData].map((partner, index) => (
          <div key={index} className="flex-shrink-0">
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const CaesarTextAnimator = () => {
  const { isDark } = useContext(ThemeContext);
  const phrases = [
    "EXPERIENCE LUXURY",
    "DISCOVER DIANI",
    "UNFORGETTABLE STAYS",
    "COASTAL PARADISE"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(phrases[0]);

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % phrases.length);
  }, 3000);

  return () => clearInterval(interval);
}, [phrases.length]);

  useEffect(() => {
    setDisplayText(phrases[currentIndex]);
  }, [currentIndex]);

  return (
    <div className="text-center py-16">
              <div className={`text-4xl md:text-6xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair tracking-wider`}>
        {displayText.split('').map((char, index) => (
          <span
            key={index}
            className="inline-block animate-pulse"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '2s'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  );
};

// Pages
const WorkInProgressPage = () => {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'Please note: This site is under active development. Some features may be incomplete.',
      visible: true
    },
    {
      id: 2,
      type: 'success',
      message: "We're adding new properties and features daily!",
      visible: true
    }
  ]);
  const dismissNotification = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, visible: false } : notif
      )
    );
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://placehold.co/1920x1080/0a0a0a/e0e0e0?text=Diani+Beach+Mombasa+Serene')`
      }}
    >
      <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/70'}`}></div>

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair animate-pulse`}>
          Work in Progress
        </h1>

        <p className={`text-xl md:text-2xl mb-8 ${isDark ? 'text-white' : 'text-gray-800'} leading-relaxed`}>
          We're meticulously crafting your ultimate Diani, Mombasa escape.
          While we perfect every detail, you can get a sneak peek!
        </p>

        <div className="mb-8 space-y-6">
          <ProgressBar progress={75} label="Property Listings" />
          <ProgressBar progress={60} label="Booking System" />
          <ProgressBar progress={90} label="Content Management" />
          <ProgressBar progress={45} label="User Experience" />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
          <button
            onClick={() => navigate('/home')}
            className="bg-gradient-to-r from-blue-400 to-blue                           -600 text-black font-bold py-4 px-8 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/30 transform hover:scale-105"
          >
            View Anyway
          </button>

          <button
            className={`${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105`}
          >
            Return
          </button>
        </div>

        <div className="max-w-md mx-auto">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              type={notification.type}
              message={notification.message}
              isVisible={notification.visible}
              onClose={() => dismissNotification(notification.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);

  // Beach-themed images for the globe gallery
  const globeImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop'
  ];

  return (
    <section className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen">
        <div className="grid lg:grid-cols-2 gap-12 min-h-screen items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-left space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white font-playfair leading-tight">
              Discover <span className="text-gradient">Luxury</span> in Every Corner of the World
        </h1>
            <p className="text-xl text-gray-300 max-w-xl">
              Experience unparalleled comfort and elegance at our handpicked locations across Diani Beach.
            </p>
            
            <div className="button-group pt-8">
              <motion.button
                onClick={() => navigate('/properties')}
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Properties
              </motion.button>
              <motion.button
                onClick={() => navigate('/contact')}
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column - Globe Gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <GlobeGallery images={globeImages} />
          </motion.div>
        </div>


      </div>
    </section>
  );
};

const HomePage = () => {
  const { isDark } = useContext(ThemeContext);
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);
  const [showDiscountNotification, setShowDiscountNotification] = useState(false);
  const { ref: propertyRef, isVisible: propertyVisible } = useScrollAnimation();
  const { ref: partnersRef, isVisible: partnersVisible } = useScrollAnimation();

  const handleDiscountClaim = () => {
    setIsReturningCustomer(true);
    setShowDiscountNotification(true);
    setTimeout(() => setShowDiscountNotification(false), 5000);
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} pt-20`}>
      <HeroSection />

      {/* Returning Customer Discount Section */}
      <section className="py-16 bg-gradient-to-r from-blue-400/10 to-blue-600/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
            Are you a returning customer?
          </h2>
          <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Claim your exclusive discount!
          </p>

          {!isReturningCustomer ? (
            <button
              onClick={handleDiscountClaim}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/30 transform hover:scale-105"
            >
              Claim My Discount
            </button>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 text-green-200">
                <Check className="w-6 h-6 mx-auto mb-2" />
                <p className="font-semibold">Welcome back!</p>
                <p className="text-sm">Enjoy KES 500 off your next booking!</p>
              </div>
            </div>
          )}

          {showDiscountNotification && (
            <div className="mt-4 max-w-md mx-auto">
              <NotificationCard
                type="success"
                message="Discount applied! You'll see reduced prices on all properties."
                isVisible={true}
                onClose={() => setShowDiscountNotification(false)}
              />
            </div>
          )}
        </div>
      </section>
      {/* Property Showcase */}
      <section ref={propertyRef} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
            Our Exclusive Properties
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 ${
            propertyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {propertiesData.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isReturningCustomer={isReturningCustomer}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <StatsSection />
      
      {/* Partners Section */}
      <section ref={partnersRef} className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
            Our Trusted Partners
          </h2>

          <div className={`transition-all duration-1000 ${
            partnersVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            <PartnerMarquee />
          </div>
        </div>
      </section>
      {/* Caesar Text Animator */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <CaesarTextAnimator />
        </div>
      </section>
      {/* Testimonials */}
      <section className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
            What Our Guests Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonialsData.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const PropertiesPage = () => {
  const { isDark } = useContext(ThemeContext);
  const [isReturningCustomer] = useState(false); // This would come from global state in a real app

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} pt-32 pb-16 min-h-screen`}>
      <div className="container mx-auto px-4">
        <h1 className={`text-4xl md:text-5xl font-bold text-center mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
          All Our Luxurious Stays
        </h1>
        <p className={`text-xl text-center mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          in Diani, Mombasa
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {propertiesData.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isReturningCustomer={isReturningCustomer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { goBack } = useBackNavigation();
  const { isDark } = useContext(ThemeContext);
  const property = propertiesData.find(p => p.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReturningCustomer] = useState(false); // This would come from global state in a real app

  if (!property) {
    return (
      <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} pt-32 pb-16 min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
          <button
            onClick={goBack}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const images = [property.image, property.image, property.image]; // Mock multiple images

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} pt-32 pb-16 min-h-screen`}>
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={goBack}
          className={`flex items-center gap-2 mb-6 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
          aria-label="Navigate back to properties page"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Properties
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative mb-4">
              <img
                src={images[currentImageIndex]}
                alt={property.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            {/* Video Section */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-8 text-center mb-8`}>
              <Play className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Property Walkthrough</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                Take a virtual tour of this beautiful property
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full max-w-md mx-auto py-3 px-6 rounded-xl font-medium bg-yellow-400 text-black hover:bg-yellow-300 transition-colors"
              >
                Book Now
              </motion.button>
            </div>

            {/* Booking Calendar */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-8 mb-8`}>
              <h3 className="text-xl font-semibold mb-6">Check Availability & Book</h3>
              <PropertyCalendar property={property} />
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
              {property.title}
            </h1>
            <div className="flex items-center gap-6 mb-6 text-sm">
              <span className="flex items-center gap-2">
                <Bed className="w-5 h-5" />
                {property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-2">
                <Bath className="w-5 h-5" />
                {property.bathrooms} Bathroom{property.bathrooms > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Up to {property.guests} Guests
              </span>
            </div>

            <div className="mb-6">
              {isReturningCustomer ? (
                <div className="space-y-2">
                  <p className={`text-lg line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    KES {property.originalPrice.toLocaleString()}/night
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    KES {property.discountedPrice.toLocaleString()}/night
                  </p>
                  <p className="text-sm text-green-400">Returning Customer Discount Applied!</p>
                </div>
              ) : (
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {property.price}
                </p>
              )}
            </div>

            <div className={`prose ${isDark ? 'prose-invert' : ''} mb-8`}>
              {property.fullDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-8 mb-8`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                Location
              </h3>
              <div className="aspect-video bg-gray-600 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-yellow-400" />
                  <p className="text-sm">Interactive map loading...</p>
                  <p className="text-xs mt-1">Diani Beach, Mombasa, Kenya</p>
                  {/* GOOGLE_MAPS_API_KEY_USAGE: Example of how to embed Google Maps */}
                  {/* <iframe
                    width="100%"
                    height="300"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=Diani+Beach+Kenya&zoom=12`}
                    title="Google Map of Diani Beach"
                  ></iframe> */}
                </div>
              </div>
              <div className="mt-4 text-sm">
                <p className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-blue-400" />
                  Walking distance to pristine Diani Beach
                </p>
                <p className="flex items-center gap-2 mt-2">
                  <Car className="w-4 h-4 text-gray-400" />
                  20 minutes drive to Mombasa city center
                </p>
              </div>
            </div>

            {/* Book Now Button */}
            <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/30 transform hover:scale-105">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};





const AboutUsPage = () => {
  const { isDark } = useContext(ThemeContext);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} pt-32 pb-16 min-h-screen`}>
      <div className="container mx-auto px-4">
        <h1 className={`text-4xl md:text-5xl font-bold text-center mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
          About Queensy
        </h1>
        <p className={`text-xl text-center mb-16 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Our Story
        </p>
        {/* Our Story Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-8 md:p-12`}>
              <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
                Our Story
              </h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Queensy was born from a passion for authentic Kenyan hospitality and the breathtaking beauty of Diani Beach.
                  Our journey began with a simple vision: to create extraordinary accommodations that capture the essence of
                  coastal Kenya while providing unparalleled comfort and service.
                </p>
                <p>
                  Located in the heart of Diani, just steps from pristine white-sand beaches and the crystal-clear waters of
                  the Indian Ocean, our properties offer guests an immersive experience in one of Africa's most stunning
                  coastal destinations.
                </p>
                <p>
                  We believe that travel should be transformative, and every stay with us is designed to create lasting
                  memories while supporting the local community and preserving the natural beauty that makes this region
                  so special.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* George Charles Section */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
              Meet the Visionary: George Charles
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-8 mb-6`}>
                  <blockquote className={`text-xl italic text-center ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-4`}>
                    "Hospitality is not just about providing a place to stay; it's about creating a home away from home
                    where every guest feels the warmth of Kenyan culture."
                  </blockquote>
                  <cite className="text-center block text-sm">- George Charles, Founder</cite>
                </div>

                <div className="space-y-4 text-lg leading-relaxed">
                  <p>
                    George Charles's journey into hospitality began during his childhood in coastal Kenya, where he witnessed
                    the transformative power of genuine warmth and authentic cultural exchange. His vision for Queensy stems
                    from years of traveling the world and understanding what makes accommodations truly exceptional.
                  </p>
                  <p>
                    With a background in business and a deep love for his homeland, George founded Queensy to showcase the
                    very best of Kenyan coastal living. His hands-on approach ensures that every guest experience reflects
                    the values of excellence, authenticity, and community that define our brand.
                  </p>
                  <p>
                    Looking towards the future, George is always seeking like-minded partners who share his vision of
                    sustainable, community-focused tourism that benefits both guests and locals alike.
                  </p>
                </div>

                <button
                  onClick={() => setShowPartnerModal(true)}
                  className="mt-6 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/30"
                >
                  Partner Inquiry
                </button>
              </div>

              <div className="order-1 lg:order-2">
                <img
                  src="https://placehold.co/400x500/0a0a0a/e0e0e0?text=George+Charles"
                  alt="George Charles, Founder"
                  className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Wendy Section */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
              A Special Tribute: Our Guiding Spirit, Wendy
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://placehold.co/400x250/0a0a0a/e0e0e0?text=Serene+Wendy"
                  alt="Wendy - Our Guiding Spirit"
                  className="w-full rounded-xl shadow-lg"
                />
              </div>

              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Wendy's influence permeates every aspect of Queensy, from our commitment to excellence to our deep
                  connection with the local community. Though no longer with us in person, her spirit continues to
                  guide our mission and values.
                </p>
                <p>
                  She believed that true hospitality comes from the heart, and that every guest should feel not just
                  welcomed, but truly at home. This philosophy is embedded in every detail of our properties, from
                  the carefully chosen furnishings to the warm greetings our guests receive.
                </p>
                <p>
                  Wendy's Penthouse, our crown jewel, stands as a testament to her vision of luxury that doesn't
                  compromise on warmth and authenticity. Her legacy lives on in every sunset viewed from our
                  properties and every smile shared between our team and our guests.
                </p>
                <p>
                  The serene beauty and peaceful atmosphere that guests consistently praise in our reviews reflect
                  Wendy's gentle spirit and her belief that travel should be a source of renewal and inspiration.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl`}>
          <div className="container mx-auto px-4">
            <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-yellow-400' : 'text-yellow-600'} font-playfair`}>
              What Our Guests Say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonialsData.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>
        </section>
        {/* Partners Section */}
        <section className="mt-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDark ? 'text-yellow-400' : 'text-yellow-600'} font-playfair`}>
            Our Trusted Partners
          </h2>
          <PartnerMarquee />
        </section>
      </div>
      {/* Partner Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 max-w-md w-full`}>
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
              Partner with Queensy
            </h3>
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We're always looking for like-minded partners to join our mission of providing exceptional
              hospitality experiences in coastal Kenya.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPartnerModal(false)}
                className={`flex-1 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} py-2 px-4 rounded-lg transition-colors`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPartnerModal(false);
                  // In a real app, this would open a contact form or navigate to contact page
                }}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ContactPage = () => {
  const { isDark } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Input validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }
    
    if (!db) {
      setErrorMessage("Database not initialized. Cannot submit message.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    try {
      // Save to Firebase
      await addDoc(collection(db, `/artifacts/${appId}/public/data/contactSubmissions`), {
        ...formData,
        timestamp: serverTimestamp(),
        userId: auth.currentUser ? auth.currentUser.uid : 'anonymous'
      });

      // Send email via EmailJS (replace with your actual EmailJS credentials)
      try {
        await emailjs.send(
          'service_queensy', // Replace with your EmailJS service ID
          'template_contact', // Replace with your EmailJS template ID
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            subject: formData.subject,
            to_name: 'Queensy Team'
          },
          'public_key_queensy' // Replace with your EmailJS public key
        );
        // Email sent successfully via EmailJS
      } catch (emailError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('EmailJS error:', emailError);
        }
        // Continue with success even if email fails
      }

      // Contact form submitted and email sent
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrorMessage('');
      setShowError(false);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error submitting contact form:", error);
      }
      setErrorMessage(`Failed to send message: ${error.message}`);
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} pt-32 pb-16 min-h-screen`}>
      <div className="container mx-auto px-4">
        <h1 className={`text-4xl md:text-5xl font-bold text-center mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
          Get in Touch
        </h1>
        <p className={`text-xl text-center mb-16 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          with Queensy
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
              Contact Information
            </h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>954-383-8287</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>info@queensy.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Diani Beach Road<br />
                    Diani, Mombasa, Kenya
                  </p>
                </div>
              </div>
            </div>
            {/* QR Code */}
            <div className="text-center mb-8">
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Quick Call QR Code
              </h3>
              <img
                src="https://placehold.co/150x150/0a0a0a/d4af37?text=Call+954-383-8287"
                alt="QR Code to call 954-383-8287"
                className="mx-auto rounded-lg"
              />
            </div>
            {/* Google Map Placeholder */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-6`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Our Location
              </h3>
              <div className="aspect-video bg-gray-600 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-yellow-400" />
                  <p className="text-sm">Interactive map loading...</p>
                  <p className="text-xs mt-1">Diani Beach, Mombasa, Kenya</p>
                  {/* GOOGLE_MAPS_API_KEY_USAGE: Example of how to embed Google Maps */}
                  {/* <iframe
                    width="100%"
                    height="300"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=Diani+Beach+Kenya&zoom=12`}
                    title="Google Map of Diani Beach"
                  ></iframe> */}
                </div>
              </div>
              <div className="mt-4 text-sm">
                <p className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-blue-400" />
                  Walking distance to pristine Diani Beach
                </p>
                <p className="flex items-center gap-2 mt-2">
                  <Car className="w-4 h-4 text-gray-400" />
                  20 minutes drive to Mombasa city center
                </p>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div>
            <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
              Send us a Message
            </h2>
            {showSuccess && (
              <div className="mb-6">
                <NotificationCard
                  type="success"
                  message="Thank you for your message! We'll get back to you soon."
                  isVisible={true}
                  onClose={() => setShowSuccess(false)}
                />
              </div>
            )}
            {showError && (
              <div className="mb-6">
                <NotificationCard
                  type="error"
                  message={errorMessage}
                  isVisible={true}
                  onClose={() => setShowError(false)}
                />
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    isDark
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    isDark
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    isDark
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    isDark
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignUpPage = () => {
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setShowError(false);
    setShowSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setShowError(true);
      return;
    }

    if (!auth) {
      setErrorMessage("Firebase Auth not initialized. Cannot sign up.");
      setShowError(true);
      return;
    }

    try {
      // FIREBASE_AUTH_USAGE_SIGNUP: Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // FIREBASE_FIRESTORE_USER_DATA: Store user data in Firestore
      await addDoc(collection(db, `/artifacts/${appId}/users/${user.uid}/profile`), {
        name: formData.name,
        email: formData.email,
        createdAt: serverTimestamp()
      });

      // Send welcome email via EmailJS
      try {
        await emailjs.send(
          'service_queensy', // Replace with your EmailJS service ID
          'template_welcome', // Replace with your EmailJS template ID
          {
            to_name: formData.name,
            to_email: formData.email,
            message: `Welcome to Queensy! We're excited to have you join our community.`
          },
          'public_key_queensy' // Replace with your EmailJS public key
        );
        // Welcome email sent successfully
      } catch (emailError) {
        console.error('EmailJS welcome email error:', emailError);
        // Continue with success even if email fails
      }

      // User signed up and data saved successfully
      setShowSuccess(true);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        setShowSuccess(false);
        // Optionally navigate to a dashboard or home page after successful signup
        // navigate('/home');
      }, 3000);

    } catch (error) {
      console.error("Error signing up:", error);
      let msg = "Failed to sign up. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        msg = "This email is already in use. Please use a different email or log in.";
      } else if (error.code === 'auth/weak-password') {
        msg = "Password is too weak. Please use a stronger password (at least 6 characters).";
      }
      setErrorMessage(msg);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} pt-32 pb-16 min-h-screen flex items-center justify-center`}>
      <div className="container mx-auto px-4 max-w-lg">
        <h1 className={`text-3xl md:text-4xl font-bold text-center mb-6 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-playfair`}>
          Create Your Queensy Account
        </h1>
        {showSuccess && (
          <div className="mb-6">
            <NotificationCard
              type="success"
              message="Account created successfully! You can now log in."
              isVisible={true}
              onClose={() => setShowSuccess(false)}
            />
          </div>
        )}
        {showError && (
          <div className="mb-6">
            <NotificationCard
              type="error"
              message={errorMessage}
              isVisible={true}
              onClose={() => setShowError(false)}
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className={`p-6 md:p-8 rounded-xl shadow-lg space-y-5 ${isDark ? 'bg-gray-800/90 backdrop-blur-sm border border-gray-700' : 'bg-white/90 backdrop-blur-sm border border-gray-200'}`}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 transform hover:scale-105"
          >
            Sign Up
          </button>
          <p className={`text-center text-sm mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login here</Link>
          </p>
        </form>
      </div>
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
        setLoadingMessage("Initializing Firebase...");
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Loading animation */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-600 rounded-full animate-ping mx-auto"></div>
          </div>
          
          {/* Progress bar */}
          <div className="w-64 bg-gray-800 rounded-full h-2 mx-auto">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
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
            <h2 className="text-2xl font-display font-bold text-red-400">
              Application Error
            </h2>
            <p className="text-gray-300 font-body">
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
        <div className="App">
          <Header />
          <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-300">Loading...</p>
              </div>
            </div>
          }>
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
              <Route path="/work-in-progress" element={<WorkInProgressPage />} />
            </Routes>
          </Suspense>
          <Footer />
          <WhatsAppFloatingButton />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;