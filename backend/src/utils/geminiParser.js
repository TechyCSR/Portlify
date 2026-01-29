import { Ollama } from 'ollama';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';

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
const RESUME_PARSER_PROMPT = `You are an expert resume parser. Analyze the resume image(s) provided and extract structured data.

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no explanations, no code blocks
2. If a section doesn't exist in the resume, return an empty array [] or empty string ""
3. Preserve ALL URLs and links found exactly as they appear
4. For any section you find that doesn't fit standard categories, add to customSections
5. Be thorough - extract every piece of relevant information
6. Skills should be categorized: technical (programming languages, frameworks), soft (communication, leadership), tools (software, platforms), languages (spoken/written)
7. For projects, always try to find demo URLs and GitHub links
8. Extract achievements, certifications, awards into the achievements section
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
    "content": "Content"
  }]
}

Now analyze the resume image(s) and extract the information:`;

/**
 * Parse resume using Ollama with gemma3:4b-cloud
 * @param {string} pdfUrl - Cloudinary URL of the PDF
 * @returns {Object} Structured resume data
 */
export async function parseResumeWithAI(pdfUrl) {
  try {
    // Download PDF and convert to images
    const images = await downloadAndConvertPDF(pdfUrl);

    if (!images || images.length === 0) {
      throw new Error('Could not convert PDF to images');
    }

    // Call Ollama API with images
    const response = await ollama.chat({
      model: MODEL,
      messages: [{
        role: 'user',
        content: RESUME_PARSER_PROMPT,
        images: images // Base64 encoded images
      }],
      stream: false
    });

    let text = response.message.content;

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

    // Cleanup temp files
    cleanupTempFiles(images);

    // Validate and sanitize the response
    return sanitizeAndValidate(parsedData);

  } catch (error) {
    console.error('Ollama parsing error:', error);
    throw new Error(`Resume parsing failed: ${error.message}`);
  }
}

/**
 * Download PDF and convert to base64 images
 */
async function downloadAndConvertPDF(pdfUrl) {
  const tempDir = path.join(os.tmpdir(), 'portlify-' + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    // Download PDF
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    });

    const pdfPath = path.join(tempDir, 'resume.pdf');
    fs.writeFileSync(pdfPath, Buffer.from(response.data));

    // Convert PDF to images using pdf2pic
    const { fromPath } = await import('pdf2pic');

    const options = {
      density: 150,
      saveFilename: 'page',
      savePath: tempDir,
      format: 'png',
      width: 1200,
      height: 1600
    };

    const converter = fromPath(pdfPath, options);

    // Get PDF info to know page count
    const pdfParse = (await import('pdf-parse')).default;
    const pdfData = await pdfParse(Buffer.from(response.data));
    const pageCount = pdfData.numpages;

    // Convert pages (max 5 pages)
    const pagesToConvert = Math.min(pageCount, 5);
    const images = [];

    for (let i = 1; i <= pagesToConvert; i++) {
      try {
        const result = await converter(i);
        if (result.path && fs.existsSync(result.path)) {
          // Read image and convert to base64
          const imageBuffer = fs.readFileSync(result.path);
          const base64Image = imageBuffer.toString('base64');
          images.push(base64Image);
        }
      } catch (pageError) {
        console.error(`Error converting page ${i}:`, pageError);
      }
    }

    // Cleanup PDF
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    return images;
  } catch (error) {
    console.error('PDF conversion error:', error);
    // Fallback to text extraction
    return await fallbackToTextExtraction(pdfUrl);
  }
}

/**
 * Fallback: Extract text from PDF and send as text prompt
 */
async function fallbackToTextExtraction(pdfUrl) {
  console.log('Falling back to text extraction...');

  const response = await axios.get(pdfUrl, {
    responseType: 'arraybuffer',
    timeout: 30000
  });

  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(Buffer.from(response.data));
  const text = data.text;

  // Send as text prompt instead of images
  const textResponse = await ollama.chat({
    model: MODEL,
    messages: [{
      role: 'user',
      content: RESUME_PARSER_PROMPT + '\n\nRESUME TEXT:\n' + text
    }],
    stream: false
  });

  let responseText = textResponse.message.content;
  responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  return JSON.parse(responseText);
}

/**
 * Cleanup temporary image files
 */
function cleanupTempFiles(images) {
  // Images are base64 strings, no cleanup needed
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
