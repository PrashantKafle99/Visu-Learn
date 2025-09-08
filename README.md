# 🌟 VisuLearn - Interactive AI Learning Platform for Kids

VisuLearn is a web-first AI playground that transforms learning into an engaging, visual adventure for children. Built with Next.js and powered by Google Gemini AI, it creates personalized educational content through interactive comics, stories, and real-world photo analysis.

## ✨ Core Features

**📚 Comic Mode**: Interactive educational comics with consistent characters that adapt to any subject. Kids explore topics like physics, math, and biology through dynamic visual storytelling with voice narration and smooth panel transitions.

**📖 Story Mode**: Personalized adventures where children become the main character. Upload a photo and watch as AI creates a cartoon version, starring them in educational stories tailored to their interests and learning level.

**📸 Snap & Learn**: Transform everyday photos into interactive learning experiences. Point your camera at objects around you, and AI adds educational annotations, explanations, and mini-quizzes to turn the real world into a classroom.

## 🚀 Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **AI**: Google Gemini 2.0 Flash Image aka Nano Banana for content generation
- **Image Processing**: Custom AI image enhancement
- **Audio**: Text-to-speech integration using Eleven Labs
- **Storage**: LocalStorage for seamless user experience

## ⚙️ Setup & Installation

```bash
# Clone the repository
git clone <repository-url>
cd visulearn

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start learning!

No login required - just pure learning fun!
