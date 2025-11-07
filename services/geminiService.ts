import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  // This is a fallback for development and should not appear in production.
  // The environment is expected to have the API_KEY set.
  console.warn("API_KEY is not set. Using a mock service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Helper function to convert image file to a Gemini-compatible format
const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

export const getGroomingRecommendations = async (imageBase64: string): Promise<string> => {
  if (!ai) {
    return new Promise(resolve => setTimeout(() => resolve("This is a mock response because the API key is not configured.\n\n**Recommended Services:**\n* **Fluff & Dry:** To enhance volume.\n* **Pawdicure:** For neat and tidy paws."), 1000));
  }

  try {
    const imagePart = fileToGenerativePart(imageBase64, 'image/jpeg');
    const textPart = { text: "Analyze this image of a pet. Based on its apparent breed, coat type, and condition, recommend specific grooming services from a luxury pet salon. Format the response elegantly with headings and bullet points. Be glamorous and inspiring." };
    
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ parts: [textPart, imagePart] }],
    });
    
    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get AI recommendations. Please check your API key and try again.');
  }
};

export const getRecommendationsFromProfile = async (breed: string, age: string, coatType: string): Promise<string> => {
  if (!ai) {
    return new Promise(resolve => setTimeout(() => resolve(`This is a mock response for a ${breed}.\n\n**Recommendations based on profile:**\n* A service suitable for a ${coatType} coat.\n* An age-appropriate treatment for a pet that is ${age}.`), 1000));
  }

  try {
    const textPart = { text: `Analyze this pet profile: The breed is ${breed}, age is ${age}, and coat type is ${coatType}. Based on this information, recommend specific grooming services from a luxury pet salon. Format the response elegantly with headings and bullet points. Be glamorous and inspiring.` };
    
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ parts: [textPart] }],
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get AI recommendations. Please check your API key and try again.');
  }
};


export const transformPetImage = async (imageBase64: string, prompt: string): Promise<string> => {
  if (!ai) {
     return new Promise(resolve => setTimeout(() => resolve(imageBase64), 1000));
  }

  try {
    const imagePart = fileToGenerativePart(imageBase64, 'image/jpeg');
    const textPart = { text: `Transform the pet in this image based on the following instruction: "${prompt}". The output should be a photorealistic image of the pet with the described style.` };

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ parts: [imagePart, textPart] }],
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
      return firstPart.inlineData.data;
    }
    
    throw new Error("Could not generate image. The API did not return valid image data.");
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to transform image. Please check your API key and try again.');
  }
};