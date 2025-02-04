# Faaiz - AI Audio Transcription with Speaker Detection

A modern, sleek web application that uses AssemblyAI to transform your audio into text with powerful AI-powered transcription and speaker identification.

## Features

- 🎙️ Automatic speaker detection and labeling
- 🕒 Timestamp tracking for each speaker segment
- 👥 Toggle between speakers view and full text view
- 🎯 Transcribe audio from URLs using AssemblyAI's powerful API
- 🔒 Secure API key input with show/hide functionality
- 📋 One-click copy to clipboard (supports both views)
- 🎨 Modern, responsive UI with glass-morphism design
- ⚡ Real-time transcription status with loading indicators
- 🛡️ Comprehensive error handling
- 📱 Full-screen responsive layout

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Get your API key from [AssemblyAI](https://www.assemblyai.com/)
2. Enter your API key in the application
3. Provide a URL to an audio file (MP3, WAV, etc.)
4. Click "Start Transcription"
5. View results in either:
   - Speakers View: See who said what and when
   - Full Text View: See the complete transcript

## Deploying to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy!

## Technologies Used

- Next.js
- React
- Tailwind CSS
- AssemblyAI API with Speaker Detection
