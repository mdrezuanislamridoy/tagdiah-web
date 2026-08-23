import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: {items: Crumb[];}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-smoke">
        <li>
          <Link to="/" className="transition-colors duration-200 ease-soft hover:text-ink">
            Home
          </Link>
        </li>
        {items.map((item) =>
        <li key={item.label} className="flex items-center gap-2">
            <ChevronRightIcon className="h-3 w-3 text-dune" strokeWidth={1.5} />
            {item.to ?
          <Link to={item.to} className="transition-colors duration-200 ease-soft hover:text-ink">
                {item.label}
              </Link> :

          <span className="text-ink">{item.label}</span>
          }
          </li>
        )}
      </ol>
    </nav>);

}