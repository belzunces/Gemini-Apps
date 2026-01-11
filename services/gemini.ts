import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const convertRecipeWithGemini = async (
  promptText: string,
  imageBase64?: string
): Promise<Recipe> => {
  const systemInstruction = `
    Eres un chef experto especializado en el robot de cocina "Monsieur Cuisine Connect" (similar a Thermomix).
    Tu objetivo es convertir recetas tradicionales (o fotos de recetas) en instrucciones precisas y programables para este robot.
    
    Reglas de conversión:
    1. Analiza los ingredientes y cantidades.
    2. Divide la receta en pasos lógicos para el robot.
    3. Para CADA paso que implique el robot, DEBES especificar:
       - Tiempo (ej. "10 min", "30 seg")
       - Temperatura (ej. "100°C", "120°C", "SF" (Varoma/Vapor), o null si es en frío). Máximo 130°C.
       - Velocidad (1-10, o "Turbo").
       - "Marcha atrás" (Reverse) si es necesario para no triturar la comida (ej. risottos, guisos).
       - Accesorios necesarios (Mezclador/Mariposa, Cesta, Vaporera plana/profunda).
    
    Si el paso es manual (ej. "reservar", "pelar", "servir"), deja los ajustes del robot vacíos.
    El idioma de salida debe ser ESPAÑOL.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Título de la receta adaptada" },
      description: { type: Type.STRING, description: "Breve descripción apetitosa" },
      prepTime: { type: Type.STRING, description: "Tiempo de preparación estimado" },
      totalTime: { type: Type.STRING, description: "Tiempo total estimado" },
      servings: { type: Type.NUMBER, description: "Número de porciones" },
      ingredients: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Lista de ingredientes con cantidades ajustadas"
      },
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            instruction: { type: Type.STRING, description: "Instrucción clara de lo que hay que hacer" },
            settings: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, nullable: true },
                temp: { type: Type.STRING, nullable: true },
                speed: { type: Type.STRING, nullable: true },
                accessory: { type: Type.STRING, nullable: true },
                reverse: { type: Type.BOOLEAN, nullable: true }
              },
              nullable: true
            }
          },
          required: ["instruction"]
        }
      }
    },
    required: ["title", "ingredients", "steps"]
  };

  const parts: any[] = [];
  
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg", // Assuming jpeg for simplicity, usually safe for uploaded photos
        data: imageBase64
      }
    });
  }

  parts.push({
    text: `Convierte la siguiente información en una receta para Monsieur Cuisine Connect: ${promptText || "Ver imagen adjunta"}`
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as Recipe;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("No se pudo convertir la receta. Por favor intenta de nuevo.");
  }
};