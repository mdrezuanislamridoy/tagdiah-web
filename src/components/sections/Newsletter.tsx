import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';

export function Newsletter() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [subscribed, setSubscribed] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await api.post('/contact/newsletter/subscribe', { email: email.trim() });
    } catch {
      // optimistic
    }
    setSubscribed(true);
  };

  return (
    <section className="bg-[#FAF7F2] py-8 sm:py-12 border-t border-[#E8DEC8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Stay Updated form */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h3 className="text-xs sm:text-[13px] font-bold tracking-[0.14em] text-[#163323] uppercase">
              STAY UPDATED
            </h3>
            <p className="mt-1.5 text-xs sm:text-[13px] text-[#5C554D] leading-relaxed">
              Subscribe to get special offers, free giveaways and once-in-a-lifetime deals.
            </p>

            {subscribed ? (
              <div className="mt-3.5 flex items-center gap-2 text-xs font-semibold text-[#163323]">
                <span>✓ Thank you for subscribing! Check your email for special offers.</span>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-3.5 flex items-center gap-2 max-w-md">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-10 sm:h-11 flex-1 rounded-[3px] border border-[#D5C6AF] bg-white px-3.5 text-xs sm:text-sm text-[#222] placeholder:text-[#9A9184] focus:border-[#163323] focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-10 sm:h-11 rounded-[3px] bg-[#123826] px-5 sm:px-6 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#0c261a] active:scale-[0.98] shrink-0"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>

          {/* Right Column: 4 Service Guarantees */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 border-t lg:border-t-0 pt-6 lg:pt-0 border-[#E8DEC8]">
            
            {/* Badge 1: Cash on Delivery */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center text-[#143D28] shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="12" r="1.5" fill="#C4A468" stroke="none" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-[#143D28] leading-tight">
                  Cash on Delivery
                </p>
                <p className="text-[10px] text-[#6E665A] leading-tight mt-0.5">
                  All Over Bangladesh
                </p>
              </div>
            </div>

            {/* Badge 2: 7 Days Easy Return */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center text-[#143D28] shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2" fill="#C4A468" stroke="none" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-[#143D28] leading-tight">
                  7 Days Easy
                </p>
                <p className="text-[10px] text-[#6E665A] leading-tight mt-0.5">
                  Return Policy
                </p>
              </div>
            </div>

            {/* Badge 3: 100% Premium Quality */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center text-[#143D28] shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="8.5" r="5.5" />
                  <path d="M12 5.5l1 2 2.5.5-2 1.5.5 2.5-2-1-2 1 .5-2.5-2-1.5 2.5-.5z" fill="#C4A468" stroke="none" />
                  <path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-[#143D28] leading-tight">
                  100% Premium
                </p>
                <p className="text-[10px] text-[#6E665A] leading-tight mt-0.5">
                  Quality
                </p>
              </div>
            </div>

            {/* Badge 4: Safe & Secure Shopping */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center text-[#143D28] shrink-0">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 2L4 5v6.5C4 16.5 7.5 21 12 22c4.5-1 8-5.5 8-10.5V5l-8-3z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="1.5" fill="#C4A468" stroke="none" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-[#143D28] leading-tight">
                  Safe &amp; Secure
                </p>
                <p className="text-[10px] text-[#6E665A] leading-tight mt-0.5">
                  Shopping
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
