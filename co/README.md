# AI Resume Builder

A full-stack AI-powered Resume Builder with Google Authentication.

## Features

- **Google OAuth 2.0 Authentication** – Sign in securely with your Google account
- **AI-Powered Resume Generation** – Generate professional resume content using AI (Google Gemini)
- **Multiple Resume Templates** – Choose from Professional, Modern, and Creative templates
- **Live Preview** – See your resume update in real-time
- **PDF Export** – Download your resume as a polished PDF
- **Resume Management** – Save, edit, and manage multiple resumes
- **Responsive Design** – Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 18 with React Router
- Tailwind CSS for styling
- React Icons
- html2pdf.js for PDF generation

### Backend
- Python Flask
- Flask-CORS for cross-origin requests
- Google OAuth 2.0 (google-auth, google-auth-oauthlib)
- Google Generative AI (Gemini) for AI content
- SQLite database
- JWT for session management

## Project Structure

```
co/
├── backend/
│   ├── app.py              # Main Flask server
│   ├── auth.py             # Google OAuth routes
│   ├── ai_engine.py        # AI resume generation
│   ├── models.py           # Database models
│   ├── config.py           # Configuration
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   ├── services/       # API service layer
│   │   ├── styles/         # CSS files
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google+ API** and **Google Identity Services**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set Authorized redirect URIs: `http://localhost:5000/auth/google/callback`
6. Copy your **Client ID** and **Client Secret**

### 2. Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key
3. Copy the key

### 3. Backend Setup

```bash
cd co/backend
pip install -r requirements.txt

# Copy .env.example to .env and fill in your credentials
cp .env.example .env

# Run the server
python app.py
```

### 4. Frontend Setup

```bash
cd co/frontend
npm install
npm start
```

### 5. Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `GEMINI_API_KEY` | Google Gemini API Key |
| `SECRET_KEY` | Flask secret key for sessions |
| `FRONTEND_URL` | Frontend URL (default: http://localhost:3000) |
