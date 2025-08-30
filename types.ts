
export interface MarketingContent {
  title: string;
  description: string;
  story: string;
  hashtags: string[];
}

export interface InitialAssets {
  posterImageUrls: string[];
  posterPrompts: string[];
  english: MarketingContent;
}

export interface Language {
    code: string;
    name: string;
}

export interface SavedKit {
  id: string; // e.g., timestamp
  createdAt: string;
  artisanId: string; // Link to the user who created it
  userInput: {
    imageFile: string; // base64
    description: string;
    price: number;
    category: string;
  };
  generatedAssets: InitialAssets;
  isInCart?: boolean;
}

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'artisan';
  mobile?: string;
  gender?: 'male' | 'female' | 'other' | '';
  dob?: string; // Date of Birth
  location?: string;
}

export interface Customer extends BaseUser {
  role: 'customer';
}

export interface Artisan extends BaseUser {
  role: 'artisan';
}

export type User = Customer | Artisan;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// FIX: Add missing Review interface used by CommentSection.tsx
export interface Review {
  id: string;
  createdAt: string;
  author: string;
  rating: number;
  comment: string;
}