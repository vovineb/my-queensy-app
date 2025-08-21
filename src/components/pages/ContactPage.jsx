import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle, AlertCircle, Car, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const ContactPage = () => {
  // Form state management
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

  // Handle form submission
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
    <main className={`min-h-screen pt-20 ${isDark ? 'bg-navy-900' : 'bg-ivory-50'}`}>
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 id="contact-heading" className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] font-playfair mb-8 leading-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-medium">
            Ready to start your journey? Contact us today and let's make your dream vacation a reality
          </p>
        </motion.header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 max-w-7xl mx-auto">
          {/* Contact Information */}
          <section aria-labelledby="contact-info-heading" className="space-y-12">
            <h2 id="contact-info-heading" className="text-3xl font-bold font-playfair mb-8 text-[var(--text-primary)]">
              Contact Information
            </h2>

            <address className="space-y-8 not-italic" role="group" aria-label="Contact details">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--vintage-cream)] rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[var(--vintage-sage)]" aria-hidden="true" />
                </div>
                <div className="form-group">
                  <h3 className="text-[var(--text-primary)] font-bold">Phone</h3>
                  <p className="text-[var(--vintage-brown)] font-semibold">+254 707 335 604</p>
                  <p className="text-[var(--text-secondary)] text-sm">Available 24/7</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--vintage-cream)] rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[var(--vintage-sage)]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[var(--text-primary)] font-bold">Email</h3>
                  <p className="text-[var(--vintage-brown)] font-semibold">info@queensy.com</p>
                  <p className="text-[var(--text-secondary)] text-sm">We'll respond within 2 hours</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--vintage-cream)] rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[var(--vintage-sage)]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[var(--text-primary)] font-bold">Address</h3>
                  <p className="text-[var(--vintage-brown)] font-semibold">Diani Beach, Kenya</p>
                  <p className="text-[var(--text-secondary)] text-sm">South Coast, Mombasa</p>
                </div>
              </div>
            </address>

            {/* Location Features */}
            <aside className="bg-[var(--card-bg)] rounded-2xl p-8 shadow-lg border border-[var(--vintage-cream)]" aria-labelledby="location-highlights-heading">
              <h3 id="location-highlights-heading" className="text-xl font-semibold text-[var(--text-primary)] mb-6">Location Highlights</h3>
              <ul className="space-y-4 list-none p-0" role="list" aria-label="Location highlights">
                <li className="flex items-center gap-3 text-[var(--text-primary)]" role="listitem">
                  <MapPin className="w-5 h-5 text-[var(--vintage-sage)]" aria-hidden="true" />
                  Walking distance to pristine Diani Beach
                </li>
                <li className="flex items-center gap-3 text-[var(--text-primary)]" role="listitem">
                  <Car className="w-5 h-5 text-[var(--vintage-brown)]" aria-hidden="true" />
                  20 minutes drive to Mombasa city center
                </li>
                <li className="flex items-center gap-3 text-[var(--text-primary)]" role="listitem">
                  <Star className="w-5 h-5 text-[var(--vintage-sage)]" aria-hidden="true" />
                  Rated 5 stars by our guests
                </li>
              </ul>
            </aside>
          </section>

          {/* Contact Form */}
          <section aria-labelledby="contact-form-heading" className="space-y-8">
            <h2 id="contact-form-heading" className="text-3xl font-bold text-[var(--text-primary)] font-playfair mb-8">
              Send us a Message
            </h2>
            
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl"
                role="alert"
                aria-live="polite"
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
                role="alert"
                aria-live="assertive"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <span className="text-red-800 font-medium">{errorMessage}</span>
                </div>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8" aria-labelledby="contact-form-heading" role="form">
              <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6 border-0 p-0 m-0">
                <div>
                  <label htmlFor="name" className="block text-[var(--text-primary)] text-lg font-medium mb-3">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-xl border border-[var(--vintage-cream)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--vintage-sage)] focus:border-transparent text-lg font-sans"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-[var(--text-primary)] text-lg font-medium mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-xl border border-[var(--vintage-cream)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--vintage-sage)] focus:border-transparent text-lg font-sans"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-[var(--text-primary)] text-lg font-medium mb-3">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-xl border border-[var(--vintage-cream)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--vintage-sage)] focus:border-transparent text-lg font-sans"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-[var(--text-primary)] text-lg font-medium mb-3">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 rounded-xl border border-[var(--vintage-cream)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--vintage-sage)] focus:border-transparent text-lg resize-none font-sans"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>
              </fieldset>
              
              <button
                type="submit"
                className="w-full py-5 px-8 bg-[var(--vintage-sage)] text-[var(--tech-white)] font-bold text-lg rounded-2xl hover:bg-[var(--vintage-brown)] transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-[var(--vintage-sage)]/30"
                aria-label="Submit contact form"
              >
                Send Message
              </button>
            </form>
          </section>
        </div>

        {/* FAQ Section */}
        <section aria-labelledby="faq-heading" className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] font-playfair mb-8 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
              Get quick answers to common questions about your stay
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6" role="region" aria-labelledby="faq-heading">
            {faqData.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[var(--vintage-sage)] rounded-2xl shadow-lg border border-[var(--vintage-cream)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-[var(--vintage-brown)] transition-all duration-300 font-sans"
                  aria-expanded={openFAQ === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <h3 id={`faq-question-${faq.id}`} className="text-lg font-bold text-[var(--tech-white)]">{faq.question}</h3>
                  {openFAQ === faq.id ? (
                    <ChevronUp className="w-6 h-6 text-[var(--tech-white)]" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[var(--tech-white)]" aria-hidden="true" />
                  )}
                </button>
                
                {openFAQ === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-8 pb-6"
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${faq.id}`}
                  >
                    <div className="border-t border-[var(--vintage-cream)] pt-4">
                      <p className="text-[var(--tech-white)] font-medium leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactPage;
