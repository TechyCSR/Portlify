const PRODUCTION_ORIGINS = [
    'https://portlifyai.app',
    'https://www.portlifyai.app',
]

const LOCAL_DEV_ORIGIN_PATTERNS = [
    /^https?:\/\/localhost(?::\d+)?$/,
    /^https?:\/\/127\.0\.0\.1(?::\d+)?$/,
    /^https?:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(?::\d+)?$/,
]

function normalizeOrigin(url) {
    if (!url) return null
    return url.replace(/\/$/, '')
}

export function getAllowedOrigins() {
    const fromEnv = normalizeOrigin(process.env.FRONTEND_URL)
    const origins = new Set(PRODUCTION_ORIGINS.map(normalizeOrigin))

    if (fromEnv) {
        origins.add(fromEnv)
    }

    return [...origins]
}

export function isAllowedCorsOrigin(origin, { isProduction = process.env.NODE_ENV === 'production' } = {}) {
    if (!origin) {
        return true
    }

    const normalized = normalizeOrigin(origin)
    const allowedOrigins = getAllowedOrigins()

    if (allowedOrigins.includes(normalized)) {
        return true
    }

    if (!isProduction) {
        return LOCAL_DEV_ORIGIN_PATTERNS.some((pattern) => pattern.test(normalized))
    }

    return false
}

export function createCorsOptions() {
    return {
        origin(origin, callback) {
            if (isAllowedCorsOrigin(origin)) {
                callback(null, true)
                return
            }

            callback(new Error(`CORS blocked for origin: ${origin}`))
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
}