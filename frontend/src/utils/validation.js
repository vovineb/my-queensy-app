// Validation Utilities
export const validation = {
  // Email validation
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      valid: emailRegex.test(email),
      message: emailRegex.test(email) ? '' : 'Please enter a valid email address'
    };
  },

  // Phone number validation (Kenyan format)
  phone: (phone) => {
    const kenyanPhoneRegex = /^(?:254|\+254|0)?[17]\d{8}$/;
    return {
      valid: kenyanPhoneRegex.test(phone),
      message: kenyanPhoneRegex.test(phone) ? '' : 'Please enter a valid Kenyan phone number'
    };
  },

  // Name validation
  name: (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return {
      valid: nameRegex.test(name),
      message: nameRegex.test(name) ? '' : 'Name must be 2-50 characters and contain only letters'
    };
  },

  // Password validation
  password: (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`At least ${minLength} characters`);
    if (!hasUpperCase) errors.push('One uppercase letter');
    if (!hasLowerCase) errors.push('One lowercase letter');
    if (!hasNumbers) errors.push('One number');
    if (!hasSpecialChar) errors.push('One special character');

    return {
      valid: errors.length === 0,
      message: errors.length === 0 ? '' : `Password must contain: ${errors.join(', ')}`
    };
  },

  // Date validation
  date: (date, minDate = null, maxDate = null) => {
    const dateObj = new Date(date);
    const now = new Date();
    
    if (isNaN(dateObj.getTime())) {
      return {
        valid: false,
        message: 'Please enter a valid date'
      };
    }

    if (minDate && dateObj < new Date(minDate)) {
      return {
        valid: false,
        message: `Date must be after ${new Date(minDate).toLocaleDateString()}`
      };
    }

    if (maxDate && dateObj > new Date(maxDate)) {
      return {
        valid: false,
        message: `Date must be before ${new Date(maxDate).toLocaleDateString()}`
      };
    }

    return {
      valid: true,
      message: ''
    };
  },

  // Check-in/Check-out date validation
  bookingDates: (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if dates are valid
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return {
        valid: false,
        message: 'Please enter valid dates'
      };
    }

    // Check-in must be today or later
    if (checkInDate < today) {
      return {
        valid: false,
        message: 'Check-in date cannot be in the past'
      };
    }

    // Check-out must be after check-in
    if (checkOutDate <= checkInDate) {
      return {
        valid: false,
        message: 'Check-out date must be after check-in date'
      };
    }

    // Maximum booking duration (e.g., 30 days)
    const maxDays = 30;
    const daysDiff = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (daysDiff > maxDays) {
      return {
        valid: false,
        message: `Maximum booking duration is ${maxDays} days`
      };
    }

    return {
      valid: true,
      message: ''
    };
  },

  // Guest count validation
  guests: (guestCount, maxGuests = 10) => {
    const guests = parseInt(guestCount);
    
    if (isNaN(guests) || guests < 1) {
      return {
        valid: false,
        message: 'At least 1 guest is required'
      };
    }

    if (guests > maxGuests) {
      return {
        valid: false,
        message: `Maximum ${maxGuests} guests allowed`
      };
    }

    return {
      valid: true,
      message: ''
    };
  },

  // Required field validation
  required: (value, fieldName = 'This field') => {
    const isValid = value !== null && value !== undefined && value.toString().trim() !== '';
    return {
      valid: isValid,
      message: isValid ? '' : `${fieldName} is required`
    };
  },

  // URL validation
  url: (url) => {
    try {
      new URL(url);
      return {
        valid: true,
        message: ''
      };
    } catch {
      return {
        valid: false,
        message: 'Please enter a valid URL'
      };
    }
  },

  // Credit card validation (basic)
  creditCard: (cardNumber) => {
    const cleaned = cardNumber.replace(/\s+/g, '');
    const cardRegex = /^\d{13,19}$/;
    
    if (!cardRegex.test(cleaned)) {
      return {
        valid: false,
        message: 'Please enter a valid card number'
      };
    }

    // Luhn algorithm check
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }

    const isValid = sum % 10 === 0;
    return {
      valid: isValid,
      message: isValid ? '' : 'Please enter a valid card number'
    };
  },

  // CVV validation
  cvv: (cvv, cardType = 'visa') => {
    const cvvLength = cardType === 'amex' ? 4 : 3;
    const cvvRegex = new RegExp(`^\\d{${cvvLength}}$`);
    
    return {
      valid: cvvRegex.test(cvv),
      message: cvvRegex.test(cvv) ? '' : `CVV must be ${cvvLength} digits`
    };
  },

  // Expiry date validation
  expiryDate: (expiry) => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    
    if (!expiryRegex.test(expiry)) {
      return {
        valid: false,
        message: 'Please enter expiry date in MM/YY format'
      };
    }

    const [month, year] = expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    
    if (expiryDate < now) {
      return {
        valid: false,
        message: 'Card has expired'
      };
    }

    return {
      valid: true,
      message: ''
    };
  },

  // Message/comment validation
  message: (message, minLength = 10, maxLength = 1000) => {
    const length = message.trim().length;
    
    if (length < minLength) {
      return {
        valid: false,
        message: `Message must be at least ${minLength} characters`
      };
    }

    if (length > maxLength) {
      return {
        valid: false,
        message: `Message must be less than ${maxLength} characters`
      };
    }

    return {
      valid: true,
      message: ''
    };
  },

  // File validation
  file: (file, options = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      required = false
    } = options;

    if (!file) {
      return {
        valid: !required,
        message: required ? 'File is required' : ''
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        message: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    return {
      valid: true,
      message: ''
    };
  }
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  for (const [field, value] of Object.entries(formData)) {
    if (rules[field]) {
      const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
      
      for (const rule of fieldRules) {
        const result = rule(value);
        if (!result.valid) {
          errors[field] = result.message;
          isValid = false;
          break; // Stop at first error for this field
        }
      }
    }
  }

  return {
    valid: isValid,
    errors
  };
};

// Real-time validation hook for React components
export const useValidation = (initialState = {}) => {
  const [errors, setErrors] = React.useState(initialState);
  const [touched, setTouched] = React.useState({});

  const validateField = (name, value, rules) => {
    if (!rules) return;

    const fieldRules = Array.isArray(rules) ? rules : [rules];
    let error = '';

    for (const rule of fieldRules) {
      const result = rule(value);
      if (!result.valid) {
        error = result.message;
        break;
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return error === '';
  };

  const markFieldTouched = (name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const clearErrors = () => {
    setErrors({});
    setTouched({});
  };

  const hasErrors = Object.values(errors).some(error => error !== '');
  const isFormValid = !hasErrors && Object.keys(touched).length > 0;

  return {
    errors,
    touched,
    validateField,
    markFieldTouched,
    clearErrors,
    hasErrors,
    isFormValid
  };
};

// Booking form validation rules
export const bookingValidationRules = {
  name: [validation.required, validation.name],
  email: [validation.required, validation.email],
  phone: [validation.required, validation.phone],
  checkIn: [(value) => validation.required(value, 'Check-in date')],
  checkOut: [(value) => validation.required(value, 'Check-out date')],
  guests: [validation.required, validation.guests],
  message: [(value) => validation.message(value, 0, 500)] // Optional message
};

// Contact form validation rules
export const contactValidationRules = {
  name: [validation.required, validation.name],
  email: [validation.required, validation.email],
  subject: [(value) => validation.required(value, 'Subject')],
  message: [validation.required, (value) => validation.message(value, 10, 1000)]
};

// User registration validation rules
export const registrationValidationRules = {
  name: [validation.required, validation.name],
  email: [validation.required, validation.email],
  password: [validation.required, validation.password],
  confirmPassword: [(value, formData) => {
    if (value !== formData.password) {
      return { valid: false, message: 'Passwords do not match' };
    }
    return { valid: true, message: '' };
  }]
};

// Payment form validation rules
export const paymentValidationRules = {
  cardNumber: [validation.required, validation.creditCard],
  expiryDate: [validation.required, validation.expiryDate],
  cvv: [validation.required, validation.cvv],
  cardholderName: [validation.required, validation.name]
};

export default validation;
