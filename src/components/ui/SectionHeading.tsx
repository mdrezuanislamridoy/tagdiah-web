import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { cx } from '../../utils/format';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  linkTo?: string;
  linkLabel?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  linkTo,
  linkLabel,
  align = 'left',
  className
}: SectionHeadingProps) {
  return (
    <div
      className={cx(
        'flex flex-col gap-5 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className
      )}>
      
      <div className={cx('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        {eyebrow && <p className="eyebrow mb-3 text-clay">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-light leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        {intro && <p className="mt-4 text-[15px] leading-relaxed text-smoke">{intro}</p>}
      </div>
      {linkTo && linkLabel &&
      <Link
        to={linkTo}
        className="group inline-flex shrink-0 items-center gap-2 border-b border-ink/25 pb-1 text-[11px] uppercase tracking-widest text-ink transition-colors duration-200 ease-soft hover:border-clay hover:text-clay">
        
          {linkLabel}
          <ArrowRightIcon
          className="h-3.5 w-3.5 transition-transform duration-200 ease-soft group-hover:translate-x-1"
          strokeWidth={1.5} />
        
        </Link>
      }
    </div>);

}