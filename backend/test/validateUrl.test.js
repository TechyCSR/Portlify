import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { validateCloudinaryUrl, validateCloudinaryPhotoUrl, validateHttpsUrl } from '../src/utils/validateUrl.js';

describe('validateCloudinaryUrl', () => {
    const originalCloudName = process.env.CLOUDINARY_CLOUD_NAME;

    before(() => {
        process.env.CLOUDINARY_CLOUD_NAME = 'testcloud';
    });

    after(() => {
        process.env.CLOUDINARY_CLOUD_NAME = originalCloudName;
    });

    it('rejects non-Cloudinary hosts', () => {
        const result = validateCloudinaryUrl('https://evil.com/resume.pdf');
        assert.equal(result.valid, false);
    });

    it('accepts valid Cloudinary resume URL', () => {
        const result = validateCloudinaryUrl('https://res.cloudinary.com/testcloud/raw/upload/v1/resume.pdf');
        assert.equal(result.valid, true);
    });

    it('rejects unsupported file extensions', () => {
        const result = validateCloudinaryUrl('https://res.cloudinary.com/testcloud/raw/upload/v1/resume.exe');
        assert.equal(result.valid, false);
    });

    it('rejects non-raw Cloudinary uploads', () => {
        const result = validateCloudinaryUrl('https://res.cloudinary.com/testcloud/image/upload/v1/resume.pdf');
        assert.equal(result.valid, false);
        assert.match(result.error, /raw upload/i);
    });
});

describe('validateCloudinaryPhotoUrl', () => {
    const originalCloudName = process.env.CLOUDINARY_CLOUD_NAME;

    before(() => {
        process.env.CLOUDINARY_CLOUD_NAME = 'testcloud';
    });

    after(() => {
        process.env.CLOUDINARY_CLOUD_NAME = originalCloudName;
    });

    it('accepts Cloudinary image uploads', () => {
        const result = validateCloudinaryPhotoUrl(
            'https://res.cloudinary.com/testcloud/image/upload/v1/photo.jpg'
        );
        assert.equal(result.valid, true);
    });

    it('rejects non-Cloudinary photo URLs', () => {
        const result = validateCloudinaryPhotoUrl('https://evil.com/photo.jpg');
        assert.equal(result.valid, false);
    });
});

describe('validateHttpsUrl', () => {
    it('rejects javascript URLs', () => {
        assert.equal(validateHttpsUrl('javascript:alert(1)'), null);
    });

    it('accepts https URLs', () => {
        assert.equal(validateHttpsUrl('https://example.com'), 'https://example.com/');
    });
});