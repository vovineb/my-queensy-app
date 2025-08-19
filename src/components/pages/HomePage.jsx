import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Users, Bed, Bath, Wifi, Shield, Coffee, Umbrella, TreePine, Code, Calculator, FileText, Monitor, Palette, Settings } from 'lucide-react';
import HeroSection from '../common/HeroSection';
import cImage from '../../assets/images/c.jpg';
import c2Image from '../../assets/images/c2.jpg';
import c3Image from '../../assets/images/c3.jpg';
import dImage from '../../assets/images/d.jpg';
import d1Image from '../../assets/images/d1.jpg';
import d2Image from '../../assets/images/d2.jpg';
import qImage from '../../assets/images/q.jpg';
import q1Image from '../../assets/images/q1.jpg';
import q2Image from '../../assets/images/q2.jpg';
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
    <div className="min-h-screen bg-ivory-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Properties Preview Section */}
      <section className="py-24 bg-gradient-to-b from-ivory-50 via-blue-50 to-oceanic-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 font-playfair leading-tight">
              Our Premium Properties
            </h2>
            <p className="text-xl md:text-2xl text-black max-w-4xl mx-auto font-medium leading-relaxed">
              Discover our handpicked selection of luxury accommodations, each offering unique experiences and world-class amenities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
            {/* Chameleon 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -16, scale: 1.03 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group border border-ivory-200"
            >
              <div className="relative h-72 overflow-hidden">
                <img src={cImage} alt="Chameleon 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Chameleon 1</h3>
                  <p className="text-oceanic-200 text-lg">Garden View Unit</p>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Bed className="w-6 h-6 text-oceanic-600" />
                    <span className="text-black font-bold text-lg">1 Bedroom</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="w-6 h-6 text-oceanic-600" />
                    <span className="text-black font-bold text-lg">1 Bath</span>
                  </div>
                </div>
                <p className="text-black text-lg mb-8 font-medium leading-relaxed">Cozy 1-bedroom unit perfect for couples or solo travelers seeking comfort and luxury.</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-black">KES 5,500</span>
                  <Link to="/properties" className="btn btn-medium text-base font-bold px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl">
                    View Properties
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Chameleon 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -16, scale: 1.03 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group border border-ivory-200"
            >
              <div className="relative h-72 overflow-hidden">
                <img src={dImage} alt="Chameleon 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Chameleon 2</h3>
                  <p className="text-oceanic-200 text-lg">Beach Access Unit</p>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Bed className="w-6 h-6 text-oceanic-600" />
                    <span className="text-black font-bold text-lg">1 Bedroom</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="w-6 h-6 text-oceanic-600" />
                    <span className="text-black font-bold text-lg">1 Bath</span>
                  </div>
                </div>
                <p className="text-black text-lg mb-8 font-medium leading-relaxed">Charming 1-bedroom accommodation with direct beach access and stunning ocean views.</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-black">KES 5,500</span>
                  <Link to="/properties" className="btn btn-medium text-base font-bold px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl">
                    View Properties
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Wendy's Penthouse */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -16, scale: 1.03 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group border border-ivory-200"
            >
              <div className="relative h-72 overflow-hidden">
                <img src={qImage} alt="Wendy's Penthouse" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Wendy's Penthouse</h3>
                  <p className="text-oceanic-200 text-lg">Luxury Penthouse</p>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Bed className="w-6 h-6 text-oceanic-600" />
                    <span className="text-black font-bold text-lg">3 Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="w-6 h-6 text-oceanic-600" />
                    <span className="text-black font-bold text-lg">3 Baths</span>
                  </div>
                </div>
                <p className="text-black text-lg mb-8 font-medium leading-relaxed">Luxurious 3-bedroom penthouse with panoramic coastal views and premium amenities.</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-black">KES 15,500</span>
                  <Link to="/properties" className="btn btn-medium text-base font-bold px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl">
                    View Properties
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="btn btn-medium px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-blue-500/40"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-b from-oceanic-50 via-pool-50 to-green-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 font-playfair leading-tight">
              Our Professional Services
            </h2>
            <p className="text-xl md:text-2xl text-black max-w-4xl mx-auto font-medium leading-relaxed">
              Comprehensive business solutions to help your enterprise thrive in the digital age
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="bg-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group border border-ivory-200"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-oceanic-100 to-pool-100 rounded-3xl flex items-center justify-center text-oceanic-600 mb-8 group-hover:bg-oceanic-600 group-hover:text-white transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-black mb-6 leading-tight">{feature.title}</h3>
                <p className="text-black leading-relaxed font-medium text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* List Your BnB Section */}
      <section className="py-24 bg-gradient-to-b from-blue-200 via-blue-600 to-blue-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 font-playfair leading-tight">
                Why List With Queensy?
              </h3>
              <div className="space-y-6">
                {[
                  "Premium market positioning",
                  "Professional photography included",
                  "24/7 guest support",
                  "Competitive commission rates",
                  "Marketing and promotion support",
                  "Easy booking management"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span className="text-white font-semibold text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30">
                <h4 className="text-xl font-semibold text-white mb-4">Web Development Services</h4>
                <p className="text-white mb-6 font-medium text-lg leading-relaxed">
                  Need a custom website for your property? We offer professional web development services tailored to your specific needs.
                </p>
                <Link
                  to="/contact"
                  className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all duration-300"
                >
                  Get Custom Website
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/20 backdrop-blur-md rounded-3xl p-10 border border-white/30"
            >
              <h3 className="text-3xl font-bold text-white mb-8">Ready to Get Started?</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-white mb-3 font-semibold text-lg">Property Name</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-lg"
                    placeholder="Enter your property name"
                  />
                </div>
                <div>
                  <label className="block text-white mb-3 font-semibold text-lg">Contact Email</label>
                  <input
                    type="email"
                    className="w-full px-6 py-4 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-lg"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-white mb-3 font-semibold text-lg">Property Type</label>
                  <select className="w-full px-6 py-4 rounded-2xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-lg">
                    <option value="">Select property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-white text-blue-600 font-semibold text-lg rounded-2xl hover:bg-blue-50 transition-all duration-300"
                >
                  Submit Application
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-ivory-50 via-blue-50 to-oceanic-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 font-playfair leading-tight">
              Queensy by the Numbers
            </h2>
            <p className="text-xl md:text-2xl text-black max-w-4xl mx-auto font-medium leading-relaxed">
              Our commitment to excellence reflected in our achievements
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="text-center group"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.5, type: "spring" }}
                  className="w-24 h-24 bg-gradient-to-br from-oceanic-100 to-pool-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:from-oceanic-200 group-hover:to-pool-200 transition-all duration-500"
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
                  <div className="text-5xl md:text-6xl font-bold text-black">
                    <CountUp end={parseInt(stat.number)} duration={2.5} delay={index * 0.2} />
                    {stat.number.includes('+') && '+'}
                  </div>
                  <div className="text-oceanic-600 font-semibold text-lg">{stat.label}</div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-green-50 via-white to-ivory-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 font-playfair leading-tight">
              What Our Guests Say
            </h2>
            <p className="text-xl md:text-2xl text-black max-w-4xl mx-auto font-medium leading-relaxed">
              Don't just take our word for it - hear from our satisfied guests
            </p>
          </motion.div>

          {/* Enhanced Testimonials Carousel */}
          <div className="relative overflow-hidden">
            <motion.div
              animate={{ x: [0, -1000, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-8"
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
                >
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-black text-lg mb-8 italic font-medium leading-relaxed">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-oceanic-100"
                    />
                    <div>
                      <div className="font-bold text-black text-lg">{testimonial.name}</div>
                      <div className="text-sm text-navy-600">{testimonial.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-oceanic-50 via-blue-100 to-blue-200">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 font-playfair leading-tight">
              Ready to Experience Paradise?
            </h2>
            <p className="text-xl md:text-2xl text-black mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
              Book your dream vacation today and create unforgettable memories in the heart of Diani Beach
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Link
                to="/properties"
                className="px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl rounded-3xl hover:from-blue-700 hover:to-blue-800 transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-blue-500/40"
              >
                Book Your Stay
              </Link>
              <Link
                to="/contact"
                className="px-12 py-6 bg-gradient-to-r from-pool-600 to-oceanic-600 text-white font-bold text-xl rounded-3xl hover:from-pool-700 hover:to-oceanic-700 transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-oceanic-500/40"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
