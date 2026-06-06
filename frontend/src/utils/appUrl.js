/**
 * Returns the frontend app base URL (no trailing slash).
 * Uses VITE_APP_URL when set, otherwise falls back to current origin.
 */
export function getAppUrl() {
    const envUrl = import.meta.env.VITE_APP_URL;
    if (envUrl) {
        return envUrl.replace(/\/$/, '');
    }
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    return '';
}

export function getPortfolioUrl(username) {
    if (!username) return getAppUrl();
    return `${getAppUrl()}/${username}`;
}