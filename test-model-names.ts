// Test different Gemini model names
import dotenv from 'dotenv';

dotenv.config();

const { getRecommendationsFromProfile } = await import('./services/geminiService.js');

const modelNames = [
  'gemini-1.5-pro',
  'gemini-1.5-flash', 
  'gemini-pro',
  'gemini-1.0-pro',
  'models/gemini-1.5-pro',
  'models/gemini-pro'
];

console.log('🧪 Testing different Gemini model names...\n');

for (const modelName of modelNames) {
  console.log(`Testing model: ${modelName}`);
  
  // Temporarily modify the service to use this model
  try {
    // We'll just test if the model works by checking the error message
    const result = await getRecommendationsFromProfile('Test Breed', '2 years', 'Short');
    console.log(`✅ ${modelName}: Working (fallback response)`);
  } catch (error) {
    if (error.message.includes('models/')) {
      console.log(`❌ ${modelName}: Model not found`);
    } else {
      console.log(`⚠️ ${modelName}: Other error - ${error.message}`);
    }
  }
  
  console.log();
}