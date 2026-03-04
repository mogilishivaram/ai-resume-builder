# 🧠 AI Resume Builder

<div align="center">

![AI Resume Builder](https://img.shields.io/badge/AI%20Resume%20Builder-v1.0-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-orange?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

### Build your perfect resume with AI assistance — powered by Google Gemini AI

</div>

---

## 📸 Screenshots

<div align="center">

### 🏠 Landing Page
![Landing Page](https://raw.githubusercontent.com/mogilishivaram/ai-resume-builder/main/co/screenshots/landing.png)

### ✨ Features
![Features](https://raw.githubusercontent.com/mogilishivaram/ai-resume-builder/main/co/screenshots/features.png)

### 🔐 Google Login
![Login](https://raw.githubusercontent.com/mogilishivaram/ai-resume-builder/main/co/screenshots/login.png)

### 📊 Dashboard
![Dashboard](https://raw.githubusercontent.com/mogilishivaram/ai-resume-builder/main/co/screenshots/dashboard.png)

### 🤖 AI Assistant + Split View Editor
![Editor](https://raw.githubusercontent.com/mogilishivaram/ai-resume-builder/main/co/screenshots/editor.png)

### 🎨 Template Selection
![Templates](https://raw.githubusercontent.com/mogilishivaram/ai-resume-builder/main/co/screenshots/templates.png)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Content Generation** | Generates professional summaries, experience bullets & skill suggestions using Google Gemini 2.5 Flash |
| 🔐 **Google OAuth 2.0** | Secure sign-in with Google account, protected with JWT tokens |
| 🎨 **3 Resume Templates** | Professional (blue), Modern (purple), Creative (green) |
| 👁️ **Split View Editor** | Live preview alongside the form editor in real time |
| 📄 **PDF Export** | Download polished resume as PDF, ready to send to recruiters |
| 📱 **Fully Responsive** | Works on mobile, tablet, and desktop |
| 💾 **Auto Save** | Resume data securely stored and synced |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Tailwind CSS, html2pdf.js |
| **Backend** | Python Flask, SQLAlchemy, SQLite |
| **Auth** | Google OAuth 2.0 + JWT Tokens |
| **AI** | Google Gemini 2.5 Flash API |
| **Deployment** | Render.com |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mogilishivaram/ai-resume-builder.git
cd ai-resume-builder/app/co
```

### 2. Set up environment variables
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SECRET_KEY=your_random_secret_key
```

### 3. Run Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
> Runs on `http://localhost:5000`

### 4. Run Frontend
```bash
cd frontend
npm install
npm start
```
> Runs on `http://localhost:3000`

---

## 🔑 API Keys Setup

**Gemini API Key (Free)**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → Create
3. Paste as `GEMINI_API_KEY` in `.env`

**Google OAuth**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials → OAuth 2.0 Client ID
3. Add `http://localhost:5000/auth/callback` as redirect URI
4. Paste Client ID & Secret in `.env`

---

## 🧪 All Tests Passed ✅

| Test | Result |
|------|--------|
| Basic UI & Navigation | ✅ Passed |
| Google OAuth Login/Logout | ✅ Passed |
| AI Content Generation | ✅ Passed |
| 3 Resume Templates | ✅ Passed |
| Live Preview | ✅ Passed |
| PDF Export | ✅ Passed |
| Mobile Responsive | ✅ Passed |

---

## 📁 Project Structure

```
app/co/
├── backend/
│   ├── app.py           # Flask API routes
│   ├── auth.py          # Google OAuth logic
│   ├── ai_engine.py     # Gemini AI integration
│   ├── models.py        # Database models
│   ├── config.py        # Configuration
│   └── requirements.txt
└── frontend/
    └── src/
        ├── components/  # Navbar, ResumeForm, ResumePreview, AIPanel
        ├── pages/       # Landing, Login, Dashboard, ResumeEditor
        ├── context/     # AuthContext
        └── services/    # API layer
```

---

## 👨‍💻 Author

<div align="center">

**Shiva Ram** ([@mogilishivaram](https://github.com/mogilishivaram))

*CSE Student | AI Enthusiast*

*Built with ❤️ and a little morning boredom 😄*

⭐ **Star this repo if you found it helpful!**

</div>
