import React from 'react';
import { StarIcon } from 'lucide-react';
import { cx } from '../../utils/format';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function Rating({ value, count, size = 'sm', className }: RatingProps) {
  const dimension = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <div
      className={cx('flex items-center gap-2', className)}
      aria-label={`Rated ${value} out of 5${count ? ` from ${count} reviews` : ''}`}>
      
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) =>
        <StarIcon
          key={star}
          className={cx(
            dimension,
            star <= Math.round(value) ? 'fill-gold text-gold' : 'text-dune'
          )}
          strokeWidth={1.5} />

        )}
      </div>
      {count !== undefined &&
      <span className="text-xs text-smoke">
          {value.toFixed(1)} <span className="text-smoke/60">({count})</span>
        </span>
      }
    </div>);

}