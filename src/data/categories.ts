import type { Category } from '../types';

export const categories: Category[] = [
{
  slug: 'wall-decor',
  name: 'Wall Décor',
  tagline: 'Quiet statements',
  description:
  'Hand-knotted hangings, carved panels and framed art made to give a bare wall a reason to be looked at.',
  image: "/0ca55bf6-661e-4372-b546-80242ee32131.jpg",

  count: 48
},
{
  slug: 'door-porda',
  name: 'Door Porda',
  tagline: 'Soft thresholds',
  description:
  'Handloom curtains that filter light and mark the passage from one room to the next.',
  image: "/fab89c34-a141-4647-bbea-518083e24b92.jpg",

  count: 32
},
{
  slug: 'home-accessories',
  name: 'Home Accessories',
  tagline: 'Everyday objects',
  description:
  'Vases, baskets, lamps and small ceramics — the pieces that make a shelf feel considered.',
  image: "/c76ac6fa-625d-47b6-bb62-2c0d2003facc.jpg",

  count: 64
},
{
  slug: 'decorative-arts',
  name: 'Decorative Arts',
  tagline: 'One of a kind',
  description:
  'Sculptural clay, brass and wood works, each signed by the artisan who shaped it.',
  image: "/50130f5c-dcde-4c5a-bfbf-68c0c580ad71.jpg",

  count: 21
},
{
  slug: 'new-arrivals',
  name: 'New Arrivals',
  tagline: 'Just landed',
  description: 'The newest pieces from our workshops, restocked every fortnight.',
  image: "/d3c76be8-f825-463c-9c8c-909a264175be.jpg",

  count: 18
}];


export const categoryBySlug = (slug: string) =>
categories.find((category) => category.slug === slug);