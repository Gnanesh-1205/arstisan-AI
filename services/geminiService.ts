import { GoogleGenAI, Type } from "@google/genai";
import { InitialAssets, MarketingContent } from '../types';
import { LANGUAGES } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const initialGenerationSchema = {
  type: Type.OBJECT,
  properties: {
    english: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A short, catchy product title." },
        description: { type: Type.STRING, description: "A compelling product description (2-3 sentences)." },
        story: { type: Type.STRING, description: "An engaging story about the craft or artisan (1 paragraph)." },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 5-7 relevant hashtags." },
      },
      required: ["title", "description", "story", "hashtags"],
    },
    posterPrompts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 5 distinct, detailed, visually rich prompts for an AI image generator. Each prompt must describe a different scene or angle but feature the exact same product, ensuring consistency."
    }
  },
  required: ["english", "posterPrompts"],
};

const translationSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Translated product title." },
    description: { type: Type.STRING, description: "Translated product description." },
    story: { type: Type.STRING, description: "Translated product story." },
    hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Translated array of hashtags." },
  },
  required: ["title", "description", "story", "hashtags"],
};

export async function generateInitialAssets(
  base64ImageData: string,
  mimeType: string,
  userDescription: string,
  onProgress: (progress: number, message: string) => void
): Promise<InitialAssets> {
  onProgress(10, 'Analyzing your beautiful craft...');
  
  const textGenerationPrompt = `
    Analyze the attached image of a handcrafted product and the artisan's description: "${userDescription}".
    The product is a beautiful, traditional craft. Your response should reflect this.

    Based on this, generate the following marketing assets in English:

    1.  **Product Title**: A short, catchy title that is evocative and respects the craft's origin.
    2.  **Product Description**: A compelling description (2-3 sentences) highlighting its unique features, craftsmanship, and cultural value.
    3.  **Artisan's Story**: An engaging, short story (1 paragraph) about the craft's origin, the artisan's passion, or the cultural significance.
    4.  **Hashtags**: An array of 5-7 relevant hashtags for social media, including general and niche tags.
    5.  **Poster Prompts**: An array of 5 distinct, detailed, visually rich prompts for an AI image generator. It is crucial that each prompt describes a scene featuring the **exact same product** from the user's image, just from different angles or in different settings. The product's specific details (color, pattern, shape) must be consistently represented. The prompts should aim to create a cohesive and professional marketing gallery.
        
        For example, if the product is a "Kanchi pattu saree", the prompts could be for:
        - "1. A full-length shot of a woman gracefully wearing the intricate Kanchi pattu saree."
        - "2. A detailed shot of the saree's vibrant, golden border near her feet."
        - "3. A close-up of the rich texture and peacock feather pattern of the silk saree fabric."
        - "4. A lifestyle shot of the woman at a festive occasion, with the beautiful saree as the centerpiece."
        - "5. An artistic shot of the same saree elegantly draped over a vintage chair in a sunlit room."
        
        Create a similar variety of 5 prompts appropriate for the provided product, ensuring the product itself remains identical in all descriptions.
    
    Return ONLY the JSON object that adheres to the provided schema. Do not include any other text or markdown formatting.`;

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64ImageData,
    },
  };

  const textPart = { text: textGenerationPrompt };
  
  const textResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: initialGenerationSchema,
    },
  });

  const generatedText = JSON.parse(textResponse.text);

  onProgress(40, 'Designing your image gallery...');
  
  const posterImageUrls: string[] = [];
  let imageIndex = 0;
  for (const prompt of generatedText.posterPrompts) {
      // Add a delay before the call for all but the first image to avoid rate limiting.
      if (imageIndex > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
      }
      
      onProgress(40 + (imageIndex * 11), `Generating image ${imageIndex + 1} of 5...`);
      
      const imageResponse = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: prompt,
          config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '3:4',
          },
      });

      const base64PosterImage = imageResponse.generatedImages[0]?.image.imageBytes;
      if (!base64PosterImage) {
          throw new Error(`Image generation failed for prompt ${imageIndex + 1}.`);
      }
      posterImageUrls.push(`data:image/jpeg;base64,${base64PosterImage}`);
      imageIndex++;
  }
  
  onProgress(95, 'Polishing the final assets...');

  return {
    posterImageUrls: posterImageUrls,
    posterPrompts: generatedText.posterPrompts,
    english: generatedText.english,
  };
}

export async function translateContent(
  englishContent: MarketingContent,
  targetLanguage: string
): Promise<MarketingContent> {
  const targetLanguageName = LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage;

  const translationPrompt = `
    You are an expert translator specializing in marketing copy for artisanal products.
    Translate the following JSON object containing marketing text from English to ${targetLanguageName}.
    Preserve the tone, style, and intent of the original copy. Ensure hashtags are relevant for the target language and culture.

    Original English Content:
    ${JSON.stringify(englishContent, null, 2)}

    Return ONLY the translated JSON object that adheres to the provided schema. Do not include any other text or markdown formatting.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: translationPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: translationSchema,
    },
  });

  return JSON.parse(response.text);
}