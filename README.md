# 🎓 AI Study Abroad Counselor

> Your personalized AI-powered companion for navigating the study abroad journey.

**Live Demo**: [AI Counsellor](https://ai-counsellor-9787.vercel.app/)

## 🚀 Overview

**AI Counselor** is an intelligent web application designed to help students plan their international education journey. It acts as a 24/7 personalized guide, helping you shortlist universities, track application deadlines, manage tasks, and analyze your profile strength.

Built with **React**, **Vite**, **Express.js**, **Supabase**, and **Google Gemini AI**.

## ✨ Key Features

- **🤖 AI Counselor Chat**:
  - Interactive chat interface to ask anything about studying abroad.
  - **Smart Action Detection**: Automatically detects intents to add tasks, universities, or lock applications from natural language.
  - **Quick Prompts**: One-click prompts for profile analysis, scholarship search, and university recommendations.

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

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS v4** for styling
- **React Router v7** for navigation
- **Lucide React** for icons

### Backend
- **Express.js** (Node.js server)
- **Google Gemini AI** for intelligent responses
- **Supabase** for database and authentication
- **PostgreSQL** (via Supabase)

### Deployment
- **Frontend**: Vercel
- **Backend**: Vercel Serverless Functions

## 📁 Project Structure

```
ai-counsellor/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions & services
│   ├── pages/              # Page components
│   └── App.tsx             # Main application component
├── server/                 # Backend Express server
│   ├── controllers/        # Route controllers
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic & external APIs
│   └── index.js            # Server entry point
├── supabase/               # Supabase configuration & migrations
└── public/                 # Static assets
```

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

   # Backend API URL
   VITE_API_URL=http://localhost:8000

   # App URL
   VITE_SITE_URL=http://localhost:5173
   ```

   Create a `.env` file in the **server** directory:
   ```env
   # Gemini AI Configuration
   GEMINI_API_KEY=your_gemini_api_key

   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Server Configuration
   PORT=8000
   ```

5. **Run the Development Servers**

   Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

   In a new terminal, start the frontend:
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

### Backend Deployment

The backend can be deployed to:
- **Vercel Serverless Functions**
- **Railway**
- **Render**
- **Heroku**

Make sure to set the appropriate environment variables for your hosting platform.

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/chat` | POST | Send chat messages to AI counselor |
| `/api/shortlist` | GET/POST/DELETE | Manage university shortlist |
| `/api/tasks` | GET/POST/PUT/DELETE | Manage tasks and to-dos |

## 👨‍💻 Author

**Jayed Akhtar**

---

*© 2026 AI Counsellor. All rights reserved.*
