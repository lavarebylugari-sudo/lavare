// Real Gemini API test for LAVARE Pet Salon
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Import AFTER loading environment variables
const { getRecommendationsFromProfile } = await import('./services/geminiService.js');

console.log('🚀 LAVARE Real AI Test\n');
console.log('🔧 Environment Check:');
console.log('  - GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');
console.log('  - API will use:', process.env.GEMINI_API_KEY ? 'Real Gemini API' : 'Mock Service');
console.log();

console.log('🐕 Testing with Golden Retriever...');

try {
  const result = await getRecommendationsFromProfile('Golden Retriever', '3 years', 'Long');
  
  console.log('✅ AI Response Generated!');
  console.log('📋 Recommendation:');
  console.log('='.repeat(60));
  console.log(result);
  console.log('='.repeat(60));
  
  // Check if it's a real AI response or mock
  if (result.includes('AI recommendations are currently unavailable')) {
    console.log('\n⚠️  Using mock service - API key may not be working');
  } else if (result.includes('Based on breed characteristics')) {
    console.log('\n⚠️  Using mock service - check API key configuration');
  } else {
    console.log('\n🎉 Real Gemini AI is working!');
  }
  
} catch (error) {
  console.log('❌ Error:', error.message || error);
}