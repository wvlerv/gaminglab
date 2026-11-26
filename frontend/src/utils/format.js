// 6599 -> "6 599 UAH" (як у макеті)
export function formatPrice(value) {
  const number = Number(value)
  return `${Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} UAH`
}

// Категорія з бекенду -> підпис на картці (як у макеті: "GAMING MOUSE")
const CATEGORY_LABELS = {
  Mouse: 'Gaming mouse',
  Headsets: 'Gaming headset',
  Keyboards: 'Gaming keyboard',
  Controllers: 'Controller',
}
export function categoryLabel(category) {
  return CATEGORY_LABELS[category] ?? category
}
