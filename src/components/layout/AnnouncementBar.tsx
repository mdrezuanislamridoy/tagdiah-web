import React from 'react';
import { Link } from 'react-router-dom';
import { TruckIcon, SparklesIcon, PhoneIcon } from 'lucide-react';

const messages = [
  { icon: TruckIcon, text: 'Free delivery on orders over ৳5,000' },
  { icon: SparklesIcon, text: 'Monsoon collection — up to 20% off' },
  { icon: PhoneIcon, text: 'Hotline: 01332-131386' },
];

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-cream relative z-40 border-b border-ink/20">
      <div className="mx-auto flex h-8 sm:h-9 lg:h-10 max-w-shell items-center justify-between px-3 sm:px-5 lg:px-8">
        <ul className="flex items-center gap-4 sm:gap-8">
          {messages.map(({ icon: Icon, text }, index) => (
            <li
              key={text}
              className={index > 0 ? 'hidden items-center gap-2 md:flex' : 'flex items-center gap-2'}
            >
              <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold shrink-0" strokeWidth={1.5} />
              <span className="text-[10px] sm:text-[11px] tracking-wide text-cream/90 truncate">
                {text}
              </span>
            </li>
          ))}
        </ul>
        <Link
          to="/shop"
          className="hidden text-[10px] sm:text-[11px] uppercase tracking-widest text-cream/80 transition-colors duration-200 ease-soft hover:text-gold sm:block"
        >
          Shop collection →
        </Link>
      </div>
    </div>
  );
}