// Firebase Authentication Functions
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './config';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    return {
      success: true,
      user: userCredential.user,
      message: 'Account created successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      message: 'Signed in successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user,
      message: 'Signed in with Google successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

// Sign in anonymously
export const signInAnonymous = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return {
      success: true,
      user: userCredential.user,
      message: 'Signed in anonymously!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Signed out successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: 'Error signing out'
    };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!auth.currentUser;
};

// Check if user is anonymous
export const isAnonymous = () => {
  return auth.currentUser?.isAnonymous || false;
};

// Get user display name
export const getUserDisplayName = () => {
  const user = auth.currentUser;
  return user?.displayName || user?.email || 'Anonymous User';
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};
