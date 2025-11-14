export interface Font {
  id: string;
  name: string;
  category: string;
  designer: string;
  price: number;
  description: string;
  preview: string;
  fileUrl?: string;
  fileFormats: string[];
  license: 'personal' | 'commercial' | 'extended';
  tags: string[];
  rating: number;
  downloads: number;
  createdAt: Date;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  font: Font;
  license: 'personal' | 'commercial' | 'extended';
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  purchasedFonts: string[];
}