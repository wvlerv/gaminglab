// Правила перевірки полів форми оформлення. Повертають текст помилки або '' (усе гаразд).
// Тексти — зрозумілою мовою: ЩО не так і ЯК виправити (вимога a11y "зрозумілі повідомлення про помилки").
export const rules = {
  required: (label) => (value) => (String(value ?? '').trim() ? '' : `Please enter ${label}.`),
  email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Please enter a valid email address, e.g. name@example.com.'),
  // Приймаємо і міжнародний (+380 67 ...), і звичний локальний формат (067 ...)
  phone: (value) => (/^(\+?380|0)\d{9}$/.test(value.replace(/[\s()-]/g, '')) ? '' : 'Please enter a Ukrainian phone number, e.g. +380 67 123 4567.'),
  fullName: (value) => (value.trim().split(/\s+/).length >= 2 ? '' : 'Please enter first and last name, as in your ID.'),
  cardNumber: (value) => (/^\d{16}$/.test(value.replace(/\s/g, '')) ? '' : 'Card number must contain 16 digits.'),
  cardExpiry: (value) => {
    const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim())
    if (!match) return 'Use the MM / YY format.'
    const month = Number(match[1])
    const year = 2000 + Number(match[2])
    if (month < 1 || month > 12) return 'Month must be between 01 and 12.'
    const now = new Date()
    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) return 'This card has expired.'
    return ''
  },
  cvc: (value) => (/^\d{3}$/.test(value.trim()) ? '' : 'CVC is the 3 digits on the back of the card.'),
}

// Автоформатування під час введення (користувач вводить лише цифри, роздільники ставимо самі)
// "4242424242424242" -> "4242 4242 4242 4242"
export function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}
// "1227" -> "12 / 27"
export function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits
}

// Номер телефону з пробілами, як у макеті: "+380991901033" -> "+380 99 190 1033"; локальний "0991901033" -> "099 190 1033"
export function formatPhone(value) {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('380')) {
    const d = digits.slice(0, 12)
    return '+' + [d.slice(0, 3), d.slice(3, 5), d.slice(5, 8), d.slice(8, 12)].filter(Boolean).join(' ')
  }
  if (digits.startsWith('0')) {
    const d = digits.slice(0, 10)
    return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join(' ')
  }
  // Поки користувач вводить початок коду ("+3", "+38") — лишаємо як є
  return (value.trimStart().startsWith('+') ? '+' : '') + digits.slice(0, 12)
}
