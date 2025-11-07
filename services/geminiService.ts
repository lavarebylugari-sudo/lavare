import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Using a mock service.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

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
    return new Promise(resolve => setTimeout(() => resolve("**LAVARE Grooming Recommendations** 🐾\n\n*AI recommendations are currently unavailable, but here are our signature services:*\n\n• **The Royal Treatment** - Full spa day with luxury shampoo, blow-dry, and styling\n• **Pawdicure Perfection** - Nail trimming, paw massage, and moisturizing treatment\n• **Fluff & Fabulous** - Professional grooming to enhance your pet's natural beauty\n• **Coat Conditioning** - Deep conditioning treatment for silky, healthy fur"), 1000));
  }

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
    
    const imagePart = fileToGenerativePart(imageBase64, 'image/jpeg');
    const textPart = "Analyze this image of a pet. Based on its apparent breed, coat type, and condition, recommend specific grooming services from a luxury pet salon. Format the response elegantly with headings and bullet points. Be glamorous and inspiring.";
    
    const response = await model.generateContent([textPart, imagePart]);
    
    return response.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    // Return a professional fallback response
    return "**LAVARE Grooming Recommendations** 🐾\n\n*Our AI stylist is temporarily unavailable, but our expert groomers recommend:*\n\n• **The Signature LAVARE Experience** - Customized grooming based on your pet's unique needs\n• **Breed-Specific Styling** - Professional cuts that enhance your pet's natural features\n• **Luxurious Spa Treatment** - Relaxing bath with premium products\n• **Finishing Touches** - Nail care, ear cleaning, and cologne spritz\n\n*Visit us for a personalized consultation!*";
  }
};

export const getRecommendationsFromProfile = async (breed: string, age: string, coatType: string): Promise<string> => {
  if (!genAI) {
    return new Promise(resolve => setTimeout(() => resolve(`**LAVARE Recommendations for ${breed}** 🐾\n\n*Based on breed characteristics and ${coatType} coat:*\n\n• **Breed-Specific Cut** - Professional styling for ${breed} features\n• **${coatType} Coat Care** - Specialized treatment for optimal health\n• **Age-Appropriate Service** - Gentle care suitable for ${age} pets\n• **LAVARE Luxury Package** - Complete spa experience`), 1000));
  }

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
    const textPart = `Analyze this pet profile: The breed is ${breed}, age is ${age}, and coat type is ${coatType}. Based on this information, recommend specific grooming services from a luxury pet salon. Format the response elegantly with headings and bullet points. Be glamorous and inspiring.`;
    
    const response = await model.generateContent([textPart]);

    return response.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    // Return a professional fallback response
    return `**LAVARE Recommendations for ${breed}** 🐾\n\n*Tailored for ${age} pets with ${coatType} coats:*\n\n• **The ${breed} Signature Style** - Breed-specific grooming that highlights natural beauty\n• **${coatType} Coat Conditioning** - Specialized care for optimal coat health\n• **Age-Conscious Care** - Gentle techniques perfect for ${age} companions\n• **LAVARE Premium Experience** - Complete luxury grooming package\n\n*Book a consultation for personalized service!*`;
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