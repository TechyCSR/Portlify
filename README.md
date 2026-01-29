# Portlify

Transform your resume into a stunning portfolio in seconds.

## 🚀 Features

- **Resume Parsing** - Upload a PDF resume and automatically extract skills, experience, and education
- **Public Portfolio** - Get a shareable portfolio URL at `portlify.techycsr.dev/username`
- **Profile Editor** - Customize your parsed data and add social links
- **Secure Uploads** - Direct upload to Cloudinary with signed URLs (no backend file handling)
- **Modern UI** - Glassmorphic design with smooth animations

## 📁 Project Structure

```
/Portlify
├── /frontend          # React + Vite + Tailwind
│   ├── /src
│   │   ├── /components
│   │   ├── /pages
│   │   ├── /hooks
│   │   └── /utils
│   └── vercel.json
├── /backend           # Express + MongoDB
│   ├── /src
│   │   ├── /routes
│   │   ├── /models
│   │   ├── /middleware
│   │   └── /utils
│   └── vercel.json
└── README.md
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Clerk account
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=https://portlify.techycsr.dev
```

### Frontend (.env)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=https://portlifybackend.techycsr.dev
```

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/check-username` | GET | Check username availability |
| `/api/auth/register` | POST | Register user with username |
| `/api/auth/me` | GET | Get current user |
| `/api/cloudinary/signature` | GET | Get signed upload params |
| `/api/profile/create` | POST | Parse resume and create profile |
| `/api/profile/update` | PUT | Update profile data |
| `/api/profile/:username` | GET | Get public profile |

## 🚢 Deployment

Deploy frontend and backend separately on Vercel:

1. **Backend**: Link `/backend` folder, set environment variables
2. **Frontend**: Link `/frontend` folder, set environment variables

## 📝 License

MIT
