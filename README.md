# 🎓 AI Study Abroad Counselor

> Your personalized AI-powered companion for navigating the study abroad journey.

AI Counselor Preview - https://ai-counsellor-k1gm.vercel.app/

## 🚀 Overview

**AI Counselor** is an intelligent web application designed to help students plan their international education journey. It acts as a 24/7 personalized guide, helping you shortlist universities, track application deadlines, manage tasks, and analyze your profile strength.

Built with **React**, **Vite**, **Express.js**, **Supabase**, and **Google Gemini AI**.

## ✨ Key Features

- **🤖 AI Counselor Chat**:
  - Interactive chat interface to ask anything about studying abroad.
  - **Smart Action Detection**: Automatically detects intents to add tasks, universities, or lock applications from natural language.
  - **Quick Prompts**: One-click prompts for profile analysis, scholarship search, and university recommendations.
  - **🔊 Voice Responses**: Text-to-speech powered by ElevenLabs for natural AI voice output.

- **📊 Smart Dashboard**:
  - **Profile Strength Meter**: Visual breakdown of your Academic, Exam, and SOP readiness.
  - **AI To-Do List**: Auto-generated tasks tailored to your profile gaps (e.g., "Prepare for IELTS", "Draft SOP").

- **🏫 University Discovery & Shortlisting**:
  - Search and filter universities by country, ranking, and major.
  - Categorize schools into **Reach**, **Target**, and **Safety**.
  - **Lock Universities**: Finalize your choices to generate specific application tasks.

- **📝 Guidance & Application Tracking**:
  - **Application Tasks**: Dedicated section for tracking submission deadlines, fees, and forms for specific universities.
  - **Document Checklist**: Keep track of passports, transcripts, LORs, and SOPs.

- **🔐 Authentication**:
  - Secure user authentication via Supabase Auth.
  - Personalized onboarding flow to capture academic profile.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **Backend / Database**: Supabase (Auth & Database)
- **AI Integration**: OpenRouter API (GPT-4o, Claude 3.5 Sonnet, etc.)

## ⚡ Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase Account
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-counsellor.git
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

4. **Environment Setup**

   Create a `.env` file in the **root** directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Run Locally**
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

### Vercel Deployment

1. Push code to GitHub.
2. Import project in Vercel.
3. Add the Environment Variables in Vercel settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your backend URL)
   - `GEMINI_API_KEY`
4. Deploy!

## 👨‍💻 Author

**Jayed Akhtar**

---

*© 2026 AI Counsellor. All rights reserved.*
