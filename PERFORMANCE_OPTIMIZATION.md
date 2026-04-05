# Performance Optimization Guide

## Changes Made for 90+ PageSpeed Score

### 1. Cache Headers Optimization (vercel.json)
✅ Updated image cache TTL from 1h to 1 year (31536000s) with immutable flag
- Images now cached on user's device for 1 year
- Reduces repeat visit load by up to 1,841 KiB (according to PageSpeed)

### 2. Font Loading Optimization (index.html)
✅ Deferred Google Fonts loading using `media="print"` technique
- Fonts no longer block page render
- Added `onload` handler to switch to actual stylesheet
- Fallback for no-JavaScript users via `<noscript>`
- Estimated savings: 750ms on render-blocking

### 3. CSS Optimization (vite.config.ts)
✅ Improved build configuration:
- Enabled `cssCodeSplit: true` for better CSS chunking
- Added `sourcemap: false` to reduce bundle size
- Added console drop for production (terserOptions)
- Better Radix UI vendors chunking

### 4. Image Loading Optimization
✅ Added lazy loading attributes:
- Hero image: `loading="eager"` (above fold content)
- Certificate images: `loading="lazy"` (below fold)
- Project images: `loading="lazy"` (below fold)
- All images: Added width/height attributes to prevent layout shift
- Added `decoding="async"` for faster rendering

### 5. Image Format & Compression

**Current Issues (from PageSpeed):**
- certificate-competence.jpg: 1008.4 KiB → 949.2 KiB savings (compress + responsive)
- hero-profile.jpg: 492.9 KiB → 467.4 KiB savings  
- certificate-completion.jpg: 322.4 KiB → 281.1 KiB savings
- Project images (PNG): Using modern format (WebP) can save 126-157 KiB

**Recommended Next Steps:**
1. Install image optimization tools:
   ```bash
   npm install --save-dev imagemin imagemin-jpegoptim imagemin-pngquant imagemin-webp
   ```

2. Run image optimization:
   ```bash
   npx imagemin app/public/*.jpg --out-dir=app/public --plugin=jpegoptim
   npx imagemin app/public/*.png --out-dir=app/public --plugin=pngquant
   npx imagemin app/public/*.{jpg,png} --out-dir=app/public --plugin=webp
   ```

3. Alternative: Use online tools like:
   - TinyJPG/TinyPNG (https://tinypng.com/)
   - Squoosh (https://squoosh.app/)
   - ImageOptim (Mac) or FileOptimizer (Windows)

### 6. Created Components
✅ OptimizedImage.tsx component for future WebP serving
- Supports picture element for format negotiation
- Lazy loading support
- Async decoding

## Build & Deploy

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   git push
   ```

## Expected Performance Improvements

**Before:** 76 Score
**After Expected:** 88-92 Score

**Main Savings:**
- Image delivery: ~2,079 KiB reduction
- Cache optimization: ~1,841 KiB reduction  
- Render-blocking resources: ~970 ms reduction

## Manual Image Compression Instructions

### Using Squoosh (Online Tool)
1. Go to https://squoosh.app/
2. Upload each image
3. Set quality to 80-85 (JPEG) or 70-80 (PNG)
4. Export WebP format
5. Save both original and WebP versions

### Using ImageOptim (Mac)
1. Download from https://imageoptim.com/
2. Drag images to ImageOptim
3. Optimizes automatically

### Using FileOptimizer (Windows)
1. Download from https://nikkhokkho.sourceforge.io/static.php?page=FileOptimizer
2. Add images to queue
3. Optimize with default settings

## Next Optimization Opportunities

1. **Critical CSS Inlining** - Inline above-fold CSS in HTML
2. **Dynamic imports** - Lazy load below-the-fold sections
3. **WebP images** - Serve modern formats for modern browsers
4. **Service Worker** - Add offline support and better caching
5. **Code splitting** - Further optimize JS bundle size
6. **CDN images** - Use image CDN for on-the-fly optimization

## Monitoring Performance

After deploying, check:
1. https://pagespeed.web.dev/ - Run audit again
2. https://web.dev/measure/ - Full Web Vitals
3. https://lighthouse-ci.appspot.com/ - Continuous monitoring

## Notes

- All changes are backward compatible
- No breaking changes to existing functionality
- Performance improvements apply to both mobile and desktop
- Cache improvements benefit repeat visitors significantly
