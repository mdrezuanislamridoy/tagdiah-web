import type { Review } from '../types';

export const IMAGES = {
  hero: "/7c6c0d51-a3c1-4b33-9403-02f6adf28475.jpg",
  promo: "/7d80354e-51bd-4697-9b63-60dd6e9e3800.jpg",

  inspoLiving: "/61989b94-2241-4d50-a511-97e9d0da28a9.jpg",

  inspoEntry: "/d3c76be8-f825-463c-9c8c-909a264175be.jpg",

  insta1: "/6835313e-ef30-4cec-8798-e2d63b937af5.jpg",

  insta2: "/31b27560-22a9-4cb8-8219-9acc8bae14a2.jpg",

  wallDecor: "/0ca55bf6-661e-4372-b546-80242ee32131.jpg",

  porda: "/fab89c34-a141-4647-bbea-518083e24b92.jpg",

  accessories: "/c76ac6fa-625d-47b6-bb62-2c0d2003facc.jpg",

  arts: "/50130f5c-dcde-4c5a-bfbf-68c0c580ad71.jpg"
};

export interface InspirationScene {
  id: string;
  room: string;
  title: string;
  copy: string;
  image: string;
  productIds: string[];
}

export const inspirationScenes: InspirationScene[] = [
{
  id: 'living',
  room: 'The living room',
  title: 'A gallery wall that grew slowly',
  copy: 'Nusrat started with one framed trio and added a piece each season. The rattan chair and jute round keep the wall from feeling formal.',
  image: IMAGES.inspoLiving,
  productIds: ['p-07', 'p-04', 'p-05']
},
{
  id: 'entry',
  room: 'The entryway',
  title: 'Three metres, four decisions',
  copy: 'A narrow hallway carries a console, a brass halo, a basket for shoes and a linen porda softening the door to the kitchen.',
  image: IMAGES.inspoEntry,
  productIds: ['p-02', 'p-05', 'p-03']
}];


export const instagramPosts = [
{ id: 'ig-1', image: IMAGES.insta1, caption: 'Shelf styling, Sunday edition', likes: 1284 },
{ id: 'ig-2', image: IMAGES.insta2, caption: 'Tassel detail on the Sahil porda', likes: 962 },
{ id: 'ig-3', image: IMAGES.inspoLiving, caption: 'Nusrat’s corner in Gulshan', likes: 2140 },
{ id: 'ig-4', image: IMAGES.wallDecor, caption: 'Layering the Chhaya panel', likes: 1571 },
{ id: 'ig-5', image: IMAGES.accessories, caption: 'New stoneware, still warm', likes: 1103 },
{ id: 'ig-6', image: IMAGES.inspoEntry, caption: 'Entryways deserve better', likes: 1836 }];


export const testimonials = [
{
  id: 't-1',
  quote:
  'The macramé panel arrived rolled in cloth, not plastic — that told me everything. It has completely changed the wall behind our sofa.',
  author: 'Farhana Rahman',
  location: 'Dhanmondi, Dhaka',
  rating: 5,
  product: 'Aranya Macramé Wall Hanging'
},
{
  id: 't-2',
  quote:
  'I ordered two porda panels for our bedroom doorway. The linen is heavier than I expected in the best way, and the colour is exactly as photographed.',
  author: 'Imtiaz Chowdhury',
  location: 'Chattogram',
  rating: 5,
  product: 'Sahil Linen Door Porda'
},
{
  id: 't-3',
  quote:
  'Customer care helped me measure my doorway over WhatsApp before I ordered the made-to-order set. It fits perfectly.',
  author: 'Sadia Karim',
  location: 'Sylhet',
  rating: 4,
  product: 'Naqsh Embroidered Porda'
}];


export const productReviews: Record<string, Review[]> = {
  default: [
  {
    id: 'r-1',
    author: 'Farhana R.',
    location: 'Dhaka',
    rating: 5,
    date: '12 July 2026',
    title: 'Better in person',
    body: 'The texture and weight are noticeably better than anything I have found locally at this price. Packaging was thoughtful — cloth wrap, no plastic. Delivery took three days.',
    verified: true
  },
  {
    id: 'r-2',
    author: 'Imtiaz C.',
    location: 'Chattogram',
    rating: 5,
    date: '28 June 2026',
    title: 'Exactly as photographed',
    body: 'I am usually wary of ordering décor online because colours never match. This is the first time the piece looked exactly like the listing in my own light.',
    verified: true
  },
  {
    id: 'r-3',
    author: 'Sadia K.',
    location: 'Sylhet',
    rating: 4,
    date: '09 June 2026',
    title: 'Lovely, wish it came in one more size',
    body: 'No complaints about the craftsmanship at all. I would have chosen a slightly larger version for our high ceiling if one existed. Fitting was straightforward.',
    verified: true
  },
  {
    id: 'r-4',
    author: 'Rezwan H.',
    location: 'Khulna',
    rating: 5,
    date: '02 June 2026',
    title: 'Third order from Tagdiah',
    body: 'Consistent quality across everything I have bought. The team answered my sizing question the same evening.',
    verified: true
  }]

};

export const ratingBreakdown = [
{ stars: 5, count: 86 },
{ stars: 4, count: 27 },
{ stars: 3, count: 9 },
{ stars: 2, count: 3 },
{ stars: 1, count: 1 }];


export const faqs = [
{
  group: 'Orders & Delivery',
  items: [
  {
    q: 'How long will my order take to arrive?',
    a: 'Inside Dhaka, orders placed before 4pm ship the same day and arrive within 1–2 working days. Outside Dhaka, allow 3–5 working days. Made-to-order pieces such as the Naqsh porda take 14–21 days before dispatch.'
  },
  {
    q: 'Do you deliver outside Bangladesh?',
    a: 'Yes. We ship to India, Malaysia, the UAE, the UK and the US via DHL. International charges are calculated at checkout and duties are payable on arrival.'
  },
  {
    q: 'Can I track my order?',
    a: 'Every dispatch email includes a courier tracking number. You can also follow the status from My Orders in your account.'
  }]

},
{
  group: 'Products & Care',
  items: [
  {
    q: 'Why does my piece look slightly different from the photo?',
    a: 'Almost everything we sell is made by hand, so weave density, glaze speckle and wood grain vary from piece to piece. We photograph a representative item, never a best case.'
  },
  {
    q: 'How do I wash a porda?',
    a: 'Washed linen panels take a cold machine wash on a gentle cycle and should be line dried in shade. Embroidered and bell-trimmed panels should be dry cleaned.'
  },
  {
    q: 'Do you offer fitting or installation?',
    a: 'Within Dhaka we offer paid installation for wall panels and mirrors over ৳5,000. Add it at checkout or call us to arrange a slot.'
  }]

},
{
  group: 'Returns & Payment',
  items: [
  {
    q: 'What is your return window?',
    a: 'Seven days from delivery for unused pieces in original packaging. Made-to-order and custom-sized items cannot be returned unless they arrive damaged.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'bKash, Nagad, all major debit and credit cards, and cash on delivery for orders under ৳15,000 inside Dhaka.'
  },
  {
    q: 'Something arrived damaged. What now?',
    a: 'Send us photographs within 48 hours of delivery and we will arrange a replacement or a full refund, including return pickup, at no cost to you.'
  }]

}];


export const storyValues = [
{
  title: 'Made by hand, named for the maker',
  body: 'Every piece carries the initials of the artisan who finished it. We publish the workshop, the district and the number of days the work took.'
},
{
  title: 'Fair, published pricing',
  body: 'Sixty percent of what you pay goes to the workshop. We would rather price honestly once than discount theatrically all year.'
},
{
  title: 'Materials that age well',
  body: 'Unlacquered brass, unglazed terracotta, washed linen, seasoned mango wood. We choose materials that look better in year five than year one.'
}];