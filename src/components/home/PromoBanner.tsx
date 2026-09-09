import React from 'react';
import { Link } from 'react-router-dom';

export function PromoBanner() {
  return (
    <section className="bg-[#FAF7F2] py-8 sm:py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-[#0C2719] text-white shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[220px] sm:min-h-[240px]">
            
            {/* Left Column: Curtain Cutout Image */}
            <div className="lg:col-span-4 h-48 sm:h-56 lg:h-full w-full relative overflow-hidden">
              <img
                src="/promo-curtain-hires.jpg"
                alt="Luxury Sage Green Damask Curtain with Gold Tassel Tieback"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0C2719] to-transparent hidden lg:block" />
            </div>

            {/* Center Column: Text & CTA */}
            <div className="lg:col-span-5 px-6 sm:px-8 py-6 sm:py-8 flex flex-col justify-center">
              <span className="text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#C4A468]">
                SPECIAL OFFER
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl lg:text-[36px] font-normal leading-tight text-white tracking-tight">
                Transform Your Windows
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#E2DACB] tracking-wide">
                Premium Curtains Starting From <span className="font-semibold text-white">৳1,999</span>
              </p>
              <div className="mt-5 sm:mt-6">
                <Link
                  to="/shop?category=curtains"
                  className="inline-flex items-center justify-center rounded-[3px] bg-white px-7 py-2.5 text-xs font-bold tracking-wider text-[#0C2719] uppercase transition-all duration-200 hover:bg-[#F2ECE1] shadow-sm active:scale-[0.98]"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>

            {/* Right Column: 2 Feature Guarantees */}
            <div className="lg:col-span-3 px-6 sm:px-8 py-6 sm:py-8 border-t lg:border-t-0 lg:border-l border-[#1D4632] flex flex-col justify-center gap-5 sm:gap-6">
              
              {/* Feature 1: Custom Size Available */}
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center text-[#C4A468] shrink-0">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="16" rx="2" strokeLinecap="round" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                    <circle cx="6" cy="6.5" r="0.75" fill="currentColor" />
                    <circle cx="6" cy="17.5" r="0.75" fill="currentColor" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <p className="text-xs sm:text-[13px] font-medium text-[#F4EFE6]">
                    Custom Size<br />Available
                  </p>
                </div>
              </div>

              {/* Feature 2: Multiple Designs & Colors */}
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center text-[#C4A468] shrink-0">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="11" r="1.5" fill="currentColor" />
                    <circle cx="15" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="9" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="11" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <p className="text-xs sm:text-[13px] font-medium text-[#F4EFE6]">
                    Multiple Designs<br />&amp; Colors
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}