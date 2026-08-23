import React from 'react';
import { ButtonLink } from '../components/ui/Button';
import { Newsletter } from '../components/sections/Newsletter';
import { IMAGES, storyValues } from '../data/content';

export function About() {
  return (
    <>
      <section className="relative">
        <div className="h-[52vh] min-h-[380px] w-full overflow-hidden">
          <img
            src={IMAGES.inspoEntry}
            alt="A warm entryway styled with a brass mirror, oak console and linen curtain"
            className="h-full w-full object-cover" />
          
          <div className="absolute inset-0 bg-ink/35" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-shell px-5 lg:px-8">
            <p className="eyebrow text-cream/85">Since 2019 · Dhaka, Bangladesh</p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-light leading-tight text-cream lg:text-6xl">
              We started with one weaver and a very empty wall
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-clay">Our story</p>
            <h2 className="mt-3 font-display text-3xl font-light leading-tight text-ink lg:text-[2.5rem]">
              Handwork, priced honestly, made close to home
            </h2>
          </div>
          <div className="space-y-5 text-[15px] leading-relaxed text-smoke">
            <p>
              Tagdiah began in a two-room flat in Dhanmondi, where our founder Ayesha Tabassum
              commissioned a single macramé panel from a weaver in Rajshahi because she could not
              find anything she liked in the city. Friends asked where it came from. Then their
              friends did.
            </p>
            <p>
              Seven years later we work with forty-two artisans across six districts — weavers,
              potters, brass-beaters and carvers — and we still commission in small runs. Nothing we
              sell is mass-produced, and nothing sits in a warehouse for a year.
            </p>
            <p>
              We publish where each piece is made, how long it took and what share of the price goes
              to the workshop. It makes our margins visible, which we think is the point.
            </p>
          </div>
        </div>

        <dl className="mt-20 grid gap-10 border-t border-sand pt-14 lg:grid-cols-3 lg:gap-14">
          {storyValues.map((value) =>
          <div key={value.title}>
              <dt className="font-display text-2xl font-light leading-snug text-ink">
                {value.title}
              </dt>
              <dd className="mt-4 text-[15px] leading-relaxed text-smoke">{value.body}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="border-y border-sand bg-warmwhite">
        <div className="mx-auto grid max-w-shell gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8 lg:py-28">
          <div className="overflow-hidden bg-linen">
            <img
              src={IMAGES.inspoLiving}
              alt="A living room corner with a gallery wall of earth-tone prints and a rattan chair"
              className="h-full w-full object-cover"
              loading="lazy" />
            
          </div>
          <div>
            <p className="eyebrow text-clay">By the numbers</p>
            <h2 className="mt-3 font-display text-3xl font-light leading-tight text-ink lg:text-[2.5rem]">
              A small studio, on purpose
            </h2>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10">
              {[
              { value: '42', label: 'Artisans we commission from' },
              { value: '6', label: 'Districts across Bangladesh' },
              { value: '60%', label: 'Of the price paid to the workshop' },
              { value: '11,400', label: 'Homes decorated since 2019' }].
              map((stat) =>
              <div key={stat.label}>
                  <dt className="font-display text-4xl font-light text-ink lg:text-5xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-smoke">{stat.label}</dd>
                </div>
              )}
            </dl>
            <ButtonLink to="/shop" className="mt-10">
              Shop the collection
            </ButtonLink>
          </div>
        </div>
      </section>

      <Newsletter />
    </>);

}