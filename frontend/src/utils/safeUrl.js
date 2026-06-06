/**
 * Return URL only if it uses HTTPS. Prevents javascript: and other unsafe schemes.
 */
export function safeHref(url) {
    if (!url || typeof url !== 'string') return null;
    try {
        const parsed = new URL(url);
        if (parsed.protocol === 'https:') return url;
        return null;
    } catch {
        return null;
    }
}

export function safeMailto(email) {
    if (!email || typeof email !== 'string') return null;
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
    return `mailto:${trimmed}`;
}