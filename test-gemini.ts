// Quick test to verify Gemini API is working
import { getRecommendationsFromProfile } from './services/geminiService.js';

console.log('🧪 Testing Gemini AI API...\n');

// Test with a Golden Retriever profile
console.log('Testing with Golden Retriever profile...');
getRecommendationsFromProfile('Golden Retriever', '3 years', 'Long')
  .then(result => {
    console.log('✅ Gemini AI is working!');
    console.log('\n📋 AI Response:');
    console.log('=' .repeat(50));
    console.log(result);
    console.log('=' .repeat(50));
  })
  .catch(error => {
    console.log('❌ Gemini API error:', error.message || error);
  });