// Тексти інформаційних сторінок — з макетів Дарьї (Info Shipping, Returns, Warranty...).
// Контент окремо від розмітки: одна сторінка-шаблон InfoPage показує будь-яку з них.
export const INFO_GROUPS = [
  { title: 'Support', pages: ['shipping', 'returns', 'warranty', 'help'] },
  { title: 'Company', pages: ['about', 'contact'] },
  { title: 'Legal', pages: ['terms', 'privacy', 'cookies'] },
]

export const INFO_PAGES = {
  shipping: {
    nav: 'Shipping', title: 'Shipping information',
    intro: 'Delivery options, costs and tracking for your GamingLab order.',
    sections: [
      ['Delivery options', 'Standard delivery takes 3–5 business days. Express delivery takes 1–2 business days. You can also collect your order from a partner pickup point where available.'],
      ['Shipping cost', 'The cost depends on the carrier, delivery speed and destination. You will see the exact amount at checkout before you place the order.'],
      ['Order processing', 'Orders placed before 14:00 on a business day usually ship the same day. Orders placed later ship the next business day.'],
      ['Tracking your order', 'When your order ships, we email you a tracking number. You can also follow the status in your account under Orders.'],
      ['Delivery problems', 'If your parcel is late, damaged or missing, contact our support team within 14 days of the expected delivery date.'],
    ],
  },
  returns: {
    nav: 'Returns', title: 'Returns and refunds',
    intro: 'How to return a product and when you get your money back.',
    sections: [
      ['Return window', 'You can return most products within 30 days of delivery, if they are unused and in the original packaging.'],
      ['How to start a return', 'Open Orders in your account, choose the order and select Return item. We will email you a return label and instructions.'],
      ['Refunds', 'After we receive and check the item, the refund goes to your original payment method within 5–10 business days.'],
      ['Items we cannot accept', 'Opened software and game keys, gift cards and items damaged by misuse cannot be returned.'],
      ['Faulty or wrong item', 'If you received a damaged, faulty or wrong item, contact support first. We cover the return shipping in this case.'],
    ],
  },
  warranty: {
    nav: 'Warranty', title: 'Warranty',
    intro: 'What is covered if your product stops working as it should.',
    sections: [
      ['Coverage period', 'Every product has at least a 24-month legal guarantee. Some brands offer a longer manufacturer warranty, which is shown on the product page.'],
      ['What is covered', 'Manufacturing defects and faults that appear during normal use.'],
      ['What is not covered', 'Damage caused by drops, liquids, unauthorised repairs, normal wear and use outside the manufacturer instructions.'],
      ['How to make a claim', 'Contact support with your order number and a short description of the problem. We will tell you whether to send the item to us or to a service centre.'],
    ],
  },
  help: {
    nav: 'Help Center', title: 'Help Center',
    intro: 'Quick answers to the questions we hear most often.',
    sections: [
      ['How do I track my order?', 'Sign in, open Orders and select your order. The tracking link appears after the order has shipped.'],
      ['Can I change or cancel an order?', 'You can change or cancel an order until it ships. Contact support as soon as possible with your order number.'],
      ['Which payment methods do you accept?', 'We accept major credit and debit cards. Available methods are shown at checkout.'],
      ['I forgot my password', 'Select Forgot password on the sign-in page and we will email you a reset link.'],
      ['I still need help', 'Write to our support team from the Contact page. We usually reply within one business day.'],
    ],
  },
  about: {
    nav: 'About Us', title: 'About GamingLab',
    intro: 'For a better way to play.',
    sections: [
      ['Who we are', 'GamingLab is an online store for gamers. We bring together gaming gear from the brands players trust, in one place, with clear information and fair delivery.'],
      ['What we sell', 'PC and console gear, controllers, headsets, keyboards, mice and accessories from multiple brands.'],
      ['How we work', 'We check every product page for accurate specifications and stock, so you know what you are buying and when it arrives.'],
      ['Our team', 'GamingLab is built by a small student team of a designer, a frontend developer and a backend developer.'],
    ],
  },
  contact: {
    nav: 'Contact', title: 'Contact us',
    intro: 'Questions about an order, a product or your account? We are here to help.',
    sections: [
      ['Customer support', 'Email: support@gaminglab.example. We usually reply within one business day.'],
      ['Opening hours', 'Monday to Friday, 09:00–18:00. We reply to messages sent at weekends on the next business day.'],
      ['Before you write', 'Please include your order number and a short description of the problem. This helps us answer faster.'],
      ['Business enquiries', 'For partnerships and brand enquiries, write to partners@gaminglab.example.'],
    ],
  },
  terms: {
    nav: 'Terms', title: 'Terms of service',
    intro: 'The rules for using GamingLab and buying from our store.',
    sections: [
      ['Using the store', 'By using GamingLab you agree to these terms. If you do not agree, please do not use the store.'],
      ['Your account', 'You are responsible for keeping your account details secure and for activity under your account.'],
      ['Orders and prices', 'An order is confirmed when we send you an order confirmation. Prices and availability can change until then. If a price is shown incorrectly, we may cancel the order and refund you.'],
      ['Intellectual property', 'All content on GamingLab, including text, logos and images, belongs to GamingLab or its partners and may not be copied without permission.'],
      ['Liability', 'We are not liable for indirect losses. Nothing in these terms limits your statutory consumer rights.'],
      ['Changes to these terms', 'We may update these terms from time to time. The date at the top shows when they last changed.'],
    ],
  },
  privacy: {
    nav: 'Privacy', title: 'Privacy policy',
    intro: 'What personal data we collect and how we use it.',
    sections: [
      ['Data we collect', 'Account details (name, email), delivery and billing details, order history and technical data such as device and browser information.'],
      ['How we use it', 'To process and deliver orders, provide support, secure your account and, if you agree, send newsletters and offers.'],
      ['Sharing your data', 'We share data only with delivery and payment providers that need it to complete your order. We do not sell your personal data.'],
      ['Your rights', 'You can ask to access, correct or delete your data, or withdraw your consent at any time.'],
      ['Contact', 'Questions about privacy? Write to privacy@gaminglab.example.'],
    ],
  },
  cookies: {
    nav: 'Cookies', title: 'Cookie policy',
    intro: 'How GamingLab uses cookies and how you can control them.',
    sections: [
      ['What are cookies', 'Cookies are small text files stored on your device. They help the site work and remember your choices.'],
      ['Essential cookies', 'Needed for the cart, sign-in and checkout. They cannot be switched off.'],
      ['Analytics cookies', 'Help us understand how the store is used so we can improve it. They are used only if you agree.'],
      ['Preference cookies', 'Remember settings such as language.'],
      ['Managing cookies', 'You can change your choice at any time in your browser settings or in the cookie banner.'],
    ],
  },
}

export const LAST_UPDATED = '25 November 2026'
