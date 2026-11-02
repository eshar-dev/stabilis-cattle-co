import type { ImageMetadata } from 'astro';

/**
 * Store state. 'open' = an animal is open for orders, 'between' = fully spoken for.
 * Cuts, prices and counts below are sample data; swap for the Shopify feed.
 */
export const orderingState: 'open' | 'between' = 'open';
export const openBreed = 'Akaushi';
export const hormoneDocumented = false;
export const FREE_DELIVERY_AT = 200;

const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });
export function photo(id: string): ImageMetadata {
  const hit = photos[`../assets/photos/${id}.jpg`];
  if (!hit) throw new Error(`Missing photo: ${id}`);
  return hit.default;
}

export const cuts = [
  { id: 'ribeye', name: 'Ribeye', spec: 'Cut at 1.5 in · approx. 16 oz', price: 38, left: 6, img: 'photo-1772285466464-8ccda2c3be92', alt: 'Two raw ribeye steaks seasoned with salt' },
  { id: 'bonein', name: 'Bone-in Ribeye', spec: 'Cut at 1.5 in · approx. 22 oz', price: 46, left: 3, img: 'photo-1788178941299-b206d3f4c4c6', alt: 'Raw bone-in ribeye steak on a metal platter' },
  { id: 'strip', name: 'New York Strip', spec: 'Cut at 1.5 in · approx. 14 oz', price: 32, left: 8, img: 'photo-1690983330536-3b0089d07cf9', alt: 'Two New York strip steaks on a cutting board' },
  { id: 'denver', name: 'Denver Steak', spec: 'From the chuck · approx. 10 oz', price: 18, left: 5, img: 'photo-1690983322025-aab4f95a0269', alt: 'Two Denver steaks on a dark table' },
  { id: 'filet', name: 'Filet', spec: 'Cut at 1.5 in · approx. 8 oz', price: 42, left: 2, img: 'photo-1690983321750-ad6f6d59a84b', alt: 'Raw beef filet on a cutting board' },
  { id: 'sirloin', name: 'Top Sirloin', spec: 'Cut at 1.5 in · approx. 12 oz', price: 22, left: 9, img: 'photo-1603048297172-c92544798d5a', alt: 'Raw top sirloin steak on a wooden table' },
  { id: 'brisket', name: 'Whole Brisket', spec: 'Packer cut · approx. 12 lb', price: 95, left: 1, img: 'photo-1666013942642-b7b54ecafd7d', alt: 'A whole raw brisket on a cutting board' },
  { id: 'ground', name: 'Ground Beef', spec: '1 lb pack', price: 10, left: 24, img: 'photo-1588347818036-558601350947', alt: 'Raw ground beef on a wooden table' },
];

export const steps = [
  { title: 'We open an animal', body: 'When one of our cattle is ready, we open it for orders and let you know its breed. Everything you see in the shop at that moment comes from that one animal.', img: 'photo-1618539640243-a9e6572a7fe7', alt: 'An Akaushi animal on pasture, ready to open for orders' },
  { title: 'You choose your cuts', body: 'Take a look at what is on offer and pick what suits your table, whether that is a couple of steaks for the weekend or enough to stock the freezer. There is only so much of each cut, so the favorites tend to go first.', img: 'photo-1690983325551-b922137727be', alt: 'A selection of raw beef cuts on a dark board' },
  { title: 'We take it from here', body: 'Once every cut is spoken for, ordering closes and the animal goes to the processor. Your steaks are cut at 1.5 inches, a little thicker than you will usually find, because customers asked us for it.', img: 'photo-1529692236671-f1f6cf9683ba', alt: 'Beef being sliced on a wooden board' },
  { title: 'It arrives at your door', body: 'We deliver across Dallas and Fort Worth, and we will let you know when yours is on its way.', note: '[Confirm the standard delivery window before publishing.]', img: 'photo-1690983323238-0b91789e1b5a', alt: 'Packed beef cuts ready for delivery' },
];

export const breeds = [
  { name: 'Red Angus', href: '#breed-red-angus', img: 'red-angus', desc: 'Dependable and beef forward. Red Angus gives you the classic, satisfying steak flavor with even marbling through the middle cuts, and it is a good place to start if ranch beef is new to you.' },
  { name: 'Wagyu', href: '#breed-wagyu', img: 'wagyu', desc: 'The breed marbling is famous for. The fat sits inside the muscle rather than around it, so Wagyu eats rich and tender, and a little goes a long way.' },
  { name: 'Akaushi', href: '#breed-akaushi', img: 'akaushi', desc: 'A Japanese red breed that very few people have tasted. It brings Wagyu style marbling with a fuller, beefier flavor behind it.' },
];

export const ways = [
  { title: 'By the cut', href: '#open-now', cta: 'The open animal', img: 'photo-1690983325551-b922137727be', alt: 'Individual beef cuts laid out on a dark board', text: 'Choose individual cuts from the animal that is open, and order as much or as little as you like.' },
  { title: 'In stock now', href: '/collections/in-stock-now', cta: 'Shop in stock', img: 'photo-1690983323238-0b91789e1b5a', alt: 'Packaged beef ready for the next delivery run', text: 'Packaged beef from the last animal, ready for the next delivery run.' },
  { title: 'Restaurants', href: '/pages/restaurants', cta: 'For restaurants', img: 'photo-1529692236671-f1f6cf9683ba', alt: 'A chef slicing cooked beef on a wooden board', text: 'Cooking for a menu? Tell us what you need and we will see how we can help.' },
];

export const faqs = [
  { q: 'How does ordering beef online work?', a: 'We open one animal at a time and let you choose the cuts you want from it. Once every cut is spoken for, ordering closes, the animal is processed and we deliver. Then we open the next one.' },
  { q: 'How much can I order, and when will it arrive?', a: 'As much or as little as suits you. You are choosing individual cuts rather than buying a share, so a few steaks and a full freezer are both fine. Every animal has a set amount of each cut, and the shop shows what is still available.', note: '[Confirm the time between ordering closing and delivery.]' },
  { q: 'What cuts can I choose, and can I ask for a different thickness?', a: 'The shop lists every cut available from the animal that is open, including cuts most places do not carry, such as the Denver steak. Steaks are cut at 1.5 inches as standard, because customers asked for that.', note: '[Confirm whether a customer can request a different thickness at checkout.]' },
  { q: 'Where do you deliver in DFW, and what does delivery cost?', a: 'We deliver across the Dallas and Fort Worth area, to your door. Orders over $200 ship free and smaller orders are [fee]. If you are not sure whether you are in range, the delivery page lists the areas we cover.' },
];

export const nav = {
  left: [
    { href: '#open-now', label: 'Shop' },
    { href: '#breeds', label: 'Our breeds' },
    { href: '#how', label: 'How it works' },
  ],
  right: [
    { href: '#delivery', label: 'Delivery' },
    { href: '#story', label: 'Our story' },
  ],
  all: [
    { href: '#open-now', label: 'Shop' },
    { href: '#breeds', label: 'Our breeds' },
    { href: '#how', label: 'How it works' },
    { href: '#delivery', label: 'Delivery' },
    { href: '#story', label: 'Our story' },
    { href: '#faq', label: 'FAQ' },
  ],
};
