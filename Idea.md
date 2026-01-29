Portlify


PROMPT (single snippet):

Build a full-stack MERN project named Portlify with the following strict requirements.

Architecture:

Monorepo with two top-level folders:

/frontend → React (Vite), Tailwind CSS , 3d Modern 

/backend → Node.js, Express

Frontend deployed at https://portlify.techycsr.dev

Backend deployed at https://portlifybackend.techycsr.dev

Public portfolios available at https://portlify.techycsr.dev/:username

Tech stack:

Frontend: React + Vite + Tailwind CSS

Backend: Express + MongoDB Atlas + Mongoose

Auth & user management: Clerk

File storage: Cloudinary (signed uploads, backend generates signature)

Deployment target: Vercel (frontend and backend separately)

Core functionality:

User authentication via Clerk (email/password).

Enforce unique username at signup (validated and stored in MongoDB).

Authenticated users can upload a resume PDF.

Resume upload flow:

Frontend requests a signed upload signature from backend.

Frontend uploads PDF directly to Cloudinary.

Backend never receives file bytes.

Cloudinary returns secure_url.

Backend parses resume text (use pdf-parse) and converts it into structured profile data:

name

headline

skills

experience

education

Store parsed profile data + resume URL in MongoDB.

Auto-generate a public portfolio page using stored data.

Public portfolio pages are accessible without auth at /username.

Users can edit parsed data manually after generation.

Resume PDF itself is not publicly exposed—only parsed content is shown.

Backend requirements:

REST API only (no server-side rendering).

Routes:

/api/auth/check-username

/api/cloudinary/signature

/api/profile/create

/api/profile/update

/api/profile/:username

Proper schema design (User, Profile).

Environment variables for secrets.

CORS configured for frontend domain only.

Frontend requirements:

Pages:

Auth (Clerk)

Username selection

Resume upload

Profile editor

Public portfolio view

Clean, minimal UI.

Fetch data from backend using domain URLs (no relative assumptions).

Code quality:

Production-ready structure

Clear folder organization

Comments only where logic is non-obvious

No mock logic, no placeholders

Do NOT:

Upload files through backend

Expose Cloudinary API secret

Use unsigned uploads

Mix frontend and backend code

Generate the full project structure and core implementation.