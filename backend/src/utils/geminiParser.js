import { Ollama } from 'ollama';
import axios from 'axios';
import { extractTextWithLinks } from './pdfLinkExtractor.js';

// Initialize Ollama with cloud API
const ollama = new Ollama({
  host: 'https://ollama.com',
  headers: {
    Authorization: 'Bearer ' + process.env.OLLAMA_API_KEY
  }
});

// Model to use
const MODEL = 'gemma3:4b-cloud';

// System prompt for resume parsing
const RESUME_PARSER_PROMPT = `You are an expert resume parser. Analyze the resume text and extract structured data.

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no explanations, no code blocks
2. If a section doesn't exist in the resume, return an empty array [] or empty string ""
3. Preserve ALL URLs and links found. The text might contain "[Link: URL]" annotations - use these!
4. For any section you find that doesn't fit standard categories, add to customSections
5. Look for predicted sections: Publications, Volunteering, References, Patents, Certifications
6. Skills should be categorized: technical (programming languages, frameworks), soft (communication, leadership), tools (software, platforms), languages (spoken/written)
7. For projects, always try to find demo URLs and GitHub links
8. Extract achievements, awards into the achievements section
9. Parse dates in readable format (e.g., "Jan 2023 - Present" or "2020 - 2024")

Return this EXACT JSON structure:
{
  "basicDetails": {
    "name": "Full name",
    "headline": "Professional title",
    "email": "email@example.com",
    "phone": "+1-234-567-8900",
    "location": "City, Country",
    "about": "Professional summary"
  },
  "skills": {
    "technical": ["JavaScript", "Python"],
    "soft": ["Leadership", "Communication"],
    "tools": ["Git", "Docker", "AWS"],
    "languages": ["English", "Spanish"]
  },
  "experience": [{
    "title": "Job Title",
    "company": "Company Name",
    "duration": "Jan 2023 - Present",
    "location": "City, Country",
    "description": "Role description",
    "achievements": ["Achievement 1"]
  }],
  "education": [{
    "degree": "Bachelor of Science",
    "institution": "University Name",
    "year": "2020 - 2024",
    "gpa": "3.8/4.0",
    "coursework": ["Data Structures"]
  }],
  "projects": [{
    "title": "Project Name",
    "description": "What it does",
    "techStack": ["React", "Node.js"],
    "demoUrl": "https://demo.com",
    "githubUrl": "https://github.com/user/project"
  }],
  "achievements": [{
    "title": "Award Name",
    "description": "Description",
    "date": "2023"
  }],
  "certifications": [{
    "name": "Cert Name",
    "issuer": "Issuer",
    "date": "2023",
    "url": "https://cert.com"
  }],
  "publications": [{
    "title": "Paper Title",
    "publisher": "Journal/Conf",
    "date": "2023",
    "url": "https://paper.com"
  }],
  "volunteering": [{
    "role": "Role",
    "organization": "Org Name",
    "description": "Description",
    "date": "2023"
  }],
  "references": [{
    "name": "Ref Name",
    "contact": "Contact Info",
    "relationship": "Manager"
  }],
  "extraCurricular": [{
    "activity": "Club Name",
    "role": "Position",
    "description": "What you did"
  }],
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "twitter": "https://twitter.com/username",
    "website": "https://website.com",
    "email": "email@example.com"
  },
  "customSections": [{
    "title": "Section Title",
    "content": "Content string or markdown list"
  }]
}

Now analyze the resume and extract the information:`;

/**
 * Parse resume using Ollama with gemma3:4b-cloud
 * @param {string} pdfUrl - Cloudinary URL of the PDF
 * @returns {Object} Structured resume data
 */
export async function parseResumeWithAI(pdfUrl) {
  try {
    // Download and extract text from PDF
    console.log('Downloading PDF from:', pdfUrl);

    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    });

    // Extract text AND hidden links using our custom extractor
    const text = await extractTextWithLinks(response.data);

    console.log(`Extracted text with links, length: ${text.length}`);

    if (!text || text.trim().length < 50) {
      throw new Error('Could not extract sufficient text from PDF');
    }

    // Send to Ollama
    console.log('Sending to Ollama (gemma3:4b-cloud)...');

    const aiResponse = await ollama.chat({
      model: MODEL,
      messages: [{
        role: 'user',
        content: RESUME_PARSER_PROMPT + '\n\n' + text
      }],
      stream: false
    });

    let responseText = aiResponse.message.content;

    // Clean up response - remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse JSON
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response:', responseText.substring(0, 500));
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate and sanitize the response
    return sanitizeAndValidate(parsedData);

  } catch (error) {
    console.error('Ollama parsing error:', error);
    throw new Error(`Resume parsing failed: ${error.message}`);
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
    certifications: [],
    publications: [],
    volunteering: [],
    references: [],
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
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    publications: Array.isArray(data.publications) ? data.publications : [],
    volunteering: Array.isArray(data.volunteering) ? data.volunteering : [],
    references: Array.isArray(data.references) ? data.references : [],
    customSections: Array.isArray(data.customSections) ? data.customSections : []
  };

  // Copy email to socialLinks if present
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

export default { parseResumeWithAI };
