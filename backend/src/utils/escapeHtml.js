const HTML_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

/**
 * Escape user-controlled strings for safe HTML interpolation.
 */
export function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}