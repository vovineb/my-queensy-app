import React from 'react';
import Header from './Header';
import Footer from './Footer';
import LoadingScreen from '../common/LoadingScreen';

const Layout = ({ children, isLoading }) => {
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-blue-900">
      <Header />
      
      {/* Main content with consistent padding and max-width */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Content grid system */}
        <div className="grid grid-cols-12 gap-6">
          {children}
        </div>
      </main>

      {/* Footer with watermark */}
      <Footer watermarkText="QUEENSY-DIANI-KE" />
    </div>
  );
};

export default Layout;