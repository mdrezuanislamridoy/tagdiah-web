import React from 'react';
import { motion } from 'framer-motion';
import { ButtonLink } from '../ui/Button';
import { IMAGES } from '../../data/content';
import { useAuth } from '../../contexts/AuthContext';

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] as const }
  })
};

export function Hero() {
  const { user, isAuthenticated } = useAuth();

  return (
    <section className="relative isolate">
      <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden lg:h-[86vh]">
        <img
          src={IMAGES.hero}
          alt="A sunlit living room styled with a macramé wall hanging, terracotta vase and linen door curtain"
          className="h-full w-full object-cover" />
        
        <div className="absolute inset-0 bg-ink/25" aria-hidden="true" />

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-shell items-center px-5 lg:px-8">
            <div className="max-w-xl">
              <motion.p
                custom={0}
                variants={rise}
                initial="hidden"
                animate="show"
                className="eyebrow text-cream/90">
                
                {isAuthenticated && user
                  ? `Welcome back, ${user.name.split(' ')[0]} — curated just for you`
                  : 'Handmade in Bangladesh · Shipped worldwide'}
              </motion.p>
              <motion.h1
                custom={1}
                variants={rise}
                initial="hidden"
                animate="show"
                className="mt-5 font-display text-[2.75rem] font-light leading-[1.05] text-cream sm:text-6xl lg:text-[4.25rem]">
                
                The wall behind your sofa deserves a story.
              </motion.h1>
              <motion.p
                custom={2}
                variants={rise}
                initial="hidden"
                animate="show"
                className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/85">
                
                Wall hangings, handloom door porda and quiet objects — each made by hand in small
                workshops, each named for the artisan who finished it.
              </motion.p>
              <motion.div
                custom={3}
                variants={rise}
                initial="hidden"
                animate="show"
                className="mt-9 flex flex-wrap gap-3">
                
                <ButtonLink to="/shop" size="lg" variant="light">
                  Shop Collection
                </ButtonLink>
                {isAuthenticated ? (
                  <ButtonLink to="/account" variant="ghost" size="lg">
                    My Account
                  </ButtonLink>
                ) : (
                  <ButtonLink to="/auth" variant="ghost" size="lg">
                    Sign In
                  </ButtonLink>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-sand bg-warmwhite">
        <ul className="mx-auto grid max-w-shell grid-cols-2 divide-sand px-5 lg:grid-cols-4 lg:divide-x lg:px-8">
          {[
          { title: 'Free delivery', body: 'On every order above ৳5,000' },
          { title: '7-day returns', body: 'Unused pieces, no questions' },
          { title: 'Made by hand', body: '40+ artisans across 6 districts' },
          { title: 'Styling help', body: 'Message us before you buy' }].
          map((item) =>
          <li key={item.title} className="px-0 py-6 lg:px-8">
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-ink">
                {item.title}
              </p>
              <p className="mt-1.5 text-[13px] text-smoke">{item.body}</p>
            </li>
          )}
        </ul>
      </div>
    </section>);

}