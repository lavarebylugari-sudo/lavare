// Check available Gemini models
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.log('❌ No API key found');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

console.log('🔍 Checking available Gemini models...\n');

try {
  const models = await genAI.listModels();
  
  console.log('📋 Available Models:');
  console.log('='.repeat(50));
  
  models.forEach((model, index) => {
    console.log(`${index + 1}. ${model.name}`);
    console.log(`   - Display Name: ${model.displayName}`);
    console.log(`   - Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
    console.log();
  });
  
  console.log('='.repeat(50));
  console.log(`Total models: ${models.length}`);
  
} catch (error) {
  console.error('❌ Error listing models:', error.message || error);
}