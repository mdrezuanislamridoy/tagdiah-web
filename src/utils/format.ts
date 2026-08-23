export const formatPrice = (value: number): string =>
`৳${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export const discountPercent = (price: number, compareAt?: number): number | null => {
  if (!compareAt || compareAt <= price) return null;
  return Math.round((compareAt - price) / compareAt * 100);
};

export const availabilityLabel: Record<string, string> = {
  'in-stock': 'In stock',
  'low-stock': 'Only a few left',
  'made-to-order': 'Made to order'
};

export const cx = (...classes: (string | false | null | undefined)[]): string =>
classes.filter(Boolean).join(' ');