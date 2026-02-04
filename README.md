# 🎓 AI Study Abroad Counselor

> Your personalized AI-powered companion for navigating the study abroad journey.

**Live Demo**: 
- [ai-counsellor.app](https://ai-counsellor-9787.vercel.app/)

## 🚀 Overview

**AI Counselor** is an intelligent web application designed to help students plan their international education journey. It acts as a 24/7 personalized guide, helping you shortlist universities, track application deadlines, manage tasks, and analyze your profile strength.

Built with **React 19**, **Vite**, **Express.js**, **Supabase**, and **Google Gemini AI**.

## ✨ Key Features

### 🤖 AI Counselor Chat
- Interactive chat interface to ask anything about studying abroad
- **Smart Action Detection**: Automatically detects intents to add tasks, universities, or lock applications from natural language
- **Quick Prompts**: One-click prompts for profile analysis, scholarship search, and university recommendations
- **🔊 Voice Responses**: Text-to-speech powered by ElevenLabs with browser fallback

### 📊 Smart Dashboard
- **Profile Strength Meter**: Visual breakdown of your Academic, Exam, and SOP readiness
- **AI To-Do List**: Auto-generated tasks tailored to your profile gaps (e.g., "Prepare for IELTS", "Draft SOP")

### 🏫 University Discovery & Shortlisting
- Search and filter universities by country, ranking, and major
- Categorize schools into **Reach**, **Target**, and **Safety**
- **Lock Universities**: Finalize your choices to generate specific application tasks

### 📝 Guidance & Application Tracking
- **Application Tasks**: Dedicated section for tracking submission deadlines, fees, and forms
- **Document Checklist**: Keep track of passports, transcripts, LORs, and SOPs

### 🔐 Authentication
- Secure user authentication via Supabase Auth
- Personalized onboarding flow to capture academic profile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **State Management** | React Context API |
| **Backend** | Node.js, Express.js |
| **Database & Auth** | Supabase (PostgreSQL) |
| **AI Integration** | Google Gemini AI |
| **Voice** | ElevenLabs API + Browser Speech Synthesis fallback |

## 📁 Project Structure

```
ai-counsellor/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context providers (Auth, User)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities, AI service, task templates
│   └── pages/          # Application pages
│       ├── Landing.tsx
│       ├── Login.tsx / Signup.tsx
│       ├── Onboarding.tsx
│       ├── Dashboard.tsx
│       ├── Counselor.tsx
│       ├── Discover.tsx
│       ├── Shortlist.tsx
│       └── Guidance.tsx
├── server/
│   ├── controllers/    # Route handlers
│   ├── routes/         # API routes
│   ├── services/       # AI and database services
│   └── index.js        # Server entry point
└── supabase/           # Database migrations
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase Account
- Google Gemini API Key
- ElevenLabs API Key (optional, for premium voice)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zayed891/AI_Counsellor-
   cd ai-counsellor
   ```

2. **Install Frontend dependencies**
   ```bash
   npm install
   ```

3. **Install Backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Frontend Environment Setup**

   Create a `.env` file in the **root** directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Backend API URL
   VITE_API_URL=http://localhost:8000

   # App URL (for OAuth redirects)
   VITE_SITE_URL=http://localhost:5173
   ```

5. **Backend Environment Setup**

   Create a `.env` file in the **server** directory:
   ```env
   # Server Configuration
   PORT=8000

   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key

   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key

   # ElevenLabs (Optional - for voice responses)
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

6. **Run the Backend**
   ```bash
   cd server
   npm run dev
   ```

7. **Run the Frontend** (in a new terminal)
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🗄️ Database Schema (Supabase)

The app requires the following tables in Supabase:

| Table | Description |
|-------|-------------|
| `profiles` | User details, GPA, study level, test scores |
| `shortlist` | Universities added by user with category (Reach/Target/Safety) |
| `tasks` | To-do items and application tasks |
| `chat_messages` | History of AI conversations |

## 🚀 Deployment

### Vercel Deployment (Frontend)

1. Push code to GitHub
2. Import project in Vercel
3. Add Environment Variables in Vercel settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your backend URL)
   - `VITE_SITE_URL` (your frontend URL)
4. Deploy!

### Backend Deployment

Deploy the `server/` directory to your preferred Node.js hosting service (Railway, Render, Fly.io, etc.) with the required environment variables.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 👨‍💻 Author

**Jayed Akhtar**

---

*© 2026 AI Counsellor. All rights reserved.*
