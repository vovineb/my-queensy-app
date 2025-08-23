// Firebase Authentication Utilities
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen for authentication state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Export auth instance for direct access if needed
export { auth };