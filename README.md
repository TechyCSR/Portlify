<p align="center">
  <img src="https://img.shields.io/badge/Portlify-AI%20Portfolio%20Builder-6366f1?style=for-the-badge&logo=react&logoColor=white" alt="Portlify"/>
</p>

<h1 align="center">Portlify</h1>

<p align="center">
  <strong>Transform your resume into a stunning portfolio in seconds</strong>
</p>

<p align="center">
  <a href="https://portlify.techycsr.dev">
    <img src="https://img.shields.io/badge/Live-portlify.techycsr.dev-00C853?style=flat-square&logo=vercel" alt="Live Demo"/>
  </a>
  <a href="https://portlifybackend.techycsr.dev">
    <img src="https://img.shields.io/badge/API-portlifybackend.techycsr.dev-FF6B6B?style=flat-square&logo=node.js" alt="API"/>
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-endpoints">API</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Overview

Portlify is an AI-powered portfolio builder that transforms PDF resumes into professional, responsive portfolio websites. Simply upload your resume, and our AI extracts your skills, experience, projects, and achievements to create a stunning portfolio you can share instantly.

### Live Demo

| Environment | URL |
|-------------|-----|
| Frontend | [portlify.techycsr.dev](https://portlify.techycsr.dev) |
| Backend API | [portlifybackend.techycsr.dev](https://portlifybackend.techycsr.dev) |

---

## Features

### Core Features

| Feature | Description |
|---------|-------------|
| **AI Resume Parsing** | Intelligent extraction of skills, experience, projects, and contact details from PDF resumes using Google Gemini AI |
| **Instant Portfolio Generation** | Automatically creates a professional portfolio from parsed resume data |
| **Custom Username** | Get a personalized portfolio URL (e.g., `portlify.techycsr.dev/username`) |
| **Real-time Editor** | Edit portfolio content directly with instant preview updates |
| **Portfolio Analytics** | Track views, visitor insights, and engagement metrics |
| **Export as ZIP** | Download your portfolio as a static site to host anywhere |

### Design & Customization

| Feature | Description |
|---------|-------------|
| **Dark/Light Themes** | Beautiful design in both modes with smooth transitions |
| **Mobile Responsive** | Perfect display on all devices from phones to desktops |
| **Multiple Portfolio Types** | Technical and Non-technical portfolio layouts |
| **Customizable Sections** | Edit skills, projects, experience, education, and more |
| **Profile Image Upload** | Upload and manage profile pictures via Cloudinary |

### Premium Features

| Feature | Description |
|---------|-------------|
| **Username Change** | Update your portfolio URL anytime |
| **Custom Branding** | Replace footer with your own text and link |
| **Premium Badge** | Show your supporter status on your profile |
| **Priority Support** | Get faster responses to queries |

### Security & Authentication

| Feature | Description |
|---------|-------------|
| **Clerk Authentication** | Secure sign-in with email, Google, GitHub |
| **Protected Routes** | Secure dashboard and settings access |
| **Razorpay Integration** | Secure payment processing for premium |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         React + Vite Frontend                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │ Landing  │ │Dashboard │ │ Editor   │ │Portfolio │ │ Settings │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  │                              │                                       │   │
│  │  ┌──────────────────────────┴────────────────────────────────────┐  │   │
│  │  │              Clerk Auth  |  Framer Motion  |  Tailwind CSS    │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                   SERVER                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       Express.js Backend                             │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                        API Routes                            │   │   │
│  │  │  /auth  │  /profile  │  /analytics  │  /payment  │  /export │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                              │                                       │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐           │   │
│  │  │  Clerk Auth   │  │ Google Gemini │  │   Razorpay    │           │   │
│  │  │  Middleware   │  │   AI Parser   │  │   Payments    │           │   │
│  │  └───────────────┘  └───────────────┘  └───────────────┘           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               DATA LAYER                                     │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐       │
│  │     MongoDB       │  │    Cloudinary     │  │   Razorpay API    │       │
│  │  - Users          │  │  - Image Storage  │  │  - Payments       │       │
│  │  - Profiles       │  │  - CDN Delivery   │  │  - Orders         │       │
│  │  - Analytics      │  │                   │  │                   │       │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Upload  │ ──▶ │  Parse   │ ──▶ │  Store   │ ──▶ │ Generate │
│  Resume  │     │  with AI │     │  Profile │     │Portfolio │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     ▼                ▼                ▼                ▼
   PDF File      Gemini API       MongoDB         React Page
                 Extraction       Document        with Theme
```

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool & Dev Server |
| Tailwind CSS | Utility-first Styling |
| Framer Motion | Animations |
| Clerk | Authentication |
| React Router | Client-side Routing |
| Axios | HTTP Client |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| Google Gemini AI | Resume Parsing |
| Cloudinary | Image Storage |
| Razorpay | Payment Gateway |
| pdf-parse | PDF Text Extraction |

### DevOps

| Technology | Purpose |
|------------|---------|
| Vercel | Frontend Hosting |
| Vercel | Backend Hosting |
| MongoDB Atlas | Database Hosting |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Clerk account
- Google AI API key (Gemini)
- Cloudinary account
- Razorpay account (for payments)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/techycsr/portlify.git
cd portlify
```

2. **Backend Setup**

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
GEMINI_API_KEY=your_google_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the server:

```bash
npm run dev
```

3. **Frontend Setup**

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the development server:

```bash
npm run dev
```

4. **Access the application**

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/register` | Register new user |
| PUT | `/api/auth/username` | Update username (Premium) |
| GET | `/api/auth/check-username/:username` | Check username availability |

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/me` | Get user's profile |
| GET | `/api/profile/:username` | Get public profile |
| PUT | `/api/profile` | Update profile |
| POST | `/api/profile/parse-resume` | Parse resume PDF |
| PUT | `/api/profile/visibility` | Toggle profile visibility |
| DELETE | `/api/profile/reset` | Reset profile data |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get portfolio analytics |
| POST | `/api/analytics/track` | Track portfolio view |

### Payment

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payment/status` | Get premium status |
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment |
| GET | `/api/payment/branding` | Get custom branding |
| PUT | `/api/payment/branding` | Update custom branding |

### Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/export/portfolio` | Download portfolio as ZIP |

---

## Project Structure

```
portlify/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vercel.json
│
├── README.md
└── LICENSE
```

---

## Skills Categorization

Portlify automatically categorizes extracted skills into:

| Category | Examples |
|----------|----------|
| Languages | JavaScript, Python, Java, C++, TypeScript |
| Frameworks | React, Node.js, Django, Spring Boot, Express |
| Databases | MongoDB, PostgreSQL, MySQL, Redis, Firebase |
| Tools | Git, Docker, AWS, Kubernetes, Jenkins |
| Concepts | Data Structures, Algorithms, System Design, OOP |
| Soft Skills | Leadership, Communication, Problem Solving |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Author

<p align="center">
  <a href="https://techycsr.dev">
    <img src="https://img.shields.io/badge/Author-@TechyCSR-6366f1?style=for-the-badge&logo=github" alt="Author"/>
  </a>
</p>

<p align="center">
  <a href="https://techycsr.dev">Website</a> •
  <a href="https://github.com/techycsr">GitHub</a>
</p>

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with dedication by <a href="https://techycsr.dev">@TechyCSR</a>
</p>
