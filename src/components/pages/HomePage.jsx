import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Users, Bed, Bath, Wifi, Shield, Coffee, Umbrella, TreePine, Code, Calculator, FileText, Monitor, Palette, Settings } from 'lucide-react';
import HeroSection from '../common/HeroSection';
// Using images from public directory
const cImage = '/images/c.jpg';
const c2Image = '/images/c2.jpg';
const c3Image = '/images/c3.jpg';
const dImage = '/images/d.jpg';
const d1Image = '/images/d1.jpg';
const d2Image = '/images/d2.jpg';
const qImage = '/images/q.jpg';
const q1Image = '/images/q1.jpg';
const q2Image = '/images/q2.jpg';
import CountUp from 'react-countup';

const HomePage = () => {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Web Development",
      description: "Custom websites and web applications tailored to your business needs"
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Auditing",
      description: "Comprehensive financial and operational auditing services"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Financial Bookkeeping",
      description: "Professional bookkeeping and financial record management"
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "QuickBooks",
      description: "QuickBooks setup, training, and ongoing support services"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "3D Rendering",
      description: "High-quality 3D visualizations for architectural and design projects"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "AutoCAD",
      description: "Professional AutoCAD design and drafting services"
    }
  ];

  const testimonials = [
    {
      name: "Sarah & John",
      location: "London, UK",
      rating: 5,
      comment: "Absolutely stunning! The views were incredible and the service was impeccable. We'll definitely be back!",
      image: cImage
    },
    {
      name: "Maria & Carlos",
      location: "Madrid, Spain",
      rating: 5,
      comment: "A perfect romantic getaway. The penthouse exceeded all our expectations. Pure luxury!",
      image: qImage
    },
    {
      name: "David & Lisa",
      location: "Sydney, Australia",
      rating: 5,
      comment: "The best vacation we've ever had. The beach access and amenities were perfect for our family.",
      image: dImage
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Guests" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "5.0", label: "Average Rating" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <main className="min-h-screen" role="main" aria-label="Queensy Properties - Home Page">
      {/* Hero Section */}
      <HeroSection />

      {/* Properties Preview Section */}
      <section aria-labelledby="properties-heading" className="py-24 section-vintage-cream section-transition">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 id="properties-heading" className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-8 font-playfair leading-tight">
              Our Premium Properties
            </h2>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-4xl mx-auto font-medium leading-relaxed">
              Discover our handpicked selection of luxury accommodations, each offering unique experiences and world-class amenities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20" role="list" aria-label="Featured properties">
            {/* Chameleon 1 */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-[var(--vintage-cream)]/20 mx-2 sm:mx-0"
              role="listitem"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img src={cImage} alt="Chameleon 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-[var(--vintage-dark)]/40" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Chameleon 1</h3>
                  <p className="text-[var(--vintage-cream)] text-lg">Garden View Unit</p>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Bed className="w-6 h-6 text-[var(--vintage-sage)]" />
                    <span className="text-[var(--vintage-brown)] font-medium text-base">1 Bedroom</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="w-6 h-6 text-[var(--vintage-sage)]" />
                    <span className="text-[var(--vintage-brown)] font-medium text-base">1 Bath</span>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] text-base mb-6 font-medium leading-relaxed">Cozy 1-bedroom unit perfect for couples or solo travelers seeking comfort and luxury.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[var(--vintage-sage)]">KES 5,500</span>
                  <Link to="/properties" className="btn btn-medium text-sm font-semibold px-6 py-3 bg-[var(--vintage-sage)] border border-[var(--vintage-sage)] text-[var(--tech-white)] hover:bg-[var(--vintage-brown)] hover:border-[var(--vintage-brown)] hover:text-[var(--tech-white)] rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                    View Properties
                  </Link>
                </div>
              </div>
            </motion.article>

            {/* Chameleon 2 */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-[var(--vintage-cream)]/20 mx-2 sm:mx-0"
              role="listitem"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img src={dImage} alt="Chameleon 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-[var(--vintage-dark)]/40" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Chameleon 2</h3>
                  <p className="text-[var(--vintage-cream)] text-lg">Beach Access Unit</p>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Bed className="w-6 h-6 text-[var(--vintage-sage)]" />
                    <span className="text-[var(--vintage-brown)] font-medium text-base">1 Bedroom</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="w-6 h-6 text-[var(--vintage-sage)]" />
                    <span className="text-[var(--vintage-brown)] font-medium text-base">1 Bath</span>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] text-base mb-6 font-medium leading-relaxed">Charming 1-bedroom accommodation with direct beach access and stunning ocean views.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[var(--vintage-sage)]">KES 5,500</span>
                  <Link to="/properties" className="btn btn-medium text-sm font-semibold px-6 py-3 bg-[var(--vintage-sage)] border border-[var(--vintage-sage)] text-[var(--tech-white)] hover:bg-[var(--vintage-brown)] hover:border-[var(--vintage-brown)] hover:text-[var(--tech-white)] rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                    View Properties
                  </Link>
                </div>
              </div>
            </motion.article>

            {/* Wendy's Penthouse */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-[var(--vintage-cream)]/20 mx-2 sm:mx-0"
              role="listitem"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img src={qImage} alt="Wendy's Penthouse" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-[var(--vintage-dark)]/40" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Wendy's Penthouse</h3>
                  <p className="text-[var(--vintage-cream)] text-lg">Luxury Penthouse</p>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Bed className="w-6 h-6 text-[var(--vintage-sage)]" />
                    <span className="text-[var(--vintage-brown)] font-medium text-base">3 Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="w-6 h-6 text-[var(--vintage-sage)]" />
                    <span className="text-[var(--vintage-brown)] font-medium text-base">3 Baths</span>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] text-base mb-6 font-medium leading-relaxed">Luxurious 3-bedroom penthouse with panoramic coastal views and premium amenities.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[var(--vintage-sage)]">KES 15,500</span>
                  <Link to="/properties" className="btn btn-medium text-sm font-semibold px-6 py-3 bg-[var(--vintage-sage)] border border-[var(--vintage-sage)] text-[var(--tech-white)] hover:bg-[var(--vintage-brown)] hover:border-[var(--vintage-brown)] hover:text-[var(--tech-white)] rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                    View Properties
                  </Link>
                </div>
              </div>
            </motion.article>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="btn btn-medium px-9 py-5 bg-[var(--vintage-sage)] text-[var(--tech-white)] font-bold text-lg rounded-2xl hover:bg-[var(--vintage-brown)] hover:text-[var(--tech-white)] transition-all duration-300 transform hover:scale-105 shadow-xl border-none"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section aria-labelledby="services-heading" className="py-24 section-vintage-sage section-transition">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 id="services-heading" className="text-5xl md:text-6xl font-bold text-[var(--tech-white)] mb-8 font-playfair leading-tight">
              Our Professional Services
            </h2>
            <p className="text-xl md:text-2xl text-[var(--tech-white)]/90 max-w-4xl mx-auto font-medium leading-relaxed">
              Comprehensive business solutions to help your enterprise thrive in the digital age
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" role="list" aria-label="Our services">
            {features.map((feature, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="bg-[var(--vintage-cream)] p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group border-none"
                role="listitem"
              >
                <div className="w-20 h-20 bg-[var(--vintage-sage)] rounded-3xl flex items-center justify-center text-[var(--tech-white)] mb-8 group-hover:bg-[var(--vintage-brown)] group-hover:text-[var(--tech-white)] transition-all duration-500" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-[var(--vintage-brown)] mb-6 leading-tight">{feature.title}</h3>
                <p className="text-[var(--vintage-brown)] leading-relaxed font-medium text-lg">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* List Your BnB Section */}
      <section aria-labelledby="list-bnb-heading" className="py-24 section-secondary section-transition">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 id="list-bnb-heading" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-8 font-playfair leading-tight">
                Why List With Queensy?
              </h3>
              <ul className="space-y-6 list-none pl-0" aria-label="Benefits of listing with Queensy">
                {[
                  "Premium market positioning",
                  "Professional photography included",
                  "24/7 guest support",
                  "Competitive commission rates",
                  "Marketing and promotion support",
                  "Easy booking management"
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 list-none"
                  >
                    <div className="w-3 h-3 bg-[var(--vintage-cream)] rounded-full" aria-hidden="true"></div>
                    <span className="text-[var(--text-primary)] font-semibold text-lg">{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              <aside className="bg-[var(--vintage-cream)]/20 backdrop-blur-md rounded-3xl p-8 border border-[var(--vintage-cream)]/30" aria-labelledby="web-dev-heading">
                <h4 id="web-dev-heading" className="text-xl font-semibold text-[var(--text-primary)] mb-4">Web Development Services</h4>
                <p className="text-[var(--text-primary)] mb-6 font-medium text-lg leading-relaxed">
                  Need a custom website for your property? We offer professional web development services tailored to your specific needs.
                </p>
                <Link
                  to="/contact"
                  className="inline-block px-9 py-5 bg-[var(--vintage-cream)] text-[var(--vintage-brown)] font-semibold rounded-2xl hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300 border-none"
                >
                  Get Custom Website
                </Link>
              </aside>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-[var(--vintage-cream)]/20 backdrop-blur-md rounded-3xl p-10 border border-[var(--vintage-cream)]/30"
              role="form"
            >
              <h3 id="contact-form-heading" className="text-3xl font-bold text-[var(--text-primary)] mb-8">Ready to Get Started?</h3>
              <form className="space-y-6" aria-labelledby="contact-form-heading">
                <div>
                  <label htmlFor="property-name" className="block text-[var(--text-primary)] mb-3 font-semibold text-lg">Property Name</label>
                  <input
                    type="text"
                    id="property-name"
                    className="w-full px-6 py-4 rounded-2xl bg-[var(--vintage-cream)]/20 border border-[var(--vintage-cream)]/30 text-[var(--text-primary)] placeholder-[var(--text-primary)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--vintage-sage)] focus:border-[var(--vintage-sage)] text-lg"
                    placeholder="Enter your property name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-[var(--text-primary)] mb-3 font-semibold text-lg">Contact Email</label>
                  <input
                    type="email"
                    id="contact-email"
                    className="w-full px-6 py-4 rounded-2xl bg-[var(--vintage-cream)]/20 border border-[var(--vintage-cream)]/30 text-[var(--text-primary)] placeholder-[var(--text-primary)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--vintage-sage)] focus:border-[var(--vintage-sage)] text-lg"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="property-type" className="block text-[var(--text-primary)] mb-3 font-semibold text-lg">Property Type</label>
                  <select 
                    id="property-type"
                    className="w-full px-6 py-4 rounded-2xl bg-[var(--vintage-cream)]/20 border border-[var(--vintage-cream)]/30 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--vintage-sage)] focus:border-[var(--vintage-sage)] text-lg"
                    aria-label="Select property type"
                  >
                    <option value="">Select property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-6 bg-[var(--vintage-cream)] text-[var(--vintage-brown)] font-semibold text-lg rounded-2xl hover:bg-[var(--vintage-sage)] hover:text-[var(--tech-white)] transition-all duration-300 border-none"
                  aria-label="Submit your property application"
                >
                  Submit Application
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 section-primary section-transition" aria-labelledby="stats-heading">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 id="stats-heading" className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-8 font-playfair leading-tight">
              Queensy by the Numbers
            </h2>
            <p className="text-xl md:text-2xl text-[var(--text-primary)] max-w-4xl mx-auto font-medium leading-relaxed">
              Our commitment to excellence reflected in our achievements
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12" role="list" aria-label="Achievement statistics">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                role="listitem"
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="text-center group"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.5, type: "spring" }}
                  className="w-24 h-24 bg-[var(--vintage-sage)] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[var(--vintage-brown)] transition-all duration-500"
                >
                  <span className="text-4xl">{stat.icon}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.8 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <div className="text-5xl md:text-6xl font-bold text-[var(--text-primary)]">
                    <CountUp end={parseInt(stat.number)} duration={2.5} delay={index * 0.2} />
                    {stat.number.includes('+') && '+'}
                  </div>
                  <div className="text-[var(--vintage-sage)] font-semibold text-lg">{stat.label}</div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 section-vintage-cream section-transition" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 id="testimonials-heading" className="text-5xl md:text-6xl font-bold text-[var(--vintage-sage)] mb-8 font-playfair leading-tight">
              What Our Guests Say
            </h2>
            <p className="text-xl md:text-2xl text-[var(--tech-black)] max-w-4xl mx-auto font-medium leading-relaxed">
              Don't just take our word for it - hear from our satisfied guests
            </p>
          </motion.div>

          {/* Enhanced Testimonials Carousel */}
          <div className="relative overflow-hidden">
            <motion.div
              animate={{ x: [0, -1000, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-8"
              role="list"
              aria-label="Guest testimonials"
            >
              {/* Duplicate testimonials for seamless loop */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="min-w-[400px] bg-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-ivory-200"
                  role="listitem"
                >
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-[var(--vintage-brown)] text-lg mb-8 italic font-medium leading-relaxed">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-oceanic-100"
                    />
                    <div>
                      <div className="font-bold text-[var(--vintage-sage)] text-lg">{testimonial.name}</div>
                      <div className="text-sm text-[var(--vintage-brown)]">{testimonial.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--vintage-cream)]" aria-labelledby="cta-heading">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 id="cta-heading" className="text-5xl md:text-6xl font-bold text-[var(--tech-black)] mb-8 font-playfair leading-tight">
              Ready to Experience Paradise?
            </h2>
            <p className="text-xl md:text-2xl text-[var(--tech-black)] mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
              Book your dream vacation today and create unforgettable memories in the heart of Diani Beach
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center" role="group" aria-label="Booking options">
              <Link
                to="/properties"
                className="px-12 py-6 bg-[var(--vintage-sage)] text-[var(--tech-white)] font-bold text-xl rounded-3xl hover:bg-[var(--vintage-brown)] transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-[var(--shadow-hover)]"
                aria-label="Book your stay - View available properties"
              >
                Book Your Stay
              </Link>
              <Link
                to="/contact"
                className="px-12 py-6 bg-[var(--vintage-brown)] text-[var(--tech-white)] font-bold text-xl rounded-3xl hover:bg-[var(--vintage-sage)] transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-[var(--shadow-hover)]"
                aria-label="Contact us for more information"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
