#!/bin/bash
# Image optimization script for portfolio
# Requires: imagemin, imagemin-jpegoptim, imagemin-pngquant, imagemin-webp

# Install dependencies if not exists
npm install --save-dev imagemin imagemin-jpegoptim imagemin-pngquant imagemin-webp

# Optimize JPG images
npx imagemin app/public/*.jpg --out-dir=app/public --plugin=jpegoptim --plugin=webp

# Optimize PNG images  
npx imagemin app/public/*.png --out-dir=app/public --plugin=pngquant --plugin=webp

echo "Image optimization complete!"
echo "Generated WebP versions alongside original images"
