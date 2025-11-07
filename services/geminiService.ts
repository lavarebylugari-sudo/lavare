import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Using a mock service.");
}

const genAI = API_KEY ? new GoogleGenAI(API_KEY) : null;

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
  if (!genAI) {
    return new Promise(resolve => setTimeout(() => resolve("This is a mock response because the API key is not configured.\n\n**Recommended Services:**\n* **Fluff & Dry:** To enhance volume.\n* **Pawdicure:** For neat and tidy paws."), 1000));
  }

  try {
    const imagePart = fileToGenerativePart(imageBase64, 'image/jpeg');
    const textPart = { text: "Analyze this image of a pet. Based on its apparent breed, coat type, and condition, recommend specific grooming services from a luxury pet salon. Format the response elegantly with headings and bullet points. Be glamorous and inspiring." };
    
    const response = await genAI.models.generateContent({
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
  if (!genAI) {
    return new Promise(resolve => setTimeout(() => resolve(`This is a mock response for a ${breed}.\n\n**Recommendations based on profile:**\n* A service suitable for a ${coatType} coat.\n* An age-appropriate treatment for a pet that is ${age}.`), 1000));
  }

  try {
    const textPart = { text: `Analyze this pet profile: The breed is ${breed}, age is ${age}, and coat type is ${coatType}. Based on this information, recommend specific grooming services from a luxury pet salon. Format the response elegantly with headings and bullet points. Be glamorous and inspiring.` };
    
    const response = await genAI.models.generateContent({
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
  if (!genAI) {
     return new Promise(resolve => setTimeout(() => resolve(imageBase64), 1000));
  }

  try {
    // Note: Image transformation is not available in the current Gemini API
    // This is a placeholder that returns the original image
    console.warn('Image transformation is not currently available with Gemini API');
    return imageBase64;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to transform image. Please check your API key and try again.');
  }
};