import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Recipe {
  id: string;
  timestamp: number;
  title: string;
  ingredients: string[];
  instructions: string[];
  tips?: string;
  nutritionalInfo: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface BusinessPlan {
  id: string;
  timestamp: number;
  businessName: string;
  concept: string;
  menu: {
    itemName: string;
    description: string;
    price: string;
  }[];
  marketingStrategy: string;
  optimizations: {
    pricingStrategy: string;
    dishCombinations: string;
    seasonalOffers: string;
    trends: string;
  };
}

export const generateRecipe = async (prompt: string): Promise<Recipe> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Erstelle ein detailliertes Rezept basierend auf diesem Prompt: ${prompt}. Liefere für jedes Rezept auch geschätzte Nährwertangaben (Kalorien, Proteine, Kohlenhydrate, Fette). Antworte NUR im JSON-Format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          tips: { type: Type.STRING },
          nutritionalInfo: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.STRING, description: "Beispiel: 450 kcal" },
              protein: { type: Type.STRING, description: "Beispiel: 20g" },
              carbs: { type: Type.STRING, description: "Beispiel: 50g" },
              fat: { type: Type.STRING, description: "Beispiel: 15g" },
            },
            required: ["calories", "protein", "carbs", "fat"],
          },
        },
        required: ["title", "ingredients", "instructions", "nutritionalInfo"],
      },
    },
  });

  const recipeData = JSON.parse(response.text);
  return {
    ...recipeData,
    id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    timestamp: Date.now(),
  };
};

export const generateBusinessPlan = async (prompt: string): Promise<BusinessPlan> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Erstelle einen Business Planner (Stand oder Laden) basierend auf diesem Prompt: ${prompt}. Inklusive Konzept, beispielhafter Speisekarte, Marketingstrategie und Optimierungsvorschlägen basierend auf Restauranttrends (Preisgestaltung, Gerichte-Kombinationen, saisonale Angebote). Antworte NUR im JSON-Format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          businessName: { type: Type.STRING },
          concept: { type: Type.STRING },
          menu: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                itemName: { type: Type.STRING },
                description: { type: Type.STRING },
                price: { type: Type.STRING },
              },
              required: ["itemName", "description", "price"],
            },
          },
          marketingStrategy: { type: Type.STRING },
          optimizations: {
            type: Type.OBJECT,
            properties: {
              pricingStrategy: { type: Type.STRING },
              dishCombinations: { type: Type.STRING },
              seasonalOffers: { type: Type.STRING },
              trends: { type: Type.STRING },
            },
            required: ["pricingStrategy", "dishCombinations", "seasonalOffers", "trends"],
          },
        },
        required: ["businessName", "concept", "menu", "marketingStrategy", "optimizations"],
      },
    },
  });

  const planData = JSON.parse(response.text);
  return {
    ...planData,
    id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    timestamp: Date.now(),
  };
};

export const generateImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Generiere ein hochqualitatives Bild für: ${prompt}. Es sollte professionell aussehen, wie für eine Speisekarte oder Produktverpackung.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated");
};
