# Queensy - Luxury Real Estate & Property Management

A modern, responsive real estate website built with React, Vite, and Tailwind CSS. Features include property listings, contact forms, blog functionality, and Firebase integration.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd my-queensy-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
1. Copy `env.example` to `.env.local`
2. Fill in your Firebase and Google Maps API keys:
   ```bash
   cp env.example .env.local
   ```

## 🛠️ Build & Deploy

### Local Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

### Deploy to GitHub Pages
1. Add to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication and Firestore
3. Add your Firebase config to `.env.local`

### Google Maps API
1. Create a Google Cloud project
2. Enable Maps JavaScript API
3. Add your API key to `.env.local`

## 📁 Project Structure
```
my-queensy-app/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   ├── index.css        # Global styles
│   └── assets/          # Static assets
├── public/              # Public assets
├── dist/                # Build output
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── vercel.json          # Vercel deployment config
```

## 🎨 Features
- ✅ Responsive design
- ✅ Dark theme
- ✅ Property listings
- ✅ Contact forms
- ✅ Blog functionality
- ✅ Firebase integration
- ✅ WhatsApp integration
- ✅ SEO optimized
- ✅ Performance optimized

## 🚀 Live Demo
Visit: [Your deployed URL here]

## 📝 License
MIT License - see LICENSE file for details
