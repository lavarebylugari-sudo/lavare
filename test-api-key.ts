// Simple API key validation test
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔑 API Key Test');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'Not found');
console.log('API Key Length:', API_KEY ? API_KEY.length : 0);
console.log();

if (!API_KEY) {
  console.log('❌ No API key found');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Try the simplest possible model and request
const models = ['gemini-pro', 'gemini-1.5-pro', 'models/gemini-pro'];

for (const modelName of models) {
  console.log(`🧪 Testing model: ${modelName}`);
  
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Hello world');
    const response = await result.response;
    const text = response.text();
    
    console.log(`✅ SUCCESS with ${modelName}!`);
    console.log(`Response: ${text.substring(0, 100)}...`);
    break;
    
  } catch (error) {
    console.log(`❌ Failed with ${modelName}: ${error.message}`);
  }
  
  console.log();
}

console.log('\n🏁 Test complete');