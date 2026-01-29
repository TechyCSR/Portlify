import axios from 'axios';

/**
 * Parse resume text and extract structured data
 * Uses pattern matching to identify common resume sections
 */
export async function parseResume(pdfUrl) {
    try {
        // Fetch PDF from Cloudinary
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(response.data);

        // Dynamic import for pdf-parse (CommonJS module)
        const pdfParse = (await import('pdf-parse')).default;
        const data = await pdfParse(pdfBuffer);
        const text = data.text;

        return extractStructuredData(text);
    } catch (error) {
        console.error('Resume parsing error:', error);
        throw new Error('Failed to parse resume');
    }
}

function extractStructuredData(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // Extract name (usually first non-empty line)
    const name = extractName(lines);

    // Extract email for headline fallback
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);

    // Extract headline (job title near top)
    const headline = extractHeadline(lines, name);

    // Extract skills
    const skills = extractSkills(text);

    // Extract experience
    const experience = extractExperience(text);

    // Extract education
    const education = extractEducation(text);

    // Extract about/summary
    const about = extractAbout(text);

    return {
        name: name || 'Your Name',
        headline: headline || 'Professional',
        about: about || '',
        skills,
        experience,
        education
    };
}

function extractName(lines) {
    // Name is typically in the first few lines, usually largest text
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i];
        // Skip if it looks like contact info
        if (line.includes('@') || line.includes('http') || /^\+?\d[\d\s-]+$/.test(line)) continue;
        // Skip common headers
        if (/^(resume|curriculum vitae|cv)$/i.test(line)) continue;
        // Likely a name if it's 2-4 words, mostly letters
        if (/^[A-Za-z\s.'-]{2,50}$/.test(line) && line.split(/\s+/).length <= 5) {
            return line;
        }
    }
    return '';
}

function extractHeadline(lines, name) {
    const jobTitlePatterns = [
        /software\s*(engineer|developer)/i,
        /full\s*stack\s*(developer|engineer)/i,
        /frontend\s*(developer|engineer)/i,
        /backend\s*(developer|engineer)/i,
        /web\s*developer/i,
        /data\s*(scientist|analyst|engineer)/i,
        /product\s*manager/i,
        /ui\s*\/?\s*ux\s*(designer|developer)/i,
        /devops\s*engineer/i,
        /mobile\s*(developer|engineer)/i,
        /machine\s*learning\s*engineer/i
    ];

    for (let i = 0; i < Math.min(10, lines.length); i++) {
        const line = lines[i];
        if (line === name) continue;

        for (const pattern of jobTitlePatterns) {
            const match = line.match(pattern);
            if (match) return line;
        }
    }
    return '';
}

function extractSkills(text) {
    const skills = new Set();

    // Common tech skills to look for
    const techSkills = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
        'React', 'Angular', 'Vue', 'Next\\.js', 'Node\\.js', 'Express', 'Django', 'Flask', 'Spring',
        'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST',
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git',
        'HTML', 'CSS', 'Tailwind', 'SASS', 'Bootstrap',
        'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
        'Agile', 'Scrum', 'Jira', 'Figma', 'Adobe XD'
    ];

    for (const skill of techSkills) {
        const regex = new RegExp(`\\b${skill}\\b`, 'gi');
        if (regex.test(text)) {
            // Normalize the skill name
            const normalizedSkill = skill.replace(/\\\+/g, '+').replace(/\\\./g, '.');
            skills.add(normalizedSkill);
        }
    }

    return Array.from(skills).slice(0, 20);
}

function extractExperience(text) {
    const experiences = [];
    const sections = text.split(/\n(?=.*(?:experience|work history|employment|professional background))/i);

    // Find experience section
    let expSection = '';
    for (const section of sections) {
        if (/experience|work history|employment/i.test(section.substring(0, 50))) {
            expSection = section;
            break;
        }
    }

    if (!expSection) {
        // Try to find job patterns anywhere
        const jobPattern = /(?:^|\n)([A-Za-z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Lead|Director|Intern)[A-Za-z\s]*)\s*(?:at|@|,|-|–)?\s*([A-Za-z\s&.]+?)(?:\s*[|,]\s*|\s+)(\d{4}\s*[-–]\s*(?:\d{4}|Present|Current))/gi;
        let match;
        while ((match = jobPattern.exec(text)) !== null && experiences.length < 5) {
            experiences.push({
                title: match[1].trim(),
                company: match[2].trim(),
                duration: match[3].trim(),
                description: ''
            });
        }
    }

    return experiences;
}

function extractEducation(text) {
    const education = [];

    // Common degree patterns
    const degreePatterns = [
        /(?:Bachelor|B\.?S\.?|B\.?A\.?|B\.?Tech|B\.?E\.?)\s*(?:of|in)?\s*[A-Za-z\s]+/gi,
        /(?:Master|M\.?S\.?|M\.?A\.?|M\.?Tech|M\.?E\.?|MBA)\s*(?:of|in)?\s*[A-Za-z\s]+/gi,
        /(?:Ph\.?D\.?|Doctorate)\s*(?:of|in)?\s*[A-Za-z\s]+/gi
    ];

    for (const pattern of degreePatterns) {
        const matches = text.match(pattern);
        if (matches) {
            for (const match of matches.slice(0, 3)) {
                const yearMatch = text.substring(text.indexOf(match), text.indexOf(match) + 200).match(/20\d{2}|19\d{2}/);
                education.push({
                    degree: match.trim(),
                    institution: '',
                    year: yearMatch ? yearMatch[0] : ''
                });
            }
        }
    }

    return education.slice(0, 3);
}

function extractAbout(text) {
    // Look for summary/about/objective section
    const summaryPatterns = [
        /(?:summary|about|objective|profile)\s*:?\s*\n([\s\S]{50,500}?)(?=\n\s*\n|\n[A-Z])/i,
        /(?:^|\n)((?:experienced|passionate|dedicated|skilled|results-driven)[^\n]{50,300})/i
    ];

    for (const pattern of summaryPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            return match[1].trim().substring(0, 500);
        }
    }

    return '';
}

export default { parseResume };
