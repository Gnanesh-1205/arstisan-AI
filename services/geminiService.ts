
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedAssets } from '../types';
import { LANGUAGES } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const textGenerationSchema = {
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
    translated: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Translated product title." },
        description: { type: Type.STRING, description: "Translated product description." },
        story: { type: Type.STRING, description: "Translated product story." },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Translated array of hashtags." },
      },
       required: ["title", "description", "story", "hashtags"],
    },
    posterPrompt: {
      type: Type.STRING,
      description: "A detailed, visually rich prompt for an AI image generator to create a marketing poster. It should evoke the essence of the craft and its cultural context."
    }
  },
  required: ["english", "translated", "posterPrompt"],
};

export async function generateMarketingAssets(
  base64ImageData: string,
  mimeType: string,
  userDescription: string,
  targetLanguage: string,
  onProgress: (progress: number, message: string) => void
): Promise<GeneratedAssets> {
  const targetLanguageName = LANGUAGES.find(l => l.code === targetLanguage)?.name || 'the selected language';
  
  onProgress(10, 'Analyzing your beautiful craft...');
  // Step 1: Generate Text Content and Image Prompt
  const textGenerationPrompt = `
    Analyze the attached image of a handcrafted product and the artisan's description: "${userDescription}".
    The product is a beautiful, traditional craft. Your response should reflect this.

    Based on this, generate the following marketing assets in English and also translate them into ${targetLanguageName} (language code: ${targetLanguage}):

    1.  **Product Title**: A short, catchy title that is evocative and respects the craft's origin.
    2.  **Product Description**: A compelling description (2-3 sentences) highlighting its unique features, craftsmanship, and cultural value.
    3.  **Artisan's Story**: An engaging, short story (1 paragraph) about the craft's origin, the artisan's passion, or the cultural significance.
    4.  **Hashtags**: An array of 5-7 relevant hashtags for social media, including general and niche tags.
    5.  **Poster Prompt**: A detailed, visually rich prompt for an AI image generator to create a stunning marketing poster. The prompt should describe a scene that showcases the product in an appealing, culturally relevant context, perhaps with natural elements or a warm, inviting atmosphere. The style should be artistic and professional.
    
    Return ONLY the JSON object that adheres to the provided schema. Do not include any other text or markdown formatting.`;

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64ImageData,
    },
  };

  const textPart = {
    text: textGenerationPrompt
  };
  
  const textResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: textGenerationSchema,
    },
  });

  const generatedText = JSON.parse(textResponse.text);

  onProgress(50, 'Crafting a stunning poster design...');
  // Step 2: Generate Marketing Poster Image
  const imageResponse = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: generatedText.posterPrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '3:4', // Good for social media stories/posts
    },
  });

  const base64PosterImage = imageResponse.generatedImages[0].image.imageBytes;
  if (!base64PosterImage) {
      throw new Error("Image generation failed to return an image.");
  }
  
  onProgress(95, 'Polishing the final assets...');
  const posterImageUrl = `data:image/jpeg;base64,${base64PosterImage}`;

  // Step 3: Combine and return all assets
  return {
    posterImageUrl: posterImageUrl,
    posterPrompt: generatedText.posterPrompt,
    english: generatedText.english,
    translated: generatedText.translated,
    targetLanguage: targetLanguage,
    targetLanguageName: targetLanguageName,
  };
}
