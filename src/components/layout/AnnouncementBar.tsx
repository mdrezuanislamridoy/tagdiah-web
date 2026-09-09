import React from 'react';
import { Truck, RotateCcw, PhoneCall, Facebook, Instagram } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-[#0D281A] text-[#F5F2EA] relative z-40 border-b border-[#143B27]">
      <div className="mx-auto flex h-8 sm:h-9 max-w-[1440px] items-center justify-between px-3 sm:px-6 lg:px-8 xl:px-12 text-[11px] sm:text-[11.5px]">
        {/* Left: Free Delivery & 7 Days Return */}
        <div className="flex items-center gap-4 sm:gap-7">
          <div className="flex items-center gap-1.5 text-[#E2DACB]">
            <Truck className="h-3.5 w-3.5 text-[#C4A468] shrink-0" strokeWidth={1.75} />
            <span>Free Delivery on orders over ৳5,000</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[#E2DACB]">
            <RotateCcw className="h-3 w-3 text-[#C4A468] shrink-0" strokeWidth={2} />
            <span>7 Days Easy Return</span>
          </div>
        </div>

        {/* Right: Customer Support & Social Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 text-[#E2DACB]">
            <PhoneCall className="h-3 w-3 text-[#C4A468] shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">Customer Support:</span>
            <a
              href="tel:+8801332131386"
              className="hover:text-white transition-colors tracking-wide font-medium"
            >
              +880 1332-131386
            </a>
          </div>

          <div className="h-3 w-[1px] bg-[#224C34]" aria-hidden="true" />

          {/* Social Icons */}
          <div className="flex items-center gap-2.5 text-[#D1C7B5]">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-white transition-colors"
            >
              <Facebook className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition-colors"
            >
              <Instagram className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="hover:text-white transition-colors"
            >
              <svg className="h-3.5 w-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .591.044.87.13V9.4a6.34 6.34 0 0 0-.87-.06A6.33 6.33 0 0 0 3.12 15.7 6.34 6.34 0 0 0 9.46 22a6.34 6.34 0 0 0 6.33-6.33V9.22c1.39.99 3.08 1.57 4.9 1.62v-3.47a4.86 4.86 0 0 1-1.1-.68z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}