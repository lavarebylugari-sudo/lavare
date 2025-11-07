<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# LAVARE Pet Salon App

A luxury pet salon management system with AI-powered grooming recommendations.

View your app in AI Studio: https://ai.studio/apps/drive/1xarklNprm4B7GYSIwjShk5EQFlyhPgon

## Features

- **Dashboard**: Overview of appointments and services
- **Booking System**: Schedule grooming appointments
- **Boutique**: Browse and purchase pet products
- **AI Vision**: Get grooming recommendations using AI image analysis
- **Responsive Design**: Works on desktop and mobile devices

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`: Your Gemini API key

## Environment Variables

- `GEMINI_API_KEY`: Required for AI vision features
