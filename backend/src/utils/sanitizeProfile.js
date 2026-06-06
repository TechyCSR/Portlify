import {
    validateCloudinaryUrl,
    validateCloudinaryPhotoUrl,
    validateHttpsUrl
} from './validateUrl.js';

function rejectInvalidHttpsUrl(url, label) {
    const safe = validateHttpsUrl(url);
    if (!safe) {
        return { valid: false, error: `${label} must be a valid HTTPS link` };
    }
    return { valid: true, url: safe };
}

/**
 * Validate and sanitize profile fields before persistence.
 * Returns { sanitized, error } where error is set if validation fails.
 */
export function sanitizeProfileFields(fields) {
    const sanitized = structuredClone(fields);
    const errors = [];

    if (sanitized.resumeUrl) {
        const result = validateCloudinaryUrl(sanitized.resumeUrl);
        if (!result.valid) errors.push(result.error);
    }

    if (sanitized.basicDetails?.profilePhoto) {
        const result = validateCloudinaryPhotoUrl(sanitized.basicDetails.profilePhoto);
        if (!result.valid) errors.push(result.error);
    }

    if (sanitized.socialLinks) {
        const socialLabels = {
            linkedin: 'LinkedIn URL',
            github: 'GitHub URL',
            twitter: 'Twitter URL',
            website: 'Website URL'
        };

        for (const key of ['linkedin', 'github', 'twitter', 'website']) {
            if (sanitized.socialLinks[key]) {
                const result = rejectInvalidHttpsUrl(sanitized.socialLinks[key], socialLabels[key]);
                if (!result.valid) {
                    errors.push(result.error);
                } else {
                    sanitized.socialLinks[key] = result.url;
                }
            }
        }
    }

    if (Array.isArray(sanitized.projects)) {
        sanitized.projects = sanitized.projects.map((project, index) => {
            const updated = { ...project };

            if (project.demoUrl) {
                const result = rejectInvalidHttpsUrl(project.demoUrl, `Project ${index + 1} demo URL`);
                if (!result.valid) {
                    errors.push(result.error);
                } else {
                    updated.demoUrl = result.url;
                }
            }

            if (project.githubUrl) {
                const result = rejectInvalidHttpsUrl(project.githubUrl, `Project ${index + 1} GitHub URL`);
                if (!result.valid) {
                    errors.push(result.error);
                } else {
                    updated.githubUrl = result.url;
                }
            }

            return updated;
        });
    }

    if (Array.isArray(sanitized.certifications)) {
        sanitized.certifications = sanitized.certifications.map((cert, index) => {
            const updated = { ...cert };

            if (cert.credentialUrl) {
                const result = rejectInvalidHttpsUrl(cert.credentialUrl, `Certification ${index + 1} URL`);
                if (!result.valid) {
                    errors.push(result.error);
                } else {
                    updated.credentialUrl = result.url;
                }
            }

            return updated;
        });
    }

    if (Array.isArray(sanitized.publications)) {
        sanitized.publications = sanitized.publications.map((pub, index) => {
            const updated = { ...pub };

            if (pub.url) {
                const result = rejectInvalidHttpsUrl(pub.url, `Publication ${index + 1} URL`);
                if (!result.valid) {
                    errors.push(result.error);
                } else {
                    updated.url = result.url;
                }
            }

            return updated;
        });
    }

    if (sanitized.ogMetadata?.image) {
        const imageResult = validateCloudinaryPhotoUrl(sanitized.ogMetadata.image);
        if (!imageResult.valid) {
            errors.push(imageResult.error);
        }
    }

    if (errors.length > 0) {
        return { sanitized: null, error: errors[0] };
    }

    return { sanitized, error: null };
}