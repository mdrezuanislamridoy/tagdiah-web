import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  title: string;
  subtitle: string;
}

const slides: HeroSlide[] = [
  {
    id: 'curtains',
    image: '/hero-curtains-living.jpg',
    alt: 'Elegant floral sheer curtains framing a sunlit window in a luxury living room with beige sofa and coffee table',
    title: 'Curtains & Living',
    subtitle: 'Handcrafted floral embroidery & sheer drapes',
  },
  {
    id: 'bedding',
    image: '/hero-slide-bedding.jpg',
    alt: 'Cozy luxury bedroom styled with botanical floral comforter set and soft natural morning light',
    title: 'Bedding & Comforters',
    subtitle: 'Pure cotton weaves & soothing botanical tones',
  },
  {
    id: 'dining',
    image: '/hero-slide-dining.jpg',
    alt: 'Warm sunlit dining room with linen curtains, solid wood table and handcrafted ceramic tableware',
    title: 'Dining & Decor',
    subtitle: 'Timeless ceramics & organic textures',
  },
  {
    id: 'living-classic',
    image: '/7c6c0d51-a3c1-4b33-9403-02f6adf28475.jpg',
    alt: 'Artisanal living room with macramé wall art, linen drape and terracotta accents',
    title: 'Artisan Heritage',
    subtitle: 'Handcrafted by master artisans across Bengal',
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto slide rotation every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative bg-[#FAF7F2] text-[#2B2724] overflow-hidden border-b border-[#EAE3D6]"
      aria-label="Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] sm:min-h-[600px] lg:min-h-[640px] xl:min-h-[700px]">
          
          {/* Left Column: Headline, Subtitle, CTA Buttons & Badges */}
          <div className="lg:col-span-5 xl:col-span-5 px-5 sm:px-8 lg:pl-10 lg:pr-6 xl:pl-14 xl:pr-8 py-8 sm:py-12 lg:py-16 xl:py-20 flex flex-col justify-center z-10">
            
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-display tracking-tight text-[#163323] leading-[1.08]">
                <span className="block text-[36px] sm:text-[48px] md:text-[52px] lg:text-[52px] xl:text-[62px] font-normal text-[#1A3326]">
                  Make Your Home
                </span>
                <span className="block text-[38px] sm:text-[50px] md:text-[54px] lg:text-[54px] xl:text-[64px] font-semibold text-[#1A3326] mt-1 sm:mt-1.5">
                  Feel Like You.
                </span>
              </h1>
            </motion.div>

            {/* Subtitle / Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 sm:mt-5 text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed text-[#4A453E] max-w-[420px]"
            >
              Elegant curtains, cozy bedding &amp; timeless décor to make everyday spaces beautiful.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3 sm:gap-3.5"
            >
              <Link
                to="/shop?category=curtains"
                className="inline-flex items-center justify-center rounded-[3px] bg-[#123826] px-6 sm:px-7 py-3 text-xs sm:text-[13px] font-semibold tracking-wider text-white uppercase transition-all duration-200 hover:bg-[#0c271a] shadow-sm hover:shadow active:scale-[0.98]"
              >
                SHOP CURTAINS
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-[3px] border border-[#D5C6AF] bg-transparent px-6 sm:px-7 py-3 text-xs sm:text-[13px] font-semibold tracking-wider text-[#1A3326] uppercase transition-all duration-200 hover:bg-[#123826]/5 active:scale-[0.98]"
              >
                EXPLORE COLLECTION
              </Link>
            </motion.div>

            {/* Trust Badges: 4 Columns with fine vertical dividers (No top line, exactly like reference) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 sm:mt-11 max-w-[460px]"
            >
              <div className="grid grid-cols-4 divide-x divide-[#E5DAC8]">
                
                {/* Badge 1: Premium Quality */}
                <div className="flex flex-col items-center text-center px-1 sm:px-2">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-[#A6824F] mb-1 transition-transform duration-200 hover:scale-110">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 2.5L4.5 5.5v5.5c0 4.8 3.2 9.2 7.5 10.5 4.3-1.3 7.5-5.7 7.5-10.5V5.5L12 2.5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 6.8l-4 1.7v3.2c0 2.6 1.7 5.1 4 5.9 2.3-.8 4-3.3 4-5.9V8.5l-4-1.7z"
                        fill="currentColor"
                        fillOpacity="0.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-[10.5px] sm:text-[11.5px] font-medium text-[#3A3834] leading-[1.2]">
                    Premium<br />Quality
                  </p>
                </div>

                {/* Badge 2: Elegant Designs */}
                <div className="flex flex-col items-center text-center px-1 sm:px-2">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-[#A6824F] mb-1 transition-transform duration-200 hover:scale-110">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                      <path
                        d="M12 3v3M12 18v3M3 12h3M18 12h3M6.3 6.3l2.2 2.2M15.5 15.5l2.2 2.2M6.3 17.7l2.2-2.2M15.5 8.5l2.2-2.2"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="3" r="0.9" fill="currentColor" />
                      <circle cx="12" cy="21" r="0.9" fill="currentColor" />
                      <circle cx="3" cy="12" r="0.9" fill="currentColor" />
                      <circle cx="21" cy="12" r="0.9" fill="currentColor" />
                      <path
                        d="M12 7.5L14.5 10l2-2.5-2.5-2L12 7.5zM12 16.5L9.5 14l-2 2.5 2.5 2 2-2z"
                        fill="currentColor"
                        fillOpacity="0.25"
                      />
                    </svg>
                  </div>
                  <p className="text-[10.5px] sm:text-[11.5px] font-medium text-[#3A3834] leading-[1.2]">
                    Elegant<br />Designs
                  </p>
                </div>

                {/* Badge 3: Perfect for Every Space */}
                <div className="flex flex-col items-center text-center px-1 sm:px-2">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-[#A6824F] mb-1 transition-transform duration-200 hover:scale-110">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 2.5l2.2 4.5 4.9.7-3.6 3.5.8 4.9-4.3-2.3-4.3 2.3.8-4.9-3.6-3.5 4.9-.7L12 2.5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="11" r="2" fill="currentColor" fillOpacity="0.4" />
                      <circle cx="12" cy="1" r="0.8" fill="currentColor" />
                      <circle cx="21.5" cy="7" r="0.8" fill="currentColor" />
                      <circle cx="2.5" cy="7" r="0.8" fill="currentColor" />
                    </svg>
                  </div>
                  <p className="text-[10.5px] sm:text-[11.5px] font-medium text-[#3A3834] leading-[1.2]">
                    Perfect for<br />Every Space
                  </p>
                </div>

                {/* Badge 4: Made with Care */}
                <div className="flex flex-col items-center text-center px-1 sm:px-2">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center text-[#A6824F] mb-1 transition-transform duration-200 hover:scale-110">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 21.2l-1.3-1.2C5.6 15.4 2.5 12.6 2.5 9.1c0-2.8 2.2-5 5-5 1.6 0 3.1.7 4.1 1.9 1-1.2 2.5-1.9 4.1-1.9 2.8 0 5 2.2 5 5 0 3.5-3.1 6.3-8.2 10.9L12 21.2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="9.5" r="1.5" fill="currentColor" fillOpacity="0.35" />
                      <path d="M12 4.1v-2M9.8 2.8l1.2.7M14.2 2.8l-1.2.7" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[10.5px] sm:text-[11.5px] font-medium text-[#3A3834] leading-[1.2]">
                    Made with<br />Care
                  </p>
                </div>

              </div>
            </motion.div>

          </div>

          {/* Right Column: Hero Visual Slider Frame (Seamless full bleed on desktop matching reference) */}
          <div
            className="lg:col-span-7 xl:col-span-7 relative h-[360px] sm:h-[460px] md:h-[520px] lg:h-full min-h-[360px] sm:min-h-[460px] lg:min-h-[640px] xl:min-h-[700px] w-full"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slides[currentSlide].id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].alt}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                  {/* Subtle soft edge blend on large screens towards the left cream background */}
                  <div
                    className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/30 to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slider Controls: Arrow buttons & 4 Indicator Dots positioned at bottom-left of image exactly like reference */}
              <div
                className="absolute left-6 sm:left-10 lg:left-12 bottom-6 sm:bottom-8 z-20 flex items-center gap-2 bg-black/20 hover:bg-black/35 backdrop-blur-[3px] px-2.5 py-1 rounded-full border border-white/20 shadow-md transition-colors"
                role="region"
                aria-label="Carousel navigation"
              >
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={prevSlide}
                  className="flex h-5 w-5 items-center justify-center text-white/90 hover:text-white transition-colors focus-visible:outline-none"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>

                {/* 4 Indicator Dots */}
                <div className="flex items-center gap-1.5 px-0.5">
                  {slides.map((slide, idx) => {
                    const isActive = idx === currentSlide;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        className={`transition-all duration-300 rounded-full focus-visible:outline-none ${
                          isActive
                            ? 'w-2 h-2 bg-white shadow-sm ring-1 ring-white/70'
                            : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                        aria-current={isActive ? 'true' : 'false'}
                      />
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={nextSlide}
                  className="flex h-5 w-5 items-center justify-center text-white/90 hover:text-white transition-colors focus-visible:outline-none"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}