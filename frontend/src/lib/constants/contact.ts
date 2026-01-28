export const CONTACT_INFO = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@lapilcha.com',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+54 9 11 1234-5678',
  phoneRaw: process.env.NEXT_PUBLIC_CONTACT_PHONE?.replace(/\s/g, '') || '+5491112345678',
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Buenos Aires, Argentina',
} as const;

export const SOCIAL_LINKS = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/lapilcha',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/lapilcha',
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/lapilcha',
} as const;

export const COMPANY_INFO = {
  name: 'La Pilcha',
  slogan: 'Moda argentina con estilo auténtico. Calidad y tradición en cada prenda.',
  foundedYear: 2026,
} as const;