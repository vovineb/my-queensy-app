import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloatingButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '254707335604';
    const message = "Hello, I would like to inquire about your properties.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 rounded-full p-4 bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 z-50"
      aria-label="Contact us on WhatsApp"
      title="Chat on WhatsApp"
    >
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
        <MessageCircle className="w-4 h-4 text-white" />
      </div>
    </button>
  );
};

export default WhatsAppFloatingButton;

