const ALLOWED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const ALLOWED_PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];

function parseCloudinaryUrl(url) {
    if (!url || typeof url !== 'string') {
        return { valid: false, error: 'URL is required' };
    }

    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        return { valid: false, error: 'Invalid URL' };
    }

    if (parsed.protocol !== 'https:') {
        return { valid: false, error: 'URL must use HTTPS' };
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
        return { valid: false, error: 'Cloudinary is not configured' };
    }

    if (parsed.hostname !== 'res.cloudinary.com') {
        return { valid: false, error: 'Asset must be hosted on Cloudinary' };
    }

    const pathParts = parsed.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2 || pathParts[0] !== cloudName) {
        return { valid: false, error: 'URL does not match configured Cloudinary account' };
    }

    return { valid: true, parsed, pathParts };
}

function validateCloudinaryByExtensions(url, allowedExtensions, label) {
    const base = parseCloudinaryUrl(url);
    if (!base.valid) return base;

    const lowerPath = base.parsed.pathname.toLowerCase();
    const hasAllowedExt = allowedExtensions.some((ext) => lowerPath.endsWith(ext));
    if (!hasAllowedExt) {
        return { valid: false, error: `${label} must be one of: ${allowedExtensions.join(', ')}` };
    }

    return { valid: true };
}

/**
 * Validate that a resume URL points to the configured Cloudinary account.
 */
export function validateCloudinaryUrl(url) {
    const base = parseCloudinaryUrl(url);
    if (!base.valid) return base;

    if (base.pathParts[1] !== 'raw') {
        return { valid: false, error: 'Resume must be a Cloudinary raw upload' };
    }

    return validateCloudinaryByExtensions(url, ALLOWED_RESUME_EXTENSIONS, 'Resume');
}

/**
 * Validate profile photo URLs on Cloudinary (image or raw upload).
 */
export function validateCloudinaryPhotoUrl(url) {
    if (!url) {
        return { valid: false, error: 'Photo URL is required' };
    }

    const base = parseCloudinaryUrl(url);
    if (!base.valid) return base;

    const resourceType = base.pathParts[1];
    if (resourceType !== 'image' && resourceType !== 'raw') {
        return { valid: false, error: 'Photo must be a Cloudinary image or raw upload' };
    }

    return validateCloudinaryByExtensions(url, ALLOWED_PHOTO_EXTENSIONS, 'Photo');
}

/**
 * Validate HTTPS URLs for user-provided links.
 */
export function validateHttpsUrl(url) {
    if (!url || typeof url !== 'string') return null;
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'https:') return null;
        return parsed.href;
    } catch {
        return null;
    }
}

/**
 * Return a safe HTTPS URL or empty string.
 */
export function sanitizeHttpsUrl(url) {
    return validateHttpsUrl(url) || '';
}