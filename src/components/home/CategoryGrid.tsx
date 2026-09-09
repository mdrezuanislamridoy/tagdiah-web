import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { categories as defaultCategories } from '../../data/categories';

export function CategoryGrid() {
  const { categories: storeCategories } = useStore();
  const categories = storeCategories && storeCategories.length > 0 ? storeCategories : defaultCategories;

  return (
    <section className="bg-[#FAF7F2] py-12 sm:py-16 lg:py-20 border-b border-[#EAE2D2]/60">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Section Header with Golden Ornament */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-[32px] font-normal tracking-[0.12em] text-[#163323] uppercase">
            SHOP BY CATEGORY
          </h2>
          
          {/* Ornate Gold Divider */}
          <div className="mt-2.5 flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#C4A468]" />
            <div className="flex items-center text-[#C4A468]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor" fillOpacity="0.3" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#C4A468]" />
          </div>
        </div>

        {/* 5 Circular Category Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 justify-items-center">
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className="group flex flex-col items-center text-center focus-visible:outline-none"
            >
              {/* Circle Image Thumbnail */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden bg-[#ECE4D8] ring-1 ring-[#D8CCBA]/80 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:ring-2 group-hover:ring-[#C4A468]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Title */}
              <h3 className="mt-3.5 font-display text-[13px] sm:text-[14px] lg:text-[15px] font-semibold tracking-wider text-[#163323] uppercase transition-colors group-hover:text-[#C4A468]">
                {category.name}
              </h3>

              {/* Subtitle */}
              <p className="mt-1 text-[11px] sm:text-[12px] text-[#635B50] leading-tight max-w-[130px] sm:max-w-[140px]">
                {category.description || category.tagline}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}