import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { inspirationScenes } from '../../data/content';
import { productsByIds } from '../../data/products';
import { cx, formatPrice } from '../../utils/format';

export function Inspiration() {
  const [activeId, setActiveId] = useState(inspirationScenes[0].id);
  const scene = inspirationScenes.find((s) => s.id === activeId) ?? inspirationScenes[0];
  const sceneProducts = productsByIds(scene.productIds);

  return (
    <section className="mx-auto max-w-shell px-5 py-20 lg:px-8 lg:py-28">
      <SectionHeading
        eyebrow="Decorate your space"
        title="Rooms our customers actually live in"
        intro="No showroom sets. These are photographs sent in by customers, with every piece in the frame listed underneath." />
      

      <div className="mt-9 flex flex-wrap gap-2">
        {inspirationScenes.map((option) =>
        <button
          key={option.id}
          type="button"
          onClick={() => setActiveId(option.id)}
          aria-pressed={option.id === scene.id}
          className={cx(
            'border px-5 py-2.5 text-[11px] uppercase tracking-widest transition-colors duration-200 ease-soft',
            option.id === scene.id ?
            'border-ink bg-ink text-cream' :
            'border-dune text-smoke hover:border-ink hover:text-ink'
          )}>
          
            {option.room}
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
        <div className="overflow-hidden bg-linen">
          <img
            key={scene.image}
            src={scene.image}
            alt={scene.title}
            className="h-full w-full object-cover"
            loading="lazy" />
          
        </div>

        <div className="flex flex-col">
          <h3 className="font-display text-2xl font-light leading-snug text-ink lg:text-3xl">
            {scene.title}
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-smoke">{scene.copy}</p>

          <p className="eyebrow mt-9 text-clay">In this photograph</p>
          <ul className="mt-4 divide-y divide-sand border-y border-sand">
            {sceneProducts.map((product) =>
            <li key={product.id}>
                <Link
                to={`/product/${product.slug}`}
                className="group flex items-center gap-4 py-4 transition-colors duration-200 ease-soft hover:bg-linen">
                
                  <img
                  src={product.images[0]}
                  alt=""
                  className="h-16 w-16 shrink-0 object-cover"
                  loading="lazy" />
                
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink group-hover:text-clay">{product.name}</p>
                    <p className="mt-1 text-sm text-smoke">{formatPrice(product.price)}</p>
                  </div>
                  <span className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center border border-dune text-ink transition-colors duration-200 ease-soft group-hover:border-ink">
                    <PlusIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>);

}