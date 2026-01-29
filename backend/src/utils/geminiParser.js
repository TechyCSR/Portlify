import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for resume parsing
const RESUME_PARSER_PROMPT = `You are an expert resume parser. Your task is to extract structured data from the resume text provided.

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no explanations, no code blocks
2. If a section doesn't exist in the resume, return an empty array [] or empty string ""
3. Preserve ALL URLs and links found in the text exactly as they appear
4. For any section you find that doesn't fit the standard categories, add it to customSections
5. Be thorough - extract every piece of relevant information
6. Skills should be categorized: technical (programming languages, frameworks), soft (communication, leadership), tools (software, platforms), languages (spoken/written)
7. For projects, always try to find demo URLs and GitHub links
8. Extract achievements, certifications, awards, publications into the achievements section
9. Parse dates in a readable format (e.g., "Jan 2023 - Present" or "2020 - 2024")

Return this EXACT JSON structure (no deviations):
{
  "basicDetails": {
    "name": "Full name of the person",
    "headline": "Professional title or tagline (e.g., 'Full Stack Developer' or 'Software Engineer at Google')",
    "email": "email@example.com",
    "phone": "+1-234-567-8900",
    "location": "City, State/Country",
    "about": "Professional summary or objective if present"
  },
  "skills": {
    "technical": ["JavaScript", "Python", "React", "Node.js"],
    "soft": ["Leadership", "Communication", "Problem Solving"],
    "tools": ["Git", "Docker", "AWS", "Figma"],
    "languages": ["English", "Spanish", "Hindi"]
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Jan 2023 - Present",
      "location": "City, Country",
      "description": "Brief description of role",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University Name",
      "year": "2020 - 2024",
      "gpa": "3.8/4.0",
      "coursework": ["Data Structures", "Algorithms", "Machine Learning"]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "What the project does",
      "techStack": ["React", "Node.js", "MongoDB"],
      "demoUrl": "https://project-demo.com",
      "githubUrl": "https://github.com/user/project"
    }
  ],
  "achievements": [
    {
      "title": "Award or Achievement Name",
      "description": "Brief description",
      "date": "2023"
    }
  ],
  "extraCurricular": [
    {
      "activity": "Activity or Club Name",
      "role": "Role or Position",
      "description": "What you did"
    }
  ],
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "twitter": "https://twitter.com/username",
    "website": "https://personal-website.com",
    "email": "email@example.com"
  },
  "customSections": [
    {
      "title": "Section Title",
      "content": "Content from this section"
    }
  ]
}

RESUME TEXT TO PARSE:
`;

/**
 * Parse resume using Gemini AI
 * @param {string} pdfUrl - Cloudinary URL of the PDF
 * @returns {Object} Structured resume data
 */
export async function parseResumeWithGemini(pdfUrl) {
  try {
    // Fetch PDF and extract text
    const pdfText = await extractTextFromPDF(pdfUrl);

    if (!pdfText || pdfText.trim().length < 50) {
      throw new Error('Could not extract sufficient text from PDF');
    }

    // Call Gemini API - Using latest Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = RESUME_PARSER_PROMPT + pdfText;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse JSON
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', text);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate and sanitize the response
    return sanitizeAndValidate(parsedData);

  } catch (error) {
    console.error('Gemini parsing error:', error);
    throw new Error(`Resume parsing failed: ${error.message}`);
  }
}

/**
 * Extract text from PDF using pdf-parse
 */
async function extractTextFromPDF(pdfUrl) {
  try {
    // Fetch PDF from Cloudinary
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    });
    const pdfBuffer = Buffer.from(response.data);

    // Dynamic import for pdf-parse (CommonJS module)
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(pdfBuffer);

    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Sanitize and validate parsed data
 */
function sanitizeAndValidate(data) {
  const defaultData = {
    basicDetails: {
      name: '',
      headline: '',
      email: '',
      phone: '',
      location: '',
      about: ''
    },
    skills: {
      technical: [],
      soft: [],
      tools: [],
      languages: []
    },
    experience: [],
    education: [],
    projects: [],
    achievements: [],
    extraCurricular: [],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: '',
      email: ''
    },
    customSections: []
  };

  // Merge with defaults to ensure all fields exist
  const result = {
    basicDetails: { ...defaultData.basicDetails, ...data.basicDetails },
    skills: {
      technical: Array.isArray(data.skills?.technical) ? data.skills.technical : [],
      soft: Array.isArray(data.skills?.soft) ? data.skills.soft : [],
      tools: Array.isArray(data.skills?.tools) ? data.skills.tools : [],
      languages: Array.isArray(data.skills?.languages) ? data.skills.languages : []
    },
    experience: Array.isArray(data.experience) ? data.experience.map(sanitizeExperience) : [],
    education: Array.isArray(data.education) ? data.education.map(sanitizeEducation) : [],
    projects: Array.isArray(data.projects) ? data.projects.map(sanitizeProject) : [],
    achievements: Array.isArray(data.achievements) ? data.achievements.map(sanitizeAchievement) : [],
    extraCurricular: Array.isArray(data.extraCurricular) ? data.extraCurricular.map(sanitizeExtraCurricular) : [],
    socialLinks: { ...defaultData.socialLinks, ...data.socialLinks },
    customSections: Array.isArray(data.customSections) ? data.customSections : []
  };

  // Copy email to socialLinks if present in basicDetails
  if (result.basicDetails.email && !result.socialLinks.email) {
    result.socialLinks.email = result.basicDetails.email;
  }

  return result;
}

function sanitizeExperience(exp) {
  return {
    title: exp.title || '',
    company: exp.company || '',
    duration: exp.duration || '',
    location: exp.location || '',
    description: exp.description || '',
    achievements: Array.isArray(exp.achievements) ? exp.achievements : []
  };
}

function sanitizeEducation(edu) {
  return {
    degree: edu.degree || '',
    institution: edu.institution || '',
    year: edu.year || '',
    gpa: edu.gpa || '',
    coursework: Array.isArray(edu.coursework) ? edu.coursework : []
  };
}

function sanitizeProject(proj) {
  return {
    title: proj.title || '',
    description: proj.description || '',
    techStack: Array.isArray(proj.techStack) ? proj.techStack : [],
    demoUrl: proj.demoUrl || '',
    githubUrl: proj.githubUrl || ''
  };
}

function sanitizeAchievement(ach) {
  return {
    title: ach.title || '',
    description: ach.description || '',
    date: ach.date || ''
  };
}

function sanitizeExtraCurricular(extra) {
  return {
    activity: extra.activity || '',
    role: extra.role || '',
    description: extra.description || ''
  };
}

export default { parseResumeWithGemini };
