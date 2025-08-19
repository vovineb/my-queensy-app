# Queensy App - Project Structure

## 📁 **Organized Project Architecture**

```
my-queensy-app/
├── 📂 backend/                    # Server-side logic
│   ├── 📂 config/
│   │   └── firebase.js           # Firebase Admin SDK configuration
│   ├── 📂 services/
│   │   ├── bookingService.js     # Backend booking operations
│   │   └── emailService.js       # Server-side email service
│   ├── 📂 utils/
│   │   └── helpers.js            # Backend utility functions
│   ├── 📂 middleware/
│   │   └── auth.js               # Authentication middleware
│   └── 📂 models/
│       └── Booking.js            # Booking data model
│
├── 📂 frontend/                   # Client-side application
│   └── 📂 src/
│       ├── 📂 config/
│       │   ├── firebase.js       # Frontend Firebase config
│       │   ├── auth.js           # Client auth functions
│       │   ├── database.js       # Client database operations
│       │   └── storage.js        # Client storage functions
│       ├── 📂 services/
│       │   ├── bookingService.js # Frontend booking service
│       │   ├── emailService.js   # EmailJS integration
│       │   └── paymentService.js # Payment processing
│       ├── 📂 utils/
│       │   └── validation.js     # Form validation utilities
│       └── 📂 components/
│           ├── 📂 booking/
│           │   ├── BookingForm.jsx
│           │   └── BookingSuccess.jsx
│           └── 📂 payment/
│               └── PaymentModal.jsx
│
├── 📂 functions/                  # Firebase Cloud Functions
│   ├── index.js                  # Cloud Functions entry point
│   └── package.json              # Functions dependencies
│
├── 📂 src/                       # Main React application
│   ├── 📂 components/            # React components
│   ├── 📂 contexts/              # React contexts
│   ├── 📂 data/                  # Static data
│   └── App.jsx                   # Main app component
│
├── 📂 public/                    # Static assets
├── 📄 .env                       # Environment variables
├── 📄 firebase.json              # Firebase configuration
├── 📄 database.rules.json        # Database security rules
├── 📄 storage.rules              # Storage security rules
└── 📄 package.json               # Project dependencies
```

## 🎯 **Architecture Benefits**

### **Backend Separation**
- **`backend/`**: Server-side logic, admin operations, secure email handling
- **Firebase Admin SDK**: Full database access, user management
- **Node.js services**: Booking management, email notifications
- **Authentication middleware**: Secure API endpoints

### **Frontend Organization**  
- **`frontend/src/config/`**: Client Firebase configuration
- **`frontend/src/services/`**: Client-side API calls
- **`frontend/src/utils/`**: Form validation, helpers
- **React components**: UI components with clean separation

### **Cloud Functions**
- **`functions/`**: Serverless backend functions
- **Automated triggers**: Email notifications, webhooks
- **Scheduled tasks**: Booking reminders, cleanup

## 🔧 **Key Features**

### **Security**
- Backend uses Firebase Admin SDK with full privileges
- Frontend uses client SDK with security rules
- Authentication middleware protects sensitive operations
- Input validation and sanitization

### **Scalability**
- Modular service architecture
- Separation of concerns
- Easy to add new features
- Clean API boundaries

### **Maintainability**
- Clear folder structure
- Consistent naming conventions
- Separated business logic
- Reusable components and utilities

## 🚀 **Development Workflow**

1. **Backend Development**: Work in `backend/` folder
2. **Frontend Development**: Work in `frontend/src/` and `src/`
3. **Cloud Functions**: Deploy from `functions/` folder
4. **Testing**: Use Firebase emulators for local development

This structure provides a professional, scalable foundation for your Queensy booking application.
