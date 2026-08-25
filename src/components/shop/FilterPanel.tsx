import React from 'react';
import { StarIcon } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { cx, formatPrice } from '../../utils/format';

export interface Filters {
  categories: string[];
  maxPrice: number;
  colors: string[];
  materials: string[];
  inStockOnly: boolean;
  minRating: number;
}

export const ALL_COLORS = [
  { name: 'Ivory', hex: '#F4EFE7' },
  { name: 'Oatmeal', hex: '#E3D6C2' },
  { name: 'Sand', hex: '#D9C7A9' },
  { name: 'Terracotta', hex: '#B15C3C' },
  { name: 'Clay', hex: '#C06B4A' },
  { name: 'Charcoal', hex: '#3A3532' },
  { name: 'Antique Brass', hex: '#B08A3E' },
  { name: 'Natural', hex: '#CDBB9C' },
];

export const ALL_MATERIALS = [
  'Cotton',
  'Linen',
  'Brass',
  'Ceramic',
  'Terracotta',
  'Wood',
  'Seagrass',
  'Paper',
  'Wild Cane',
  'Tossa Jute',
];

export const PRICE_CEILING = 10000;

interface FilterPanelProps {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
}

export function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const { categories } = useStore();

  const toggle = (key: 'categories' | 'colors' | 'materials', value: string) => {
    const current = filters[key];
    onChange({
      ...filters,
      [key]: current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    });
  };

  return (
    <div className="space-y-9">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-light text-ink">Filter</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] uppercase tracking-widest text-smoke underline underline-offset-4 transition-colors duration-200 ease-soft hover:text-clay"
        >
          Reset
        </button>
      </div>

      <Group label="Category">
        <ul className="space-y-2.5">
          {categories
            .filter((c) => c.slug !== 'new-arrivals')
            .map((category) => (
              <li key={category.slug}>
                <Check
                  checked={filters.categories.includes(category.slug)}
                  onChange={() => toggle('categories', category.slug)}
                  label={category.name}
                  hint={category.count !== undefined ? `${category.count}` : undefined}
                />
              </li>
            ))}
        </ul>
      </Group>

      <Group label="Price">
        <input
          type="range"
          min={1000}
          max={PRICE_CEILING}
          step={250}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          aria-label="Maximum price"
          className="w-full accent-clay" />
        
        <div className="mt-2 flex justify-between text-xs text-smoke">
          <span>{formatPrice(1000)}</span>
          <span className="text-ink">Up to {formatPrice(filters.maxPrice)}</span>
        </div>
      </Group>

      <Group label="Colour">
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((color) => {
            const active = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggle('colors', color.name)}
                aria-pressed={active}
                title={color.name}
                className={cx(
                  'flex h-9 items-center gap-2 border px-2.5 text-xs transition-colors duration-200 ease-soft',
                  active ? 'border-ink text-ink' : 'border-sand text-smoke hover:border-dune'
                )}>
                
                <span
                  className="h-4 w-4 rounded-full border border-ink/10"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true" />
                
                {color.name}
              </button>);

          })}
        </div>
      </Group>

      <Group label="Material">
        <ul className="space-y-2.5">
          {ALL_MATERIALS.map((material) =>
          <li key={material}>
              <Check
              checked={filters.materials.includes(material)}
              onChange={() => toggle('materials', material)}
              label={material} />
            
            </li>
          )}
        </ul>
      </Group>

      <Group label="Availability">
        <Check
          checked={filters.inStockOnly}
          onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
          label="In stock only" />
        
      </Group>

      <Group label="Rating">
        <ul className="space-y-2.5">
          {[4.5, 4, 0].map((value) =>
          <li key={value}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-smoke hover:text-ink">
                <input
                type="radio"
                name="min-rating"
                checked={filters.minRating === value}
                onChange={() => onChange({ ...filters, minRating: value })}
                className="h-4 w-4 accent-clay" />
              
                {value === 0 ?
              'All ratings' :

              <span className="flex items-center gap-1.5">
                    <StarIcon className="h-3.5 w-3.5 fill-gold text-gold" strokeWidth={1.5} />
                    {value} &amp; up
                  </span>
              }
              </label>
            </li>
          )}
        </ul>
      </Group>
    </div>);

}

function Group({ label, children }: {label: string;children: React.ReactNode;}) {
  return (
    <fieldset className="border-t border-sand pt-6">
      <legend className="eyebrow mb-4 text-bark">{label}</legend>
      {children}
    </fieldset>);

}

function Check({
  checked,
  onChange,
  label,
  hint





}: {checked: boolean;onChange: () => void;label: string;hint?: string;}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-smoke transition-colors duration-200 ease-soft hover:text-ink">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-clay" />
      <span className={checked ? 'text-ink' : undefined}>{label}</span>
      {hint && <span className="ml-auto text-xs text-smoke/60">{hint}</span>}
    </label>);

}