import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeProfileFields } from '../src/utils/sanitizeProfile.js';

describe('sanitizeProfileFields', () => {
    const originalCloudName = process.env.CLOUDINARY_CLOUD_NAME;

    before(() => {
        process.env.CLOUDINARY_CLOUD_NAME = 'testcloud';
    });

    after(() => {
        process.env.CLOUDINARY_CLOUD_NAME = originalCloudName;
    });

    it('rejects invalid resume URLs', () => {
        const { error } = sanitizeProfileFields({
            resumeUrl: 'https://evil.com/resume.pdf'
        });
        assert.ok(error);
    });

    it('rejects invalid social link URLs', () => {
        const { error } = sanitizeProfileFields({
            socialLinks: {
                linkedin: 'javascript:alert(1)',
                github: 'https://github.com/user',
                twitter: '',
                website: '',
                email: ''
            }
        });
        assert.ok(error);
    });

    it('sanitizes valid social links to HTTPS', () => {
        const { sanitized, error } = sanitizeProfileFields({
            socialLinks: {
                linkedin: 'https://linkedin.com/in/user',
                github: 'https://github.com/user',
                twitter: '',
                website: '',
                email: ''
            }
        });
        assert.equal(error, null);
        assert.equal(sanitized.socialLinks.linkedin, 'https://linkedin.com/in/user');
        assert.equal(sanitized.socialLinks.github, 'https://github.com/user');
    });

    it('accepts valid Cloudinary resume URL', () => {
        const { sanitized, error } = sanitizeProfileFields({
            resumeUrl: 'https://res.cloudinary.com/testcloud/raw/upload/v1/resume.pdf'
        });
        assert.equal(error, null);
        assert.ok(sanitized.resumeUrl);
    });
});