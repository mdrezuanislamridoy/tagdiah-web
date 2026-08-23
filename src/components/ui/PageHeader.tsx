import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs: {label: string;to?: string;}[];
  children?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, intro, crumbs, children }: PageHeaderProps) {
  return (
    <section className="border-b border-sand bg-linen">
      <div className="mx-auto max-w-shell px-5 py-10 lg:px-8 lg:py-14">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {eyebrow && <p className="eyebrow mb-3 text-clay">{eyebrow}</p>}
            <h1 className="font-display text-4xl font-light leading-tight text-ink lg:text-5xl">
              {title}
            </h1>
            {intro && <p className="mt-4 text-[15px] leading-relaxed text-smoke">{intro}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>);

}