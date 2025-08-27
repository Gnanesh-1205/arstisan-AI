
export interface MarketingContent {
  title: string;
  description: string;
  story: string;
  hashtags: string[];
}

export interface GeneratedAssets {
  posterImageUrl: string;
  posterPrompt: string;
  english: MarketingContent;
  translated: MarketingContent;
  targetLanguage: string;
  targetLanguageName: string;
}

export interface Language {
    code: string;
    name: string;
}
