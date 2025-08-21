import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Check, AlertCircle } from 'lucide-react';

const SignUpForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      setErrors({ submit: error.message });
    }
    setIsSubmitting(false);
  };

  const inputClasses = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors";
  const labelClasses = "flex items-center gap-2 text-gray-300 text-sm font-medium mb-1";

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-md w-full mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Name Field */}
      <div>
        <label htmlFor="name" className={labelClasses}>
          <User className="w-4 h-4" />
          <span>Full Name</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClasses}
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className={labelClasses}>
          <Mail className="w-4 h-4" />
          <span>Email Address</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClasses}
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className={labelClasses}>
          <Lock className="w-4 h-4" />
          <span>Password</span>
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className={inputClasses}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className={labelClasses}>
          <Lock className="w-4 h-4" />
          <span>Confirm Password</span>
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className={inputClasses}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
          isSubmitting
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-400 hover:bg-blue-500 text-[var(--vintage-brown)]'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
            />
            Processing...
          </span>
        ) : (
          'Create Account'
        )}
      </motion.button>

      {/* Success Message */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400 flex items-center gap-2"
        >
          <Check className="w-5 h-5" />
          <span>Account created successfully!</span>
        </motion.div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          <span>{errors.submit}</span>
        </motion.div>
      )}
    </motion.form>
  );
};

export default SignUpForm;