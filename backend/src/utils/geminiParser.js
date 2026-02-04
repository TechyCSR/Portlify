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
const RESUME_PARSER_PROMPT = `You are an elite resume parsing AI. Your job is to extract EVERY piece of information from a resume and structure it into a premium portfolio format.

## CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON - absolutely no markdown, no explanations, no code blocks, no prefixes
2. Extract EVERYTHING - names, titles, descriptions, dates, locations, URLs, achievements
3. Be GENEROUS with descriptions - write professional, engaging summaries
4. NEVER leave fields empty if you can infer or generate quality content
5. URLs: Look for "linkedin.com", "github.com", "http://", "https://", email patterns. The text might contain "[Link: URL]" annotations - ALWAYS use these!

## SMART EXTRACTION RULES:

### For "about" (Professional Summary):
- If resume has a summary/objective, use it and ENHANCE it
- If no summary exists, GENERATE a compelling 2-3 sentence professional summary based on their experience and skills
- Example: "Senior Full Stack Developer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers."

### For Skills (CATEGORIZE CAREFULLY):
- "programmingLanguages": Only programming/scripting languages (Python, JavaScript, TypeScript, C++, Java, SQL, Go, Rust, Ruby, PHP, Swift, Kotlin, C#, R)
- "frameworks": Libraries and frameworks (React, Vue, Angular, Node.js, Express, Django, Flask, TensorFlow, Keras, PyTorch, Scikit-learn, Spring, .NET, Laravel, Next.js)
- "databases": Database systems (MongoDB, MySQL, PostgreSQL, SQLite, Redis, Firebase, DynamoDB, Cassandra, Oracle, SQL Server)
- "tools": Development tools (Git, Docker, Postman, VS Code, Figma, Jira, Jenkins, Webpack, npm, Kubernetes, Terraform)
- "cloudSystems": Cloud platforms and OS (AWS, Azure, GCP, Linux, Windows, macOS, Heroku, Vercel, Netlify, DigitalOcean)
- "softSkills": Interpersonal skills (Team Collaboration, Leadership, Public Speaking, Communication, Problem Solving, Time Management, Event Management, Critical Thinking)

### For Experience:
- Extract EVERY job, even internships
- "achievements": Convert bullet points into achievement statements. If none exist, generate 2-3 based on the role
- Example achievements: "Led team of 5 developers", "Reduced load time by 40%", "Implemented CI/CD pipeline"

### For Projects:
- Title: Use the exact project name
- Description: Write an engaging 1-2 sentence description of what it does and why it matters
- techStack: Extract ALL technologies mentioned
- demoUrl/githubUrl: Look for any URLs near the project. Even partial URLs like "github.com/user/repo"

### For Education:
- Include degree, institution, graduation year
- "coursework": List relevant courses if mentioned

### For Social Links:
- ACTIVELY SEARCH for: linkedin.com/in/..., github.com/..., twitter.com/..., personal websites
- Look for email addresses anywhere in the document
- If you see "Portfolio: example.com" → put in website field

### For Custom Sections:
- Any section that doesn't fit standard categories goes here
- Examples: "Publications", "Patents", "Speaking Engagements", "Hobbies", "Awards"

## JSON STRUCTURE (return EXACTLY this format):
{
  "basicDetails": {
    "name": "Full Name",
    "headline": "Professional Title (e.g., 'Senior Software Engineer | React Expert')",
    "email": "email@example.com",
    "phone": "+1-234-567-8900",
    "location": "City, Country",
    "about": "Professional summary - 2-4 sentences about their expertise and passion"
  },
  "skills": {
    "programmingLanguages": ["Python", "JavaScript", "TypeScript", "SQL", "C++"],
    "frameworks": ["React", "Node.js", "TensorFlow", "Flask", "Scikit-learn"],
    "databases": ["MongoDB", "MySQL", "PostgreSQL", "Redis"],
    "tools": ["Git", "Docker", "Postman", "VS Code", "Figma"],
    "cloudSystems": ["AWS", "Linux", "Heroku", "Vercel"],
    "softSkills": ["Leadership", "Team Collaboration", "Public Speaking", "Problem Solving"]
  },
  "experience": [{
    "title": "Job Title",
    "company": "Company Name",
    "duration": "Jan 2022 - Present",
    "location": "City, Country",
    "description": "Brief role overview",
    "achievements": ["Led development of...", "Increased performance by...", "Mentored 3 junior developers"]
  }],
  "education": [{
    "degree": "Bachelor of Science in Computer Science",
    "institution": "University Name",
    "year": "2018 - 2022",
    "gpa": "3.8/4.0",
    "coursework": ["Data Structures", "Algorithms", "Machine Learning"]
  }],
  "projects": [{
    "title": "Project Name",
    "description": "A brief, compelling description of what this project does and its impact",
    "techStack": ["React", "Node.js", "MongoDB"],
    "demoUrl": "https://project-demo.com",
    "githubUrl": "https://github.com/username/project"
  }],
  "achievements": [{
    "title": "Award or Achievement Name",
    "description": "What you achieved",
    "date": "2023"
  }],
  "certifications": [{
    "name": "AWS Certified Solutions Architect",
    "issuer": "Amazon Web Services",
    "date": "2023",
    "url": "https://certification-url.com"
  }],
  "publications": [{
    "title": "Paper or Article Title",
    "publisher": "Journal or Publication",
    "date": "2023",
    "url": "https://paper-url.com"
  }],
  "volunteering": [{
    "role": "Role Title",
    "organization": "Organization Name",
    "description": "What you did",
    "date": "2022 - 2023"
  }],
  "references": [],
  "extraCurricular": [{
    "activity": "Club or Activity",
    "role": "Your role",
    "description": "Brief description"
  }],
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "twitter": "https://twitter.com/username",
    "website": "https://personal-website.com",
    "email": "email@example.com"
  },
  "customSections": [{
    "title": "Section Name",
    "content": "Section content as text or markdown"
  }]
}

## EXAMPLES OF GOOD OUTPUT:

EXAMPLE 1 - If resume says "Worked at Google":
{
  "experience": [{
    "title": "Software Engineer",
    "company": "Google",
    "duration": "Extracted or inferred dates",
    "description": "Developed scalable solutions at one of the world's leading tech companies",
    "achievements": ["Contributed to high-impact projects", "Collaborated with cross-functional teams"]
  }]
}

EXAMPLE 2 - If resume has a GitHub link "github.com/johnsmith":
{
  "socialLinks": {
    "github": "https://github.com/johnsmith"
  }
}

EXAMPLE 3 - If no summary exists but person is a "Full Stack Developer with React and Node":
{
  "basicDetails": {
    "headline": "Full Stack Developer | React & Node.js Specialist",
    "about": "Passionate Full Stack Developer with expertise in React and Node.js. Committed to building user-centric applications with clean, maintainable code."
  }
}

Now analyze the following resume and extract ALL information:
`;

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
