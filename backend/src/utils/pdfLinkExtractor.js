import pdfParse from 'pdf-parse';

/**
 * Extract text from a PDF buffer and detect URLs within the text.
 * Uses pdf-parse which is reliable in serverless environments.
 * @param {Buffer} dataBuffer - PDF data
 * @returns {Promise<string>} - Extracted text with URLs preserved
 */
export async function extractTextWithLinks(dataBuffer) {
    try {
        const data = await pdfParse(dataBuffer);
        let text = data.text;

        // URL regex to find links in text
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Find all URLs and mark them for the AI
        const urls = text.match(urlRegex) || [];

        // If URLs found, they're already in the text - just ensure they're visible
        // The AI prompt will handle parsing them correctly

        // Also try to detect email addresses and mark them
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
        const emails = text.match(emailRegex) || [];

        // Log extraction summary for debugging
        console.log(`PDF Extraction: ${text.length} chars, ${urls.length} URLs, ${emails.length} emails found`);

        return text;
    } catch (error) {
        console.error('PDF Extraction Error:', error);
        throw error;
    }
}
