# 🔥 Firebase Setup Guide for Queensy App

## 📋 **Prerequisites**
1. **Firebase Console Account** - Create at [console.firebase.google.com](https://console.firebase.google.com)
2. **Node.js** - For development
3. **EmailJS Account** - For email functionality

---

## 🚀 **Step 1: Firebase Project Setup**

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `queensy-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### 1.2 Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Enable these sign-in methods:
   - ✅ **Email/Password**
   - ✅ **Anonymous** (for demo users)
4. Click **"Save"**

### 1.3 Enable Firestore Database
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select your preferred location
5. Click **"Done"**

### 1.4 Get Firebase Config
1. Go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click **"Add app"** → **Web app**
4. Register app with name: `Queensy Web App`
5. Copy the config object

---

## 🔧 **Step 2: Update Firebase Configuration**

### 2.1 Replace Firebase Config in App.jsx
Replace the `firebaseConfigDefaults` in `src/App.jsx`:

```javascript
const firebaseConfigDefaults = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2.2 Set Up Firestore Security Rules
In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow public read access to contact submissions
    match /artifacts/{appId}/public/data/contactSubmissions/{document} {
      allow read: if request.auth != null;
      allow write: if true; // Anyone can submit contact forms
    }
    
    // Allow public read access to blog posts
    match /artifacts/{appId}/public/data/blogPosts/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📧 **Step 3: EmailJS Integration**

### 3.1 Install EmailJS
```bash
npm install @emailjs/browser
```

### 3.2 Create EmailJS Account
1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for free account
3. Create email templates for:
   - Contact form submissions
   - Booking confirmations
   - Sign-up confirmations

### 3.3 Add EmailJS to Contact Form
Update the ContactPage in `src/App.jsx`:

```javascript
import emailjs from '@emailjs/browser';

// In ContactPage component, update handleSubmit:
const handleSubmit = async (e) => {
  e.preventDefault();
  
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

    // Send email via EmailJS
    await emailjs.send(
      'YOUR_SERVICE_ID', // EmailJS service ID
      'YOUR_TEMPLATE_ID', // EmailJS template ID
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        subject: formData.subject
      },
      'YOUR_PUBLIC_KEY' // EmailJS public key
    );

    console.log('Contact form submitted and email sent');
    setShowSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrorMessage('');
    setShowError(false);
    setTimeout(() => setShowSuccess(false), 5000);
  } catch (error) {
    console.error("Error submitting contact form:", error);
    setErrorMessage(`Failed to send message: ${error.message}`);
    setShowError(true);
    setShowSuccess(false);
    setTimeout(() => setShowError(false), 5000);
  }
};
```

---

## 🔐 **Step 4: Authentication Setup**

### 4.1 Enable Anonymous Authentication
The app already uses anonymous authentication for demo users. This allows users to:
- Browse properties without signing up
- Use the booking calendar
- Submit contact forms

### 4.2 User Registration Flow
The sign-up process:
1. User fills registration form
2. Firebase creates user account
3. User data saved to Firestore
4. Welcome email sent via EmailJS

### 4.3 Authentication States
- **Anonymous**: Can browse, contact, view properties
- **Registered**: Can book, save preferences, get notifications

---

## 📊 **Step 5: Database Structure**

### 5.1 Firestore Collections
```
artifacts/
  {appId}/
    users/
      {userId}/
        profile/
          - name
          - email
          - createdAt
        bookings/
          - propertyId
          - checkIn
          - checkOut
          - totalCost
          - status
    public/
      data/
        contactSubmissions/
          - name
          - email
          - message
          - timestamp
        blogPosts/
          - title
          - content
          - author
          - publishedAt
```

---

## 🚨 **Step 6: Fix the "auth/admin-restricted-operation" Error**

### 6.1 Common Causes
1. **Anonymous auth not enabled**
2. **Wrong API key**
3. **Firestore rules too restrictive**
4. **Project not properly initialized**

### 6.2 Solution Steps
1. **Enable Anonymous Auth**:
   - Firebase Console → Authentication → Sign-in method
   - Enable "Anonymous" authentication

2. **Check API Key**:
   - Verify the API key in your config matches Firebase Console
   - Ensure project ID is correct

3. **Update Firestore Rules**:
   - Use the rules provided above
   - Allow anonymous users to read public data

4. **Test Authentication**:
   ```javascript
   // Add this to test Firebase connection
   useEffect(() => {
     if (auth) {
       signInAnonymously(auth)
         .then((result) => {
           console.log('Anonymous sign-in successful:', result.user.uid);
         })
         .catch((error) => {
           console.error('Anonymous sign-in failed:', error);
         });
     }
   }, [auth]);
   ```

---

## 🧪 **Step 7: Testing**

### 7.1 Test Firebase Connection
1. Open browser console (F12)
2. Check for Firebase initialization logs
3. Verify anonymous authentication works
4. Test contact form submission

### 7.2 Test EmailJS
1. Submit contact form
2. Check email received
3. Verify EmailJS dashboard shows sent emails

### 7.3 Test Database
1. Check Firestore Console for new documents
2. Verify data structure matches expected format
3. Test user registration flow

---

## 🔧 **Step 8: Environment Variables (Optional)**

Create `.env` file in project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

Then update `firebaseConfigDefaults`:
```javascript
const firebaseConfigDefaults = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

---

## ✅ **Expected Results**

After following this guide:
- ✅ Firebase authentication works (anonymous + email/password)
- ✅ Contact forms save to Firestore and send emails
- ✅ User registration creates accounts and sends welcome emails
- ✅ Booking system saves to database
- ✅ No more "auth/admin-restricted-operation" errors
- ✅ Full functionality with real backend

---

## 🆘 **Troubleshooting**

### If still getting auth errors:
1. **Clear browser cache**
2. **Check Firebase Console** for any error messages
3. **Verify project settings** match your config
4. **Test in incognito mode**

### If emails not sending:
1. **Check EmailJS template** configuration
2. **Verify service ID and template ID**
3. **Check EmailJS dashboard** for errors

### If database not working:
1. **Check Firestore rules**
2. **Verify collection paths**
3. **Check Firebase Console** for permission errors

---

**Need help?** Check the browser console (F12) for specific error messages and refer to Firebase/EmailJS documentation. 