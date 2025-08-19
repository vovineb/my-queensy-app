import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Backend service class
class BackendService {
  // Properties Management
  async addProperty(propertyData) {
    try {
      const docRef = await addDoc(collection(db, 'properties'), {
        ...propertyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  }

  async getProperties() {
    try {
      const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  }

  async updateProperty(propertyId, updates) {
    try {
      const propertyRef = doc(db, 'properties', propertyId);
      await updateDoc(propertyRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  }

  async deleteProperty(propertyId) {
    try {
      await deleteDoc(doc(db, 'properties', propertyId));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  }

  // Bookings Management
  async addBooking(bookingData) {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
  }

  async getBookings(propertyId = null) {
    try {
      let q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      if (propertyId) {
        q = query(collection(db, 'bookings'), where('propertyId', '==', propertyId));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting bookings:', error);
      throw error;
    }
  }

  async updateBookingStatus(bookingId, status) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // User Management
  async createUser(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Add user data to Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        ...userData,
        createdAt: serverTimestamp()
      });
      
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async signInUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOutUser() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Contact/Inquiries Management
  async addInquiry(inquiryData) {
    try {
      const docRef = await addDoc(collection(db, 'inquiries'), {
        ...inquiryData,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding inquiry:', error);
      throw error;
    }
  }

  async getInquiries() {
    try {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting inquiries:', error);
      throw error;
    }
  }

  // File Upload
  async uploadFile(file, path) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Real-time listeners
  onPropertiesChange(callback) {
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const properties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(properties);
    });
  }

  onBookingsChange(callback, propertyId = null) {
    let q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    if (propertyId) {
      q = query(collection(db, 'bookings'), where('propertyId', '==', propertyId));
    }
    return onSnapshot(q, (querySnapshot) => {
      const bookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(bookings);
    });
  }

  onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
}

// Export singleton instance
export const backendService = new BackendService();
export { db, auth, storage };
