import React from 'react';
import { instagramPosts } from '../../data/content';

export function InstagramGallery() {
  return (
    <section className="bg-[#FAF7F2] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
        
        {/* Title */}
        <h2 className="font-display text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[0.08em] text-[#163323] uppercase">
          FOLLOW US ON INSTAGRAM
        </h2>
        
        {/* Subtitle / Handle */}
        <p className="mt-1 text-xs sm:text-[13px] font-medium tracking-wider text-[#A6824F]">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            @tagdiahhomedecor
          </a>
        </p>

        {/* 8-Photo Gallery Strip */}
        <div className="mt-7 sm:mt-9 grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {instagramPosts.slice(0, 8).map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden rounded-md bg-[#ECE4D8] shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}