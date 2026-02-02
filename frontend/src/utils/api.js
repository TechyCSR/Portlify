import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
    try {
        // Wait for Clerk to be fully loaded
        const clerk = window.Clerk
        if (clerk) {
            // Try to get token from active session
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

export default api
