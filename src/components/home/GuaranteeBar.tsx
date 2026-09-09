import React from 'react';

export function GuaranteeBar() {
  const items = [
    {
      title: 'PREMIUM QUALITY',
      subtitle: 'Carefully selected high-quality products',
      icon: (
        <svg className="w-8 h-8 text-[#143D28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="8.5" r="5.5" strokeLinecap="round" />
          <path d="M12 5.5l1 2 2.5.5-2 1.5.5 2.5-2-1-2 1 .5-2.5-2-1.5 2.5-.5z" fill="#C4A468" stroke="none" />
          <path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: 'CUSTOM SIZE OPTION',
      subtitle: 'Curtains in your required size',
      icon: (
        <svg className="w-8 h-8 text-[#143D28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 4v16M17 4v16M3 12h18" strokeDasharray="1 1" />
          <circle cx="7" cy="12" r="1.5" fill="#C4A468" stroke="none" />
          <circle cx="17" cy="12" r="1.5" fill="#C4A468" stroke="none" />
        </svg>
      ),
    },
    {
      title: 'EASY RETURNS',
      subtitle: '7 days easy return policy',
      icon: (
        <svg className="w-8 h-8 text-[#143D28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.5" fill="#C4A468" stroke="none" />
        </svg>
      ),
    },
    {
      title: 'FAST DELIVERY',
      subtitle: '2–4 days delivery all over Bangladesh',
      icon: (
        <svg className="w-8 h-8 text-[#143D28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="2" y="5" width="13" height="11" rx="1" />
          <path d="M15 9h4l3 3v4h-7V9z" />
          <circle cx="6.5" cy="18.5" r="2.5" />
          <circle cx="17.5" cy="18.5" r="2.5" />
          <circle cx="6.5" cy="18.5" r="1" fill="#C4A468" stroke="none" />
          <circle cx="17.5" cy="18.5" r="1" fill="#C4A468" stroke="none" />
        </svg>
      ),
    },
    {
      title: 'SECURE PAYMENT',
      subtitle: '100% secure payment & cash on delivery',
      icon: (
        <svg className="w-8 h-8 text-[#143D28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 2L4 5v6.5C4 16.5 7.5 21 12 22c4.5-1 8-5.5 8-10.5V5l-8-3z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="11" r="3" />
          <circle cx="12" cy="11" r="1.5" fill="#C4A468" stroke="none" />
          <path d="M12 14v3" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#FAF7F2] py-6 sm:py-8">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="bg-[#FAF7F2] rounded-lg border border-[#E8DEC8] py-5 sm:py-6 px-3 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E5DAC8]">
            {items.map((item, idx) => (
              <div
                key={item.title}
                className={`flex items-center gap-3.5 px-2 sm:px-3 ${
                  idx > 0 ? 'pt-4 md:pt-0' : ''
                }`}
              >
                <div className="shrink-0">{item.icon}</div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#143D28] tracking-wider uppercase leading-snug">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 text-[10px] sm:text-[11px] text-[#5C554D] leading-tight">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
