import React, { useState } from 'react';
import { cx } from '../../utils/format';

interface ProductGalleryProps {
  images: string[];
  name: string;
  badge?: string;
}

export function ProductGallery({ images, name, badge }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      <ul className="flex gap-3 overflow-x-auto hide-scrollbar lg:flex-col lg:overflow-visible">
        {images.map((image, index) =>
        <li key={image}>
            <button
            type="button"
            onClick={() => setActive(index)}
            aria-label={`View image ${index + 1} of ${name}`}
            aria-current={index === active}
            className={cx(
              'block h-20 w-20 overflow-hidden border transition-colors duration-200 ease-soft',
              index === active ? 'border-ink' : 'border-transparent hover:border-dune'
            )}>
            
              <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          </li>
        )}
      </ul>

      <div className="relative flex-1 overflow-hidden bg-linen">
        {badge &&
        <span className="absolute left-5 top-5 z-10 bg-ink px-3 py-1 text-[10px] uppercase tracking-widest text-cream">
            {badge}
          </span>
        }
        <div className="aspect-[4/5] w-full">
          <img
            key={images[active]}
            src={images[active]}
            alt={`${name} — view ${active + 1}`}
            className="h-full w-full object-cover" />
          
        </div>
      </div>
    </div>);

}