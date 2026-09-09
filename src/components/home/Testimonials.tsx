import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '../../data/content';

export function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);

  const prev = () => {
    setStartIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="bg-[#FAF7F2] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Section Heading */}
        <h2 className="text-center font-display text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[0.08em] text-[#163323] uppercase mb-8 sm:mb-10">
          WHAT OUR CUSTOMERS SAY
        </h2>

        {/* Carousel Container with Side Arrows */}
        <div className="relative flex items-center">
          
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={prev}
            className="hidden sm:flex absolute -left-3 lg:-left-5 z-10 h-8 w-8 items-center justify-center rounded-full border border-[#D5C2A5] bg-white text-[#8C6D45] shadow-sm hover:bg-[#FAF7F2] transition-colors focus-visible:outline-none"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>

          {/* 3 Review Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between bg-white rounded-md border border-[#ECE5D8] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
              >
                {/* 5 Stars */}
                <div>
                  <div className="flex text-[#E5A83B] text-sm tracking-widest">
                    {'★★★★★'}
                  </div>

                  {/* Quote */}
                  <p className="mt-3.5 text-xs sm:text-[13px] leading-relaxed text-[#3A3834] italic font-normal">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info with Avatar */}
                <div className="mt-6 flex items-center gap-3 pt-3 border-t border-[#F0EBE1]">
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-[#E2D8C9] shrink-0 ring-1 ring-[#D8CCBA]">
                    <img
                      src={item.avatar || '/avatar-1.jpg'}
                      alt={item.author}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span className="text-xs sm:text-[13px] font-semibold text-[#1A2E22]">
                      — {item.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={next}
            className="hidden sm:flex absolute -right-3 lg:-right-5 z-10 h-8 w-8 items-center justify-center rounded-full border border-[#D5C2A5] bg-white text-[#8C6D45] shadow-sm hover:bg-[#FAF7F2] transition-colors focus-visible:outline-none"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>

        </div>

      </div>
    </section>
  );
}