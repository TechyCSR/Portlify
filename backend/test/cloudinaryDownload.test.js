import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractPublicIdFromUrl } from '../src/utils/cloudinaryDownload.js';

describe('extractPublicIdFromUrl', () => {
    it('parses simple raw upload URLs', () => {
        const result = extractPublicIdFromUrl(
            'https://res.cloudinary.com/demo/raw/upload/v123/resumes/my-resume.pdf'
        );
        assert.equal(result.publicId, 'resumes/my-resume');
        assert.equal(result.format, 'pdf');
    });

    it('parses raw upload URLs with transformation segments', () => {
        const result = extractPublicIdFromUrl(
            'https://res.cloudinary.com/demo/raw/upload/s--abc--/v123/resumes/my-resume.pdf'
        );
        assert.equal(result.publicId, 'resumes/my-resume');
        assert.equal(result.format, 'pdf');
    });
});