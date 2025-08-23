import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setAuthError('');
    
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      setAuthError('Invalid email or password. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const handleAnonymousLogin = async () => {
    setIsSubmitting(true);
    setAuthError('');
    
    try {
      await signInAnonymously(auth);
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      setAuthError('Failed to sign in anonymously. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const inputClasses = "w-full px-4 py-3 bg-[var(--vintage-cream)] border border-[var(--vintage-brown)]/30 rounded-lg text-[var(--vintage-brown)] placeholder-[var(--vintage-brown)]/60 focus:outline-none focus:border-[var(--vintage-sage)] transition-colors";
  const labelClasses = "flex items-center gap-2 text-[var(--tech-white)] text-sm font-medium mb-1";

  return (
    <div className="min-h-screen bg-[var(--vintage-cream)] pt-20 flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full bg-[var(--vintage-sage)] backdrop-blur-md rounded-3xl p-8 border border-[var(--vintage-brown)]/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--tech-white)] mb-2">Welcome Back</h1>
          <p className="text-[var(--vintage-cream)]">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              <p className="mt-1 text-[var(--tech-white)] text-sm flex items-center gap-1">
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
              <p className="mt-1 text-[var(--tech-white)] text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Error Message */}
          {authError && (
            <div className="bg-[var(--vintage-brown)]/20 border border-[var(--vintage-brown)]/50 rounded-lg p-4 text-[var(--tech-white)] flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{authError}</span>
            </div>
          )}

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
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </motion.button>

          {/* Anonymous Login Button */}
          <motion.button
            type="button"
            onClick={handleAnonymousLogin}
            disabled={isSubmitting}
            className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
              isSubmitting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Signing In...' : 'Continue as Guest'}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[var(--vintage-cream)]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--tech-white)] hover:text-[var(--vintage-cream)] font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;