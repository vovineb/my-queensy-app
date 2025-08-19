// Import all images
import c1Image from './c.jpg';
import c2Image from './c2.jpg';
import d1Image from './d1.jpg';
import d2Image from './d2.jpg';
import d3Image from './d3.jpg';
import qImage from './q.jpg';
import q1Image from './q1.jpg';

// Export all images
export {
  c1Image,
  c2Image,
  d1Image,
  d2Image,
  d3Image,
  qImage,
  q1Image
};

// Property image mapping
export const propertyImages = {
  chameleon1: c1Image,
  chameleon2: c2Image,
  wendysPenthouse: qImage
};

// Properties object for easy access
export const properties = {
  chameleon1: {
    name: 'Chameleon 1',
    image: c1Image,
    price: 'KES 5,500'
  },
  chameleon2: {
    name: 'Chameleon 2',
    image: c2Image,
    price: 'KES 5,500'
  },
  wendysPenthouse: {
    name: 'Wendy\'s Penthouse',
    image: qImage,
    price: 'KES 25,000'
  }
};