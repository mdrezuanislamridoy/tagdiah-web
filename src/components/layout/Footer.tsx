import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B281A] text-[#E0D8C8] pt-14 pb-8 border-t border-[#16432B]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#1A4B31]">
          
          {/* Column 1: Brand Info & Socials (4 cols on lg) */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5">
              {/* Ornate Gold Emblem */}
              <div className="flex h-9 w-9 items-center justify-center text-[#C4A468] shrink-0">
                <svg viewBox="0 0 40 40" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity="0.25" />
                  <path d="M20 4 C16 12, 16 16, 20 20 C24 16, 24 12, 20 4 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M20 36 C16 28, 16 24, 20 20 C24 24, 24 28, 20 36 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M4 20 C12 16, 16 16, 20 20 C16 24, 12 24, 4 20 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M36 20 C28 16, 24 16, 20 20 C24 24, 28 24, 36 20 Z" fill="currentColor" fillOpacity="0.2" />
                  <circle cx="20" cy="20" r="14" strokeDasharray="2 2" strokeOpacity="0.5" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-medium tracking-[0.04em] text-white">
                  Tagdiah
                </span>
                <span className="mt-0.5 text-[8px] uppercase tracking-[0.26em] text-[#C4A468] font-semibold">
                  HOME DECOR &amp; ARTS
                </span>
              </div>
            </Link>

            <p className="mt-5 text-xs sm:text-[13px] leading-relaxed text-[#C5BBAA] max-w-sm">
              Bringing elegance, comfort and style to your home with our premium home décor collection.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[#D5CCBA] hover:text-white hover:border-white transition-colors"
              >
                <Facebook className="h-3.5 w-3.5" strokeWidth={1.75} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[#D5CCBA] hover:text-white hover:border-white transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" strokeWidth={1.75} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[#D5CCBA] hover:text-white hover:border-white transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .591.044.87.13V9.4a6.34 6.34 0 0 0-.87-.06A6.33 6.33 0 0 0 3.12 15.7 6.34 6.34 0 0 0 9.46 22a6.34 6.34 0 0 0 6.33-6.33V9.22c1.39.99 3.08 1.57 4.9 1.62v-3.47a4.86 4.86 0 0 1-1.1-.68z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[#D5CCBA] hover:text-white hover:border-white transition-colors"
              >
                <Youtube className="h-3.5 w-3.5" strokeWidth={1.75} />
              </a>
            </div>
          </div>

          {/* Column 2: SHOP (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              SHOP
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#B8AE9E]">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=curtains" className="hover:text-white transition-colors">Curtains</Link></li>
              <li><Link to="/shop?category=bedding" className="hover:text-white transition-colors">Bedding</Link></li>
              <li><Link to="/shop?category=decor" className="hover:text-white transition-colors">Home Decor</Link></li>
              <li><Link to="/shop?category=dining" className="hover:text-white transition-colors">Kitchen &amp; Dining</Link></li>
              <li><Link to="/shop/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?sale=true" className="hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Column 3: CUSTOMER CARE (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#B8AE9E]">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Return &amp; Refund</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 4: MY ACCOUNT (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              MY ACCOUNT
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#B8AE9E]">
              <li><Link to="/account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Blogs &amp; Tips</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Care Instructions</Link></li>
            </ul>
          </div>

          {/* Column 5: CONTACT US (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              CONTACT US
            </h4>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#B8AE9E]">
              <li className="flex items-start gap-2">
                <Phone className="h-3.5 w-3.5 text-[#C4A468] shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <a href="tel:+8801332131386" className="text-white hover:underline block font-medium">
                    +880 1332-131386
                  </a>
                  <span className="text-[11px] text-[#9E9585]">(10AM - 10PM)</span>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#C4A468] shrink-0" strokeWidth={1.75} />
                <a href="mailto:tagdiah.bd@gmail.com" className="text-white hover:underline truncate">
                  tagdiah.bd@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#C4A468] shrink-0 mt-0.5" strokeWidth={1.75} />
                <span className="text-[11.5px] leading-snug">
                  Dewgaon, Rajashan, Savar, Dhaka, Bangladesh, 1340
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright on Left, Payment Gateways on Right */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A89D8B]">
          <p>© 2025 Tagdiah Home Decor &amp; Arts. All Rights Reserved.</p>
          
          {/* Payment Badges */}
          <div className="flex items-center gap-3">
            {/* bKash */}
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#E2136E] text-[10px] font-bold text-white tracking-wide">
              bKash
            </span>
            {/* Nagad */}
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#F7931E] text-[10px] font-bold text-white tracking-wide">
              nagad
            </span>
            {/* VISA */}
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#1A1F71] text-[10px] font-bold text-white tracking-wide">
              VISA
            </span>
            {/* Mastercard */}
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-[#252525] text-[10px] font-bold text-white">
              <span className="h-2.5 w-2.5 rounded-full bg-[#EB001B] inline-block -mr-1" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#F79E1B] inline-block opacity-80" />
              <span className="ml-1 text-[9px]">mastercard</span>
            </span>
            {/* SSL Secured */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#143D28] text-[10px] font-medium text-[#C4A468] border border-[#23583C]">
              <span>🔒</span> SSL Secured
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}