// Comprehensive AI test for LAVARE Pet Salon
import dotenv from 'dotenv';
import { getRecommendationsFromProfile } from './services/geminiService.js';

// Load environment variables
dotenv.config();

console.log('🧪 LAVARE AI Test Suite\n');
console.log('🔧 Environment Check:');
console.log('  - API_KEY:', process.env.API_KEY ? '✅ Set' : '❌ Not set');
console.log('  - GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');
console.log();

async function testAI() {
  const testCases = [
    { breed: 'Golden Retriever', age: '3 years', coatType: 'Long' },
    { breed: 'Poodle', age: '2 years', coatType: 'Curly' },
    { breed: 'Beagle', age: '5 years', coatType: 'Short' }
  ];

  for (const testCase of testCases) {
    console.log(`🐕 Testing ${testCase.breed} (${testCase.age}, ${testCase.coatType} coat)...`);
    
    try {
      const result = await getRecommendationsFromProfile(
        testCase.breed, 
        testCase.age, 
        testCase.coatType
      );
      
      console.log('✅ Success!');
      console.log('📋 AI Recommendation:');
      console.log('-'.repeat(50));
      console.log(result);
      console.log('-'.repeat(50));
      console.log();
      
    } catch (error) {
      console.log('❌ Error:', error.message || error);
      console.log();
    }
  }
}

testAI().catch(console.error);