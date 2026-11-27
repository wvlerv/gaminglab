// Мегаменю з макету (Homepage PC / Console / Accessories Megamenu).
// Посилання ведуть у каталог з відповідними фільтрами там, де такі товари є на бекенді;
// для підкатегорій, яких у базі поки немає, — на сторінку розділу.
// promo.image — фото для фону промо-картки, лежать у frontend/public/images/menu/ (не з бекенду).
const q = (params) => `/catalog?${new URLSearchParams(params)}`

export const MENU = [
  {
    id: 'pc',
    label: 'PC',
    to: '/catalog/pc',
    columns: [
      { title: 'Explore PC', links: [
        ['Desktops & Components', '/catalog/pc'], ['Laptops & Accessories', '/catalog/pc'], ['Monitors', '/catalog/pc'],
        ['Storage & Drives', '/catalog/pc'], ['PC Build Kits', '/catalog/pc'],
      ] },
      { title: 'Peripherals', links: [
        ['Mechanical Keyboards', '/catalog/pc?category=Keyboards'], ['Gaming Mice', '/catalog/pc?category=Mouse'],
        ['Mouse Mats', '/catalog/accessories'], ['Controllers for PC', '/catalog/pc?category=Controllers'],
      ] },
      { title: 'Streaming & Audio', links: [
        ['Headsets', '/catalog/pc?category=Headsets'], ['Microphones', '/catalog/pc'], ['Webcams', '/catalog/pc'], ['Capture Cards', '/catalog/pc'],
      ] },
    ],
    promo: { badge: 'New release', title: 'Viper V3 Pro', text: 'Mice, keyboards, headsets & more for peak performance.', image: '/images/menu/promo-pc.webp', to: '/catalog/pc?category=Mouse' },
  },
  {
    id: 'console',
    label: 'Console',
    to: '/catalog/console',
    columns: [
      { title: 'PlayStation', links: [
        ['PS5 Consoles', q({ platform: 'PlayStation 5' })], ['DualSense Controllers', q({ platform: 'PlayStation 5', category: 'Controllers' })],
        ['PS5 Headsets', q({ platform: 'PlayStation 5', category: 'Headsets' })], ['Storage Expansion', q({ platform: 'PlayStation 5' })],
      ] },
      { title: 'Xbox', links: [
        ['Xbox Series X|S', q({ platform: 'Xbox Series X/S' })], ['Wireless Controllers', q({ platform: 'Xbox Series X/S', category: 'Controllers' })],
        ['Xbox Headsets', q({ platform: 'Xbox Series X/S', category: 'Headsets' })], ['Storage Cards', q({ platform: 'Xbox Series X/S' })],
      ] },
      { title: 'Nintendo', links: [
        ['Switch Consoles', q({ platform: 'Nintendo Switch' })], ['Joy-Con & Pro Controllers', q({ platform: 'Nintendo Switch', category: 'Controllers' })],
        ['Cases & Protection', q({ platform: 'Nintendo Switch' })], ['MicroSD Cards', q({ platform: 'Nintendo Switch' })],
      ] },
    ],
    promo: { badge: '-15%', title: 'DualSense Edge', text: 'Pro-level control and customization for competitive play.', image: '/images/menu/promo-console.webp', to: q({ platform: 'PlayStation 5', category: 'Controllers' }), tone: 'discount' },
  },
  {
    id: 'accessories',
    label: 'Accessories',
    to: '/catalog/accessories',
    columns: [
      { title: 'Furniture', links: [['Gaming Chairs', '/catalog/accessories'], ['Ergonomic Desks', '/catalog/accessories'], ['Monitor Arms', '/catalog/accessories'], ['Floor Mats', '/catalog/accessories']] },
      { title: 'Room Setup', links: [['Smart RGB Lighting', '/catalog/accessories'], ['Acoustic Panels', '/catalog/accessories'], ['Cable Management', '/catalog/accessories'], ['Headphone Stands', '/catalog/accessories']] },
      { title: 'Gear Care & Merch', links: [['Cleaning Kits', '/catalog/accessories'], ['Keycap Sets', '/catalog/accessories'], ['Apparel', '/catalog/accessories'], ['Backpacks & Bags', '/catalog/accessories']] },
    ],
    promo: { badge: 'Bestseller', title: 'Razer Gigantus V2 XXL', text: 'Extra-large mouse mat for\nfull-desk setups.', image: '/images/menu/promo-accessories.webp', to: '/catalog/accessories' },
  },
]
