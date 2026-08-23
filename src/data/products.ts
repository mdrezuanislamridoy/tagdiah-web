import type { Product } from '../types';

const IMG = {
  macrame: "/e328ea71-c32d-43d8-b74c-8f8e3029133b.jpg",

  mirror: "/7bacbbfd-5aae-476b-a398-58354390ba1d.jpg",

  pordaLinen: "/ad172792-7186-4679-a0f2-3988f7a8d81e.jpg",

  vase: "/489a76f1-c1e9-4ed6-a767-054dec61c3f5.jpg",
  basket: "/b7acd751-0fa3-4463-8431-efeade2ff972.jpg",

  planter: "/62868358-244f-4b6d-8a7f-0e3f39837dfc.jpg",

  artSet: "/f6bcaf03-2614-40b5-a9d9-22b4c9efdf8d.jpg",

  pordaEmbroidered: "/5937fc08-fa5f-4560-98f0-5ff780d8dee4.jpg",

  lamp: "/44063e24-c2cd-4122-8677-f0f3c1fc398b.jpg",
  sculpture: "/660ebf7d-a91f-48fa-a4b5-d77498c6e8a3.jpg",

  wallPanel: "/0ca55bf6-661e-4372-b546-80242ee32131.jpg",

  doorway: "/fab89c34-a141-4647-bbea-518083e24b92.jpg",

  accessories: "/c76ac6fa-625d-47b6-bb62-2c0d2003facc.jpg",

  arts: "/50130f5c-dcde-4c5a-bfbf-68c0c580ad71.jpg",
  living: "/61989b94-2241-4d50-a511-97e9d0da28a9.jpg",

  entry: "/d3c76be8-f825-463c-9c8c-909a264175be.jpg"

};

export const products: Product[] = [
{
  id: 'p-01',
  slug: 'aranya-macrame-wall-hanging',
  name: 'Aranya Macramé Wall Hanging',
  category: 'wall-decor',
  price: 4800,
  compareAt: 6200,
  rating: 4.8,
  reviewCount: 126,
  images: [IMG.macrame, IMG.living, IMG.wallPanel, IMG.entry],
  badge: 'Best Seller',
  colors: ['Ivory', 'Sand', 'Charcoal'],
  materials: ['Cotton'],
  sizes: ['Medium — 90 cm', 'Large — 120 cm'],
  availability: 'in-stock',
  shortDescription:
  'Hand-knotted in un-dyed cotton over a seasoned teak dowel, with a deep fringe that softens every wall it meets.',
  story:
  'Six artisans in our Rajshahi studio knot each Aranya panel over four days. Because it is worked entirely by hand, no two fringes fall exactly alike — the small irregularities are the signature of the maker, not a flaw.',
  specs: [
  { label: 'Dimensions', value: '120 cm W × 145 cm H (incl. fringe)' },
  { label: 'Material', value: '4 mm un-dyed cotton rope, teak dowel' },
  { label: 'Colour', value: 'Natural ivory' },
  { label: 'Weight', value: '2.1 kg' },
  { label: 'Care', value: 'Dust with a soft brush, spot clean only' }],

  popularity: 98,
  createdAt: '2026-05-12',
  bestSeller: true,
  completeTheLook: ['p-04', 'p-09', 'p-06']
},
{
  id: 'p-02',
  slug: 'surya-brass-sunburst-mirror',
  name: 'Surya Brass Sunburst Mirror',
  category: 'wall-decor',
  price: 7900,
  rating: 4.9,
  reviewCount: 84,
  images: [IMG.mirror, IMG.entry, IMG.wallPanel],
  badge: 'Best Seller',
  colors: ['Antique Brass', 'Blackened Brass'],
  materials: ['Brass', 'Glass'],
  availability: 'in-stock',
  shortDescription:
  'A hand-beaten brass halo around bevelled glass — it throws light back into rooms that never get quite enough.',
  story:
  'Each ray is beaten flat by hand and set by eye, so the halo is never perfectly symmetrical. The brass is left unlacquered and will deepen in tone over the years.',
  specs: [
  { label: 'Dimensions', value: '72 cm diameter × 4 cm depth' },
  { label: 'Material', value: 'Unlacquered brass, 5 mm bevelled glass' },
  { label: 'Colour', value: 'Antique brass' },
  { label: 'Weight', value: '4.6 kg' },
  { label: 'Care', value: 'Polish with a dry cloth; patina is intended' }],

  popularity: 94,
  createdAt: '2026-04-28',
  bestSeller: true,
  completeTheLook: ['p-05', 'p-09', 'p-03']
},
{
  id: 'p-03',
  slug: 'sahil-linen-door-porda',
  name: 'Sahil Linen Door Porda',
  category: 'door-porda',
  price: 3450,
  compareAt: 4200,
  rating: 4.7,
  reviewCount: 212,
  images: [IMG.pordaLinen, IMG.doorway, IMG.entry],
  badge: '18% Off',
  colors: ['Oatmeal', 'Clay', 'Charcoal'],
  materials: ['Linen'],
  sizes: ['7 ft — Door', '9 ft — Long Door'],
  availability: 'in-stock',
  shortDescription:
  'Loose-weave washed linen with a fine terracotta selvedge, cut long so it pools slightly at the floor.',
  story:
  'Woven on handlooms in Tangail and stone-washed twice for a fabric that hangs heavy but moves with a draught. Sold as a single panel; most doorways take two.',
  specs: [
  { label: 'Dimensions', value: '132 cm W × 213 cm H per panel' },
  { label: 'Material', value: '100% washed handloom linen, 210 gsm' },
  { label: 'Colour', value: 'Oatmeal with clay border' },
  { label: 'Header', value: 'Concealed rod pocket, 7.5 cm' },
  { label: 'Care', value: 'Cold machine wash, line dry in shade' }],

  popularity: 96,
  createdAt: '2026-03-19',
  bestSeller: true,
  completeTheLook: ['p-02', 'p-05', 'p-04']
},
{
  id: 'p-04',
  slug: 'mitti-stoneware-vase',
  name: 'Mitti Speckled Stoneware Vase',
  category: 'home-accessories',
  price: 2200,
  rating: 4.6,
  reviewCount: 158,
  images: [IMG.vase, IMG.accessories, IMG.living],
  colors: ['Sand', 'Ash'],
  materials: ['Ceramic'],
  sizes: ['Small — 18 cm', 'Tall — 28 cm'],
  availability: 'in-stock',
  shortDescription:
  'Wheel-thrown stoneware in a matte sand glaze, weighted at the base to hold tall dried stems.',
  story:
  'Thrown one at a time and fired to 1240°C. The speckle comes from iron in the local clay body, so the density of the flecks shifts from batch to batch.',
  specs: [
  { label: 'Dimensions', value: '16 cm diameter × 28 cm H' },
  { label: 'Material', value: 'Speckled stoneware, matte glaze' },
  { label: 'Colour', value: 'Warm sand' },
  { label: 'Watertight', value: 'Yes — suitable for fresh stems' },
  { label: 'Care', value: 'Hand wash, not dishwasher safe' }],

  popularity: 88,
  createdAt: '2026-06-02',
  bestSeller: true,
  completeTheLook: ['p-06', 'p-05', 'p-01']
},
{
  id: 'p-05',
  slug: 'kaya-seagrass-basket',
  name: 'Kaya Seagrass Basket',
  category: 'home-accessories',
  price: 1850,
  compareAt: 2300,
  rating: 4.5,
  reviewCount: 97,
  images: [IMG.basket, IMG.accessories, IMG.entry],
  colors: ['Natural', 'Bark'],
  materials: ['Seagrass', 'Leather'],
  sizes: ['Medium', 'Large'],
  availability: 'low-stock',
  shortDescription:
  'Coil-woven seagrass with soft brown leather handles — for throws, firewood or the things that never get put away.',
  story:
  'Woven by a women-led cooperative in Barisal from seagrass harvested at the end of the monsoon, when the reed is at its most pliable.',
  specs: [
  { label: 'Dimensions', value: '42 cm diameter × 38 cm H' },
  { label: 'Material', value: 'Seagrass, vegetable-tanned leather' },
  { label: 'Colour', value: 'Natural' },
  { label: 'Capacity', value: '48 litres' },
  { label: 'Care', value: 'Keep dry; wipe with a barely damp cloth' }],

  popularity: 79,
  createdAt: '2026-05-30',
  completeTheLook: ['p-04', 'p-03', 'p-06']
},
{
  id: 'p-06',
  slug: 'ruh-fluted-terracotta-planter',
  name: 'Ruh Fluted Terracotta Planter',
  category: 'home-accessories',
  price: 1450,
  rating: 4.7,
  reviewCount: 143,
  images: [IMG.planter, IMG.accessories, IMG.living],
  badge: 'New',
  colors: ['Terracotta', 'Chalk'],
  materials: ['Terracotta'],
  sizes: ['12 cm', '16 cm', '22 cm'],
  availability: 'in-stock',
  shortDescription:
  'A hand-ridged terracotta pot with a drainage hole and matching saucer, unglazed so roots can breathe.',
  story:
  'Pressed and ridged by hand in Dhamrai, then slow-fired in a wood kiln. The clay lightens as it dries, which is how you know when to water.',
  specs: [
  { label: 'Dimensions', value: '16 cm diameter × 15 cm H' },
  { label: 'Material', value: 'Unglazed terracotta' },
  { label: 'Colour', value: 'Natural terracotta' },
  { label: 'Drainage', value: 'Yes, with matching saucer' },
  { label: 'Care', value: 'Rinse and air dry between plantings' }],

  popularity: 84,
  createdAt: '2026-07-14',
  newArrival: true,
  completeTheLook: ['p-04', 'p-05', 'p-10']
},
{
  id: 'p-07',
  slug: 'dhara-framed-print-trio',
  name: 'Dhara Framed Print Trio',
  category: 'wall-decor',
  price: 5600,
  compareAt: 6900,
  rating: 4.8,
  reviewCount: 65,
  images: [IMG.artSet, IMG.living, IMG.wallPanel],
  badge: 'New',
  colors: ['Sand', 'Clay', 'Charcoal'],
  materials: ['Paper', 'Oak'],
  sizes: ['A3 set', 'A2 set'],
  availability: 'in-stock',
  shortDescription:
  'Three abstract landscapes printed on cotton rag and framed in narrow light oak — a gallery wall in one box.',
  story:
  'Painted in gouache by Dhaka artist Nusrat Kabir, then printed in a run of 200 on 310 gsm cotton rag. Each frame is numbered on the reverse.',
  specs: [
  { label: 'Dimensions', value: '3 × (30 cm W × 42 cm H)' },
  { label: 'Material', value: '310 gsm cotton rag, oak frame, glass' },
  { label: 'Colour', value: 'Sand, clay and charcoal' },
  { label: 'Hanging', value: 'Sawtooth fittings pre-installed' },
  { label: 'Care', value: 'Keep out of direct sunlight' }],

  popularity: 82,
  createdAt: '2026-07-02',
  newArrival: true,
  completeTheLook: ['p-09', 'p-04', 'p-05']
},
{
  id: 'p-08',
  slug: 'naqsh-embroidered-porda',
  name: 'Naqsh Embroidered Porda',
  category: 'door-porda',
  price: 4950,
  rating: 4.9,
  reviewCount: 71,
  images: [IMG.pordaEmbroidered, IMG.doorway, IMG.entry],
  colors: ['Cream', 'Charcoal'],
  materials: ['Cotton', 'Brass'],
  sizes: ['7 ft — Door', '9 ft — Long Door'],
  availability: 'made-to-order',
  shortDescription:
  'Hand-embroidered cotton with a charcoal geometric border and a row of small brass bells at the hem.',
  story:
  'Each panel takes eleven days of nakshi hand-embroidery. Made to order in your measurements, so allow two to three weeks before it ships.',
  specs: [
  { label: 'Dimensions', value: 'Made to your width, up to 150 cm' },
  { label: 'Material', value: 'Handloom cotton, cotton floss, brass bells' },
  { label: 'Colour', value: 'Cream with charcoal motif' },
  { label: 'Lead time', value: '14–21 days' },
  { label: 'Care', value: 'Dry clean recommended' }],

  popularity: 74,
  createdAt: '2026-06-21',
  newArrival: true,
  completeTheLook: ['p-02', 'p-09', 'p-01']
},
{
  id: 'p-09',
  slug: 'roshan-brass-table-lamp',
  name: 'Roshan Brass Table Lamp',
  category: 'home-accessories',
  price: 6400,
  compareAt: 7400,
  rating: 4.6,
  reviewCount: 58,
  images: [IMG.lamp, IMG.living, IMG.accessories],
  colors: ['Brass', 'Bronze'],
  materials: ['Brass', 'Linen'],
  availability: 'in-stock',
  shortDescription:
  'A spun brass base under a natural linen drum shade, dimmable, with a fabric-braided cord.',
  story:
  'Spun on a hand lathe and finished with a light satin brush so the base holds a low, warm glow rather than a hard shine.',
  specs: [
  { label: 'Dimensions', value: '28 cm diameter × 46 cm H' },
  { label: 'Material', value: 'Brushed brass, linen shade' },
  { label: 'Colour', value: 'Warm brass' },
  { label: 'Fitting', value: 'E27, max 40 W — bulb not included' },
  { label: 'Cord', value: '1.8 m braided cotton, inline dimmer' }],

  popularity: 76,
  createdAt: '2026-05-05',
  completeTheLook: ['p-07', 'p-04', 'p-01']
},
{
  id: 'p-10',
  slug: 'aakar-clay-sculpture',
  name: 'Aakar Curved Clay Sculpture',
  category: 'decorative-arts',
  price: 3900,
  rating: 4.9,
  reviewCount: 39,
  images: [IMG.sculpture, IMG.arts, IMG.accessories],
  badge: 'Limited',
  colors: ['Terracotta', 'Ash'],
  materials: ['Terracotta'],
  availability: 'low-stock',
  shortDescription:
  'A single unbroken curve in matte clay, weighted to sit on a shelf or a stack of books without a plinth.',
  story:
  'Shaped freehand by ceramicist Imran Hossain in an edition of forty. Each piece is initialled underneath and slightly different in its arc.',
  specs: [
  { label: 'Dimensions', value: '19 cm W × 24 cm H × 9 cm D' },
  { label: 'Material', value: 'Matte-finished terracotta' },
  { label: 'Colour', value: 'Muted terracotta' },
  { label: 'Edition', value: 'Limited to 40 pieces' },
  { label: 'Care', value: 'Dust with a dry cloth' }],

  popularity: 71,
  createdAt: '2026-07-18',
  newArrival: true,
  completeTheLook: ['p-11', 'p-04', 'p-09']
},
{
  id: 'p-11',
  slug: 'chhaya-carved-wall-panel',
  name: 'Chhaya Hand-Carved Wall Panel',
  category: 'decorative-arts',
  price: 8200,
  compareAt: 9800,
  rating: 4.8,
  reviewCount: 47,
  images: [IMG.wallPanel, IMG.living, IMG.arts],
  badge: 'Limited',
  colors: ['Natural Mango', 'Walnut'],
  materials: ['Wood'],
  sizes: ['60 cm', '80 cm'],
  availability: 'made-to-order',
  shortDescription:
  'A round mango-wood mandala carved in relief, deep enough to cast its own shadow through the afternoon.',
  story:
  'Carved from a single seasoned mango-wood round over nine days. The relief is cut deep on purpose — the piece reads differently as the light moves across it.',
  specs: [
  { label: 'Dimensions', value: '80 cm diameter × 5 cm depth' },
  { label: 'Material', value: 'Seasoned mango wood, natural wax finish' },
  { label: 'Colour', value: 'Natural mango' },
  { label: 'Weight', value: '6.8 kg' },
  { label: 'Care', value: 'Re-wax annually; avoid damp walls' }],

  popularity: 69,
  createdAt: '2026-04-11',
  completeTheLook: ['p-10', 'p-02', 'p-01']
},
{
  id: 'p-12',
  slug: 'anghan-doorway-curtain-set',
  name: 'Anghan Doorway Curtain Set',
  category: 'door-porda',
  price: 5300,
  compareAt: 6500,
  rating: 4.7,
  reviewCount: 88,
  images: [IMG.doorway, IMG.pordaLinen, IMG.entry],
  badge: '18% Off',
  colors: ['Oatmeal', 'Clay'],
  materials: ['Linen', 'Cotton'],
  sizes: ['7 ft — Door', '9 ft — Long Door'],
  availability: 'in-stock',
  shortDescription:
  'A matched pair of tasselled handloom panels with tie-backs, sized for a standard interior doorway.',
  story:
  'Our most-asked-for set: two Sahil panels, hand-twisted tassels and a pair of woven tie-backs, priced below buying the pieces apart.',
  specs: [
  { label: 'Dimensions', value: '2 × (132 cm W × 213 cm H)' },
  { label: 'Material', value: 'Handloom linen-cotton, 190 gsm' },
  { label: 'Colour', value: 'Oatmeal with clay tassels' },
  { label: 'Includes', value: '2 panels, 2 tie-backs' },
  { label: 'Care', value: 'Cold machine wash, warm iron' }],

  popularity: 90,
  createdAt: '2026-06-08',
  bestSeller: true,
  completeTheLook: ['p-02', 'p-05', 'p-09']
}];


export const productById = (id: string) => products.find((p) => p.id === id);
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const productsByIds = (ids: string[] = []) =>
ids.map(productById).filter((p): p is (typeof products)[number] => Boolean(p));