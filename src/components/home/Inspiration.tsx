import React from 'react';
import { Link } from 'react-router-dom';

const customerPhotos = [
  { id: 'p1', image: '/hero-curtains-living.jpg', alt: 'Customer living room styled with sheer curtains and indoor plant' },
  { id: 'p2', image: '/hero-slide-bedding.jpg', alt: 'Customer bedroom styled with grey quilt comforter set' },
  { id: 'p3', image: '/489a76f1-c1e9-4ed6-a767-054dec61c3f5.jpg', alt: 'Customer entryway console with floral arrangement' },
  { id: 'p4', image: '/61989b94-2241-4d50-a511-97e9d0da28a9.jpg', alt: 'Customer sunlit lounge with cozy sofa and cushions' },
  { id: 'p5', image: '/hero-slide-dining.jpg', alt: 'Customer dining room with wood dining table and curtains' },
];

export function Inspiration() {
  return (
    <section className="bg-[#FAF7F2] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
        
        {/* Title */}
        <h2 className="font-display text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[0.08em] text-[#163323] uppercase mb-7 sm:mb-9">
          LOVED BY OUR CUSTOMERS
        </h2>

        {/* 5-Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {customerPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-md bg-[#ECE4D8] shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <img
                src={photo.image}
                alt={photo.alt}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-8 sm:mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-[3px] bg-[#123826] px-8 py-2.5 sm:py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#0c261a] shadow-sm active:scale-[0.98]"
          >
            SEE MORE PHOTOS
          </Link>
        </div>

      </div>
    </section>
  );
}