import express from 'express';
import archiver from 'archiver';
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import authMiddleware, { getUserFromAuth } from '../middleware/auth.js';

const router = express.Router();

// Generate portfolio HTML template
const generateHTML = (profile, preferences) => {
    const { basicDetails, skills, experience, education, projects, certifications, socialLinks } = profile;
    const isTechnical = preferences?.portfolioType === 'technical';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${basicDetails.headline || `Portfolio of ${basicDetails.name}`}">
    <meta property="og:title" content="${basicDetails.name} - Portfolio">
    <meta property="og:description" content="${basicDetails.headline || basicDetails.about?.substring(0, 160)}">
    <meta property="og:image" content="${basicDetails.profilePhoto || ''}">
    <title>${basicDetails.name} - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Hero Section -->
        <header class="hero">
            ${basicDetails.profilePhoto ? `<img src="${basicDetails.profilePhoto}" alt="${basicDetails.name}" class="avatar">` : ''}
            <h1>${basicDetails.name || 'Your Name'}</h1>
            <p class="headline">${basicDetails.headline || ''}</p>
            <p class="location">${basicDetails.location || ''}</p>
            ${basicDetails.about ? `<p class="about">${basicDetails.about}</p>` : ''}
            
            <!-- Social Links -->
            <div class="social-links">
                ${socialLinks?.linkedin ? `<a href="${socialLinks.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
                ${socialLinks?.github ? `<a href="${socialLinks.github}" target="_blank" rel="noopener">GitHub</a>` : ''}
                ${socialLinks?.twitter ? `<a href="${socialLinks.twitter}" target="_blank" rel="noopener">Twitter</a>` : ''}
                ${socialLinks?.website ? `<a href="${socialLinks.website}" target="_blank" rel="noopener">Website</a>` : ''}
            </div>
        </header>

        <!-- Skills Section -->
        ${(skills?.technical?.length || skills?.tools?.length) ? `
        <section class="section">
            <h2>Skills</h2>
            <div class="skills-grid">
                ${skills.technical?.map(s => `<span class="skill-tag">${s}</span>`).join('') || ''}
                ${skills.tools?.map(s => `<span class="skill-tag">${s}</span>`).join('') || ''}
            </div>
        </section>
        ` : ''}

        <!-- Experience Section -->
        ${experience?.length ? `
        <section class="section">
            <h2>Experience</h2>
            ${experience.map(exp => `
            <div class="card">
                <h3>${exp.title}</h3>
                <p class="subtitle">${exp.company} ${exp.location ? `• ${exp.location}` : ''}</p>
                <p class="duration">${exp.duration}</p>
                ${exp.description ? `<p>${exp.description}</p>` : ''}
            </div>
            `).join('')}
        </section>
        ` : ''}

        <!-- Projects Section -->
        ${projects?.length ? `
        <section class="section">
            <h2>Projects</h2>
            <div class="projects-grid">
                ${projects.map(proj => `
                <div class="card project-card">
                    <h3>${proj.title}</h3>
                    <p>${proj.description || ''}</p>
                    ${proj.techStack?.length ? `
                    <div class="tech-stack">
                        ${proj.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                    ` : ''}
                    <div class="project-links">
                        ${proj.demoUrl ? `<a href="${proj.demoUrl}" target="_blank" rel="noopener">Live Demo</a>` : ''}
                        ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" rel="noopener">GitHub</a>` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Education Section -->
        ${education?.length ? `
        <section class="section">
            <h2>Education</h2>
            ${education.map(edu => `
            <div class="card">
                <h3>${edu.degree}</h3>
                <p class="subtitle">${edu.institution}</p>
                <p class="duration">${edu.year}</p>
            </div>
            `).join('')}
        </section>
        ` : ''}

        <!-- Certifications Section -->
        ${certifications?.length ? `
        <section class="section">
            <h2>Certifications</h2>
            ${certifications.map(cert => `
            <div class="card">
                <h3>${cert.name}</h3>
                <p class="subtitle">${cert.issuer}</p>
                <p class="duration">${cert.date}</p>
                ${cert.credentialUrl ? `<a href="${cert.credentialUrl}" target="_blank" rel="noopener">View Credential</a>` : ''}
            </div>
            `).join('')}
        </section>
        ` : ''}

        <footer>
            <p>Generated with ❤️ by Portlify</p>
        </footer>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
};

// Generate CSS
const generateCSS = (theme) => {
    const themes = {
        modern: { primary: '#6366f1', bg: '#0f172a', card: '#1e293b', text: '#f8fafc' },
        minimal: { primary: '#18181b', bg: '#ffffff', card: '#f4f4f5', text: '#18181b' },
        creative: { primary: '#ec4899', bg: '#1f1f1f', card: '#2d2d2d', text: '#ffffff' },
        professional: { primary: '#0f766e', bg: '#f0fdfa', card: '#ffffff', text: '#134e4a' }
    };

    const t = themes[theme] || themes.modern;

    return `
:root {
    --primary: ${t.primary};
    --bg: ${t.bg};
    --card: ${t.card};
    --text: ${t.text};
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.hero {
    text-align: center;
    margin-bottom: 3rem;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid var(--primary);
    margin-bottom: 1rem;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.headline {
    font-size: 1.25rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
}

.location {
    opacity: 0.6;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.about {
    max-width: 600px;
    margin: 1rem auto;
}

.social-links {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 1.5rem;
}

.social-links a {
    color: var(--primary);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid var(--primary);
    border-radius: 0.5rem;
    transition: all 0.3s;
}

.social-links a:hover {
    background: var(--primary);
    color: white;
}

.section {
    margin-bottom: 3rem;
}

.section h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--primary);
}

.card {
    background: var(--card);
    padding: 1.5rem;
    border-radius: 1rem;
    margin-bottom: 1rem;
}

.card h3 {
    margin-bottom: 0.5rem;
}

.subtitle {
    opacity: 0.7;
}

.duration {
    font-size: 0.9rem;
    opacity: 0.6;
    margin-bottom: 0.5rem;
}

.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-tag {
    background: var(--primary);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.9rem;
}

.projects-grid {
    display: grid;
    gap: 1rem;
}

.tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
}

.tech-tag {
    background: rgba(99, 102, 241, 0.2);
    color: var(--primary);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
}

.project-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.project-links a {
    color: var(--primary);
    text-decoration: none;
}

footer {
    text-align: center;
    padding: 2rem;
    opacity: 0.6;
}

@media (max-width: 600px) {
    h1 { font-size: 2rem; }
    .container { padding: 1rem; }
}
`;
};

// Generate JS
const generateJS = () => {
    return `
// Portfolio JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Add fade-in animation to sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
});
`;
};

// Download portfolio as ZIP (protected)
router.get('/portfolio', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const profile = await Profile.findOne({ userId: user._id });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Set response headers for ZIP download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${user.username}-portfolio.zip"`);

        // Create archive
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);

        // Add files
        archive.append(generateHTML(profile, user.preferences), { name: 'index.html' });
        archive.append(generateCSS(user.preferences?.themePreference || 'modern'), { name: 'styles.css' });
        archive.append(generateJS(), { name: 'script.js' });

        // Add README
        archive.append(`# ${profile.basicDetails?.name || user.username}'s Portfolio

Generated from Portlify on ${new Date().toLocaleDateString()}

## Usage
1. Open index.html in a browser
2. Or deploy to any static hosting (GitHub Pages, Netlify, Vercel)

## Files
- index.html - Main portfolio page
- styles.css - Styling
- script.js - Animations and interactions

## Customization
Feel free to modify the CSS variables in styles.css to change colors.

Generated with ❤️ by Portlify
https://portlify.techycsr.dev
`, { name: 'README.md' });

        await archive.finalize();
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Export failed' });
    }
});

export default router;
