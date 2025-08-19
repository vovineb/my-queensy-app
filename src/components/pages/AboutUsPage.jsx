import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Instagram, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import byronProfile from '../../assets/images/byron_profile.jpg';
import georgeProfile from '../../assets/images/george_profile.jpg';
import wendyProfile from '../../assets/images/wendy_profile.jpg';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-blue-800">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-blue-400 font-playfair mb-6"
          >
            About Queensy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
          >
            Your premier destination for luxury accommodations in the heart of Diani Beach, Mombasa
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-blue-400 font-playfair mb-8 leading-tight">
            Our Story
          </h1>
          <p className="text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Discover the journey of Queensy, from humble beginnings to becoming the premier luxury accommodation provider in Diani Beach, Kenya
          </p>
        </motion.div>

        {/* Mission & Vision Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-blue-400 font-playfair leading-tight">
                Our Mission
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                To provide exceptional luxury accommodations that blend modern comfort with authentic Kenyan hospitality, creating unforgettable experiences for our guests while preserving the natural beauty of Diani Beach.
              </p>
              <p className="text-lg text-blue-200 leading-relaxed">
                We believe in sustainable tourism that benefits both our guests and the local community, ensuring that every stay contributes to the preservation of this pristine coastal paradise.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-sm border border-blue-500/30">
                <h3 className="text-2xl font-bold text-blue-400 mb-6 text-center">Our Vision</h3>
                <div className="space-y-4 text-center">
                  <p className="text-blue-100 text-lg">
                    To be the leading luxury accommodation provider in East Africa, known for exceptional service, sustainable practices, and authentic cultural experiences.
                  </p>
                  <p className="text-blue-200">
                    We envision a future where luxury travel and environmental conservation go hand in hand, creating lasting positive impact for generations to come.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blue-400 font-playfair mb-8">
              Our Core Values
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              These principles guide everything we do, from property design to guest interactions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                icon: '🏠',
                title: 'Excellence',
                description: 'We maintain the highest standards in every aspect of our service, from property maintenance to guest experience, ensuring every detail exceeds expectations.'
              },
              {
                icon: '🌿',
                title: 'Sustainability',
                description: 'Committed to eco-friendly practices and responsible tourism that preserves the natural beauty of Diani Beach for future generations.'
              },
              {
                icon: '🤝',
                title: 'Community',
                description: 'We actively support local businesses and communities, creating meaningful partnerships that benefit both our guests and the local economy.'
              },
              {
                icon: '💎',
                title: 'Luxury',
                description: 'Premium accommodations with world-class amenities, designed to provide the ultimate comfort and relaxation experience.'
              },
              {
                icon: '🎯',
                title: 'Authenticity',
                description: 'Genuine Kenyan hospitality that reflects our culture and traditions, creating authentic and memorable experiences for our guests.'
              },
              {
                icon: '🚀',
                title: 'Innovation',
                description: 'Continuously improving our services and properties through modern technology and creative solutions to enhance guest satisfaction.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 text-center"
              >
                <div className="text-6xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold text-blue-400 mb-4 font-playfair">{value.title}</h3>
                <p className="text-blue-100 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blue-400 font-playfair mb-8">
              Meet Our Team
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Dedicated professionals committed to making your stay exceptional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* George - CEO */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="group perspective-1000"
            >
              <div className="relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                {/* Front of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/30">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-400">
                      <img src={georgeProfile} alt="George" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <h3 className="text-3xl font-bold text-blue-400 font-playfair">George</h3>
                      <a
                        href={`https://wa.me/254726268141?text=${encodeURIComponent('Hello George, I’d like to inquire about your services.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
                        title="WhatsApp George"
                      >
                        <MessageCircle className="w-4 h-4 text-green-400" />
                      </a>
                    </div>
                    <p className="text-blue-200 text-lg">Founder & CEO</p>
                  </div>
                </div>
                
                {/* Back of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-blue-400/50 rotate-y-180">
                  <div className="text-center space-y-6">
                    <h3 className="text-2xl font-bold text-blue-400 font-playfair">Founder & CEO</h3>
                    <p className="text-blue-100 leading-relaxed text-sm">
                      With over 15 years of experience in luxury hospitality, George leads our team with passion and dedication. His vision for sustainable luxury tourism drives every decision we make.
                    </p>
                    <div className="pt-4">
                      <p className="text-blue-200 text-sm">Expertise:</p>
                      <p className="text-blue-100 text-xs">Luxury Hospitality, Business Strategy, Guest Experience</p>
                    </div>
                    <div className="pt-4">
                      <a
                        href="https://wa.me/254726268141?text=Hello%20George%2C%20I%27d%20like%20to%20inquire%20about%20your%20services."
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
                        title="WhatsApp George"
                      >
                        <MessageCircle className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Wendy - Host */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="group perspective-1000"
            >
              <div className="relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                {/* Front of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/30">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-400">
                      <img src={wendyProfile} alt="Wendy" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <h3 className="text-3xl font-bold text-blue-400 font-playfair">Wendy</h3>
                      <a
                        href={`https://wa.me/254707335604?text=${encodeURIComponent('Hello Wendy, I’d like to inquire about your services.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
                        title="WhatsApp Wendy"
                      >
                        <MessageCircle className="w-4 h-4 text-green-400" />
                      </a>
                    </div>
                    <p className="text-blue-200 text-lg">Host & Operations</p>
                  </div>
                </div>
                
                {/* Back of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-blue-400/50 rotate-y-180">
                  <div className="text-center space-y-6">
                    <h3 className="text-2xl font-bold text-blue-400 font-playfair">Host & Operations</h3>
                    <p className="text-blue-100 leading-relaxed text-sm">
                      Wendy ensures every aspect of our operations runs smoothly, from guest services to property maintenance. Her attention to detail guarantees exceptional experiences for all our guests.
                    </p>
                    <div className="pt-4">
                      <p className="text-blue-200 text-sm">Expertise:</p>
                      <p className="text-blue-100 text-xs">Guest Services, Property Management, Quality Assurance</p>
                    </div>
                    <div className="pt-4">
                      <a
                        href="https://wa.me/254707335604?text=Hello%20Wendy%2C%20I%27d%20like%20to%20inquire%20about%20your%20services."
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
                        title="WhatsApp Wendy"
                      >
                        <MessageCircle className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Byron - Developer */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="group perspective-1000"
            >
              <div className="relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                {/* Front of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-black/30 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/30">
                  <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-400">
                      <img src={byronProfile} alt="Byron" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <h3 className="text-3xl font-bold text-blue-400 font-playfair">Byron</h3>
                      <a
                        href={`https://wa.me/254706880575?text=${encodeURIComponent('Hello Byron, I’d like to inquire about your services.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
                        title="WhatsApp Byron"
                      >
                        <MessageCircle className="w-4 h-4 text-green-400" />
                      </a>
                    </div>
                    <p className="text-blue-200 text-lg">Developer</p>
                  </div>
                </div>
                
                {/* Back of card */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-blue-400/50 rotate-y-180">
                  <div className="text-center space-y-6">
                    <h3 className="text-2xl font-bold text-blue-400 font-playfair">Developer</h3>
                    <p className="text-blue-100 leading-relaxed text-sm">
                      Byron handles all our technical infrastructure and digital platforms, ensuring seamless online experiences for our guests and efficient backend operations.
                    </p>
                    <div className="pt-4">
                      <p className="text-blue-200 text-sm">Expertise:</p>
                      <p className="text-blue-100 text-xs">Web Development, System Architecture, Digital Innovation</p>
                    </div>
                    <div className="pt-4">
                      <a
                        href="https://wa.me/254706880575?text=Hello%20Byron%2C%20I%27d%20like%20to%20inquire%20about%20your%20services."
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
                        title="WhatsApp Byron"
                      >
                        <MessageCircle className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-900/30 to-blue-600/30 rounded-3xl p-12 border border-blue-500/30"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-blue-400 font-playfair mb-8">
              Get in Touch
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Ready to experience luxury in Diani Beach? Contact us to start planning your perfect getaway.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="px-12 py-6 bg-blue-400 text-black font-bold rounded-3xl hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-xl"
              >
                Contact Us
              </Link>
              <Link
                to="/properties"
                className="px-12 py-6 border-3 border-blue-400 text-blue-400 font-bold rounded-3xl hover:bg-blue-400 hover:text-black transition-all duration-300 transform hover:scale-105 text-xl"
              >
                View Properties
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
