import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle, AlertCircle, Car, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "How do I check in?",
      answer: "Check-in is available from 2:00 PM onwards. Upon arrival, please proceed to our main reception area where our staff will welcome you and provide your room keys. We'll also give you a brief orientation of the property and answer any questions you may have."
    },
    {
      id: 2,
      question: "Where do I get the key?",
      answer: "Keys are provided at check-in at our main reception desk. For late arrivals, we can arrange key pickup at a secure location. Please contact us in advance if you'll be arriving after 8:00 PM to make special arrangements."
    },
    {
      id: 3,
      question: "What is the WiFi password?",
      answer: "WiFi passwords are provided upon check-in. Each property has its own secure network. The password is also displayed in your welcome packet and can be found on the information card in your room. If you need assistance, our staff is available 24/7."
    },
    {
      id: 4,
      question: "Do I have Netflix access?",
      answer: "Yes! All our properties come with complimentary Netflix access. You'll find the Netflix app pre-installed on all smart TVs. Simply log in with your own Netflix account, or use our guest account if you don't have one. The login details are provided in your welcome packet."
    }
  ];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const { isDark } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen pt-20 ${isDark ? 'bg-navy-900' : 'bg-ivory-50'}`}>
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-black font-playfair mb-8 leading-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed font-medium">
            Ready to start your journey? Contact us today and let's make your dream vacation a reality
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-12">
            <h2 className={`text-3xl font-bold font-playfair mb-8 ${isDark ? 'text-ivory-100' : 'text-navy-900'}`}>
              Contact Information
            </h2>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-oceanic-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-oceanic-600" />
                </div>
                <div>
                  <h3 className="text-black font-bold">Phone</h3>
                  <p className="text-blue-700 font-semibold">+254 707 335 604</p>
                  <p className="text-blue-600 text-sm">Available 24/7</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-oceanic-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-oceanic-600" />
                </div>
                <div>
                  <h3 className="text-black font-bold">Email</h3>
                  <p className="text-blue-700 font-semibold">info@queensy.com</p>
                  <p className="text-blue-600 text-sm">We'll respond within 2 hours</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-oceanic-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-oceanic-600" />
                </div>
                <div>
                  <h3 className="text-black font-bold">Address</h3>
                  <p className="text-blue-700 font-semibold">Diani Beach, Kenya</p>
                  <p className="text-blue-600 text-sm">South Coast, Mombasa</p>
                </div>
              </div>
            </div>

            {/* Location Features */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-ivory-200">
              <h3 className="text-xl font-semibold text-navy-900 mb-6">Location Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-navy-700">
                  <MapPin className="w-5 h-5 text-oceanic-600" />
                  Walking distance to pristine Diani Beach
                </div>
                <div className="flex items-center gap-3 text-navy-700">
                  <Car className="w-5 h-5 text-navy-400" />
                  20 minutes drive to Mombasa city center
                </div>
                <div className="flex items-center gap-3 text-navy-700">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Rated 5 stars by our guests
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-navy-900 font-playfair mb-8">
              Send us a Message
            </h2>
            
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-800 font-medium">Thank you for your message! We'll get back to you soon.</span>
                </div>
              </motion.div>
            )}
            
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <span className="text-red-800 font-medium">{errorMessage}</span>
                </div>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-navy-700 text-lg font-medium mb-3">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-xl border border-ivory-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-oceanic-500 focus:border-transparent text-lg"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-navy-700 text-lg font-medium mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-xl border border-ivory-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-oceanic-500 focus:border-transparent text-lg"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-navy-700 text-lg font-medium mb-3">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-xl border border-ivory-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-oceanic-500 focus:border-transparent text-lg"
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-navy-700 text-lg font-medium mb-3">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-6 py-4 rounded-xl border border-ivory-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-oceanic-500 focus:border-transparent text-lg resize-none"
                  placeholder="Tell us about your inquiry..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-5 px-8 bg-gradient-to-r from-oceanic-600 to-pool-600 text-white font-bold text-lg rounded-2xl hover:from-oceanic-700 hover:to-pool-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-oceanic-500/30"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 font-playfair mb-8 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-navy-700 max-w-3xl mx-auto leading-relaxed">
              Get quick answers to common questions about your stay
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqData.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg border border-blue-300 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-blue-800 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                  {openFAQ === faq.id ? (
                    <ChevronUp className="w-6 h-6 text-white" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white" />
                  )}
                </button>
                
                {openFAQ === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-8 pb-6"
                  >
                    <div className="border-t border-blue-400 pt-4">
                      <p className="text-white font-medium leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
