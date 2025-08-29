
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
  userInput: {
    imageFile: string; // base64
    description: string;
  };
  generatedAssets: InitialAssets;
  isInCart?: boolean;
}
