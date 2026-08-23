import React from 'react';
import { Link } from 'react-router-dom';
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  YoutubeIcon } from
'lucide-react';

const columns = [
{
  title: 'Shop',
  links: [
  { label: 'Wall Décor', to: '/shop/wall-decor' },
  { label: 'Door Porda', to: '/shop/door-porda' },
  { label: 'Home Accessories', to: '/shop/home-accessories' },
  { label: 'Decorative Arts', to: '/shop/decorative-arts' },
  { label: 'New Arrivals', to: '/shop/new-arrivals' }]

},
{
  title: 'Customer Care',
  links: [
  { label: 'Contact Us', to: '/contact' },
  { label: 'My Orders', to: '/account' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Help & FAQ', to: '/faq' },
  { label: 'Shipping & Returns', to: '/shipping-returns' }]

},
{
  title: 'The Studio',
  links: [
  { label: 'About Tagdiah', to: '/about' },
  { label: 'Our Artisans', to: '/about' },
  { label: 'Decorate Your Space', to: '/' },
  { label: 'Privacy Policy', to: '/shipping-returns' },
  { label: 'Terms of Service', to: '/shipping-returns' }]

}];


const socials = [
{ icon: InstagramIcon, label: 'Instagram' },
{ icon: FacebookIcon, label: 'Facebook' },
{ icon: YoutubeIcon, label: 'YouTube' }];


export function Footer() {
  return (
    <footer className="bg-ink text-cream/80">
      <div className="mx-auto max-w-shell px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <span className="font-display text-[26px] font-medium tracking-[0.22em] text-cream">
              TAGDIAH
            </span>
            <p className="mt-1 text-[9px] uppercase tracking-[0.32em] text-gold">
              Home Décor &amp; Arts
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/70">
              Handmade wall décor, door porda and objects for the home — made in small workshops
              across Bangladesh and shipped worldwide.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                <span className="text-cream/70">House 12, Road 27, Banani, Dhaka 1213</span>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                <a href="tel:+8801712004118" className="text-cream/70 hover:text-cream">
                  +880 1712 004 118
                </a>
              </li>
              <li className="flex gap-3">
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                <a href="mailto:hello@tagdiah.com" className="text-cream/70 hover:text-cream">
                  hello@tagdiah.com
                </a>
              </li>
            </ul>
          </div>

          {columns.map((column) =>
          <nav key={column.title} aria-label={column.title}>
              <h3 className="eyebrow text-gold">{column.title}</h3>
              <ul className="mt-6 space-y-3">
                {column.links.map((link) =>
              <li key={link.label}>
                    <Link
                  to={link.to}
                  className="text-sm text-cream/70 transition-colors duration-200 ease-soft hover:text-cream">
                  
                      {link.label}
                    </Link>
                  </li>
              )}
              </ul>
            </nav>
          )}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-cream/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-cream/50">
            © 2026 Tagdiah Home Décor &amp; Arts. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-cream/50">We accept bKash, Nagad, Visa, Mastercard</span>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label }) =>
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center border border-cream/20 text-cream/70 transition-colors duration-200 ease-soft hover:border-gold hover:text-gold">
                
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>);

}