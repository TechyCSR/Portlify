const SOURCE_DEFINITIONS = [
    { id: 'direct', label: 'Direct / Link', category: 'direct', patterns: [] },
    { id: 'chatgpt', label: 'ChatGPT', category: 'ai', patterns: [/^(chat\.openai\.com|chatgpt\.com)$/i] },
    { id: 'claude', label: 'Claude', category: 'ai', patterns: [/^claude\.ai$/i] },
    { id: 'perplexity', label: 'Perplexity', category: 'ai', patterns: [/^perplexity\.ai$/i] },
    { id: 'gemini', label: 'Google Gemini', category: 'ai', patterns: [/^(gemini\.google\.com|bard\.google\.com)$/i] },
    { id: 'copilot', label: 'Microsoft Copilot', category: 'ai', patterns: [/^(copilot\.microsoft\.com|copilot\.cloud\.microsoft)$/i] },
    { id: 'phind', label: 'Phind', category: 'ai', patterns: [/^phind\.com$/i] },
    { id: 'poe', label: 'Poe', category: 'ai', patterns: [/^poe\.com$/i] },
    { id: 'you', label: 'You.com', category: 'ai', patterns: [/^you\.com$/i] },
    { id: 'meta-ai', label: 'Meta AI', category: 'ai', patterns: [/^meta\.ai$/i] },
    { id: 'grok', label: 'Grok', category: 'ai', patterns: [/^grok\.com$/i] },
    { id: 'deepseek', label: 'DeepSeek', category: 'ai', patterns: [/^chat\.deepseek\.com$/i] },
    { id: 'linkedin', label: 'LinkedIn', category: 'social', patterns: [/^(linkedin\.com|lnkd\.in)$/i] },
    { id: 'twitter', label: 'X (Twitter)', category: 'social', patterns: [/^(twitter\.com|x\.com|t\.co)$/i] },
    { id: 'facebook', label: 'Facebook', category: 'social', patterns: [/^(facebook\.com|fb\.com|m\.facebook\.com)$/i] },
    { id: 'instagram', label: 'Instagram', category: 'social', patterns: [/^(instagram\.com|l\.instagram\.com)$/i] },
    { id: 'reddit', label: 'Reddit', category: 'social', patterns: [/^(reddit\.com|old\.reddit\.com)$/i] },
    { id: 'youtube', label: 'YouTube', category: 'social', patterns: [/^(youtube\.com|youtu\.be|m\.youtube\.com)$/i] },
    { id: 'tiktok', label: 'TikTok', category: 'social', patterns: [/^(tiktok\.com|vm\.tiktok\.com)$/i] },
    { id: 'pinterest', label: 'Pinterest', category: 'social', patterns: [/^(pinterest\.com|pin\.it)$/i] },
    { id: 'threads', label: 'Threads', category: 'social', patterns: [/^threads\.net$/i] },
    { id: 'discord', label: 'Discord', category: 'social', patterns: [/^(discord\.com|discord\.gg)$/i] },
    { id: 'telegram', label: 'Telegram', category: 'social', patterns: [/^(t\.me|telegram\.org|web\.telegram\.org)$/i] },
    { id: 'whatsapp', label: 'WhatsApp', category: 'social', patterns: [/^(wa\.me|web\.whatsapp\.com|api\.whatsapp\.com)$/i] },
    { id: 'github', label: 'GitHub', category: 'website', patterns: [/^github\.com$/i] },
    { id: 'medium', label: 'Medium', category: 'website', patterns: [/^(medium\.com|www\.medium\.com)$/i] },
    { id: 'substack', label: 'Substack', category: 'website', patterns: [/^(substack\.com|open\.substack\.com)$/i] },
    { id: 'notion', label: 'Notion', category: 'website', patterns: [/^(notion\.so|www\.notion\.so)$/i] },
    { id: 'google', label: 'Google Search', category: 'search', patterns: [/^google\.[a-z.]+$/i] },
    { id: 'bing', label: 'Bing', category: 'search', patterns: [/^bing\.com$/i] },
    { id: 'duckduckgo', label: 'DuckDuckGo', category: 'search', patterns: [/^duckduckgo\.com$/i] },
    { id: 'yahoo', label: 'Yahoo', category: 'search', patterns: [/^(search\.yahoo\.com|yahoo\.com)$/i] },
    { id: 'ecosia', label: 'Ecosia', category: 'search', patterns: [/^ecosia\.org$/i] },
    { id: 'brave', label: 'Brave Search', category: 'search', patterns: [/^search\.brave\.com$/i] },
    { id: 'gmail', label: 'Gmail', category: 'email', patterns: [/^mail\.google\.com$/i] },
    { id: 'outlook', label: 'Outlook', category: 'email', patterns: [/^(outlook\.live\.com|outlook\.office\.com)$/i] },
    { id: 'yahoo-mail', label: 'Yahoo Mail', category: 'email', patterns: [/^mail\.yahoo\.com$/i] },
    { id: 'protonmail', label: 'Proton Mail', category: 'email', patterns: [/^(mail\.proton\.me|protonmail\.com)$/i] },
];

const LABEL_LOOKUP = new Map(
    SOURCE_DEFINITIONS.flatMap((source) => [
        [source.label.toLowerCase(), source],
        [source.id, source],
    ])
);

const LEGACY_DIRECT_LABELS = new Set(['direct', 'direct / link']);

const UTM_SOURCE_LOOKUP = {
    linkedin: 'linkedin',
    twitter: 'twitter',
    x: 'twitter',
    facebook: 'facebook',
    instagram: 'instagram',
    reddit: 'reddit',
    youtube: 'youtube',
    tiktok: 'tiktok',
    google: 'google',
    bing: 'bing',
    chatgpt: 'chatgpt',
    claude: 'claude',
    perplexity: 'perplexity',
    gemini: 'gemini',
    newsletter: 'newsletter',
    email: 'email',
    whatsapp: 'whatsapp',
    telegram: 'telegram',
    github: 'github',
};

const UTM_FALLBACK_LABELS = {
    newsletter: { id: 'newsletter', label: 'Newsletter', category: 'email' },
    email: { id: 'email', label: 'Email', category: 'email' },
};

const MAX_REFERRER_LENGTH = 2048;
const INTERNAL_HOSTS = new Set(['localhost', '127.0.0.1']);

function stripWww(hostname) {
    return hostname.replace(/^www\./i, '');
}

function getConfiguredInternalHosts() {
    const hosts = new Set(INTERNAL_HOSTS);
    const frontendUrl = process.env.FRONTEND_URL;

    if (frontendUrl) {
        try {
            const hostname = stripWww(new URL(frontendUrl).hostname);
            if (hostname) hosts.add(hostname.toLowerCase());
        } catch {
            // Ignore invalid FRONTEND_URL values.
        }
    }

    return hosts;
}

function tryParseReferrerHost(raw) {
    try {
        const url = /^https?:\/\//i.test(raw) ? new URL(raw) : new URL(`https://${raw}`);
        return stripWww(url.hostname).toLowerCase();
    } catch {
        return null;
    }
}

function isInternalHostname(hostname) {
    const normalized = stripWww(hostname).toLowerCase();

    for (const host of getConfiguredInternalHosts()) {
        if (normalized === host || normalized.endsWith(`.${host}`)) {
            return true;
        }
    }

    return false;
}

function isInternalReferrer(raw) {
    if (!raw || raw.startsWith('utm:')) {
        return false;
    }

    const host = tryParseReferrerHost(raw);
    return host ? isInternalHostname(host) : false;
}

function formatHostname(hostname) {
    const parts = stripWww(hostname).split('.').filter(Boolean);
    if (parts.length === 0) return hostname;

    const base = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
    return base
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function matchSourceDefinition(hostname) {
    return SOURCE_DEFINITIONS.find((source) =>
        source.patterns.some((pattern) => pattern.test(hostname))
    );
}

function buildResult(source, domain = null) {
    return {
        id: source.id,
        label: source.label,
        category: source.category,
        domain,
    };
}

function getCanonicalReferrerMeta(normalized) {
    const definition = SOURCE_DEFINITIONS.find((entry) => entry.id === normalized.id)
        || UTM_FALLBACK_LABELS[normalized.id];

    if (definition) {
        return {
            id: definition.id,
            label: definition.label,
            category: definition.category,
            domain: normalized.domain,
        };
    }

    return normalized;
}

function normalizeUtmReferrer(raw) {
    const parts = raw.split(':');
    const source = (parts[1] || '').trim();
    const medium = (parts[2] || '').trim();
    const campaign = parts.slice(3).join(':').trim();
    const normalizedSource = source.toLowerCase();
    const normalizedMedium = medium.toLowerCase();

    const mappedId = UTM_SOURCE_LOOKUP[normalizedSource];
    if (mappedId) {
        const definition = SOURCE_DEFINITIONS.find((entry) => entry.id === mappedId)
            || UTM_FALLBACK_LABELS[mappedId];

        if (definition) {
            return getCanonicalReferrerMeta(buildResult(definition));
        }
    }

    const fallbackLabel = [
        source,
        medium ? `(${medium})` : '',
        campaign ? `· ${campaign}` : '',
    ].filter(Boolean).join(' ');

    return {
        id: `utm-${normalizedSource || 'unknown'}`,
        label: fallbackLabel || 'Campaign',
        category: 'campaign',
        domain: null,
    };
}

export function resolveReferrer(rawReferrer) {
    return getCanonicalReferrerMeta(normalizeReferrer(sanitizeReferrerInput(rawReferrer)));
}

export function sanitizeReferrerInput(input) {
    if (input == null) {
        return '';
    }

    if (typeof input !== 'string') {
        return '';
    }

    return input.trim().slice(0, MAX_REFERRER_LENGTH);
}

export function normalizeReferrer(rawReferrer) {
    const raw = sanitizeReferrerInput(rawReferrer);

    if (!raw || LEGACY_DIRECT_LABELS.has(raw.toLowerCase())) {
        return buildResult(SOURCE_DEFINITIONS[0]);
    }

    const known = LABEL_LOOKUP.get(raw.toLowerCase());
    if (known) {
        return buildResult(known);
    }

    if (raw.startsWith('utm:')) {
        return normalizeUtmReferrer(raw);
    }

    if (isInternalReferrer(raw)) {
        return buildResult(SOURCE_DEFINITIONS[0]);
    }

    try {
        const url = /^https?:\/\//i.test(raw) ? new URL(raw) : new URL(`https://${raw}`);
        const hostname = stripWww(url.hostname);
        const matched = matchSourceDefinition(hostname);

        if (matched) {
            return buildResult(matched, hostname);
        }

        return {
            id: hostname.toLowerCase(),
            label: formatHostname(hostname),
            category: 'website',
            domain: hostname.toLowerCase(),
        };
    } catch {
        return {
            id: 'unknown',
            label: raw.length > 48 ? `${raw.slice(0, 45)}...` : raw,
            category: 'other',
            domain: null,
        };
    }
}

export function aggregateReferrers(referrerEntries = []) {
    const totals = new Map();

    for (const entry of referrerEntries) {
        if (!entry || typeof entry.source !== 'string') {
            continue;
        }

        const normalized = resolveReferrer(entry.source);
        const existing = totals.get(normalized.id);

        if (existing) {
            existing.count += entry.count || 0;
        } else {
            totals.set(normalized.id, {
                ...normalized,
                source: normalized.label,
                count: entry.count || 0,
            });
        }
    }

    return [...totals.values()].sort((a, b) => b.count - a.count);
}
