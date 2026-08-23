import React from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../utils/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'quiet' | 'light';
type Size = 'sm' | 'md' | 'lg';

const base =
'inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-[background-color,color,border-color,transform] duration-200 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-40 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-cream hover:bg-clay',
  secondary: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream',
  ghost: 'border border-cream/50 text-cream hover:bg-cream hover:text-ink',
  light: 'bg-cream text-ink hover:bg-gold',
  quiet: 'text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-clay hover:text-clay'
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[11px] uppercase tracking-widest',
  md: 'h-11 px-6 text-[11px] uppercase tracking-widest',
  lg: 'h-14 px-9 text-xs uppercase tracking-widest'
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cx(base, variants[variant], variant !== 'quiet' && sizes[size], className)}
      {...rest}>
      
      {children}
    </button>);

}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  to
}: CommonProps & {to: string;}) {
  return (
    <Link
      to={to}
      className={cx(base, variants[variant], variant !== 'quiet' && sizes[size], className)}>
      
      {children}
    </Link>);

}