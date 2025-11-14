import { Font } from '@/types/font';

export const fontsData: Font[] = [
  {
    id: '1',
    name: 'Montserrat Pro',
    category: 'Sans Serif',
    designer: 'Juliet Martinez',
    price: 29,
    description: 'A clean, modern sans-serif font perfect for both headlines and body text. Excellent readability across all sizes.',
    preview: 'The quick brown fox jumps over the lazy dog',
    fileFormats: ['OTF', 'TTF', 'WOFF', 'WOFF2'],
    license: 'personal',
    tags: ['modern', 'clean', 'versatile'],
    rating: 4.8,
    downloads: 15234,
    createdAt: new Date('2024-01-15'),
    isPopular: true
  },
  {
    id: '2',
    name: 'Elegant Script',
    category: 'Script',
    designer: 'Sophia Chen',
    price: 45,
    description: 'Beautiful calligraphic script font with flowing lines and elegant curves. Perfect for wedding invitations and luxury branding.',
    preview: 'Beautiful Typography',
    fileFormats: ['OTF', 'TTF', 'WOFF'],
    license: 'commercial',
    tags: ['elegant', 'calligraphy', 'wedding'],
    rating: 4.9,
    downloads: 8921,
    createdAt: new Date('2024-02-20'),
    isNew: true
  },
  {
    id: '3',
    name: 'Tech Sans',
    category: 'Display',
    designer: 'Alex Thompson',
    price: 39,
    description: 'Bold, futuristic display font designed for technology brands and sci-fi projects. Strong geometric shapes.',
    preview: 'FUTURE IS NOW',
    fileFormats: ['OTF', 'TTF', 'WOFF2'],
    license: 'commercial',
    tags: ['futuristic', 'tech', 'bold'],
    rating: 4.7,
    downloads: 6543,
    createdAt: new Date('2024-03-10')
  },
  {
    id: '4',
    name: 'Classic Serif',
    category: 'Serif',
    designer: 'Robert Williams',
    price: 35,
    description: 'Timeless serif font with traditional elegance. Perfect for editorial design and luxury publications.',
    preview: 'Timeless Elegance in Design',
    fileFormats: ['OTF', 'TTF', 'WOFF', 'WOFF2'],
    license: 'personal',
    tags: ['classic', 'elegant', 'editorial'],
    rating: 4.6,
    downloads: 9876,
    createdAt: new Date('2024-01-05'),
    isPopular: true
  },
  {
    id: '5',
    name: 'Playful Rounded',
    category: 'Display',
    designer: 'Emma Davis',
    price: 25,
    description: 'Fun, rounded font perfect for children\'s products, food branding, and playful designs. Friendly approachable style.',
    preview: 'Fun & Playful Design!',
    fileFormats: ['OTF', 'TTF', 'WOFF'],
    license: 'personal',
    tags: ['playful', 'rounded', 'friendly'],
    rating: 4.5,
    downloads: 5432,
    createdAt: new Date('2024-04-01'),
    isNew: true
  },
  {
    id: '6',
    name: 'Minimal Mono',
    category: 'Monospace',
    designer: 'David Kim',
    price: 32,
    description: 'Clean monospace font for coding, technical documentation, and minimalist design projects.',
    preview: 'const cleanCode = true;',
    fileFormats: ['OTF', 'TTF', 'WOFF', 'WOFF2'],
    license: 'commercial',
    tags: ['minimal', 'coding', 'technical'],
    rating: 4.4,
    downloads: 7654,
    createdAt: new Date('2024-02-15')
  }
];

export const categories = [
  'All',
  'Sans Serif',
  'Serif',
  'Script',
  'Display',
  'Monospace'
];

export const licenseOptions = [
  { value: 'personal', label: 'Personal', description: 'For personal projects only' },
  { value: 'commercial', label: 'Commercial', description: 'For commercial projects' },
  { value: 'extended', label: 'Extended', description: 'For resale and mass distribution' }
];