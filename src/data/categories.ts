import type { Category } from '../types';

export const categories: Category[] = [
  {
    slug: 'curtains',
    name: 'CURTAINS',
    tagline: 'Elegant curtains',
    description: 'Elegant curtains for every room',
    image: '/cat-curtains.jpg',
    count: 38,
  },
  {
    slug: 'bedding',
    name: 'BEDDING',
    tagline: 'Comfort meets',
    description: 'Comfort meets beautiful design',
    image: '/cat-bedding.jpg',
    count: 24,
  },
  {
    slug: 'decor',
    name: 'HOME DECOR',
    tagline: 'Small details,',
    description: 'Small details, beautiful spaces',
    image: '/cat-decor.jpg',
    count: 52,
  },
  {
    slug: 'wall-decor',
    name: 'WALL DECOR',
    tagline: 'Art that transforms',
    description: 'Art that transforms your walls',
    image: '/cat-wall.jpg',
    count: 31,
  },
  {
    slug: 'dining',
    name: 'KITCHEN & DINING',
    tagline: 'Designed for',
    description: 'Designed for everyday living',
    image: '/cat-dining.jpg',
    count: 29,
  },
];

export const categoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);