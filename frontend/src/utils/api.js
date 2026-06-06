import axios from 'axios'

let apiUrlWarningShown = false

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const API_URL = rawApiUrl.replace(/\/api\/?$/, '')

if (import.meta.env.DEV && rawApiUrl.match(/\/api\/?$/) && !apiUrlWarningShown) {
    console.warn(
        '[Portlify] VITE_API_URL should not include /api suffix. ' +
        'Use the base URL only (e.g. http://localhost:5000). Auto-corrected.'
    )
    apiUrlWarningShown = true
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
    try {
        const clerk = window.Clerk
        if (clerk) {
            const session = clerk.session
            if (session) {
                const token = await session.getToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
            }
        }
    } catch (error) {
        console.error('Error getting auth token:', error)
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// Auth APIs
export const checkUsername = (username) =>
    api.get(`/api/auth/check-username?username=${encodeURIComponent(username)}`)

export const registerUser = (data) =>
    api.post('/api/auth/register', data)

export const getCurrentUser = () =>
    api.get('/api/auth/me')

export const getPreferences = () =>
    api.get('/api/auth/preferences')

export const savePreferences = (data) =>
    api.post('/api/auth/preferences', data)

export const updatePreferences = (data) =>
    api.put('/api/auth/preferences', data)

// Cloudinary APIs
export const getCloudinarySignature = () =>
    api.get('/api/cloudinary/signature')

// Profile APIs
export const parseResume = (resumeUrl) =>
    api.post('/api/profile/parse', { resumeUrl })

export const createProfile = (data) =>
    api.post('/api/profile/create', data)

export const updateProfile = (data) =>
    api.put('/api/profile/update', data)

export const updateProfilePhoto = (photoUrl) =>
    api.put('/api/profile/photo', { photoUrl })

export const getMyProfile = () =>
    api.get('/api/profile/me')

export const getPublicProfile = (username) =>
    api.get(`/api/profile/${encodeURIComponent(username)}`)

// Analytics APIs
export const trackPortfolioView = (username, referrer) =>
    api.post(`/api/analytics/track/${encodeURIComponent(username)}`, { referrer })

export const getAnalyticsSummary = () =>
    api.get('/api/analytics/summary')

export const getAnalyticsDetailed = () =>
    api.get('/api/analytics/me')

// Export APIs
export const downloadPortfolio = () =>
    api.get('/api/export/portfolio', { responseType: 'blob' })

// Profile management APIs
export const resetProfile = () =>
    api.post('/api/profile/reset')

export const updateVisibility = (isPublic) =>
    api.put('/api/profile/visibility', { isPublic })

// Username update API
export const updateUsername = (newUsername) =>
    api.put('/api/auth/username', { newUsername })

// Payment & Premium APIs
export const getPremiumStatus = () =>
    api.get('/api/payment/status')

export const createPaymentOrder = () =>
    api.post('/api/payment/create-order')

export const verifyPayment = (paymentData) =>
    api.post('/api/payment/verify', paymentData)

export const getCustomBranding = () =>
    api.get('/api/payment/branding')

export const updateCustomBranding = (branding) =>
    api.put('/api/payment/branding', branding)

export { API_URL }
export default api