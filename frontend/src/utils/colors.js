// Бекенд зберігає кольори як HEX-коди. Для підпису "Color: Black" перекладаємо їх у назви.
const COLOR_NAMES = {
  '#000000': 'Black',
  '#111111': 'Black',
  '#FFFFFF': 'White',
  '#C8FF24': 'Neon green',
  '#5F6FD6': 'Cobalt blue',
}
export function colorName(hex) {
  // Якщо на бекенді з'явиться новий колір без назви — показуємо нейтральне "Custom", а не HEX-код
  return COLOR_NAMES[hex?.toUpperCase()] ?? 'Custom'
}
