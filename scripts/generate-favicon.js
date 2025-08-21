import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const SVG_PATH = path.join(PUBLIC_DIR, 'logo.svg');
const FAVICON_PATH = path.join(PUBLIC_DIR, 'favicon.ico');
const FAVICON_PNG_PATH = path.join(PUBLIC_DIR, 'favicon.png');

// Create directory if it doesn't exist
if (!fs.existsSync(path.dirname(FAVICON_PATH))) {
  fs.mkdirSync(path.dirname(FAVICON_PATH), { recursive: true });
}

// Generate favicon.png (512x512)
async function generateFavicons() {
  try {
    // First convert SVG to PNG at 512x512
    await sharp(SVG_PATH)
      .resize(512, 512)
      .png()
      .toFile(FAVICON_PNG_PATH);
    
    console.log(`✅ Generated ${FAVICON_PNG_PATH}`);
    
    // Then convert PNG to ICO (16x16, 32x32, 48x48)
    await sharp(FAVICON_PNG_PATH)
      .resize(32, 32)
      .toFile(FAVICON_PATH);
    
    console.log(`✅ Generated ${FAVICON_PATH}`);
    
    console.log('Favicon generation complete!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();