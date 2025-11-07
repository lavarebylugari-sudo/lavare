// Quick test to verify Gemini API is working
import { getRecommendationsFromProfile } from './services/geminiService.js';

console.log('Testing Gemini API...');

getRecommendationsFromProfile('Golden Retriever', '3 years', 'Long')
  .then(result => {
    console.log('✅ Gemini API is working!');
    console.log('Response:', result);
  })
  .catch(error => {
    console.log('❌ Gemini API error:', error);
  });