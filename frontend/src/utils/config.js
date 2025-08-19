// Configuration utility for environment variables
export const config = {
  // Firebase Configuration
  firebase: {
    apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyB0m_RLdLwrN4H00pRcZ_EOMCq6bcsg68g',
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'my-queensy-app.firebaseapp.com',
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'my-queensy-app',
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'my-queensy-app.firebasestorage.app',
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '199451469300',
    appId: process.env.VITE_FIREBASE_APP_ID || '1:199451469300:web:c2479e388c20b99ca6c5a1'
  },
  
  // EmailJS Configuration
  emailjs: {
    serviceId: process.env.VITE_EMAILJS_SERVICE_ID || 'service_queensy',
    templateId: process.env.VITE_EMAILJS_TEMPLATE_ID || 'template_contact',
    publicKey: process.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key_queensy'
  },
  
  // Google Maps Configuration
  googleMaps: {
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'
  },
  
  // App Configuration
  app: {
    name: 'Queensy',
    version: process.env.VITE_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  }
};

// Validate required configuration
export const validateConfig = () => {
  const errors = [];
  
  if (!config.firebase.projectId || config.firebase.projectId === 'YOUR_PROJECT_ID') {
    errors.push('Firebase Project ID is not configured');
  }
  
  if (!config.emailjs.serviceId || config.emailjs.serviceId === 'YOUR_SERVICE_ID') {
    errors.push('EmailJS Service ID is not configured');
  }
  
  if (!config.googleMaps.apiKey || config.googleMaps.apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    errors.push('Google Maps API Key is not configured');
  }
  
  if (errors.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('Configuration warnings:', errors);
  }
  
  return errors.length === 0;
};

export default config; 