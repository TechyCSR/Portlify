export const LANDING_FAQ = [
    {
        question: 'What is PortlifyAi?',
        answer: 'PortlifyAi is a free AI-powered tool that transforms your resume into a professional portfolio website in seconds. Upload PDF, DOC, or DOCX and AI extracts your skills and experience into a shareable portfolio URL.',
    },
    {
        question: 'Is PortlifyAi really free?',
        answer: 'Yes, PortlifyAi is completely free to use. You can create and publish your portfolio with no credit card required. Premium features like custom branding and priority support are available as optional upgrades.',
    },
    {
        question: 'How does the AI resume parser work?',
        answer: 'PortlifyAi uses machine learning models to analyze your uploaded resume, extracting key information including skills, work experience, education, projects, and contact details with 95% accuracy.',
    },
    {
        question: 'What file formats are supported?',
        answer: 'PortlifyAi supports PDF, DOC, and DOCX file formats for resume uploads. Simply upload your resume in any of these formats and our AI parser extracts all relevant information automatically.',
    },
    {
        question: 'Can I customize my portfolio design?',
        answer: 'Yes, PortlifyAi offers multiple themes including Modern, Minimal, Creative, and Professional. You can also switch between dark and light modes and customize your portfolio URL with a unique username.',
    },
    {
        question: 'How do I share my portfolio?',
        answer: 'Once your portfolio is generated, you get a custom URL that you can share anywhere — on LinkedIn, GitHub, your resume, or social media. The portfolio is mobile-responsive and works on all devices.',
    },
]

export function getFaqSchemaEntities() {
    return LANDING_FAQ.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
        },
    }))
}
