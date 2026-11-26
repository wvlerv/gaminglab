// Довідник доставки. У реальному магазині міста й відділення приходили б з API Нової пошти / Укрпошти;
// у навчальному проєкті — статичні демо-дані (для Києва — як у макеті).
export const CITIES = ['Kyiv', 'Kharkiv', 'Lviv', 'Odesa', 'Dnipro']

export const CARRIERS = [
  { value: 'NOVA_POSHTA', label: 'Nova Poshta', hint: '1–2 days across Ukraine', icon: 'local_shipping' },
  { value: 'UKRPOSHTA', label: 'Ukrposhta', hint: '2–5 days, lower rates', icon: 'package_2' },
]

// Способи отримання та вартість — ТАК САМО, як рахує бекенд (OrderService.shippingCost):
// відділення — безкоштовно, усе інше — 120 UAH. Від макету (поштомат Free, кур'єр Укрпошти 80) свідомо відходимо,
// щоб сума на сторінці оформлення збігалася з сумою підтвердженого замовлення.
export const DELIVERY_METHODS = {
  NOVA_POSHTA: [
    { value: 'BRANCH', label: 'Branch', cost: 0, icon: 'location_on' },
    { value: 'PARCEL_LOCKER', label: 'Parcel locker', cost: 120, icon: 'package_2' },
    { value: 'COURIER', label: 'Courier', cost: 120, icon: 'local_shipping' },
  ],
  UKRPOSHTA: [
    { value: 'BRANCH', label: 'Branch', cost: 0, icon: 'location_on' },
    { value: 'COURIER', label: 'Courier', cost: 120, icon: 'local_shipping' },
  ],
}

const KYIV = {
  NOVA_POSHTA: {
    BRANCH: ['Branch №12 · Kyiv, Khreshchatyk St, 22', 'Branch №3 · Kyiv, Antonovycha St, 176', 'Branch №47 · Kyiv, Velyka Vasylkivska St, 15', 'Branch №105 · Kyiv, Saksahanskoho St, 120'],
    PARCEL_LOCKER: ['Parcel locker №4512 · Kyiv, Velyka Vasylkivska St, 72', 'Parcel locker №2107 · Kyiv, Saksahanskoho St, 120', 'Parcel locker №3390 · Kyiv, Lva Tolstoho St, 9'],
  },
  UKRPOSHTA: {
    BRANCH: ['Branch 01001 · Kyiv, Khreshchatyk St, 22', 'Branch 01004 · Kyiv, Baseina St, 1', 'Branch 01033 · Kyiv, Saksahanskoho St, 41'],
  },
}

// Для інших міст генеруємо демо-пункти, щоб форма працювала для будь-якого міста зі списку
export function getDeliveryPoints(carrier, city, method) {
  if (!carrier || !city || !method || method === 'COURIER') return []
  if (city === 'Kyiv') return KYIV[carrier]?.[method] ?? []
  if (carrier === 'NOVA_POSHTA' && method === 'BRANCH') return [1, 2, 3].map((n) => `Branch №${n} · ${city}, Central St, ${n * 10}`)
  if (carrier === 'NOVA_POSHTA' && method === 'PARCEL_LOCKER') return [1, 2].map((n) => `Parcel locker №${n}00${n} · ${city}, Central St, ${n * 5}`)
  if (carrier === 'UKRPOSHTA') return [1, 2].map((n) => `Branch 0${n}000 · ${city}, Post St, ${n}`)
  return []
}
