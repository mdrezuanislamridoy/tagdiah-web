import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { categories } from '../../data/categories';
import { cx } from '../../utils/format';

export function CategoryGrid() {
  const [feature, ...rest] = categories;

  return (
    <section className="mx-auto max-w-shell px-5 py-20 lg:px-8 lg:py-28">
      <SectionHeading
        eyebrow="Browse by room, or by craft"
        title="Five collections, one language"
        intro="Everything we make shares the same palette and the same hand — so pieces bought a year apart still sit together."
        linkTo="/shop"
        linkLabel="Shop everything" />
      

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
        <CategoryTile category={feature} className="lg:col-span-2 lg:row-span-2" featured />
        {rest.map((category) =>
        <CategoryTile key={category.slug} category={category} />
        )}
      </div>
    </section>);

}

function CategoryTile({
  category,
  className,
  featured = false




}: {category: (typeof categories)[number];className?: string;featured?: boolean;}) {
  return (
    <Link
      to={`/shop/${category.slug}`}
      className={cx('group relative block overflow-hidden bg-linen', className)}>
      
      <div className={cx('w-full', featured ? 'aspect-[4/5] lg:aspect-auto lg:h-full' : 'aspect-[4/5]')}>
        <img
          src={category.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 ease-soft group-hover:scale-[1.04]"
          loading="lazy" />
        
      </div>
      <div className="absolute inset-0 bg-ink/20 transition-colors duration-200 ease-soft group-hover:bg-ink/35" />
      <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7">
        <p className="eyebrow text-cream/80">{category.tagline}</p>
        <h3
          className={cx(
            'mt-2 font-display font-light text-cream',
            featured ? 'text-3xl lg:text-4xl' : 'text-2xl'
          )}>
          
          {category.name}
        </h3>
        {featured &&
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/80">
            {category.description}
          </p>
        }
        <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-cream">
          {category.count} pieces
          <ArrowUpRightIcon
            className="h-3.5 w-3.5 transition-transform duration-200 ease-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5} />
          
        </span>
      </div>
    </Link>);

}